from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Request, Response
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from jugaad_data.nse import NSELive
from nsepython import nse_get_top_gainers, nse_get_top_losers
from pymongo import MongoClient
from bson.objectid import ObjectId
from cachetools import TTLCache
from typing import Optional, List, Dict, Any, Set
import pandas as pd
import asyncio
import threading
import time
import json
import os
import datetime
import logging
import uuid
from dotenv import load_dotenv

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="NSE Stock API", description="API for NSE stock data and trading")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize NSE object
nse = NSELive()

# MongoDB connection
mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)
db = client['Growup']
orders_collection = db['orders']
users = db['users']
exchanges = db['exchanges']
holdings = db['holdings']

# Create indexes for faster queries
orders_collection.create_index([('status', 1)])
orders_collection.create_index([('symbol', 1)])
orders_collection.create_index([('created_at', -1)])

# WebSocket variables
active_connections: Set[WebSocket] = set()
symbol_subscribers: Dict[str, Set[WebSocket]] = {}
price_cache = TTLCache(maxsize=100, ttl=5)  # Cache for 5 seconds

# Track market status
market_open = False

# Helper Functions
def check_market_status():
    """Check if the market is currently open"""
    try:
        status = nse.market_status()
        market_states = status['marketState']
        for market in market_states:
            if market['market'] == 'Capital Market' and market['marketStatus'] == 'Open':
                return True
        return False
    except Exception as e:
        logger.error(f"Error checking market status: {e}")
        return False

def serialize_doc(doc):
    """Convert MongoDB document to JSON serializable format"""
    if not doc:
        return doc
    doc_copy = doc.copy()
    for key, value in doc_copy.items():
        if isinstance(value, ObjectId):
            doc_copy[key] = str(value)
        elif isinstance(value, datetime.datetime):
            doc_copy[key] = value.isoformat()
    return doc_copy

# WebSocket Functions
async def format_stock_data(symbol, quote):
    """Format stock data to match the expected format in the frontend"""
    try:
        price_info = quote.get("priceInfo", {})
        security_info = quote.get("securityInfo", {})
        metadata = quote.get("metadata", {})
        
        return {
            "T": "q",  # Type: quote
            "S": symbol,
            # Basic price info
            "lastPrice": price_info.get("lastPrice", 0),
            "open": price_info.get("open", 0),
            "close": price_info.get("close", 0),
            "change": price_info.get("change", 0),
            "pChange": price_info.get("pChange", 0),
            "previousClose": price_info.get("previousClose", 0),
            "vwap": price_info.get("vwap", 0),
            
            # High/Low info
            "intraDayHighLow": {
                "max": price_info.get("intraDayHighLow", {}).get("max", 0),
                "min": price_info.get("intraDayHighLow", {}).get("min", 0)
            },
            "weekHighLow": {
                "max": price_info.get("weekHighLow", {}).get("max", 0),
                "min": price_info.get("weekHighLow", {}).get("min", 0),
                "maxDate": price_info.get("weekHighLow", {}).get("maxDate", ""),
                "minDate": price_info.get("weekHighLow", {}).get("minDate", "")
            },
            
            # Circuit limits
            "upperCP": price_info.get("upperCP", 0),
            "lowerCP": price_info.get("lowerCP", 0),
            "pPriceBand": price_info.get("pPriceBand", "N/A"),
            "basePrice": price_info.get("basePrice", 0),
            
            # Technical info
            "ieq": security_info.get("ieq", ""),
            "iNavValue": metadata.get("iNavValue", 0),
            "tickSize": security_info.get("tickSize", 0.05),
            "stockIndClosePrice": metadata.get("stockIndClosePrice", 0),
            "checkINAV": metadata.get("checkINAV", False),
            
            # Market status
            "marketStatus": metadata.get("market", "Closed"),
            "advances": metadata.get("advances", 0),
            "declines": metadata.get("declines", 0),
            "unchanged": metadata.get("unchanged", 0),
            
            # Symbol info
            "symbol": symbol,
            "name": security_info.get("companyName", symbol),
            "indexSymbol": security_info.get("index", ""),
            
            # Timestamp
            "timestamp": int(time.time() * 1000)
        }
    except Exception as e:
        logger.error(f"Error formatting stock data for {symbol}: {str(e)}")
        return {
            "T": "error",
            "S": symbol,
            "message": f"Error formatting data: {str(e)}"
        }

async def fetch_price(symbol):
    """Fetch and cache price data for a symbol"""
    try:
        # Cache hit
        if symbol in price_cache:
            return price_cache[symbol]

        # Live fetch
        quote = nse.stock_quote(symbol)
        data = await format_stock_data(symbol, quote)
        
        # Cache the data
        price_cache[symbol] = data
        return data
    except Exception as e:
        logger.error(f"Error fetching price for {symbol}: {str(e)}")
        return {
            "T": "error",
            "S": symbol,
            "message": f"Error fetching data: {str(e)}"
        }

async def price_broadcast_loop():
    """Background task to broadcast price updates to WebSocket clients"""
    while True:
        try:
            for symbol, clients in list(symbol_subscribers.items()):
                if not clients:
                    continue
                
                data = await fetch_price(symbol)
                disconnected = []
                
                for client in clients:
                    try:
                        await client.send_json(data)
                    except Exception as e:
                        logger.error(f"Error sending to client: {str(e)}")
                        disconnected.append(client)
                
                # Remove disconnected clients
                for dc in disconnected:
                    clients.discard(dc)
                
                # Clean up empty subscriptions
                if not clients:
                    del symbol_subscribers[symbol]
                    
            await asyncio.sleep(3)  # Update every 3 seconds
            
        except Exception as e:
            logger.error(f"Error in price broadcast loop: {str(e)}")
            await asyncio.sleep(1)  # Wait before retrying

# API Models (for documentation)
class OrderRequest(BaseModel):
    symbol: str
    quantity: int
    order_type: str
    target_price: float
    Email: str
    OrderId: str
    HoldingId: str

# WebSocket Endpoints
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time stock data"""
    await websocket.accept()
    active_connections.add(websocket)
    
    try:
        while True:
            data = await websocket.receive_json()
            action = data.get("action")
            symbol = data.get("symbol", "").upper()

            if action == "subscribe" and symbol:
                # Validate the stock symbol
                try:
                    quote = nse.stock_quote(symbol)
                    if quote and "priceInfo" in quote:
                        # Create subscription entry if it doesn't exist
                        if symbol not in symbol_subscribers:
                            symbol_subscribers[symbol] = set()
                        
                        symbol_subscribers[symbol].add(websocket)
                        await websocket.send_json({"message": f"Subscribed to {symbol}"})
                        
                        # Send initial data immediately
                        initial_data = await format_stock_data(symbol, quote)
                        await websocket.send_json(initial_data)
                    else:
                        await websocket.send_json({"error": f"Invalid stock symbol: {symbol}"})
                except Exception as e:
                    logger.error(f"Error subscribing to {symbol}: {str(e)}")
                    await websocket.send_json({"error": f"Error subscribing to {symbol}: {str(e)}"})

            elif action == "unsubscribe" and symbol:
                if symbol in symbol_subscribers:
                    symbol_subscribers[symbol].discard(websocket)
                    await websocket.send_json({"message": f"Unsubscribed from {symbol}"})
                    
                    # Remove empty subscription sets to save memory
                    if not symbol_subscribers[symbol]:
                        del symbol_subscribers[symbol]

    except WebSocketDisconnect:
        logger.info("WebSocket disconnected")
        active_connections.discard(websocket)
        for symbol, subscribers in list(symbol_subscribers.items()):
            subscribers.discard(websocket)
            if not subscribers:
                del symbol_subscribers[symbol]
    except Exception as e:
        logger.error(f"WebSocket error: {str(e)}")
        active_connections.discard(websocket)

# REST API Endpoints
@app.get("/")
async def root():
    """Root endpoint that returns a simple HTML page"""
    try:
        return HTMLResponse(content="""
        <html>
            <head>
                <title>NSE Stock API</title>
            </head>
            <body>
                <h1>NSE Stock API</h1>
                <p>API Documentation is available at <a href="/docs">/docs</a></p>
            </body>
        </html>
        """)
    except Exception as e:
        logger.error(f"Error serving root page: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

@app.get("/api/search/{query}")
async def search_stocks(query: str):
    """Search for stocks by query string"""
    try:
        search_results = nse.search_stock(query.upper())
        return {"results": search_results}
    except Exception as e:
        logger.error(f"Error searching stocks: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error searching stocks: {str(e)}")

@app.get("/api/validate/{symbol}")
async def validate_stock(symbol: str):
    """Validate if a stock symbol exists"""
    try:
        quote = nse.stock_quote(symbol.upper())
        if quote and "priceInfo" in quote:
            return {"valid": True, "symbol": symbol.upper()}
        return {"valid": False}
    except Exception as e:
        logger.error(f"Error validating stock {symbol}: {str(e)}")
        return {"valid": False}

@app.get("/api/graph-data/{symbol}")
async def get_graph_data(symbol: str):
    """Get graph data for a stock"""
    try:
        # This is a placeholder - you'll need to implement the actual historical data fetching
        current_time = int(time.time() * 1000)
        one_day_ago = current_time - (24 * 60 * 60 * 1000)
        
        # Get current price for reference
        quote = nse.stock_quote(symbol.upper())
        current_price = quote.get("priceInfo", {}).get("lastPrice", 100)
        
        # Generate some price movements around the current price
        import random
        data_points = []
        for i in range(100):
            timestamp = one_day_ago + (i * 14.4 * 60 * 1000)  # 14.4 minutes intervals
            price = current_price * (0.9 + 0.2 * random.random())  # ±10% variation
            data_points.append([timestamp, price])
        
        return data_points
    except Exception as e:
        logger.error(f"Error fetching graph data for {symbol}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching graph data: {str(e)}")

@app.post("/api/place-order")
async def place_order(order_data: OrderRequest):
    """Place a buy or sell order"""
    try:
        data = order_data.dict()
        required_fields = ['symbol', 'quantity', 'order_type', 'target_price', 'Email', 'OrderId', 'HoldingId']

        # Uncomment to enable market hours check
        # market_open = check_market_status()
        # if not market_open:
        #     return JSONResponse(
        #         status_code=400,
        #         content={"error": "Market is closed. Cannot place orders."}
        #     )

        # Validate input data
        for field in required_fields:
            if field not in data or not data[field]:
                return JSONResponse(
                    status_code=400,
                    content={"error": f"Missing required field: {field}"}
                )

        # Convert and validate numeric values
        try:
            quantity = int(data['quantity'])
            target_price = float(data['target_price'])

            if quantity <= 0 or target_price <= 0:
                return JSONResponse(
                    status_code=400,
                    content={"error": "Quantity and price must be positive values"}
                )
        except ValueError:
            return JSONResponse(
                status_code=400,
                content={"error": "Invalid numeric values for quantity or price"}
            )

        # Validate order type
        order_type = data['order_type'].upper()
        if order_type not in ['BUY', 'SELL']:
            return JSONResponse(
                status_code=400,
                content={"error": "Order type must be either BUY or SELL"}
            )

        # Fetch user data
        user = users.find_one({'Email': data['Email']})
        if not user:
            return JSONResponse(status_code=404, content={"error": "User not found"})

        symbol = data['symbol'].upper()

        # Validate holdings for SELL orders
        if order_type == 'SELL':
            holding = holdings.find_one({'HoldingId': data['HoldingId']})
            if not holding:
                return JSONResponse(status_code=404, content={"error": "Holding not found"})

            existing_holding = next((h for h in holding['Holdings'] if h['symbol'] == symbol), None)
            if not existing_holding or existing_holding['quantity'] < quantity:
                return JSONResponse(
                    status_code=400,
                    content={"error": "Insufficient holdings to sell"}
                )

        # Check balance for BUY orders
        balance = user['Balance']
        if order_type == 'BUY' and (float(balance) < (quantity * target_price)):
            return JSONResponse(
                status_code=400,
                content={"error": "Insufficient balance"}
            )

        # Create order object
        order = {
            'OrderId': data['OrderId'],
            'symbol': symbol,
            'quantity': quantity,
            'order_type': order_type,
            'target_price': target_price,
            'Email': data['Email'],
            'HoldingId': data['HoldingId'],
            'created_at': datetime.datetime.now(),
            'status': 'EXECUTED'  # Assume instant execution for simplicity
        }

        # Insert order into collection
        result = orders_collection.insert_one(order)
        order['_id'] = result.inserted_id

        # Process BUY order
        if order_type == 'BUY':
            new_balance = balance - (quantity * target_price)
            users.update_one({'_id': user['_id']}, {'$set': {'Balance': new_balance}})

            holding = holdings.find_one({'HoldingId': data['HoldingId']})
            if not holding:
                holding = {'HoldingId': data['HoldingId'], 'Holdings': []}
                holdings.insert_one(holding)
                holding = holdings.find_one({'HoldingId': data['HoldingId']})

            existing_holding = next((h for h in holding['Holdings'] if h['symbol'] == symbol), None)
            if existing_holding:
                total_qty = existing_holding['quantity'] + quantity
                avg_price = ((existing_holding['quantity'] * existing_holding['price']) +
                             (quantity * target_price)) / total_qty

                for h in holding['Holdings']:
                    if h['symbol'] == symbol:
                        h['quantity'] = total_qty
                        h['price'] = avg_price
                        break
            else:
                holding['Holdings'].append({
                    'symbol': symbol,
                    'quantity': quantity,
                    'price': target_price
                })

            holdings.update_one({'HoldingId': data['HoldingId']}, {'$set': {'Holdings': holding['Holdings']}})

        # Process SELL order
        else:
            new_balance = balance + (quantity * target_price)
            users.update_one({'_id': user['_id']}, {'$set': {'Balance': new_balance}})

            holding = holdings.find_one({'HoldingId': data['HoldingId']})
            for i, h in enumerate(holding['Holdings']):
                if h['symbol'] == symbol:
                    h['quantity'] -= quantity
                    if h['quantity'] == 0:
                        holding['Holdings'].pop(i)
                    break

            if not holding['Holdings']:
                holdings.delete_one({'HoldingId': data['HoldingId']})
            else:
                holdings.update_one({'HoldingId': data['HoldingId']}, {'$set': {'Holdings': holding['Holdings']}})

        return {
            "message": "Order placed successfully",
            "order_id": str(order['_id']),
            "order": serialize_doc(order)
        }

    except Exception as e:
        logger.error(f"Order placement error: {str(e)}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={"error": f"An error occurred while processing your order: {str(e)}"}
        )

@app.get("/api/gainer-losers")
async def get_gainers_and_losers():
    """Get top gainers and losers for the day"""
    try:
        gainers = nse_get_top_gainers()
        losers = nse_get_top_losers()

        gainers_df = pd.DataFrame(gainers)
        losers_df = pd.DataFrame(losers)
        
        return {
            "gainers": gainers_df.to_dict(orient="records"),
            "losers": losers_df.to_dict(orient="records")
        }
    except Exception as e:
        logger.error(f"Error fetching gainers and losers: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": f"Error fetching gainers and losers: {str(e)}"}
        )

@app.get("/api/orders")
async def get_orders(status: Optional[str] = None, symbol: Optional[str] = None):
    """Get all orders with optional filtering"""
    try:
        # Build query
        query = {}
        if status:
            query['status'] = status.upper()
        if symbol:
            query['symbol'] = symbol.upper()
        
        # Get orders
        orders_cursor = orders_collection.find(query).sort('created_at', -1)
        orders = []
        
        for order in orders_cursor:
            orders.append(serialize_doc(order))
        
        return {
            "orders": orders,
            "count": len(orders),
            "market_open": check_market_status()
        }
    except Exception as e:
        logger.error(f"Error fetching orders: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": f"Error fetching orders: {str(e)}"}
        )

@app.get("/api/orders/{id}")
async def get_order(id: str):
    """Get all orders for an ExchangeId"""
    try:
        # Find all orders for the ExchangeId
        orders = list(orders_collection.find({'OrderId': id}).sort('created_at', -1))
        if orders:
            return {
                "orders": [serialize_doc(order) for order in orders],
                "count": len(orders)
            }
            
        return JSONResponse(
            status_code=404,
            content={"error": "No orders found"}
        )
    except Exception as e:
        logger.error(f"Error fetching orders for {id}: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": f"Error fetching orders: {str(e)}"}
        )

@app.get("/api/market-status")
async def api_market_status():
    """Get current market status"""
    try:
        status = nse.market_status()
        is_open = check_market_status()
        return {
            'marketState': status['marketState'],
            'isOpen': is_open
        }
    except Exception as e:
        logger.error(f"Error fetching market status: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": f"Error fetching market status: {str(e)}"}
        )

@app.get("/api/stock-quote/{symbol}")
async def api_stock_quote(symbol: str):
    """Get current stock quote"""
    try:
        quote = nse.stock_quote(symbol.upper())
        return quote['priceInfo']
    except Exception as e:
        logger.error(f"Error fetching stock quote for {symbol}: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": f"Error fetching stock quote: {str(e)}"}
        )

@app.get("/api/indices")
async def api_indices():
    """Get current indices data"""
    try:
        indices = nse.all_indices()
        return indices
    except Exception as e:
        logger.error(f"Error fetching indices: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": f"Error fetching indices: {str(e)}"}
        )

# Startup and Shutdown Events
@app.on_event("startup")
async def startup_event():
    """Run on application startup"""
    logger.info("Starting NSE Stock API")
    global market_open
    market_open = check_market_status()
    logger.info(f"Market status: {'Open' if market_open else 'Closed'}")
    
    # Start the WebSocket broadcast loop
    asyncio.create_task(price_broadcast_loop())

@app.on_event("shutdown")
async def shutdown_event():
    """Run on application shutdown"""
    logger.info("Shutting down NSE Stock API")

# Run the application
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from jugaad_data.nse   import NSELive
from cachetools import TTLCache
import asyncio
import time
import json
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

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

active_connections = set()
symbol_subscribers = {}  # Will be populated dynamically
price_cache = TTLCache(maxsize=100, ttl=5)  # Cache for 5 seconds

@app.get("/")
async def get():
    try:
        with open("templates/index1.html") as f:
            return HTMLResponse(content=f.read())
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Template file not found")

@app.get("/api/search/{query}")
async def search_stocks(query: str):
    try:
        search_results = nse.search_stock(query.upper())
        return {"results": search_results}
    except Exception as e:
        logger.error(f"Error searching stocks: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error searching stocks: {str(e)}")

@app.get("/api/validate/{symbol}")
async def validate_stock(symbol: str):
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
    try:
        # This is a placeholder - you'll need to implement the actual historical data fetching
        # NSELive might not have historical data, so you might need another library
        # For now, we'll return some dummy data for testing
        
        current_time = int(time.time() * 1000)
        one_day_ago = current_time - (24 * 60 * 60 * 1000)
        
        # Get current price for reference
        quote = nse.stock_quote(symbol.upper())
        current_price = quote.get("priceInfo", {}).get("lastPrice", 100)
        
        # Generate some random price movements around the current price
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

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
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

@app.on_event("startup")
async def startup_event():
    logger.info("Starting price broadcast loop")
    asyncio.create_task(price_broadcast_loop())

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down API")
    # Close any resources if needed
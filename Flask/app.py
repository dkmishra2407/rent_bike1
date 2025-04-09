from flask import Flask, jsonify, request
from jugaad_data.nse import NSELive
import pandas as pd
import threading
import time
import json
import os
import datetime
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
from nsepython import nse_get_top_gainers, nse_get_top_losers
from dotenv import load_dotenv
app = Flask(__name__)
CORS(app)
nse = NSELive()
load_dotenv()
# Connect to MongoDB
mongo_uri = os.getenv("MONGO_URI")

# Initialize MongoDB client
client = MongoClient(mongo_uri)
db = client['Growup']
orders_collection = db['orders']
users = db['users']
exchanges = db['exchanges']
holdings = db['holdings']

# Track market status
market_open = False


# Create indexes for faster queries
orders_collection.create_index([('status', 1)])
orders_collection.create_index([('symbol', 1)])
orders_collection.create_index([('created_at', -1)])

def check_market_status():
    """Check if the market is currently open"""
    try:
        status = nse.market_status()
        market_states = status['marketState']
        print(market_states)
        for market in market_states:
            if market['market'] == 'Capital Market' and market['marketStatus'] == 'Open':
                return True
        return False
    except Exception as e:
        print(f"Error checking market status: {e}")
        return False

def serialize_doc(doc):
    for key, value in doc.items():
        if isinstance(value, ObjectId):
            doc[key] = str(value)
    return doc


@app.route('/api/place-order', methods=['POST'])
def place_order():
    try:
        data = request.json
        required_fields = ['symbol', 'quantity', 'order_type', 'target_price', 'Email', 'OrderId', 'HoldingId']
        # market_open = check_market_status()
        # market_open = True
        # if not market_open:
        #     return jsonify({"error": "Market is closed. Cannot place orders."}), 400

        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        try:
            quantity = int(data['quantity'])
            target_price = float(data['target_price'])

            if quantity <= 0 or target_price <= 0:
                return jsonify({"error": "Quantity and price must be positive values"}), 400
        except ValueError:
            return jsonify({"error": "Invalid numeric values for quantity or price"}), 400

        order_type = data['order_type'].upper()
        if order_type not in ['BUY', 'SELL']:
            return jsonify({"error": "Order type must be either BUY or SELL"}), 400

        # Fetch user data
        user = users.find_one({'Email': data['Email']})
        if not user:
            return jsonify({"error": "User not found"}), 404

        symbol = data['symbol'].upper()

        # Validate holdings for SELL orders
        if order_type == 'SELL':
            holding = holdings.find_one({'HoldingId': data['HoldingId']})
            if not holding:
                return jsonify({"error": "Holding not found"}), 404

            existing_holding = next((h for h in holding['Holdings'] if h['symbol'] == symbol), None)
            if not existing_holding or existing_holding['quantity'] < quantity:
                return jsonify({"error": "Insufficient holdings to sell"}), 400

        balance = user['Balance']
        if order_type == 'BUY' and (float(balance) < (quantity * target_price)):
            return jsonify({"error": "Insufficient balance"}), 400

        # Create order object
        order = {
            'OrderId': data['OrderId'],  # You can use UUID or your logic to create OrderId
            'symbol': symbol,
            'quantity': quantity,
            'order_type': order_type,
            'target_price': target_price,
            'Email': data['Email'],
            'HoldingId': data['HoldingId'],
            'created_at': datetime.datetime.now()
        }

        # Insert order into collection
        result = orders_collection.insert_one(order)
        order['_id'] = result.inserted_id  # Add Mongo _id for reference

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

        return jsonify({
            "message": "Order placed successfully",
            "order_id": str(order['_id']),
            "order": serialize_doc(order)
        })

    except Exception as e:
        app.logger.error(f"Order placement error: {str(e)}", exc_info=True)
        return jsonify({"error": "An error occurred while processing your order"}), 500
    
@app.route('/api/gainer-losers', methods=['GET'])
def get_gainers_and_losers():
    gainers = nse_get_top_gainers()
    losers = nse_get_top_losers()

    gainers_df = pd.DataFrame(gainers)
    losers_df = pd.DataFrame(losers)
    
    return jsonify({
        "gainers": gainers_df.to_dict(orient="records"),
        "losers": losers_df.to_dict(orient="records")
    })
    
@app.route('/api/orders', methods=['GET'])
def get_orders():
    """Get all orders with optional filtering"""
    try:
        # Parse query parameters
        status = request.args.get('status')
        symbol = request.args.get('symbol')
        
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
            # Convert ObjectId to string for JSON serialization
            order['_id'] = str(order['_id'])
            orders.append(order)
        
        return jsonify({
            "orders": orders,
            "count": len(orders),
            "market_open": market_open
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/orders/<order_id>', methods=['GET'])
def get_order(order_id):
    """Get a specific order by ID"""
    try:
        # Validate ObjectId
        if not ObjectId.is_valid(order_id):
            return jsonify({"error": "Invalid order ID"}), 400
            
        order = orders_collection.find_one({'_id': ObjectId(order_id)})
        
        if not order:
            return jsonify({"error": "Order not found"}), 404
            
        # Convert ObjectId to string for JSON serialization
        order['_id'] = str(order['_id'])
        
        return jsonify(order)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

#FETCHING THE STOCKS DATA 
@app.route('/api/market-status', methods=['GET'])
def api_market_status():
    """Get current market status"""
    try:
        status = nse.market_status()
        is_open = check_market_status()
        return jsonify({
            'marketState': status['marketState'],
            'isOpen': is_open
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/stock-quote/<symbol>', methods=['GET'])
def api_stock_quote(symbol):
    """Get current stock quote"""
    try:
        quote = nse.stock_quote(symbol)
        return jsonify(quote['priceInfo'])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/indices', methods=['GET'])
def api_indices():
    """Get current indices data"""
    try:
        indices = nse.all_indices()
        return jsonify(indices)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
if __name__ == '__main__':
    port = int(os.getenv("PORT", 5000))
    # Run the Flask app on port 5000
    app.run(debug=True, port=port,host="0.0.0.0")
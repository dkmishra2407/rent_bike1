
# from flask import Flask, jsonify, render_template_string
# from jugaad_data.nse import NSELive
# import pandas as pd
# import threading
# import time
# import json
# from flask_socketio import SocketIO

# app = Flask(__name__)
# socketio = SocketIO(app, cors_allowed_origins="*")
# nse = NSELive()

# # Store for latest data
# latest_data = {}
# should_continue = True
# monitored_symbols = set()

# @app.route('/')
# def home():
#     return """
#     <h1>NSE Data API</h1>
    
#     <h2>Available endpoints:</h2>
#     <ul>
#         <li><a href="/market-status">/market-status</a> - Get current market status</li>
#         <li><a href="/stock-quote/IRFC">/stock-quote/IRFC</a> - Get stock quote for IRFC</li>
#         <li><a href="/stock-quote/SBIN">/stock-quote/SBIN</a> - Get stock quote for SBIN</li>
#         <li><a href="/tick-data/SBIN">/tick-data/SBIN</a> - Get tick data for SBIN (limited to 100 entries)</li>
#         <li><a href="/realtime">/realtime</a> - Real-time dashboard for monitoring stocks</li>
#     </ul>
#     """

# @app.route('/market-status')
# def market_status():
#     try:
#         status = nse.market_status()
#         return jsonify(status['marketState'])
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# @app.route('/stock-quote/<symbol>')
# def stock_quote(symbol):
#     try:
#         quote = nse.stock_quote(symbol)
#         return jsonify(quote['priceInfo'])
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# @app.route('/tick-data/<symbol>')
# def tick_data(symbol):
#     try:
#         data = nse.tick_data(symbol)
#         # Limiting to first 100 entries to avoid large responses
#         return jsonify(data['graphData'][0:100])
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# @app.route('/realtime')
# def realtime_dashboard():
#     dashboard_html = """
#     <!DOCTYPE html>
#     <html>
#     <head>
#         <title>Real-time NSE Stock Monitor</title>
#         <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.0.1/socket.io.js"></script>
#         <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>
#         <style>
#             body { font-family: Arial, sans-serif; margin: 20px; }
#             #stocks { width: 100%; border-collapse: collapse; }
#             #stocks th, #stocks td { border: 1px solid #ddd; padding: 8px; text-align: left; }
#             #stocks tr:nth-child(even) { background-color: #f2f2f2; }
#             #stocks th { padding-top: 12px; padding-bottom: 12px; background-color: #4CAF50; color: white; }
#             .up { color: green; }
#             .down { color: red; }
#             .controls { margin-bottom: 20px; }
#             input, button { padding: 8px; margin-right: 10px; }
#         </style>
#     </head>
#     <body>
#         <h1>Real-time NSE Stock Monitor</h1>
        
#         <div class="controls">
#             <input type="text" id="symbolInput" placeholder="Enter stock symbol (e.g., SBIN)">
#             <button onclick="addSymbol()">Add Symbol</button>
#             <button onclick="clearSymbols()">Clear All</button>
#         </div>
        
#         <table id="stocks">
#             <thead>
#                 <tr>
#                     <th>Symbol</th>
#                     <th>Last Price</th>
#                     <th>Change</th>
#                     <th>% Change</th>
#                     <th>High</th>
#                     <th>Low</th>
#                     <th>Open</th>
#                     <th>Last Updated</th>
#                     <th>Action</th>
#                 </tr>
#             </thead>
#             <tbody id="stocksBody">
#                 <!-- Data will be populated here -->
#             </tbody>
#         </table>
        
#         <script>
#             const socket = io();
#             const monitoredSymbols = new Set();
            
#             socket.on('connect', function() {
#                 console.log('Connected to server');
#             });
            
#             socket.on('stock_update', function(data) {
#                 updateStockRow(data);
#             });
            
#             function addSymbol() {
#                 const symbol = document.getElementById('symbolInput').value.trim().toUpperCase();
#                 if (symbol && !monitoredSymbols.has(symbol)) {
#                     monitoredSymbols.add(symbol);
#                     socket.emit('add_symbol', {symbol: symbol});
                    
#                     // Add row placeholder
#                     const tbody = document.getElementById('stocksBody');
#                     const row = document.createElement('tr');
#                     row.id = `row-${symbol}`;
#                     row.innerHTML = `
#                         <td>${symbol}</td>
#                         <td colspan="7">Loading...</td>
#                         <td><button onclick="removeSymbol('${symbol}')">Remove</button></td>
#                     `;
#                     tbody.appendChild(row);
                    
#                     document.getElementById('symbolInput').value = '';
#                 }
#             }
            
#             function removeSymbol(symbol) {
#                 monitoredSymbols.delete(symbol);
#                 socket.emit('remove_symbol', {symbol: symbol});
                
#                 const row = document.getElementById(`row-${symbol}`);
#                 if (row) {
#                     row.remove();
#                 }
#             }
            
#             function clearSymbols() {
#                 monitoredSymbols.forEach(symbol => {
#                     socket.emit('remove_symbol', {symbol: symbol});
#                 });
#                 monitoredSymbols.clear();
#                 document.getElementById('stocksBody').innerHTML = '';
#             }
            
#             function updateStockRow(data) {
#                 const symbol = data.symbol;
#                 const priceInfo = data.priceInfo;
                
#                 let row = document.getElementById(`row-${symbol}`);
#                 if (!row) {
#                     const tbody = document.getElementById('stocksBody');
#                     row = document.createElement('tr');
#                     row.id = `row-${symbol}`;
#                     tbody.appendChild(row);
#                 }
                
#                 const changeClass = priceInfo.change >= 0 ? 'up' : 'down';
#                 const changeSign = priceInfo.change >= 0 ? '+' : '';
                
#                 row.innerHTML = `
#                     <td>${symbol}</td>
#                     <td>${priceInfo.lastPrice}</td>
#                     <td class="${changeClass}">${changeSign}${priceInfo.change.toFixed(2)}</td>
#                     <td class="${changeClass}">${changeSign}${priceInfo.pChange.toFixed(2)}%</td>
#                     <td>${priceInfo.intraDayHighLow.max}</td>
#                     <td>${priceInfo.intraDayHighLow.min}</td>
#                     <td>${priceInfo.open}</td>
#                     <td>${moment().format('HH:mm:ss')}</td>
#                     <td><button onclick="removeSymbol('${symbol}')">Remove</button></td>
#                 `;
#             }
#         </script>
#     </body>
#     </html>
#     """
#     return render_template_string(dashboard_html)

# def fetch_stock_data():
#     global should_continue
#     while should_continue:
#         current_symbols = list(monitored_symbols)
#         for symbol in current_symbols:
#             try:
#                 quote = nse.stock_quote(symbol)
#                 latest_data[symbol] = {
#                     'symbol': symbol,
#                     'priceInfo': quote['priceInfo']
#                 }
#                 socketio.emit('stock_update', latest_data[symbol])
#             except Exception as e:
#                 print(f"Error fetching data for {symbol}: {e}")
        
#         # Sleep for 5 seconds before the next update
#         # Adjust based on API rate limits and your needs
#         time.sleep(5)

# @socketio.on('connect')
# def handle_connect():
#     print('Client connected')

# @socketio.on('disconnect')
# def handle_disconnect():
#     print('Client disconnected')

# @socketio.on('add_symbol')
# def handle_add_symbol(data):
#     symbol = data.get('symbol')
#     if symbol:
#         monitored_symbols.add(symbol)
#         try:
#             quote = nse.stock_quote(symbol)
#             latest_data[symbol] = {
#                 'symbol': symbol,
#                 'priceInfo': quote['priceInfo']
#             }
#             socketio.emit('stock_update', latest_data[symbol])
#         except Exception as e:
#             print(f"Error adding symbol {symbol}: {e}")
#             socketio.emit('error', {'message': f"Error adding {symbol}: {str(e)}"})

# @socketio.on('remove_symbol')
# def handle_remove_symbol(data):
#     symbol = data.get('symbol')
#     if symbol and symbol in monitored_symbols:
#         monitored_symbols.remove(symbol)
#         if symbol in latest_data:
#             del latest_data[symbol]

# if __name__ == '__main__':
#     # Start the background thread for data fetching
#     data_thread = threading.Thread(target=fetch_stock_data)
#     data_thread.daemon = True
#     data_thread.start()
    
#     # Run the Flask app with SocketIO
#     socketio.run(app, debug=True, allow_unsafe_werkzeug=True)


#      WE HAVE TO STORE ALL THE REQUESTS THAT ARE COME WHEN MARKET IS CLSOED IN THE QUEUE ONCE MARKET IS OPENED WE HAVE TO SEND ALL THE REQUESTS TO THE API AND CONTINOUSLY CHECK THAT MARKET IS COME AT REQUEST AT THAT PRICE THEN BUY/SELL STOCK

#     WRITE ONLY ROUTES FOR THE APIS DO NOT WRITE UI 
from flask import Flask, jsonify, request
from jugaad_data.nse import NSELive
import pandas as pd
import threading
import time
import json
import datetime
import uuid

app = Flask(__name__)
CORS(app)
nse = NSELive()

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/GrowwUp')
db = client['GrowwUp']
orders_collection = db['orders']
executions_collection = db['executions']
users = db['users']
exchanges = db['exchanges']
holdings = db['Holdings']

# Track market status
market_open = False
should_continue = True

# Lock for thread-safe operations
lock = threading.Lock()

# Create indexes for faster queries
orders_collection.create_index([('status', 1)])
orders_collection.create_index([('symbol', 1)])
orders_collection.create_index([('created_at', -1)])

def check_market_status():
    """Check if the market is currently open"""
    try:
        status = nse.market_status()
        market_states = status['marketState']
        
        # Check if the equity market is open
        for market in market_states:
            if market['market'] == 'Equity' and market['marketStatus'] == 'Open':
                return True
        return False
    except Exception as e:
        print(f"Error checking market status: {e}")
        return False

def process_pending_orders():
    """Process all pending orders from the database when market opens"""
    try:
        # Find all queued orders
        queued_orders = orders_collection.find({'status': 'QUEUED'})
        
        count = 0
        for order in queued_orders:
            # Update order status to ACTIVE
            orders_collection.update_one(
                {'_id': order['_id']},
                {'$set': {
                    'status': 'ACTIVE',
                    'updated_at': datetime.datetime.now()
                }}
            )
            count += 1
        
        print(f"Processed {count} pending orders")
    except Exception as e:
        print(f"Error processing pending orders: {e}")

def monitor_order_prices():
    """Monitor prices for active orders and execute when target price is reached"""
    try:
        # Get all active orders
        active_orders = orders_collection.find({'status': 'ACTIVE'})
        active_orders_list = list(active_orders)
        
        if not active_orders_list:
            return
            
        # Group by symbol to minimize API calls
        symbols = {}
        for order in active_orders_list:
            symbol = order['symbol']
            if symbol not in symbols:
                symbols[symbol] = []
            symbols[symbol].append(order)
        
        orders_to_execute = []
        
        for symbol, orders in symbols.items():
            try:
                quote = nse.stock_quote(symbol)
                current_price = quote['priceInfo']['lastPrice']
                
                # Check each order for this symbol
                for order in orders:
                    if (order['order_type'] == 'BUY' and current_price <= order['target_price']) or \
                       (order['order_type'] == 'SELL' and current_price >= order['target_price']):
                        # Order condition met
                        execution = {
                            'order_id': str(order['_id']),
                            'symbol': order['symbol'],
                            'quantity': order['quantity'],
                            'order_type': order['order_type'],
                            'target_price': order['target_price'],
                            'execution_price': current_price,
                            'executed_at': datetime.datetime.now()
                        }
                        
                        # Add to executions
                        executions_collection.insert_one(execution)
                        
                        # Update order status to EXECUTED
                        orders_collection.update_one(
                            {'_id': order['_id']},
                            {'$set': {
                                'status': 'EXECUTED',
                                'execution_price': current_price,
                                'executed_at': datetime.datetime.now(),
                                'updated_at': datetime.datetime.now()
                            }}
                        )
                        
                        orders_to_execute.append(order)
                        
            except Exception as e:
                print(f"Error monitoring price for {symbol}: {e}")
    
        # Return number of executed orders
        return len(orders_to_execute)
    except Exception as e:
        print(f"Error in monitor_order_prices: {e}")
        return 0

def market_monitor_thread():
    """Background thread to monitor market status and process orders"""
    global market_open, should_continue
    
    while should_continue:
        current_market_status = check_market_status()
        
        # Market just opened
        if current_market_status and not market_open:
            print("Market opened, processing pending orders")
            market_open = True
            process_pending_orders()
        
        # Market just closed
        elif not current_market_status and market_open:
            print("Market closed")
            market_open = False
        
        # If market is open, monitor prices for active orders
        if market_open:
            executed_count = monitor_order_prices()
            if executed_count:
                print(f"Executed {executed_count} orders")
        
        # Check every 60 seconds for market status
        # and every 5 seconds for prices when market is open
        time.sleep(5 if market_open else 60)
def serialize_doc(doc):
    for key, value in doc.items():
        if isinstance(value, ObjectId):
            doc[key] = str(value)
    return doc

# API Routes

@app.route('/api/place-order', methods=['POST'])
def place_order():
    try:
        data = request.json
        required_fields = ['symbol', 'quantity', 'order_type', 'target_price', 'Email', 'OrderId', 'HoldingId']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        # Validate numeric inputs
        try:
            quantity = int(data['quantity'])
            target_price = float(data['target_price'])
            
            if quantity <= 0 or target_price <= 0:
                return jsonify({"error": "Quantity and price must be positive values"}), 400
        except ValueError:
            return jsonify({"error": "Invalid numeric values for quantity or price"}), 400
            
        # Normalize order type
        order_type = data['order_type'].upper()
        if order_type not in ['BUY', 'SELL']:
            return jsonify({"error": "Order type must be either BUY or SELL"}), 400
            
        # Fetch user data
        user = users.find_one({'Email': data['Email']})

        print(user)
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Validate holdings for SELL orders
        symbol = data['symbol'].upper()
        if order_type == 'SELL':
            holding = holdings.find_one({'HoldingId': data['HoldingId']})
            if not holding:
                return jsonify({"error": "Holding not found"}), 404
                
            existing_holding = next((h for h in holding['Holdings'] if h['symbol'] == symbol), None)
            if not existing_holding or existing_holding['quantity'] < quantity:
                return jsonify({"error": "Insufficient holdings to sell"}), 400
        
        balance = user['Balance']
        # balance = 10000
        if order_type == 'BUY' and (float(balance) < (quantity * target_price)):
            return jsonify({"error": "Insufficient balance"}), 400
        
        # Create order object
        order = {
            'OrderId': data['OrderId'],
            'symbol': symbol,
            'quantity': quantity,
            'order_type': order_type,
            'target_price': target_price,
            'created_at': datetime.datetime.now(),
            'updated_at': datetime.datetime.now(),
            'status': 'ACTIVE' if market_open else 'QUEUED'  # Assuming market_open is defined elsewhere
        }
        
        # Insert order
        result = orders_collection.insert_one(order)
        order_id = str(result.inserted_id)
        order['OrderId'] = order_id  # replace the ObjectId with its string

        
        # Process active orders (skip this for queued orders)
        if order['status'] == 'ACTIVE':
            # Handle BUY order
            if order_type == 'BUY':
                # Update user balance
                new_balance = user['Balance'] - (quantity * target_price)
                users.update_one({'_id': user['_id']}, {'$set': {'Balance': new_balance}})
                
                # Update holdings
                holding = holdings.find_one({'HoldingId': data['HoldingId']})
                if not holding:
                    holding = {'HoldingId': data['HoldingId'], 'Holdings': []}
                    holdings.insert_one(holding)
                    holding = holdings.find_one({'HoldingId': data['HoldingId']})
                
                # Update existing holding or add new one
                existing_holding = next((h for h in holding['Holdings'] if h['symbol'] == symbol), None)
                if existing_holding:
                    total_qty = existing_holding['quantity'] + quantity
                    avg_price = ((existing_holding['quantity'] * existing_holding['price']) + 
                                 (quantity * target_price)) / total_qty
                    
                    # Update the holding in the list
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
                
                # Save updated holdings
                holdings.update_one({'HoldingId': data['HoldingId']}, {'$set': {'Holdings': holding['Holdings']}})
            
            # Handle SELL order
            else:
                # Update user balance
                new_balance = user['Balance'] + (quantity * target_price)
                users.update_one({'_id': user['_id']}, {'$set': {'Balance': new_balance}})
                
                # Update holdings
                holding = holdings.find_one({'HoldingId': data['HoldingId']})
                if not holding:
                    return jsonify({"error": "Holding not found"}), 404
                
                # Find and update the specific holding
                for i, h in enumerate(holding['Holdings']):
                    if h['symbol'] == symbol:
                        h['quantity'] -= quantity
                        if h['quantity'] == 0:
                            # Remove this holding if quantity becomes zero
                            holding['Holdings'].pop(i)
                        break
                
                # Save updated holdings or delete if empty
                if not holding['Holdings']:
                    holdings.delete_one({'HoldingId': data['HoldingId']})
                else:
                    holdings.update_one({'HoldingId': data['HoldingId']}, {'$set': {'Holdings': holding['Holdings']}})
        
        # Return success response
        return jsonify({
            "message": "Order placed successfully",
            "order_id": order_id,
            "order": serialize_doc(order)
        })
  


    
    except Exception as e:
        # Log the full error for debugging
        app.logger.error(f"Order placement error: {str(e)}", exc_info=True)
        return jsonify({"error": "An error occurred while processing your order"}), 500
    

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

@app.route('/api/orders/<order_id>', methods=['DELETE'])
def cancel_order(order_id):
    """Cancel an order"""
    try:
        # Validate ObjectId
        if not ObjectId.is_valid(order_id):
            return jsonify({"error": "Invalid order ID"}), 400
            
        # Find the order
        order = orders_collection.find_one({'_id': ObjectId(order_id)})
        
        if not order:
            return jsonify({"error": "Order not found"}), 404
            
        # Check if order can be cancelled
        if order['status'] in ['EXECUTED', 'CANCELLED']:
            return jsonify({
                "error": f"Cannot cancel order in {order['status']} status"
            }), 400
            
        # Update order status
        orders_collection.update_one(
            {'_id': ObjectId(order_id)},
            {'$set': {
                'status': 'CANCELLED',
                'updated_at': datetime.datetime.now()
            }}
        )
        
        # Get updated order
        updated_order = orders_collection.find_one({'_id': ObjectId(order_id)})
        updated_order['_id'] = str(updated_order['_id'])
        
        return jsonify({
            "message": "Order cancelled successfully",
            "order": updated_order
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/executions', methods=['GET'])
def get_executions():
    """Get all executed orders"""
    try:
        executions_cursor = executions_collection.find().sort('executed_at', -1)
        executions = []
        
        for execution in executions_cursor:
            # Convert ObjectId to string for JSON serialization
            execution['_id'] = str(execution['_id'])
            executions.append(execution)
        
        return jsonify({
            "executions": executions,
            "count": len(executions)
        })
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
    # Start the background thread for market monitoring
    market_thread = threading.Thread(target=market_monitor_thread)
    market_thread.daemon = True
    market_thread.start()
    
    # Run the Flask app
    app.run(debug=True)
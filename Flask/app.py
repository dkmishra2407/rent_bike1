
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
import queue
import datetime
import uuid

app = Flask(__name__)
nse = NSELive()

# Queue for orders when market is closed
pending_orders = queue.Queue()

# Track active orders that are waiting for price targets when market is open
active_orders = {}

# Track market status
market_open = False
should_continue = True

# Lock for thread-safe operations
lock = threading.Lock()

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
    """Process all pending orders from the queue when market opens"""
    global pending_orders
    
    print(f"Processing {pending_orders.qsize()} pending orders")
    
    while not pending_orders.empty():
        order = pending_orders.get()
        order_id = str(uuid.uuid4())
        
        # Add to active orders for price monitoring
        with lock:
            active_orders[order_id] = order
            order['order_id'] = order_id
            order['status'] = 'ACTIVE'
            order['created_at'] = datetime.datetime.now().isoformat()
        
        print(f"Moved order to active monitoring: {order}")

def monitor_order_prices():
    """Monitor prices for active orders and execute when target price is reached"""
    global active_orders
    
    orders_to_execute = []
    
    with lock:
        if not active_orders:
            return
            
        # Group by symbol to minimize API calls
        symbols = set(order['symbol'] for order in active_orders.values())
        
        for symbol in symbols:
            try:
                quote = nse.stock_quote(symbol)
                current_price = quote['priceInfo']['lastPrice']
                
                # Check each order for this symbol
                for order_id, order in list(active_orders.items()):
                    if order['symbol'] != symbol:
                        continue
                        
                    if (order['order_type'] == 'BUY' and current_price <= order['target_price']) or \
                       (order['order_type'] == 'SELL' and current_price >= order['target_price']):
                        # Order condition met
                        order['execution_price'] = current_price
                        order['executed_at'] = datetime.datetime.now().isoformat()
                        order['status'] = 'EXECUTED'
                        
                        # Add to execution list
                        orders_to_execute.append(order.copy())
                        
                        # Remove from active monitoring
                        del active_orders[order_id]
                        
            except Exception as e:
                print(f"Error monitoring price for {symbol}: {e}")
    
    # Execute orders (in real implementation, this would call your broker's API)
    for order in orders_to_execute:
        print(f"Executing order: {order}")
        # Here you would integrate with your broker's API
        # broker_api.place_order(order)

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
            monitor_order_prices()
        
        # Check every 60 seconds for market status
        # and every 5 seconds for prices when market is open
        time.sleep(5 if market_open else 60)

# API Routes

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

@app.route('/api/place-order', methods=['POST'])
def place_order():
    """Place a new order - queue it if market closed, monitor it if market open"""
    try:
        data = request.json
        
        # Validate request
        required_fields = ['symbol', 'quantity', 'order_type', 'target_price']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Create order object
        order = {
            'symbol': data['symbol'].upper(),
            'quantity': int(data['quantity']),
            'order_type': data['order_type'].upper(),  # BUY or SELL
            'target_price': float(data['target_price']),
            'created_at': datetime.datetime.now().isoformat()
        }
        
        # Add optional fields
        if 'limit_price' in data:
            order['limit_price'] = float(data['limit_price'])
        
        # Check if market is open
        if market_open:
            # Add to active orders with a unique ID
            order_id = str(uuid.uuid4())
            order['order_id'] = order_id
            order['status'] = 'ACTIVE'
            
            with lock:
                active_orders[order_id] = order
            
            return jsonify({
                "message": "Order placed for active monitoring",
                "order_id": order_id,
                "order": order
            })
        else:
            # Add to queue for when market opens
            order['status'] = 'QUEUED'
            pending_orders.put(order)
            
            return jsonify({
                "message": "Market is closed. Order queued for processing when market opens.",
                "order": order
            })
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/orders', methods=['GET'])
def get_orders():
    """Get all active and queued orders"""
    queued_orders = list(pending_orders.queue)
    
    with lock:
        all_active_orders = list(active_orders.values())
    
    return jsonify({
        "active_orders": all_active_orders,
        "queued_orders": queued_orders,
        "market_open": market_open
    })

@app.route('/api/cancel-order/<order_id>', methods=['DELETE'])
def cancel_order(order_id):
    """Cancel an active order"""
    with lock:
        if order_id in active_orders:
            order = active_orders.pop(order_id)
            return jsonify({
                "message": "Order cancelled successfully",
                "order": order
            })
        
    return jsonify({"error": "Order not found"}), 404

@app.route('/api/stock-quote/<symbol>', methods=['GET'])
def api_stock_quote(symbol):
    """Get current stock quote"""
    try:
        quote = nse.stock_quote(symbol)
        return jsonify(quote['priceInfo'])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Start the background thread for market monitoring
    market_thread = threading.Thread(target=market_monitor_thread)
    market_thread.daemon = True
    market_thread.start()
    
    # Run the Flask app
    app.run(debug=True)
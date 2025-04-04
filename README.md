# 📊 Flask Stock Market App with jugaad-data

This is a simple Flask application integrated with [`jugaad-data`](https://pypi.org/project/jugaad-data/) to fetch and process live stock data from NSE (National Stock Exchange, India). The project uses specific versions of Flask and Werkzeug to maintain compatibility.

---

## ⚙️ Setup & Installation

Follow the steps below to set up the project from scratch:

### ✅ 1. Create and Activate Virtual Environment

**Windows:**
```bash
python -m venv venv
.\venv\Scripts\activate
📦 2. Install Required Packages
Initial version-specific installs:

python -m pip install werkzeug==2.0.3
python -m pip install flask==2.0.3
Then install the data libraries:

python -m pip install jugaad-data pandas
Optional: Upgrade to newer compatible versions:

python -m pip install flask==2.2.5 werkzeug==2.2.3
🔍 3. Verify Installed Versions
Run the following to confirm the installed versions:

python -m pip freeze | findstr "Flask Werkzeug"
Expected output:

Flask==2.2.5
Werkzeug==2.2.3
🚀 Running the App
Replace app.py with your actual script name if different.

python app.py


📚 Dependencies
Flask – Web application framework

Werkzeug – WSGI utility library used by Flask

jugaad-data – For fetching live market data from NSE

pandas – Data analysis and manipulation

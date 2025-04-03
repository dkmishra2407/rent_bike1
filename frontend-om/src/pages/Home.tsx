<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { BarChart3, TrendingUp, Shield } from 'lucide-react';

const Home = () => {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 1000 });

    // Fetch stock data from API
    fetch('https://api.example.com/stocks') // 🔴 Replace with your actual API URL
      .then((response) => response.json())
      .then((data) => setStocks(data))
      .catch((error) => console.error('Error fetching stock data:', error));
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* TradingView Widget */}
      <div id="tradingview-widget" className="mb-8" style={{ pointerEvents: 'none' }}></div>

      {/* Hero Section */}
      <div className="text-center py-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6" data-aos="fade-up">
          Trade Smarter with GrowUp
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto" data-aos="fade-up">
=======
import React from 'react';
import { BarChart3, TrendingUp, Shield } from 'lucide-react';

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Trade Smarter with GrowUp
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
>>>>>>> 6c9e313b2d124c8700e4f25e6dd07af4fcb6484e
          Your all-in-one platform for real-time stock trading, advanced analytics, and portfolio management.
        </p>
      </div>

<<<<<<< HEAD
      {/* Stock Table */}
      <div className="bg-white shadow-md rounded-lg p-6" data-aos="fade-up">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4 text-center">📈 Live Stock Market Data</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white text-left">
                <th className="py-3 px-4 text-lg">Stock Name</th>
                <th className="py-3 px-4 text-lg">Current Value</th>
              </tr>
            </thead>
            <tbody>
              {stocks.length > 0 ? (
                stocks.map((stock, index) => (
                  <tr key={index} className="border-b hover:bg-gray-100 transition-all duration-300" data-aos="fade-in">
                    <td className="py-3 px-4 text-gray-800">{stock.name}</td>
                    <td className="py-3 px-4 font-semibold text-green-600">${stock.value}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center py-4 text-gray-500">
                    Loading stock data...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 py-12">
        <div className="bg-white p-6 rounded-lg shadow-md" data-aos="fade-up">
=======
      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 py-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
>>>>>>> 6c9e313b2d124c8700e4f25e6dd07af4fcb6484e
          <div className="flex items-center mb-4">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <h3 className="text-xl font-semibold ml-3">Real-Time Analytics</h3>
          </div>
          <p className="text-gray-600">
            Access live market data and advanced charting tools to make informed decisions.
          </p>
        </div>

<<<<<<< HEAD
        <div className="bg-white p-6 rounded-lg shadow-md" data-aos="fade-up" data-aos-delay="200">
=======
        <div className="bg-white p-6 rounded-lg shadow-md">
>>>>>>> 6c9e313b2d124c8700e4f25e6dd07af4fcb6484e
          <div className="flex items-center mb-4">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <h3 className="text-xl font-semibold ml-3">Smart Trading</h3>
          </div>
          <p className="text-gray-600">
            Execute trades quickly and efficiently with our intuitive trading interface.
          </p>
        </div>

<<<<<<< HEAD
        <div className="bg-white p-6 rounded-lg shadow-md" data-aos="fade-up" data-aos-delay="400">
=======
        <div className="bg-white p-6 rounded-lg shadow-md">
>>>>>>> 6c9e313b2d124c8700e4f25e6dd07af4fcb6484e
          <div className="flex items-center mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
            <h3 className="text-xl font-semibold ml-3">Secure Platform</h3>
          </div>
          <p className="text-gray-600">
            Trade with confidence knowing your investments are protected by top-tier security.
          </p>
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default Home;
=======
export default Home;
>>>>>>> 6c9e313b2d124c8700e4f25e6dd07af4fcb6484e

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
          Your all-in-one platform for real-time stock trading, advanced analytics, and portfolio management.
        </p>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 py-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <h3 className="text-xl font-semibold ml-3">Real-Time Analytics</h3>
          </div>
          <p className="text-gray-600">
            Access live market data and advanced charting tools to make informed decisions.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <h3 className="text-xl font-semibold ml-3">Smart Trading</h3>
          </div>
          <p className="text-gray-600">
            Execute trades quickly and efficiently with our intuitive trading interface.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
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

export default Home;
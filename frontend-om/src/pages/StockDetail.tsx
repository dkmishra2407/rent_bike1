import React from 'react';
import { useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Clock, DollarSign, BarChart2 } from 'lucide-react';

// Temporary mock data
const mockStockData = {
  symbol: 'AAPL',
  name: 'Apple Inc.',
  price: 175.43,
  change: 2.31,
  changePercent: 1.32,
  high: 176.98,
  low: 173.12,
  volume: '52.4M',
  marketCap: '2.8T',
};

const mockChartData = Array.from({ length: 20 }, (_, i) => ({
  time: `${i}:00`,
  price: 170 + Math.random() * 10,
}));

const StockDetail = () => {
  const { symbol } = useParams<{ symbol: string }>();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stock Info */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{mockStockData.name}</h1>
                <p className="text-lg text-gray-600">{symbol}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">
                  ${mockStockData.price.toFixed(2)}
                </div>
                <div className="flex items-center justify-end mt-1">
                  {mockStockData.change >= 0 ? (
                    <TrendingUp className="h-5 w-5 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-600 mr-1" />
                  )}
                  <span
                    className={
                      mockStockData.change >= 0 ? 'text-green-600' : 'text-red-600'
                    }
                  >
                    ${Math.abs(mockStockData.change).toFixed(2)} (
                    {mockStockData.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="h-[400px] mt-8">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={['auto', 'auto']} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Trading Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Trade {symbol}</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Order Type
                </label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option>Market Order</option>
                  <option>Limit Order</option>
                  <option>Stop Order</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Buy
                </button>
                <button
                  type="button"
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Sell
                </button>
              </div>
            </form>
          </div>

          {/* Stock Stats */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Statistics</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BarChart2 className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-600">High</span>
                </div>
                <span className="font-medium">${mockStockData.high}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BarChart2 className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-600">Low</span>
                </div>
                <span className="font-medium">${mockStockData.low}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-600">Volume</span>
                </div>
                <span className="font-medium">{mockStockData.volume}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-600">Market Cap</span>
                </div>
                <span className="font-medium">{mockStockData.marketCap}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockDetail;
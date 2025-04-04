import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Wallet, TrendingUp, Star, Clock } from 'lucide-react';

// Temporary mock data
const mockPortfolioValue = [
  { date: '2024-01', value: 10000 },
  { date: '2024-02', value: 12000 },
  { date: '2024-03', value: 11500 },
  { date: '2024-04', value: 13500 },
  { date: '2024-05', value: 14200 },
];

const mockHoldings = [
  { symbol: 'AAPL', shares: 10, avgPrice: 175.43, currentPrice: 178.22, totalValue: 1782.20 },
  { symbol: 'MSFT', shares: 5, avgPrice: 334.23, currentPrice: 338.11, totalValue: 1690.55 },
  { symbol: 'GOOGL', shares: 8, avgPrice: 138.45, currentPrice: 141.18, totalValue: 1129.44 },
];

const mockWatchlist = [
  { symbol: 'TSLA', price: 202.64, change: 5.67, changePercent: 2.88 },
  { symbol: 'NVDA', price: 788.17, change: -12.33, changePercent: -1.54 },
  { symbol: 'META', price: 485.58, change: 3.22, changePercent: 0.67 },
];

const mockRecentTrades = [
  { symbol: 'AAPL', type: 'buy', shares: 2, price: 175.43, date: '2024-03-15' },
  { symbol: 'MSFT', type: 'sell', shares: 1, price: 338.11, date: '2024-03-14' },
  { symbol: 'GOOGL', type: 'buy', shares: 3, price: 141.18, date: '2024-03-13' },
];

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <Wallet className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold ml-3">Portfolio Value</h3>
          </div>
          <p className="text-3xl font-bold">$24,602.19</p>
          <p className="text-green-600 mt-2">+$1,245.32 (5.33%)</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold ml-3">Today's Gain/Loss</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">+$324.15</p>
          <p className="text-gray-600 mt-2">+1.33%</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <Star className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold ml-3">Top Performer</h3>
          </div>
          <p className="text-xl font-bold">AAPL</p>
          <p className="text-green-600 mt-2">+$2.79 (1.58%)</p>
        </div>
      </div>

      {/* Portfolio Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-6">Portfolio Performance</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockPortfolioValue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#2563eb"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Holdings */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Current Holdings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Symbol
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Shares
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Avg Price
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Current
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockHoldings.map((holding) => (
                  <tr key={holding.symbol}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {holding.symbol}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-gray-500">
                      {holding.shares}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-gray-500">
                      ${holding.avgPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-gray-500">
                      ${holding.currentPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900">
                      ${holding.totalValue.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          {/* Watchlist */}
          <div className="bg-white rounded-lg shadow-md mb-8">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">Watchlist</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {mockWatchlist.map((stock) => (
                <div key={stock.symbol} className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-900">{stock.symbol}</h3>
                    <p className="text-gray-500">${stock.price.toFixed(2)}</p>
                  </div>
                  <div className={stock.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {stock.change >= 0 ? '+' : ''}
                    {stock.changePercent.toFixed(2)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Trades */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-blue-600 mr-2" />
                <h2 className="text-xl font-bold">Recent Trades</h2>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {mockRecentTrades.map((trade, index) => (
                <div key={index} className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-900">{trade.symbol}</h3>
                      <p className="text-sm text-gray-500">{trade.date}</p>
                    </div>
                    <div className="text-right">
                      <p className={trade.type === 'buy' ? 'text-green-600' : 'text-red-600'}>
                        {trade.type.toUpperCase()} {trade.shares} shares
                      </p>
                      <p className="text-sm text-gray-500">
                        @ ${trade.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
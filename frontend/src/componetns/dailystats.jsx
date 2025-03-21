import React from 'react';

const DailyStats = ({ data }) => {
  // Check if data exists, if not return a loading state

  console.log(data)
  if (!data) {
    return <div className="p-4">Loading stock data...</div>;
  }

  // Safely access nested properties
  const fiftyTwoWeek = data.fifty_two_week || {};
  
  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center border-b pb-2">
        {data.name || 'Stock'} ({data.symbol || ''})
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Price Section */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Current Price</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Close</span>
              <span className="text-xl font-bold">${data.close || 'N/A'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Previous Close</span>
              <span className="text-lg">${data.previous_close || 'N/A'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Change</span>
              <span className={`text-lg font-medium ${parseFloat(data.change || 0) < 0 ? 'text-red-600' : 'text-green-600'}`}>
                ${data.change || '0'} ({data.percent_change || '0'}%)
              </span>
            </div>
          </div>
        </div>
        
        {/* Daily Range Section */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Daily Range</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Open</span>
              <span className="text-lg">${data.open || 'N/A'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">High</span>
              <span className="text-lg">${data.high || 'N/A'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Low</span>
              <span className="text-lg">${data.low || 'N/A'}</span>
            </div>
          </div>
        </div>
        
        {/* 52 Week Range Section */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">52 Week Range</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700">High</h4>
              <p className="text-lg mb-1">${fiftyTwoWeek.high || 'N/A'}</p>
              <div className="flex flex-col">
                <span className={`text-sm ${parseFloat(fiftyTwoWeek.high_change || 0) < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  ${fiftyTwoWeek.high_change || '0'} ({fiftyTwoWeek.high_change_percent || '0'}%)
                </span>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Low</h4>
              <p className="text-lg mb-1">${fiftyTwoWeek.low || 'N/A'}</p>
              <div className="flex flex-col">
                <span className={`text-sm ${parseFloat(fiftyTwoWeek.low_change || 0) < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  ${fiftyTwoWeek.low_change || '0'} ({fiftyTwoWeek.low_change_percent || '0'}%)
                </span>
              </div>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            <p>Range: {fiftyTwoWeek.range || 'N/A'}</p>
          </div>
        </div>
        
        {/* Volume Section */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Volume Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Volume</span>
              <span className="text-lg">
                {data.volume ? parseInt(data.volume).toLocaleString() : 'N/A'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Average Volume</span>
              <span className="text-lg">
                {data.average_volume ? parseInt(data.average_volume).toLocaleString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Additional Information Section */}
      <div className="bg-white p-4 rounded-lg shadow mt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Additional Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Exchange</span>
            <span className="text-lg">{data.exchange || 'N/A'}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Currency</span>
            <span className="text-lg">{data.currency || 'N/A'}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Date</span>
            <span className="text-lg">{data.datetime || 'N/A'}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Market Status</span>
            <span className={`text-lg font-medium ${data.is_market_open ? 'text-green-600' : 'text-red-600'}`}>
              {data.is_market_open !== undefined ? (data.is_market_open ? 'Open' : 'Closed') : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyStats;
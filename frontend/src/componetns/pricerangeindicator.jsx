import React from 'react';
import { useState, useEffect } from 'react';

const PriceRangeIndicator = ({ stockData, currentVal }) => {
  // Get the low, high, and current values
  const low = parseFloat(stockData.low) || 0;
  const high = parseFloat(stockData.high) || 0;
  const current = parseFloat(currentVal) || 0;
  
  // Calculate marker position as a percentage of the total range
  const [markerPosition, setMarkerPosition] = useState(0);
  
  useEffect(() => {
    if (high > low) {
      const position = ((current - low) / (high - low)) * 100;
      // Clamp between 0 and 100 to ensure marker stays on the line
      setMarkerPosition(Math.max(0, Math.min(100, position)));
    }
  }, [low, high, current]);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-medium text-gray-700 mb-4">Performance</h2>
      <div className="flex justify-between mb-2">
        <div className="text-sm text-gray-600">Today's Low</div>
        <div className="text-sm text-gray-600">Today's High</div>
      </div>
      
      <div className="relative">
        <div className="flex justify-between mb-1">
          <div className="font-bold">${low.toFixed(2)}</div>
          <div className="font-bold">${high.toFixed(2)}</div>
        </div>
        
        {/* Progress bar */}
        <div className="h-2 w-full bg-green-500 rounded-full relative">
          {/* Triangle marker for current value */}
          <div 
            className="absolute -top-1" 
            style={{ 
              left: `${markerPosition}%`, 
              transform: 'translateX(-50%)' 
            }}
          >
            <div className="w-0 h-0 border-l-4 border-r-4 border-b-6 border-l-transparent border-r-transparent border-b-gray-600"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceRangeIndicator;
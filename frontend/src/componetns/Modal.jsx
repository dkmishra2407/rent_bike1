import React, { useState } from 'react';

const Modal = () => {
  const [orderType, setOrderType] = useState('BUY');
  const [deliveryType, setDeliveryType] = useState('Delivery');
//   const [isSellClicked,setSellClicked] = useState(false);

  return (
    <div className='w-2/5 max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md m-10 h-full'>
      <div className="flex flex-col">
        {/* Stock Info Header */}
        <div className="border-b pb-4">
          <h2 className="text-xl font-medium">Tesla</h2>
          <div className="flex items-center text-sm mt-1">
            <span> $225.40 (+3.30%)</span>
            <span className="ml-2 text-gray-500 underline">Depth</span>
          </div>
        </div>
        
        {/* Buy/Sell Toggle */}
        <div className="border-b flex mt-4">
          <button 
            className={`py-2 px-8 font-medium ${orderType === 'BUY' ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-500'}`}
            onClick={() => setOrderType('BUY')}
          >
            BUY
          </button>
          <button 
            className={`py-2 px-8 font-medium ${orderType === 'SELL' ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-500'}`}
            onClick={() => setOrderType('SELL') }
            // onClick={() => setSellClicked(true)}

          >
            SELL
          </button>
        </div>
        
        {/* Order Type Selection */}
        <div className="mt-4 flex gap-2">
          <button 
            className={`px-4 py-2 rounded-full text-sm ${deliveryType === 'Delivery' ? 'bg-gray-200 font-medium' : 'border border-gray-300'}`}
            onClick={() => setDeliveryType('Delivery')}
          >
            Delivery
          </button>
          <button 
            className={`px-4 py-2 rounded-full text-sm ${deliveryType === 'Intraday' ? 'bg-gray-200 font-medium' : 'border border-gray-300'}`}
            onClick={() => setDeliveryType('Intraday')}
          >
            Intraday
          </button>
          <button 
            className={`px-4 py-2 rounded-full text-sm ${deliveryType === 'MTF' ? 'bg-gray-200 font-medium' : 'border border-gray-300'}`}
            onClick={() => setDeliveryType('MTF')}
          >
            MTF
          </button>
          <button className="ml-auto p-2 rounded-full border border-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
        
        {/* Quantity Selection */}
        <div className="mt-4 flex items-center">
          <div className="flex items-center">
            <span className="text-gray-600 mr-2">Qty</span>
          </div>
          <div className="ml-auto">
            <input type="text" className="w-full border rounded-md p-2" />
          </div>
        </div>
        
        {/* Price Selection */}
        <div className="mt-4 flex items-center">
          <div className="flex items-center">
            <span className="text-gray-600 mr-2">Price</span>
            <span className="flex items-center border rounded-md px-2 py-1">
              <span>Market</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>
          <div className="ml-auto">
            <div className="w-full border rounded-md p-2 text-gray-500">
              At market
            </div>
          </div>
        </div>
        
        {/* Order Message */}
        <div className="mt-16 text-center text-gray-500 text-sm">
          Order will be executed at best price in market
        </div>
        
        {/* Balance Info */}
        <div className="mt-8 flex justify-between text-sm">
          <div>Balance : ₹0</div>
          <div className="text-gray-500 underline">Approx req. : ₹0</div>
        </div>
        
        {/* Buy Button */}
        <button className="mt-4 w-full bg-green-500 text-white font-medium py-3 rounded-md">
          {orderType}
        </button>
      </div>
    </div>
  );
};

export default Modal;
import React, { useEffect, useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import axios from 'axios';
import PriceRangeIndicator from './pricerangeindicator';
import AboutStock from './aboutstock';
import DailyStats from './dailystats';
const Chart = () => {
  const [stockData, setStockData] = useState({});
  const [currentVal, setCurrentVal] = useState(0);
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [days, setDays] = useState(30);
  const API_KEY = 'f7c090d1abmsh0b1dcc790f243ccp1b8b18jsne1af8c2785f4';
  const API_HOST = 'twelve-data1.p.rapidapi.com';
  const STOCK_SYMBOL = 'GOOG';
  
  const [logo, setLogo] = useState('');

  async function fetchLogo() {
    try {
      const response = await axios.get('https://twelve-data1.p.rapidapi.com/logo', {
        params: { symbol: STOCK_SYMBOL },
        headers: {
          'x-rapidapi-key': API_KEY,
          'x-rapidapi-host': API_HOST
        }
      });
      setLogo(response.data.url);
    } catch (error) {
      console.error(error);
    }
  }

  function handleButtonClick(day) {
    setDays(day);
  }

  async function getTimeSeriesData() {
    try {
      const response = await axios.get(`https://${API_HOST}/time_series`, {
        params: { 
          symbol: STOCK_SYMBOL, 
          interval: '1day', 
          outputsize: days.toString(),
          format: 'json' 
        },
        headers: { 'x-rapidapi-key': API_KEY, 'x-rapidapi-host': API_HOST }
      });
  
      if (response.data && response.data.values) {
        const formattedData = response.data.values.map(entry => {
          return {
            name: entry.datetime,
            price: parseFloat(entry.close)
          };
        });
        
        setTimeSeriesData(formattedData.reverse());
      }
    } catch (error) {
      console.error(error);
    }
  }
  
  async function getStockPrice() {
    try {
      const response = await axios.get(`https://${API_HOST}/price`, {
        params: { symbol: STOCK_SYMBOL, format: 'json' },
        headers: { 'x-rapidapi-key': API_KEY, 'x-rapidapi-host': API_HOST }
      });
  
      if (response.data && response.data.price) {
        setCurrentVal(parseFloat(response.data.price));
      }
    } catch (error) {
      console.error(error);
    }
  }
  
  async function getStockQuote() {
    try {
      const response = await axios.get(`https://${API_HOST}/quote`, {
        params: { symbol: STOCK_SYMBOL, format: 'json' },
        headers: { 'x-rapidapi-key': API_KEY, 'x-rapidapi-host': API_HOST }
      });
  
      if (response.data) {
        console.log(response.data)
        setStockData(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  }
  
  async function fetchStockData() {
    await getTimeSeriesData();
    await fetchLogo();
    await getStockPrice();
    await getStockQuote();
  }
  
  useEffect(() => {
    fetchStockData();
  }, []);

  useEffect(() => {
    getTimeSeriesData();
  }, [days]);

  return (
    <div className="chart-container w-3/5">
       
       <div className='flex justify-between items-center'>
       {logo && <img src={logo} alt="logo" />}
       <button className='btn btn-success'>Add To Watchlist</button>
       </div>
      <h2>{STOCK_SYMBOL} Stock Price Chart</h2>
      <p>Current Price: ${currentVal}</p>
      {timeSeriesData.length > 0 ? (
        <LineChart width={900} height={450} data={timeSeriesData}>
          <Line type="monotone" dataKey="price" stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="name" />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip />
          <Legend />
        </LineChart>
      ) : (
        <p>Loading chart data...</p>
      )}

      <div className="button-group flex gap-2 ml-20">
      <button className="btn btn-primary" onClick={() => handleButtonClick(7)}>1 Week</button>
      {/* <button className="btn btn-primary" onClick={() => handleButtonClick(180)}>6 Months</button> */}
        <button className="btn btn-primary" onClick={() => handleButtonClick(10)}>10 Days</button>
      <button className="btn btn-primary" onClick={() => handleButtonClick(21)}>3 Weeks</button>
        <button className="btn btn-primary" onClick={() => handleButtonClick(20)}>20 Days</button>
        <button className="btn btn-primary" onClick={() => handleButtonClick(30)}>30 Days</button>
        <button className="btn btn-primary" onClick={() => handleButtonClick(90)}>3 Months</button>
        <button className="btn btn-primary" onClick={() => handleButtonClick(100)}>100 Days</button>
        <button className="btn btn-primary" onClick={() => handleButtonClick(180)}>6 Months</button>
      </div>

      <PriceRangeIndicator stockData={stockData} currentVal={currentVal}/>

      <DailyStats data={stockData} />

      {/* {Object.keys(stockData).length > 0 && (
        <div className="stock-info">
          <h3>Daily Stats</h3>
          <p>Open: ${stockData.open}</p>
          <p>High: ${stockData.high}</p>
          <p>Low: ${stockData.low}</p>
          <p>Close: ${stockData.close}</p>
          <p>Volume: {stockData.volume}</p>
        </div>
      )} */}

      <AboutStock stockName={STOCK_SYMBOL}/>
    </div>
  );
};

export default Chart;
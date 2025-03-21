import React from 'react';
import  Sidebar  from './componetns/sidebar/sidebar';
// import Header from './componetns/header';
import './App.css'
import Stockinfo from './pages/stockinfo';
function App() {
  return (
    <div className="flex flex-col">
      <Sidebar />
      {/* <Header/> */}
      <div className="pl-22 pt-5 pr-5 pb-10">
        <Stockinfo />
      </div>
    </div>
  );
}

export default App;
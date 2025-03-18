import React from 'react';
import Chart from './componetns/chart';
import  Sidebar  from './componetns/sidebar/sidebar';
import Header from './componetns/header';
import './App.css'
function App() {
  return (
    <div className="flex flex-col">
      <Sidebar />
      <Header/>
      <div className="pl-22 pt-5 pr-5 pb-10">
        <Chart />
      </div>
    </div>
  );
}

export default App;
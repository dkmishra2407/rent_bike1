import React from 'react'
import Chart from '../componetns/chart';
import Modal from '../componetns/Modal';
const Stockinfo = () => {
  return (
    <div className='flex gap-10'>
      <Chart />
      <Modal/>
    </div>
  )
}

export default Stockinfo
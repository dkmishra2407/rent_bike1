import React, { useState } from 'react';
import {
  MdHome, // Home icon
  MdDashboard, // Portfolio icon
  MdCalculate, // Tax Calculator icon
  MdListAlt, // Watchlist icon
  MdLocalOffer, // Sales icon
  MdSchool, // Stock Gyan icon (using a knowledge/education icon)
} from 'react-icons/md';
import './SideBar.css';
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // State to manage sidebar open/close
  const [hoveredItem, setHoveredItem] = useState(null); // State to track hovered item

  // Page mapping between the page name and its icon and label
  const pageMapping = [
    { id: 'Home', icon: <MdHome />, label: 'Home' },
    { id: 'Portfolio', icon: <MdDashboard />, label: 'Portfolio' },
    { id: 'Tax Calculator', icon: <MdCalculate />, label: 'Tax Calculator' },
    { id: 'Watchlist', icon: <MdListAlt />, label: 'Watchlist' },
    { id: 'Sales', icon: <MdLocalOffer />, label: 'Sales' },
    { id: 'stockGyan', icon: <MdSchool />, label: 'Stock Gyan' },
  ];

  // Function to handle mouse entering the icon
  const handleMouseEnter = (id) => {
    setHoveredItem(id);
  };

  // Function to handle mouse leaving the icon
  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  return (
    <aside className={`sidebar transition-all duration-300 bg-gray-800 text-white flex flex-col ${isOpen ? 'w-56' : 'w-20'}`}>
      <div className="flex items-center justify-between p-4">
        {isOpen ? (
          <div className="w-32 transition-all duration-300">
            {/* Full logo displayed when sidebar is open */}
            {/* <img src={fullLogo} alt="Full Logo" className="w-full h-auto" /> */}
          </div>
        ) : (
          <div className="w-8 transition-all duration-300">
            {/* Small logo displayed when sidebar is collapsed */}
            {/* <img src={smallLogo} alt="Small Logo" className="w-full h-auto" /> */}
          </div>
        )}
        {/* <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 text-2xl transition-transform duration-300"
        >
          {isOpen ? '<' : '>'}
        </button> */}
      </div>

      <ul className="flex-grow">
        {pageMapping.map((page) => (
          <li
            key={page.id}
            className="flex items-center p-2 hover:bg-gray-700 transition-colors duration-200 relative"
            onMouseEnter={() => handleMouseEnter(page.id)} // Show label on hover
            onMouseLeave={handleMouseLeave} // Hide label when mouse leaves
          >
            <div className="flex text-white w-full">
              <span className="text-2xl w-full">{page.icon}</span>
              {isOpen && <span className="ml-4">{page.label}</span>}
            </div>
            {/* Display label if this item is being hovered and sidebar is collapsed */}
            {hoveredItem === page.id && !isOpen && (
              <div className="absolute left-14 bg-gray-700 text-white px-2 py-1 rounded-md shadow-md">
                {page.label}
              </div>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
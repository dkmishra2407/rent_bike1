// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuthStore } from '../store/authStore';
// import { BarChart3, User, LogOut } from 'lucide-react';

// const Navbar = () => {
//   const { isAuthenticated, setUser } = useAuthStore();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     // Clear Zustand state
//     setUser(null);
  
//     // Clear localStorage
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
  
//     // Redirect to login
//     navigate('/login');
//   };

//   return (
//     <nav className="bg-white shadow-lg">
//       <div className="container mx-auto px-6 py-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center">
//             <Link to="/" className="flex items-center text-xl font-bold text-gray-800">
//               <BarChart3 className="h-6 w-6 mr-2" />
//               GrowUp
//             </Link>
//           </div>
          
//           <div className="flex items-center space-x-6">
//             <Link to="/learn" className="text-gray-600 hover:text-gray-900">Learn</Link>
//             <Link to="/stocks" className="text-gray-600 hover:text-gray-900">Stocks</Link>
//             <Link to="/watchlist" className="text-gray-600 hover:text-gray-900">Watchlist</Link>
//             <Link to="/about" className="text-gray-600 hover:text-gray-900">About</Link>
//             <Link to="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
//             <Link to="/holding" className="text-gray-600 hover:text-gray-900">Holding</Link>

            
//             {isAuthenticated ? (
//               <>
//                 <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
//                   <User className="h-5 w-5" />
//                 </Link>
//                 <button
//                   onClick={handleLogout}
//                   className="text-gray-600 hover:text-gray-900"
//                 >
//                   <LogOut className="h-5 w-5" />
//                 </button>
//               </>
//             ) : (
//               <>
//                 <Link
//                   to="/login"
//                   className="text-gray-600 hover:text-gray-900"
//                 >
//                   Login
//                 </Link>
//                 <Link
//                   to="/signup"
//                   className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//                 >
//                   Sign Up
//                 </Link>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;


import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { BarChart3, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear Zustand state
    setUser(null);
  
    // Clear localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  
    // Redirect to login
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-xl font-bold text-gray-800">
              <BarChart3 className="h-6 w-6 mr-2" />
              GrowUp
            </Link>
          </div>
          
          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link to="/learn" className="text-gray-600 hover:text-gray-900">Learn</Link>
                <Link to="/stocks" className="text-gray-600 hover:text-gray-900">Stocks</Link>
                <Link to="/watchlist" className="text-gray-600 hover:text-gray-900">Watchlist</Link>
                <Link to="/about" className="text-gray-600 hover:text-gray-900">About</Link>
                <Link to="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
                <Link to="/holding" className="text-gray-600 hover:text-gray-900">Holding</Link>
                <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
                  <User className="h-5 w-5" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <Link to="/learn" className="text-gray-600 hover:text-gray-900">Learn</Link>
                <Link to="/about" className="text-gray-600 hover:text-gray-900">About</Link>
                <Link to="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
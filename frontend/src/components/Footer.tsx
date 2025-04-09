// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { 
//   Mail, 
//   Phone, 
//   MapPin, 
//   Facebook, 
//   Twitter, 
//   Instagram, 
//   Linkedin, 
//   Youtube, 
//   ChevronUp, 
//   ChevronRight,
//   MessageSquare,
//   DollarSign,
//   TrendingUp,
//   BookOpen,
//   User,
//   HelpCircle
// } from "lucide-react";

// const Footer = () => {
//   const [email, setEmail] = useState("");
//   const [subscribed, setSubscribed] = useState(false);
//   const [chatVisible, setChatVisible] = useState(false);
//   const [chatMessage, setChatMessage] = useState("");
//   const [showBackToTop, setShowBackToTop] = useState(false);

//   // Check scroll position to show/hide back to top button
//   React.useEffect(() => {
//     const handleScroll = () => {
//       setShowBackToTop(window.scrollY > 300);
//     };
    
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const handleSubscribe = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (email && email.includes('@')) {
//       setSubscribed(true);
//       setTimeout(() => setSubscribed(false), 3000);
//       setEmail("");
//     }
//   };

//   const handleChatSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (chatMessage) {
//       // In a real app, you would handle the chat message here
//       alert(`Message received: ${chatMessage}`);
//       setChatMessage("");
//     }
//   };

//   const scrollToTop = () => {
//     window.scrollTo({
//       top: 0,
//       behavior: 'smooth'
//     });
//   };

//   return (
//     <>
//       {/* Main Footer */}
//       <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {/* Company Info */}
//             <div>
//               <h3 className="text-2xl font-bold text-white mb-4">
//                 <span className="text-blue-400">Grow</span>Up Trader
//               </h3>
//               <p className="mb-4 text-gray-400">
//                 Your premier virtual stock trading platform. Learn, practice, and master trading without financial risk.
//               </p>
//               <div className="flex space-x-4 mt-6">
//                 {[Facebook, Twitter, Linkedin, Instagram, Youtube].map((Icon, i) => (
//                   <motion.a
//                     key={i}
//                     href="#"
//                     className="bg-gray-800 p-2 rounded-full hover:bg-blue-600 transition-colors duration-300"
//                     whileHover={{ y: -5 }}
//                     whileTap={{ scale: 0.9 }}
//                   >
//                     <Icon size={18} />
//                   </motion.a>
//                 ))}
//               </div>
//             </div>

//             {/* Quick Links */}
//             <div>
//               <h4 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700">
//                 Quick Links
//               </h4>
//               <ul className="space-y-2">
//                 {[
//                   { label: "Trading Platform", icon: DollarSign },
//                   { label: "Market Analysis", icon: TrendingUp },
//                   { label: "Learning Resources", icon: BookOpen },
//                   { label: "My Portfolio", icon: User },
//                   { label: "Help Center", icon: HelpCircle }
//                 ].map((link, i) => (
//                   <motion.li key={i} whileHover={{ x: 5 }}>
//                     <a href="#" className="flex items-center hover:text-blue-400 transition-colors duration-200">
//                       <link.icon size={16} className="mr-2" />
//                       <span>{link.label}</span>
//                     </a>
//                   </motion.li>
//                 ))}
//               </ul>
//             </div>

//             {/* Contact Info */}
//             <div>
//               <h4 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700">
//                 Contact Us
//               </h4>
//               <ul className="space-y-4">
//                 <li className="flex items-start">
//                   <MapPin size={18} className="mr-2 mt-1 text-blue-400" />
//                   <span>Pune Institute of Computer Technology,Pune-411043</span>
//                 </li>
//                 <li className="flex items-center">
//                   <Phone size={18} className="mr-2 text-blue-400" />
//                   <span>+91 7709469083</span>
//                 </li>
//                 <li className="flex items-center">
//                   <Mail size={18} className="mr-2 text-blue-400" />
//                   <span>growup@gmail.com</span>
//                 </li>
//               </ul>
//               <div className="mt-6">
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => setChatVisible(!chatVisible)}
//                   className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                 >
//                   <MessageSquare size={16} className="mr-2" />
//                   <span>{chatVisible ? "Close Chat" : "Live Chat"}</span>
//                 </motion.button>
//               </div>
//             </div>

//             {/* Newsletter */}
//             <div>
//               <h4 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700">
//                 Market Updates
//               </h4>
//               <p className="mb-4 text-gray-400">
//                 Subscribe to our newsletter for weekly market insights and trading tips.
//               </p>
//               <form onSubmit={handleSubscribe} className="mt-4">
//                 <div className="flex flex-col space-y-2">
//                   <input 
//                     type="email" 
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     placeholder="Your email address" 
//                     className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
//                     required 
//                   />
//                   <motion.button
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                     type="submit"
//                     className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex justify-center items-center transition-colors"
//                   >
//                     Subscribe <ChevronRight size={16} className="ml-1" />
//                   </motion.button>
//                 </div>
//               </form>
//               {subscribed && (
//                 <motion.div 
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className="mt-2 text-green-400 text-sm"
//                 >
//                   Thanks for subscribing! Check your inbox.
//                 </motion.div>
//               )}
//             </div>
//           </div>

//           {/* Bottom Footer */}
//           <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
//             <div className="text-sm text-gray-500 mb-4 md:mb-0">
//               © {new Date().getFullYear()} GrowUp Trader. All rights reserved.
//             </div>
//             <div className="flex space-x-4 text-sm text-gray-500">
//               <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
//               <span className="text-gray-700">|</span>
//               <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
//               <span className="text-gray-700">|</span>
//               <a href="#" className="hover:text-white transition-colors">Disclaimer</a>
//             </div>
//           </div>
//         </div>
//       </footer>

//       {/* Live Chat Popup */}
//       {chatVisible && (
//         <motion.div 
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="fixed bottom-24 right-6 w-80 bg-white rounded-lg shadow-2xl overflow-hidden z-50"
//         >
//           <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
//             <h3 className="font-semibold">Live Support</h3>
//             <button onClick={() => setChatVisible(false)} className="text-white hover:text-gray-200">
//               ✕
//             </button>
//           </div>
//           <div className="h-64 bg-gray-100 p-4 overflow-y-auto">
//             <div className="bg-blue-100 text-blue-800 p-3 rounded-lg rounded-tl-none mb-4 max-w-[80%]">
//               Hello! How can I help you with your trading today?
//             </div>
//           </div>
//           <form onSubmit={handleChatSubmit} className="p-3 border-t border-gray-200 flex">
//             <input
//               type="text"
//               value={chatMessage}
//               onChange={(e) => setChatMessage(e.target.value)}
//               placeholder="Type your message..."
//               className="flex-1 bg-gray-100 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <button
//               type="submit"
//               className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700"
//             >
//               Send
//             </button>
//           </form>
//         </motion.div>
//       )}

//       {/* Back to top button */}
//       <motion.button
//         initial={{ opacity: 0 }}
//         animate={{ opacity: showBackToTop ? 1 : 0 }}
//         onClick={scrollToTop}
//         className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg z-50"
//         whileHover={{ scale: 1.1 }}
//         whileTap={{ scale: 0.9 }}
//       >
//         <ChevronUp size={24} />
//       </motion.button>
//     </>
//   );
// };

// export default Footer;


import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube, 
  ChevronUp, 
  ChevronRight,
  MessageSquare,
  DollarSign,
  TrendingUp,
  BookOpen,
  User,
  HelpCircle,
  Loader
} from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { 
      role: "assistant", 
      content: "Hello! I'm your Stock Market Assistant. Ask me about the top-performing stocks in specific sectors!" 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);

  // Check scroll position to show/hide back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll to bottom of chat when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail("");
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    
    // Add user message to chat
    setChatMessages(prev => [...prev, { role: "user", content: chatMessage }]);
    const userQuery = chatMessage;
    setChatMessage("");
    setIsLoading(true);
    
    try {
      // In a production environment, you would call your backend API here
      // which would then securely interact with the Gemini API
      const response = await fetchGeminiResponse(userQuery);
      
      // Add bot response to chat
      setChatMessages(prev => [...prev, { role: "assistant", content: response }]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setChatMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Sorry, I encountered an error processing your request. Please try again later." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Mock function to simulate API call to Gemini
  // In production, this would be replaced with an actual API call to your backend
  const fetchGeminiResponse = async (query) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Sample responses based on query keywords
    if (query.toLowerCase().includes("semiconductor") || query.toLowerCase().includes("tech stocks")) {
      return "Based on recent data, the top 5 semiconductor stocks are: 1) NVIDIA (NVDA) - Strong growth in AI chips, 2) Taiwan Semiconductor (TSM) - Leading foundry, 3) AMD (AMD) - Gaining market share, 4) Qualcomm (QCOM) - Strong in mobile chips, 5) Intel (INTC) - Restructuring with potential upside. The sector has shown 15% growth YTD.";
    } else if (query.toLowerCase().includes("finance") || query.toLowerCase().includes("bank")) {
      return "Top performing financial stocks: 1) JPMorgan Chase (JPM) - Stable growth, strong balance sheet, 2) Bank of America (BAC) - Benefiting from higher interest rates, 3) Goldman Sachs (GS) - Strong investment banking division, 4) Morgan Stanley (MS) - Wealth management growth, 5) Wells Fargo (WFC) - Recovery play with improving fundamentals.";
    } else if (query.toLowerCase().includes("renewable") || query.toLowerCase().includes("green energy")) {  
      return "Leading renewable energy stocks: 1) First Solar (FSLR) - US manufacturing advantage, 2) Enphase Energy (ENPH) - Strong inverter technology, 3) NextEra Energy (NEE) - Utility with major renewables focus, 4) Brookfield Renewable (BEP) - Diversified clean energy portfolio, 5) SolarEdge (SEDG) - Global solar technology leader with growth potential.";
    } else {
      return "For specific stock information, please ask about particular sectors or stocks you're interested in. I can provide data on top performers, recent trends, and investment outlooks across various market segments.";
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {/* Main Footer */}
      <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">
                <span className="text-blue-400">Grow</span>Up Trader
              </h3>
              <p className="mb-4 text-gray-400">
                Your premier virtual stock trading platform. Learn, practice, and master trading without financial risk.
              </p>
              <div className="flex space-x-4 mt-6">
                {[Facebook, Twitter, Linkedin, Instagram, Youtube].map((Icon, i) => (
                  <motion.a
                    key={i}
                    href="#"
                    className="bg-gray-800 p-2 rounded-full hover:bg-blue-600 transition-colors duration-300"
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Icon size={18} />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {[
                  { label: "Trading Platform", icon: DollarSign },
                  { label: "Market Analysis", icon: TrendingUp },
                  { label: "Learning Resources", icon: BookOpen },
                  { label: "My Portfolio", icon: User },
                  { label: "Help Center", icon: HelpCircle }
                ].map((link, i) => (
                  <motion.li key={i} whileHover={{ x: 5 }}>
                    <a href="#" className="flex items-center hover:text-blue-400 transition-colors duration-200">
                      <link.icon size={16} className="mr-2" />
                      <span>{link.label}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700">
                Contact Us
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <MapPin size={18} className="mr-2 mt-1 text-blue-400" />
                  <span>Pune Institute of Computer Technology,Pune-411043</span>
                </li>
                <li className="flex items-center">
                  <Phone size={18} className="mr-2 text-blue-400" />
                  <span>+91 7709469083</span>
                </li>
                <li className="flex items-center">
                  <Mail size={18} className="mr-2 text-blue-400" />
                  <span>growup@gmail.com</span>
                </li>
              </ul>
              <div className="mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setChatVisible(!chatVisible)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <MessageSquare size={16} className="mr-2" />
                  <span>{chatVisible ? "Close Stock Assistant" : "Stock Assistant"}</span>
                </motion.button>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700">
                Market Updates
              </h4>
              <p className="mb-4 text-gray-400">
                Subscribe to our newsletter for weekly market insights and trading tips.
              </p>
              <form onSubmit={handleSubscribe} className="mt-4">
                <div className="flex flex-col space-y-2">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address" 
                    className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
                    required 
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex justify-center items-center transition-colors"
                  >
                    Subscribe <ChevronRight size={16} className="ml-1" />
                  </motion.button>
                </div>
              </form>
              {subscribed && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-green-400 text-sm"
                >
                  Thanks for subscribing! Check your inbox.
                </motion.div>
              )}
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-500 mb-4 md:mb-0">
              © {new Date().getFullYear()} GrowUp Trader. All rights reserved.
            </div>
            <div className="flex space-x-4 text-sm text-gray-500">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <span className="text-gray-700">|</span>
              <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
              <span className="text-gray-700">|</span>
              <a href="#" className="hover:text-white transition-colors">Disclaimer</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Stock Assistant Chat Popup - Now integrated with Gemini */}
      {chatVisible && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-24 right-6 w-96 bg-white rounded-lg shadow-2xl overflow-hidden z-50"
        >
          <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
            <h3 className="font-semibold">Stock Market Assistant</h3>
            <button onClick={() => setChatVisible(false)} className="text-white hover:text-gray-200">
              ✕
            </button>
          </div>
          
          {/* Chat messages container */}
          <div 
            ref={chatContainerRef}
            className="h-80 bg-gray-100 p-4 overflow-y-auto"
          >
            {chatMessages.map((msg, index) => (
              <div 
                key={index} 
                className={`${
                  msg.role === "assistant" 
                    ? "bg-blue-100 text-blue-800 rounded-lg rounded-tl-none ml-auto" 
                    : "bg-white text-gray-800 rounded-lg rounded-tr-none mr-auto"
                } p-3 mb-3 max-w-[80%] shadow-sm`}
              >
                {msg.content}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-center items-center my-2">
                <Loader size={20} className="animate-spin text-blue-600" />
              </div>
            )}
          </div>
          
          {/* Chat input form */}
          <form onSubmit={handleChatSubmit} className="p-3 border-t border-gray-200 flex">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Ask about stocks (e.g., 'Top 5 tech stocks')"
              className="flex-1 bg-gray-100 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 flex items-center"
              disabled={isLoading}
            >
              {isLoading ? <Loader size={16} className="animate-spin" /> : "Send"}
            </button>
          </form>
          
          {/* Chat examples */}
          <div className="p-3 bg-gray-50 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">Try asking about:</p>
            <div className="flex flex-wrap gap-2">
              {["Top semiconductor stocks", "Best bank stocks", "Renewable energy stocks"].map((example, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setChatMessage(example);
                  }}
                  className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full hover:bg-blue-100"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Back to top button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: showBackToTop ? 1 : 0 }}
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronUp size={24} />
      </motion.button>
    </>
  );
};

export default Footer;
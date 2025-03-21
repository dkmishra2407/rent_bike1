import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const AboutStock = ({ stockName }) => {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        
        const apiKey = 'AIzaSyAob0WQKtKQJltILvk3mchuYr-XuphVJWY'
        console.log(apiKey)
        if (!apiKey) {
          throw new Error("API key is missing. Check your .env file.");
        }

        // Initialize the API client
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Create the prompt
        const prompt = `Generate a 20-30 line description about the stock market for a stock market website's 'About' section. The content should explain what the stock market is, how it works, and its importance. Mention key aspects like stock exchanges, trading, investment strategies, and market trends. Keep it beginner-friendly, engaging, and informative. Stock Name: ${stockName}`;

        // Generate content
        const result = await model.generateContent(prompt);
        const response = await result.response.text(); // Corrected way to get text

        // Set the response data
        setData(response);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load information. Please try again later.");
        setLoading(false);
      }
    };

    if (stockName) {
      fetchAboutData();
    }
  }, [stockName]); // Re-run when stockName changes

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto my-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">
        About {stockName}
      </h1>
      
      {loading && (
        <div className="flex items-center justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading information...</span>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {!loading && !error && (
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{data}</p>
        </div>
      )}
    </div>
  );
};

export default AboutStock;
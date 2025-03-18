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
        
        const apiKey = 'AIzaSyAob0WQKtKQJltILvk3mchuYr-XuphVJWY';
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
    <div className="about-section">
      <h1>About {stockName}</h1>
      {loading && <p>Loading information...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && <p>{data}</p>}
    </div>
  );
};

export default AboutStock;

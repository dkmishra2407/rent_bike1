"use client"

import Link from "next/link"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

export default function LearnPage() {
  const [activeTab, setActiveTab] = useState('basics')

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      

      <main className="flex-1 py-2">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Stock Market Education</h1>
              <p className="text-gray-600">
                Learn everything you need to know about investing in the stock market.
              </p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="border-b border-gray-200">
                <div className="flex overflow-x-auto">
                  <button 
                    className={`px-6 py-3 font-medium text-sm border-b-2 ${activeTab === 'basics' ? 'border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700 border-transparent'}`}
                    onClick={() => setActiveTab('basics')}
                  >
                    Basics
                  </button>
                  <button 
                    className={`px-6 py-3 font-medium text-sm border-b-2 ${activeTab === 'analysis' ? 'border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700 border-transparent'}`}
                    onClick={() => setActiveTab('analysis')}
                  >
                    Analysis
                  </button>
                  <button 
                    className={`px-6 py-3 font-medium text-sm border-b-2 ${activeTab === 'strategies' ? 'border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700 border-transparent'}`}
                    onClick={() => setActiveTab('strategies')}
                  >
                    Strategies
                  </button>
                  <button 
                    className={`px-6 py-3 font-medium text-sm border-b-2 ${activeTab === 'advanced' ? 'border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700 border-transparent'}`}
                    onClick={() => setActiveTab('advanced')}
                  >
                    Advanced
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'basics' && (
                  <BasicsTab />
                )}

                {activeTab === 'analysis' && (
                  <AnalysisTab />
                )}

                {activeTab === 'strategies' && (
                  <StrategiesTab />
                )}

                {activeTab === 'advanced' && (
                  <AdvancedTab />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// Tab Components
function BasicsTab() {
    return (
      <>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Indian Stock Market Basics - FAQ</h2>
        <p className="text-gray-600 mb-6">
          Common questions and answers about Indian stock market fundamentals.
        </p>
  
        <div className="space-y-4">
          <FAQItem 
            question="What are the major stock exchanges in India?"
            answer={
              <>
                <p className="mb-3">
                  India has two primary stock exchanges:
                </p>
                <ul className="list-disc pl-5 space-y-2 mb-3">
                  <li>
                    <strong>Bombay Stock Exchange (BSE)</strong> - Established in 1875, it's Asia's oldest stock exchange. 
                    The benchmark index is SENSEX (30 stocks) with current market capitalization around ₹300 lakh crore.
                  </li>
                  <li>
                    <strong>National Stock Exchange (NSE)</strong> - Established in 1992, it's India's largest exchange by turnover. 
                    The benchmark index is NIFTY 50 (50 stocks) with current market capitalization around ₹320 lakh crore.
                  </li>
                </ul>
                <p>
                  Both exchanges operate from Mumbai and follow the same trading hours (9:15 AM to 3:30 PM IST, Monday to Friday).
                </p>
              </>
            }
          />
  
          <FAQItem 
            question="What is the minimum amount needed to start investing in Indian stocks?"
            answer={
              <>
                <p className="mb-3">
                  You can start investing in Indian stocks with very small amounts:
                </p>
                <ul className="list-disc pl-5 space-y-2 mb-3">
                  <li>
                    <strong>Direct equity:</strong> Many stocks trade below ₹100 per share. For example, you can buy 1 share of 
                    Tata Motors (around ₹800) or ITC (around ₹400).
                  </li>
                  <li>
                    <strong>Mutual funds:</strong> SIPs (Systematic Investment Plans) allow investments as low as ₹500 per month.
                  </li>
                  <li>
                    <strong>ETFs:</strong> Index ETFs like NIFTYBEES can be bought for the current market price (around ₹220 per unit).
                  </li>
                </ul>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 text-gray-800">Important Note:</h4>
                  <p>
                    While the minimum amount is small, it's recommended to invest at least ₹5,000-10,000 to make brokerage fees 
                    (typically ₹20 per trade) cost-effective.
                  </p>
                </div>
              </>
            }
          />
  
          <FAQItem 
            question="What are the taxes on stock market investments in India?"
            answer={
              <>
                <p className="mb-3">
                  Indian tax laws for stock market investments:
                </p>
                <ul className="list-disc pl-5 space-y-2 mb-3">
                  <li>
                    <strong>Short-term Capital Gains (STCG):</strong> 
                    <ul className="list-disc pl-5 mt-1">
                      <li>Equity: 15% if sold within 1 year (regardless of amount)</li>
                      <li>Other securities: Added to income and taxed as per slab if sold within 3 years</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Long-term Capital Gains (LTCG):</strong> 
                    <ul className="list-disc pl-5 mt-1">
                      <li>10% on gains above ₹1 lakh per year for equity (holding period greater than 1 year)</li>
                      <li>20% with indexation benefit for other securities (holding period greater than 3 years)</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Dividend Income:</strong> Taxable as per investor's income tax slab (TDS @10% if dividend greater than ₹5,000)
                  </li>
                  <li>
                    <strong>Securities Transaction Tax (STT):</strong> 0.1% on delivery equity trades
                  </li>
                </ul>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium mb-2 text-blue-800">FY 2023-24 Update:</h4>
                  <p>
                    The government has introduced Tax Deducted at Source (TDS) @0.1% on sale of shares exceeding ₹10 lakhs in value per exchange per day.
                  </p>
                </div>
              </>
            }
          />
  
          <FAQItem 
            question="What are the best stocks for beginners in India?"
            answer={
              <>
                <p className="mb-3">
                  For beginners in the Indian market, consider these categories:
                </p>
                <ul className="list-disc pl-5 space-y-2 mb-3">
                  <li>
                    <strong>Large-cap stocks:</strong> Reliance Industries (₹2,800), TCS (₹3,500), HDFC Bank (₹1,600) - stable with moderate growth
                  </li>
                  <li>
                    <strong>Dividend stocks:</strong> ITC (₹400, ~3% yield), Power Grid (₹240, ~5% yield), Coal India (₹400, ~8% yield)
                  </li>
                  <li>
                    <strong>Index funds/ETFs:</strong> NIFTY 50 Index Fund, SENSEX ETF - provides diversification
                  </li>
                  <li>
                    <strong>Sector leaders:</strong> Infosys (IT), HUL (FMCG), Bharti Airtel (Telecom) - established companies
                  </li>
                </ul>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-medium mb-2 text-yellow-800">Beginner Tip:</h4>
                  <p>
                    Start with 70% in index funds/ETFs and 30% in 3-5 quality stocks. Avoid penny stocks (below ₹10) and small-caps initially.
                  </p>
                </div>
              </>
            }
          />
  
          <FAQItem 
            question="How does IPO investing work in India?"
            answer={
              <>
                <p className="mb-3">
                  Initial Public Offerings (IPOs) in India follow this process:
                </p>
                <ol className="list-decimal pl-5 space-y-2 mb-3">
                  <li>
                    <strong>Company files DRHP</strong> with SEBI (Securities and Exchange Board of India)
                  </li>
                  <li>
                    <strong>IPO opens</strong> for 3-5 days with price band (e.g., ₹500-550)
                  </li>
                  <li>
                    <strong>Investors apply</strong> through ASBA (bank account) or broker
                    <ul className="list-disc pl-5 mt-1">
                      <li>Retail investors (up to ₹2 lakh application) get quota reservation</li>
                      <li>Minimum lot size (e.g., 15 shares)</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Allotment</strong> based on demand (may get partial/full/none)
                  </li>
                  <li>
                    <strong>Listing</strong> on exchanges after 7-10 days
                  </li>
                </ol>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-medium mb-2 text-green-800">Recent IPO Performance:</h4>
                  <p>
                    In 2023, 57 companies raised ₹49,000 crore via IPOs. Average listing gain was 14%, but only 60% traded above issue price after 6 months.
                  </p>
                </div>
              </>
            }
          />
  
          <FAQItem 
            question="What are the best trading platforms in India?"
            answer={
              <>
                <p className="mb-3">
                  Popular trading platforms for Indian investors:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div className="bg-white p-3 rounded-lg border">
                    <h4 className="font-medium mb-2">Discount Brokers (Low Cost):</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Zerodha (₹20/trade)</li>
                      <li>Groww (₹20/trade)</li>
                      <li>Upstox (₹20/trade)</li>
                      <li>Angel One (₹20/trade)</li>
                    </ul>
                  </div>
                  <div className="bg-white p-3 rounded-lg border">
                    <h4 className="font-medium mb-2">Full-Service Brokers:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>ICICI Direct (0.55% brokerage)</li>
                      <li>HDFC Securities (0.50% brokerage)</li>
                      <li>Kotak Securities (0.50% brokerage)</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="font-medium mb-2 text-purple-800">Platform Comparison:</h4>
                  <p>
                    Discount brokers are cheaper (flat ₹20 per trade) while full-service brokers offer research and advisory 
                    but charge percentage-based fees (0.3-0.5%). For beginners with small amounts, discount brokers are recommended.
                  </p>
                </div>
              </>
            }
          />
  
          <FAQItem 
            question="What is the difference between NSE and BSE?"
            answer={
              <>
                <table className="min-w-full divide-y divide-gray-200 mb-4">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Parameter</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">NSE</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">BSE</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Established</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">1992</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">1875</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Benchmark Index</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">NIFTY 50</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">SENSEX</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Market Cap (2023)</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">₹320 lakh crore</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">₹300 lakh crore</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Daily Turnover</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">₹60,000-80,000 crore</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">₹5,000-6,000 crore</td>
                    </tr>
                  </tbody>
                </table>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <h4 className="font-medium mb-2 text-gray-800">Key Differences:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>NSE has higher liquidity and more derivatives trading</li>
                    <li>BSE has more listed companies (5,000+ vs NSE's 2,000+)</li>
                    <li>NSE's NIFTY is more widely tracked globally</li>
                    <li>BSE is better for SME listings</li>
                  </ul>
                </div>
              </>
            }
          />
  
          <FAQItem 
            question="What are the best resources to learn about Indian stock market?"
            answer={
              <>
                <p className="mb-3">
                  Recommended resources for learning about Indian markets:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div className="bg-white p-3 rounded-lg border">
                    <h4 className="font-medium mb-2">Free Resources:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>SEBI's investor education website (investor.sebi.gov.in)</li>
                      <li>NSE's learning center (nseindia.com/learn)</li>
                      <li>Zerodha Varsity (zerodha.com/varsity)</li>
                      <li>Moneycontrol Academy</li>
                    </ul>
                  </div>
                  <div className="bg-white p-3 rounded-lg border">
                    <h4 className="font-medium mb-2">Paid Courses:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>NCFM certifications (NSE)</li>
                      <li>BSE's certification programs</li>
                      <li>CA Rachana Ranade's courses (YouTube)</li>
                      <li>Elearnmarkets.com courses</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium mb-2 text-blue-800">Beginner's Learning Path:</h4>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Start with Zerodha Varsity (free)</li>
                    <li>Open a demo trading account (₹1 lakh virtual money)</li>
                    <li>Follow SEBI's investor awareness programs</li>
                    <li>Begin with small investments (₹5,000-10,000)</li>
                  </ol>
                </div>
              </>
            }
          />
        </div>
      </>
    )
}

function AnalysisTab() {
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Stock Analysis</h2>
      <p className="text-gray-600 mb-6">
        Learn how to analyze stocks using fundamental and technical analysis.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <VideoCard
          title="Fundamental Analysis Basics"
          description="How to analyze a company's financial health."
          videoId="7gkQHSW3hkE"
          explanation="Fundamental analysis involves evaluating a company's financial statements, competitive advantages, industry position, and management to determine its intrinsic value. This approach focuses on factors like revenue growth, profit margins, debt levels, and cash flow to assess whether a stock is undervalued or overvalued. Fundamental analysts believe that the market may misprice a security in the short run but will eventually correct to reflect the stock's true value."
        />

        <VideoCard
          title="Technical Analysis Introduction"
          description="Using charts and patterns to predict price movements."
          videoId="eynxyoKgpng"
          explanation="Technical analysis studies past market data, primarily price and volume, to forecast future price movements. Unlike fundamental analysis, technical analysis doesn't focus on a company's intrinsic value but instead uses chart patterns, trends, and statistical indicators to identify trading opportunities. Technical analysts believe that historical price action can indicate future price movement, as market psychology tends to repeat itself."
        />

        <VideoCard
          title="Reading Financial Statements"
          description="Understanding income statements, balance sheets, and cash flow statements."
          videoId="XnSzD8vPP74"
          explanation="Financial statements provide crucial information about a company's financial health. The income statement shows revenue, expenses, and profit over a specific period. The balance sheet provides a snapshot of assets, liabilities, and shareholders' equity at a point in time. The cash flow statement tracks how cash moves in and out of the business. Learning to read these statements helps investors understand a company's profitability, financial position, and operational efficiency."
        />

        <VideoCard
          title="Key Financial Ratios"
          description="Important metrics for evaluating stocks."
          videoId="ZyAgLJ_SMKc"
          explanation="Financial ratios help investors compare companies and evaluate their financial health. Price-to-earnings (P/E) ratio compares a company's share price to its earnings per share. Price-to-book (P/B) ratio compares market value to book value. Debt-to-equity ratio measures financial leverage. Return on equity (ROE) shows how efficiently a company uses shareholders' equity. These and other ratios provide insights into valuation, profitability, efficiency, and financial stability."
        />
      </div>
    </>
  )
}

function StrategiesTab() {
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Investment Strategies</h2>
      <p className="text-gray-600 mb-6">
        Discover different approaches to stock market investing.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <VideoCard
          title="Value Investing"
          description="Finding undervalued stocks with long-term potential."
          videoId="npoyc_X5zO8"
          explanation="Value investing, popularized by Benjamin Graham and Warren Buffett, involves buying stocks that appear underpriced relative to their intrinsic value. Value investors look for companies trading below their true worth due to temporary market pessimism or overlooked potential. They focus on strong fundamentals, low price-to-earnings ratios, high dividend yields, and strong balance sheets. This strategy requires patience as it may take time for the market to recognize a stock's true value."
        />

        <VideoCard
          title="Growth Investing"
          description="Identifying companies with above-average growth potential."
          videoId="bLl0tNxRrI8"
          explanation="Growth investing focuses on companies expected to grow earnings at an above-average rate compared to the market. Growth investors are willing to pay a premium for stocks with high growth potential, often resulting in higher price-to-earnings ratios. They look for companies with strong revenue growth, expanding market share, and innovative products or services. This strategy typically involves companies reinvesting profits rather than paying dividends, with the expectation of higher future returns."
        />

        <VideoCard
          title="Dividend Investing"
          description="Building a portfolio of dividend-paying stocks."
          videoId="8ZwTwjJrGYM"
          explanation="Dividend investing focuses on stocks that pay regular dividends, providing investors with a steady income stream in addition to potential capital appreciation. Dividend investors often look for companies with a history of consistent dividend payments and increases (dividend aristocrats). This strategy is popular among retirees and income-focused investors. Dividend reinvestment plans (DRIPs) allow investors to automatically reinvest dividends to purchase additional shares, potentially accelerating portfolio growth through compounding."
        />

        <VideoCard
          title="Index Fund Investing"
          description="The power of passive investing through index funds."
          videoId="gvZSpET11ZY"
          explanation="Index fund investing involves buying funds that track market indices like the S&P 500. This passive strategy aims to match market returns rather than beat them, based on the efficient market hypothesis that it's difficult to consistently outperform the market. Index funds offer broad diversification, low fees, and minimal research requirements. This approach, advocated by investors like John Bogle and Warren Buffett, is suitable for investors who want a simple, low-maintenance strategy with historically reliable long-term returns."
        />
      </div>
    </>
  )
}

function AdvancedTab() {
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Advanced Topics</h2>
      <p className="text-gray-600 mb-6">
        Explore sophisticated investment concepts and strategies.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <VideoCard
          title="Options Trading Basics"
          description="Understanding calls, puts, and options strategies."
          videoId="7PM4rNDev1Q"
          explanation="Options are contracts giving the buyer the right, but not the obligation, to buy (call) or sell (put) an asset at a predetermined price (strike price) before a specific date (expiration). Options can be used for speculation, income generation, hedging, or leverage. Key concepts include premium (the price paid for the option), intrinsic value, time value, and the Greeks (delta, gamma, theta, vega) which measure how option prices respond to various factors. Options involve higher risk and complexity than stock trading."
        />

        <VideoCard
          title="Shorting Stocks"
          description="How to profit from falling stock prices."
          videoId="CAs_aX95tVQ"
          explanation="Short selling involves borrowing shares from a broker, selling them at the current market price, and later buying them back (hopefully at a lower price) to return to the lender. The profit is the difference between the selling price and the repurchase price, minus borrowing costs. Short sellers profit from price declines but face theoretically unlimited risk if prices rise significantly. This strategy requires a margin account and is typically used by experienced investors for hedging or speculating on overvalued companies."
        />

        <VideoCard
          title="Tax-Efficient Investing"
          description="Strategies to minimize your investment taxes."
          videoId="m_8QQmwvGpQ"
          explanation="Tax-efficient investing aims to maximize after-tax returns by minimizing tax liabilities. Strategies include holding investments in tax-advantaged accounts (401(k)s, IRAs, HSAs), tax-loss harvesting (selling losing investments to offset gains), asset location (placing tax-inefficient investments in tax-advantaged accounts), and investing in tax-efficient funds (index funds with low turnover). Understanding the difference between short-term and long-term capital gains taxes and the tax treatment of different investment types can significantly impact long-term returns."
        />

        <VideoCard
          title="Retirement Planning"
          description="Building a stock portfolio for retirement."
          videoId="zdXgJpXQSJ4"
          explanation="Retirement planning involves creating an investment strategy to provide income during retirement. Key considerations include time horizon (years until retirement), risk tolerance, desired retirement lifestyle, and expected longevity. The strategy typically evolves from growth-focused in early years to more income and preservation-focused near and during retirement. Understanding retirement accounts (401(k), IRA, Roth), Social Security benefits, withdrawal strategies (4% rule), and required minimum distributions (RMDs) is essential for effective retirement planning."
        />
      </div>
    </>
  )
}

// Reusable Components
function FAQItem({ question, answer }: { question: string; answer: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        className="w-full flex justify-between items-center p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-gray-800">{question}</span>
        {isOpen ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
      </button>
      {isOpen && (
        <div className="p-4 bg-white">
          {answer}
        </div>
      )}
    </div>
  )
}

function VideoCard({
  title,
  description,
  videoId,
  explanation,
}: {
  title: string
  description: string
  videoId: string
  explanation: string
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 mb-1">{title}</h3>
        <p className="text-gray-600 text-sm mb-3">{description}</p>
        <div className="aspect-w-16 aspect-h-9 rounded-md overflow-hidden mb-4">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-48"
          ></iframe>
        </div>
        <button
          className="w-full flex justify-between items-center py-2 px-3 text-sm font-medium text-blue-600 hover:text-blue-700"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span>{isExpanded ? 'Hide explanation' : 'Show explanation'}</span>
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {isExpanded && (
          <div className="mt-3 p-3 bg-gray-50 rounded-md text-sm text-gray-700">
            {explanation}
          </div>
        )}
      </div>
      <div className="border-t border-gray-200 p-4">
        <button className="w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          Mark as Completed
        </button>
      </div>
    </div>
  )
}
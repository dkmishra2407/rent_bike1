"use client"

import { useState } from "react"
import { ArrowDown, ArrowUp, ChevronDown, DollarSign, TrendingDown, TrendingUp } from "lucide-react"

const stockData = [
  {
    id: 1,
    name: "Apple",
    ticker: "AAPL",
    price: 182.52,
    change: 1.25,
    changePercent: 0.69,
    shares: 15,
    value: 2737.8,
    cost: 2500,
    profit: 237.8,
  },
  {
    id: 2,
    name: "Microsoft",
    ticker: "MSFT",
    price: 415.32,
    change: 3.78,
    changePercent: 0.92,
    shares: 8,
    value: 3322.56,
    cost: 3000,
    profit: 322.56,
  },
  {
    id: 3,
    name: "Tesla",
    ticker: "TSLA",
    price: 175.34,
    change: -2.45,
    changePercent: -1.38,
    shares: 12,
    value: 2104.08,
    cost: 2400,
    profit: -295.92,
  },
  {
    id: 4,
    name: "Amazon",
    ticker: "AMZN",
    price: 178.75,
    change: 1.32,
    changePercent: 0.74,
    shares: 10,
    value: 1787.5,
    cost: 1650,
    profit: 137.5,
  },
  {
    id: 5,
    name: "Google",
    ticker: "GOOGL",
    price: 163.45,
    change: -0.87,
    changePercent: -0.53,
    shares: 7,
    value: 1144.15,
    cost: 1200,
    profit: -55.85,
  },
  {
    id: 6,
    name: "Meta",
    ticker: "META",
    price: 474.88,
    change: 5.23,
    changePercent: 1.11,
    shares: 5,
    value: 2374.4,
    cost: 2000,
    profit: 374.4,
  },
]

const calculateSummary = (stocks: typeof stockData) => {
  return stocks.reduce(
    (acc, stock) => {
      acc.totalValue += stock.value
      acc.totalCost += stock.cost
      acc.totalProfit += stock.profit
      return acc
    },
    { totalValue: 0, totalCost: 0, totalProfit: 0 },
  )
}

const StockDashboard = () => {
  const [stocks, setStocks] = useState(stockData)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "ascending" | "descending" } | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const summary = calculateSummary(stocks)

  const sortStocks = (key: string) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig?.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }

    const sortedStocks = [...stocks].sort((a, b) => {
      if (a[key as keyof typeof a] < b[key as keyof typeof b]) return direction === "ascending" ? -1 : 1
      if (a[key as keyof typeof a] > b[key as keyof typeof b]) return direction === "ascending" ? 1 : -1
      return 0
    })

    setStocks(sortedStocks)
    setSortConfig({ key, direction })
    setIsDropdownOpen(false)
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Stock Portfolio</h1>
          <p className="text-gray-500 mt-1">Your investment overview</p>
        </div>
        <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg flex items-center">
          {/* <DollarSign className="h-4 w-4 mr-2" /> */}
          {/* <span>Last updated: {new Date().toLocaleDateString()}</span> */}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Invested</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                ${summary.totalCost.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Current Value</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                ${summary.totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow ${
          summary.totalProfit >= 0 ? "border-t-4 border-t-green-500" : "border-t-4 border-t-red-500"
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Profit/Loss</p>
              <h3 className={`text-2xl font-bold mt-1 ${
                summary.totalProfit >= 0 ? "text-green-600" : "text-red-600"
              }`}>
                {summary.totalProfit >= 0 ? "+" : ""}
                ${Math.abs(summary.totalProfit).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                <span className="text-sm ml-2 font-normal text-gray-500">
                  ({((summary.totalProfit / summary.totalCost) * 100).toFixed(2)}%)
                </span>
              </h3>
            </div>
            <div className={`p-3 rounded-full ${
              summary.totalProfit >= 0 ? "bg-green-100" : "bg-red-100"
            }`}>
              {summary.totalProfit >= 0 ? (
                <TrendingUp className="h-5 w-5 text-green-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-600" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Holdings Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Your Holdings</h2>
            <p className="text-sm text-gray-500 mt-1">{stocks.length} stocks in portfolio</p>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-gray-700 transition-colors"
            >
              Sort By
              <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white border border-gray-200 z-10">
                <div className="py-1">
                  <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-100">Sort Options</div>
                  <button
                    onClick={() => sortStocks("value")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    By Value
                  </button>
                  <button
                    onClick={() => sortStocks("profit")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    By Profit/Loss
                  </button>
                  <button
                    onClick={() => sortStocks("changePercent")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    By Daily Change
                  </button>
                  <button
                    onClick={() => sortStocks("name")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    By Name
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Shares</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Profit/Loss</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stocks.map((stock) => (
                <tr key={stock.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                        <span className="text-blue-600 font-medium">{stock.ticker[0]}</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{stock.name}</div>
                        <div className="text-sm text-gray-500">{stock.ticker}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900 font-medium">
                    ${stock.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className={`flex items-center justify-end ${
                      stock.change >= 0 ? "text-green-600" : "text-red-600"
                    }`}>
                      {stock.change >= 0 ? (
                        <ArrowUp className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowDown className="h-4 w-4 mr-1" />
                      )}
                      {stock.change >= 0 ? "+" : ""}
                      {stock.change.toFixed(2)} ({stock.changePercent >= 0 ? "+" : ""}
                      {stock.changePercent.toFixed(2)}%)
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-gray-500">
                    {stock.shares}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900 font-medium">
                    ${stock.value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className={`flex flex-col items-end ${
                      stock.profit >= 0 ? "text-green-600" : "text-red-600"
                    }`}>
                      <div className="flex items-center">
                        {stock.profit >= 0 ? (
                          <TrendingUp className="h-4 w-4 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 mr-1" />
                        )}
                        {stock.profit >= 0 ? "+" : ""}$
                        {Math.abs(stock.profit).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                      <div className="text-xs mt-1 text-gray-400">
                        ({((stock.profit / stock.cost) * 100).toFixed(2)}%)
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default StockDashboard
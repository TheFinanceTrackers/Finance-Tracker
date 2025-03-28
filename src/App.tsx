import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { IndianRupee, PieChart, Wallet, TrendingUp, LogIn, UserPlus, BarChart } from 'lucide-react';
import BudgetPage from './pages/BudgetPage';

function HomePage() {
  const [showVisualization, setShowVisualization] = useState(false);
  const navigate = useNavigate();

  // Mock spending data
  const spendingData = [
    { category: 'Housing', amount: 15000, color: 'bg-blue-500' },
    { category: 'Food', amount: 8000, color: 'bg-green-500' },
    { category: 'Transportation', amount: 5000, color: 'bg-yellow-500' },
    { category: 'Entertainment', amount: 3000, color: 'bg-purple-500' },
    { category: 'Healthcare', amount: 4000, color: 'bg-red-500' },
    { category: 'Shopping', amount: 6000, color: 'bg-pink-500' },
  ];

  const total = spendingData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <IndianRupee className="h-8 w-8 text-orange-500" />
              <span className="ml-2 text-xl font-bold">Personal Finance Management Tools</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center px-4 py-2 rounded-full text-gray-600 hover:text-gray-900">
                <LogIn className="h-5 w-5 mr-1" />
                Sign In
              </button>
              <button className="flex items-center px-4 py-2 rounded-full bg-orange-500 text-white hover:bg-orange-600">
                <UserPlus className="h-5 w-5 mr-1" />
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div 
        className="relative h-[500px] bg-cover bg-center"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("https://images.unsplash.com/photo-1640340434855-6084b1f4901c?auto=format&fit=crop&q=80")'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-5xl font-bold mb-4">Take Control of Your Finances</h1>
            <p className="text-xl mb-8">Smart budgeting tools to help you manage your money better</p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => navigate('/budget')}
                className="px-8 py-3 bg-orange-500 rounded-full text-white font-semibold hover:bg-orange-600"
              >
                Start Budgeting Now
              </button>
              <button 
                onClick={() => setShowVisualization(!showVisualization)}
                className="px-8 py-3 bg-white text-orange-500 rounded-full font-semibold hover:bg-gray-100 flex items-center"
              >
                <BarChart className="h-5 w-5 mr-2" />
                Visualize Spending
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Spending Visualization */}
      {showVisualization && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-8 text-center">Monthly Spending Distribution</h2>
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="relative w-64 h-64">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-lg font-semibold">Total: ₹{total}</div>
                </div>
                <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                  {spendingData.reduce((acc, item, index) => {
                    const percentage = (item.amount / total) * 100;
                    const prevOffset = acc.offset;
                    acc.offset += percentage;
                    return {
                      offset: acc.offset,
                      elements: [
                        ...acc.elements,
                        <circle
                          key={item.category}
                          cx="50"
                          cy="50"
                          r="40"
                          strokeWidth="20"
                          stroke={item.color.replace('bg-', 'var(--tw-')}
                          strokeDasharray={`${percentage} 100`}
                          strokeDashoffset={-prevOffset}
                          fill="none"
                          className="transition-all duration-300"
                        />
                      ]
                    };
                  }, { offset: 0, elements: [] }).elements}
                </svg>
              </div>
              <div className="mt-8 md:mt-0 md:ml-8">
                <h3 className="text-xl font-semibold mb-4">Categories</h3>
                <div className="grid grid-cols-1 gap-3">
                  {spendingData.map((item) => (
                    <div key={item.category} className="flex items-center">
                      <div className={`w-4 h-4 rounded-full ${item.color} mr-2`}></div>
                      <span className="font-medium">{item.category}:</span>
                      <span className="ml-2">₹{item.amount}</span>
                      <span className="ml-2 text-gray-500">
                        ({((item.amount / total) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <PieChart className="h-12 w-12 text-orange-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Budget Tracking</h3>
            <p className="text-gray-600">Create and manage your monthly budgets with easy-to-use tools</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <Wallet className="h-12 w-12 text-orange-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Expense Management</h3>
            <p className="text-gray-600">Track your expenses and categorize your spending habits</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <TrendingUp className="h-12 w-12 text-orange-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Financial Goals</h3>
            <p className="text-gray-600">Set and achieve your financial goals with our planning tools</p>
          </div>
        </div>
      </div>

      {/* Finance Tips */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Financial Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-2">50/30/20 Rule</h3>
              <p className="text-gray-600">Allocate 50% of your income to needs, 30% to wants, and 20% to savings</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-2">Emergency Fund</h3>
              <p className="text-gray-600">Save 3-6 months of expenses for unexpected situations</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-2">Investment Strategy</h3>
              <p className="text-gray-600">Start investing early and diversify your portfolio</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-2">Debt Management</h3>
              <p className="text-gray-600">Prioritize paying off high-interest debt first</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>© 2024 Personal Finance Management Team S4 DIT Pimpri. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/budget" element={<BudgetPage />} />
      </Routes>
    </Router>
  );
}

export default App;
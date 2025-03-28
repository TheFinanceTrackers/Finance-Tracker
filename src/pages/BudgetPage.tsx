import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { getTransactions, addTransaction, deleteTransaction } from '../api';

interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export default function BudgetPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'Housing',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = ['Housing', 'Food', 'Transportation', 'Entertainment', 'Healthcare', 'Shopping', 'Others'];

  // Fetch transactions from the database when the page loads
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const data = await getTransactions();
      setExpenses(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const expense = {
        description: newExpense.description,
        amount: parseFloat(newExpense.amount) || 0, // Ensure amount is a number
        category: newExpense.category,
        date: newExpense.date
      };

      await addTransaction(expense.description, expense.amount, expense.category, expense.date);

      // ✅ Update state immediately so UI refreshes
      await fetchTransactions();

      setShowForm(false);
      setNewExpense({
        description: '',
        amount: '',
        category: 'Housing',
        date: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      console.log(`Attempting to delete transaction with ID: ${id}`);
      await deleteTransaction(id);
      console.log(`Transaction ${id} deleted successfully`);
      setExpenses(expenses.filter(expense => expense.id !== id)); // Remove from UI
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Budget Dashboard</h1>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Add Expense
            </button>
          </div>

          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6">Add New Expense</h2>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <input
                        type="text"
                        required
                        value={newExpense.description}
                        onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                      <input
                        type="text"
                        required
                        min="0"
                        step="0.01"
                        value={newExpense.amount}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*\.?\d*$/.test(value)) {  // ✅ Prevents leading zeros & allows only valid numbers
                            setNewExpense({ ...newExpense, amount: value });
                          }
                        }}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={newExpense.category}
                        onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                      >
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="date"
                        required
                        value={newExpense.date}
                        onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-700">
                      Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
                      Add Expense
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Transaction List */}
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4">Transaction History</h2>
            {expenses.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 border">Date</th>
                      <th className="px-4 py-2 border">Description</th>
                      <th className="px-4 py-2 border">Category</th>
                      <th className="px-4 py-2 border">Amount</th>
                      <th className="px-4 py-2 border text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((expense) => (
                      <tr key={expense.id} className="border">
                        <td className="px-4 py-2 border">{expense.date}</td>
                        <td className="px-4 py-2 border">{expense.description}</td>
                        <td className="px-4 py-2 border">{expense.category}</td>
                        <td className="px-4 py-2 border">₹{expense.amount.toFixed(2)}</td>
                        <td className="px-4 py-2 border text-center">
                          <button 
                            onClick={() => handleDelete(expense.id)}
                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 transition flex items-center"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No expenses added yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

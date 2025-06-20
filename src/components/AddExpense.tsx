import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Plus, DollarSign, Tag, FileText } from 'lucide-react';

interface AddExpenseProps {
  userId: string;
  onExpenseAdded: () => void;
}

const AddExpense: React.FC<AddExpenseProps> = ({ userId, onExpenseAdded }) => {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category.trim() || !amount.trim()) {
      setError('Please fill in category and amount');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Attempting to add expense for user:', userId);
      
      const expenseData = {
        userId,
        category: category.trim(),
        amount: amountNum,
        note: note.trim(),
        timestamp: serverTimestamp(),
        createdAt: new Date().toISOString()
      };

      console.log('Expense data:', expenseData);

      const expensesRef = collection(db, 'expenses');
      const docRef = await addDoc(expensesRef, expenseData);
      
      console.log('Expense added successfully with ID:', docRef.id);

      // Reset form
      setCategory('');
      setAmount('');
      setNote('');
      onExpenseAdded();
    } catch (error: any) {
      console.error('Detailed error adding expense:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      let errorMessage = 'Failed to add expense. ';
      
      if (error.code === 'permission-denied') {
        errorMessage += 'Permission denied. Please check Firestore security rules.';
      } else if (error.code === 'unavailable') {
        errorMessage += 'Service temporarily unavailable. Please try again.';
      } else if (error.code === 'unauthenticated') {
        errorMessage += 'Please sign in again.';
      } else {
        errorMessage += `Error: ${error.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const suggestedCategories = [
    'Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 
    'Bills & Utilities', 'Healthcare', 'Travel', 'Education', 'Other'
  ];

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-white/20">
      <div className="flex items-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl mr-4 shadow-lg">
          <Plus className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Add New Expense</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category (e.g., Food, Transport)"
            className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            list="categories"
            required
          />
          <datalist id="categories">
            {suggestedCategories.map((cat) => (
              <option key={cat} value={cat} />
            ))}
          </datalist>
        </div>

        <div className="relative">
          <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            step="0.01"
            min="0"
            className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            required
          />
        </div>

        <div className="relative">
          <FileText className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Note (optional)"
            rows={3}
            className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !category.trim() || !amount.trim()}
          className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-semibold hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
              Adding Expense...
            </div>
          ) : (
            'Add Expense'
          )}
        </button>
      </form>

     
    </div>
  );
};

export default AddExpense;
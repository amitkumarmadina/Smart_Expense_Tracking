import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase.js';
import { Receipt, Trash2, Calendar, DollarSign, FileText, Tag } from 'lucide-react';

interface Expense {
  id: string;
  category: string;
  amount: number;
  note: string;
  timestamp: any;
  createdAt: string;
}

interface ExpenseListProps {
  userId: string;
  refreshTrigger: number;
  onExpensesChange: (expenses: Expense[]) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ userId, refreshTrigger, onExpensesChange }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    console.log('Setting up expense listener for user:', userId);
    
    const expensesRef = collection(db, 'expenses');
    const q = query(
      expensesRef,
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log('Received snapshot with', snapshot.size, 'documents');
      const expenseList: Expense[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        console.log('Document data:', { id: doc.id, ...data });
        expenseList.push({
          id: doc.id,
          ...data
        } as Expense);
      });
      console.log('Final expense list:', expenseList);
      setExpenses(expenseList);
      setLoading(false);
      setError('');
      onExpensesChange(expenseList);
    }, (error) => {
      console.error('Error fetching expenses:', error);
      setError(`Error loading expenses: ${error.message}`);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId, refreshTrigger, onExpensesChange]);

  const handleDelete = async (expenseId: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    setDeleting(expenseId);
    try {
      await deleteDoc(doc(db, 'expenses', expenseId));
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Failed to delete expense. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (timestamp: any, createdAt: string) => {
    if (timestamp && timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    // Fallback to createdAt if timestamp is not available
    return new Date(createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-white/20">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
          <span className="ml-3 text-gray-600">Loading expenses...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-white/20">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl">
          {error}
        </div>
        
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-white/20 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-4">
          <Receipt className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No expenses yet</h3>
        <p className="text-gray-500">Start tracking your expenses by adding your first entry above.</p>
        
      </div>
    );
  }

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl mr-4 shadow-lg">
            <Receipt className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Your Expenses</h2>
            <p className="text-sm text-gray-600">{expenses.length} entries</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total Spent</p>
          <p className="text-2xl font-bold text-green-600">{formatAmount(totalAmount)}</p>
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100 hover:bg-gray-50 transition-all duration-200 group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mr-3">
                    <Tag className="w-3 h-3 mr-1" />
                    {expense.category}
                  </div>
                  <div className="flex items-center text-green-600 font-bold text-xl">
                    <DollarSign className="w-5 h-5" />
                    {formatAmount(expense.amount)}
                  </div>
                </div>
                
                {expense.note && (
                  <div className="flex items-start text-gray-600 text-sm mb-2">
                    <FileText className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <p>{expense.note}</p>
                  </div>
                )}
                
                <div className="flex items-center text-gray-500 text-sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(expense.timestamp, expense.createdAt)}
                </div>
              </div>
              
              <button
                onClick={() => handleDelete(expense.id)}
                disabled={deleting === expense.id}
                className="ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 opacity-0 group-hover:opacity-100 disabled:opacity-50"
              >
                {deleting === expense.id ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-500 border-t-transparent"></div>
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Debug info - remove in production */}
      <div className="mt-4 p-3 bg-gray-100 rounded-lg text-xs text-gray-600">
        <p><strong>Debug Info:</strong></p>
        <p>User ID: {userId}</p>
        <p>Expenses loaded: {expenses.length}</p>
        <p>Check browser console for detailed logs</p>
      </div>
    </div>
  );
};

export default ExpenseList;
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from './firebase';
import AuthForm from './components/AuthForm';
import AddExpense from './components/AddExpense';
import ExpenseList from './components/ExpenseList';
import SummaryChart from './components/SummaryChart';
import { LogOut, Wallet, BarChart3 } from 'lucide-react';

interface Expense {
  id: string;
  category: string;
  amount: number;
  note: string;
  timestamp: any;
  createdAt: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState<'expenses' | 'analytics'>('expenses');

  // Auth and Session Inactivity
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Sign out on tab/browser close
    const handleUnload = async () => {
      try {
        await signOut(auth);
        console.log('Signed out on tab/browser close');
      } catch (err) {
        console.error('Sign-out error:', err);
      }
    };

    window.addEventListener('beforeunload', handleUnload);

    // Auto sign-out after 15 minutes of inactivity
    let timeout: NodeJS.Timeout;
    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        console.log('Session expired due to inactivity.');
        signOut(auth);
      }, 15 * 60 * 1000); // 15 minutes
    };

    const activityEvents = ['mousemove', 'keydown', 'scroll', 'touchstart'];
    activityEvents.forEach((event) =>
      window.addEventListener(event, resetTimer)
    );
    resetTimer(); // Initial call

    return () => {
      unsubscribe();
      window.removeEventListener('beforeunload', handleUnload);
      activityEvents.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );
      clearTimeout(timeout);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleExpenseAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleExpensesChange = (newExpenses: Expense[]) => {
    setExpenses(newExpenses);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4 mx-auto"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onAuthSuccess={() => {}} />;
  }

  const totalExpenses = expenses.length;
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl mr-3 shadow-lg">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Smart Expense Tracker</h1>
                <p className="text-sm text-gray-600">Welcome back, {user.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <p className="font-semibold text-gray-800">{totalExpenses}</p>
                  <p className="text-gray-600">Expenses</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-green-600">
                    ${totalAmount.toFixed(2)}
                  </p>
                  <p className="text-gray-600">Total Spent</p>
                </div>
              </div>

              <button
                onClick={handleSignOut}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-1 shadow-lg border border-white/20">
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab('expenses')}
                className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === 'expenses'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Wallet className="w-4 h-4 mr-2" />
                Expenses
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === 'analytics'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'expenses' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <AddExpense 
                userId={user.uid} 
                onExpenseAdded={handleExpenseAdded} 
              />
            </div>
            <div>
              <ExpenseList 
                userId={user.uid} 
                refreshTrigger={refreshTrigger}
                onExpensesChange={handleExpensesChange}
              />
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto">
            <SummaryChart expenses={expenses} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

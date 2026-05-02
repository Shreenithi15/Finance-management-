import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import TransactionModal from './components/TransactionModal';
import Auth from './components/Auth';
import './App.css';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      return JSON.parse(savedUser);
    }
    return null;
  });

  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState('all');

  // Transactions state depends on the logged-in user
  const [transactions, setTransactions] = useState([]);

  // Load transactions when user changes
  useEffect(() => {
    if (user) {
      const allTransactions = JSON.parse(localStorage.getItem('allTransactions')) || {};
      setTransactions(allTransactions[user.email] || []);
    } else {
      setTransactions([]);
    }
  }, [user]);

  // Save transactions when they change, scoped to the current user
  useEffect(() => {
    if (user) {
      const allTransactions = JSON.parse(localStorage.getItem('allTransactions')) || {};
      allTransactions[user.email] = transactions;
      localStorage.setItem('allTransactions', JSON.stringify(allTransactions));
    }
  }, [transactions, user]);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setCurrentTab('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const handleAddTransaction = (newTransaction) => {
    setTransactions(prev => [...prev, newTransaction]);
  };

  const handleDeleteTransaction = (id) => {
    if(window.confirm("Are you sure you want to delete this transaction?")) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  // If not logged in, show Auth component
  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  // Otherwise, show main App
  return (
    <div className="app-container">
      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        onLogout={handleLogout}
      />

      <main className="main-content">
        <header className="top-header">
          <div className="greeting">
            <h1>Hello, <span className="accent-text">{user.name.split(' ')[0]}</span>! 👋</h1>
            <p>Here's your financial overview</p>
          </div>
          <button 
            className="btn primary-btn" 
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={20} /> Add Transaction
          </button>
        </header>

        {currentTab === 'dashboard' && (
          <Dashboard 
            transactions={transactions} 
            onDelete={handleDeleteTransaction}
            setCurrentTab={setCurrentTab}
          />
        )}

        {currentTab === 'transactions' && (
          <section id="transactions" className="page-section">
            <div className="glassmorphism section-box full-height">
              <div className="section-header">
                <h3>All Transactions</h3>
                <div className="filters">
                  <select 
                    className="custom-select"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
              </div>
              <TransactionList 
                transactions={transactions} 
                filterType={filterType}
                onDelete={handleDeleteTransaction}
              />
            </div>
          </section>
        )}

        {currentTab === 'analytics' && (
          <section id="analytics" className="page-section">
            <div className="glassmorphism section-box full-height">
              <div className="section-header">
                <h3>Analytics</h3>
              </div>
              <div className="analytics-content">
                <div className="empty-state">
                  Charts coming soon! Keep adding transactions to see your financial trends.
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAddTransaction={handleAddTransaction} 
      />
    </div>
  );
}

export default App;

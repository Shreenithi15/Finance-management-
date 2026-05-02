import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import TransactionModal from './components/TransactionModal';
import Auth from './components/Auth';
import AnalyticsDashboard from './components/AnalyticsDashboard';
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

  const handleExportCSV = () => {
    if (transactions.length === 0) {
      alert("No transactions to export.");
      return;
    }
    
    // Create CSV header
    const headers = ["ID", "Type", "Amount", "Category", "Date", "Description"];
    
    // Convert transactions to CSV rows
    const csvRows = transactions.map(t => {
      return `"${t.id}","${t.type}","${t.amount}","${t.category}","${t.date}","${t.description.replace(/"/g, '""')}"`;
    });
    
    // Combine header and rows
    const csvContent = [headers.join(","), ...csvRows].join("\n");
    
    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `finmanage_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                    style={{ marginRight: '1rem' }}
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                  <button className="btn primary-btn" onClick={handleExportCSV} style={{ padding: '0.5rem 1rem' }}>
                    Export CSV
                  </button>
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
            <AnalyticsDashboard transactions={transactions} />
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

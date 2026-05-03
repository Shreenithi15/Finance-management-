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
  const [session, setSession] = useState(() => {
    const savedSession = localStorage.getItem('currentSession');
    if (savedSession) {
      return JSON.parse(savedSession);
    }
    return null;
  });

  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState('all');

  const [transactions, setTransactions] = useState([]);
  
  const user = session ? session.user : null;
  const token = session ? session.token : null;

  // Fetch transactions from backend when session changes
  useEffect(() => {
    const fetchTransactions = async () => {
      if (session && session.token) {
        try {
          const res = await fetch('http://localhost:5000/api/transactions', {
            headers: { 'Authorization': `Bearer ${session.token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setTransactions(data);
          } else {
            console.error('Failed to fetch transactions');
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        setTransactions([]);
      }
    };
    fetchTransactions();
  }, [session]);

  const handleLogin = (sessionData) => {
    setSession(sessionData);
    localStorage.setItem('currentSession', JSON.stringify(sessionData));
    setCurrentTab('dashboard');
  };

  const handleLogout = () => {
    setSession(null);
    localStorage.removeItem('currentSession');
  };

  const handleAddTransaction = async (newTransaction) => {
    try {
      const res = await fetch('http://localhost:5000/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newTransaction)
      });
      if (res.ok) {
        const data = await res.json();
        setTransactions(prev => [...prev, data]);
      }
    } catch (err) {
      console.error('Error adding transaction', err);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if(window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        const res = await fetch(`http://localhost:5000/api/transactions/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          setTransactions(prev => prev.filter(t => t.id !== id));
        }
      } catch (err) {
        console.error('Error deleting transaction', err);
      }
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

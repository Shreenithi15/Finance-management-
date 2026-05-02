import React from 'react';
import { Scale, TrendingUp, TrendingDown } from 'lucide-react';
import TransactionList from './TransactionList';
import './Dashboard.css';

const Dashboard = ({ transactions, onDelete, setCurrentTab }) => {
  const amounts = transactions.map(t => 
    t.type === 'income' ? t.amount : -t.amount
  );

  const total = amounts.reduce((acc, item) => (acc += item), 0);
  const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0);
  const expense = amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1;

  const formatMoney = (amount) => {
    return parseFloat(amount).toLocaleString('en-US', {minimumFractionDigits: 2});
  };

  return (
    <section id="dashboard" className="page-section">
      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card balance-card glassmorphism hover-effect">
          <div className="card-icon">
            <Scale size={28} />
          </div>
          <div className="card-info">
            <h3>Total Balance</h3>
            <h2>${formatMoney(total)}</h2>
          </div>
        </div>
        <div className="card income-card glassmorphism hover-effect">
          <div className="card-icon">
            <TrendingUp size={28} />
          </div>
          <div className="card-info">
            <h3>Total Income</h3>
            <h2>${formatMoney(income)}</h2>
          </div>
        </div>
        <div className="card expense-card glassmorphism hover-effect">
          <div className="card-icon">
            <TrendingDown size={28} />
          </div>
          <div className="card-info">
            <h3>Total Expense</h3>
            <h2>${formatMoney(expense)}</h2>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="recent-transactions glassmorphism section-box">
        <div className="section-header">
          <h3>Recent Transactions</h3>
          <a 
            href="#" 
            className="view-all" 
            onClick={(e) => { e.preventDefault(); setCurrentTab('transactions'); }}
          >
            View All
          </a>
        </div>
        <TransactionList 
          transactions={transactions} 
          limit={5} 
          onDelete={onDelete} 
        />
      </div>
    </section>
  );
};

export default Dashboard;

import React from 'react';
import { Wallet, PieChart, List, LineChart, LogOut } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ currentTab, setCurrentTab, onLogout }) => {
  return (
    <aside className="sidebar glassmorphism-sidebar">
      <div className="logo">
        <Wallet size={32} className="logo-icon" />
        <h2>FinManage</h2>
      </div>
      <nav className="nav-menu">
        <a 
          href="#" 
          className={`nav-item ${currentTab === 'dashboard' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); setCurrentTab('dashboard'); }}
        >
          <PieChart size={20} />
          <span>Dashboard</span>
        </a>
        <a 
          href="#" 
          className={`nav-item ${currentTab === 'transactions' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); setCurrentTab('transactions'); }}
        >
          <List size={20} />
          <span>Transactions</span>
        </a>
        <a 
          href="#" 
          className={`nav-item ${currentTab === 'analytics' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); setCurrentTab('analytics'); }}
        >
          <LineChart size={20} />
          <span>Analytics</span>
        </a>
      </nav>
      
      <div className="sidebar-footer">
        <button className="nav-item logout-btn" onClick={onLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

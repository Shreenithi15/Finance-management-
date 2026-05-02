import React from 'react';
import { 
  Utensils, Car, Home, Zap, Film, ShoppingCart, 
  Stethoscope, Banknote, Laptop, TrendingUp, Gift, 
  Receipt, CircleDollarSign, Trash2
} from 'lucide-react';
import './TransactionList.css';

const getCategoryIcon = (category) => {
  switch (category) {
    case 'Food & Dining': return <Utensils size={20} />;
    case 'Transportation': return <Car size={20} />;
    case 'Housing': return <Home size={20} />;
    case 'Utilities': return <Zap size={20} />;
    case 'Entertainment': return <Film size={20} />;
    case 'Shopping': return <ShoppingCart size={20} />;
    case 'Healthcare': return <Stethoscope size={20} />;
    case 'Salary': return <Banknote size={20} />;
    case 'Freelance': return <Laptop size={20} />;
    case 'Investments': return <TrendingUp size={20} />;
    case 'Gifts': return <Gift size={20} />;
    case 'Other Expense': return <Receipt size={20} />;
    default: return <CircleDollarSign size={20} />;
  }
};

const formatDate = (dateString) => {
  const parts = dateString.split('-');
  if (parts.length === 3) {
      const date = new Date(parts[0], parts[1] - 1, parts[2]);
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return date.toLocaleDateString(undefined, options);
  }
  return dateString;
};

const TransactionList = ({ transactions, filterType = 'all', limit = null, onDelete }) => {
  let filtered = transactions;
  
  if (filterType !== 'all') {
    filtered = transactions.filter(t => t.type === filterType);
  }

  filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (limit) {
    filtered = filtered.slice(0, limit);
  }

  if (filtered.length === 0) {
    return <div className="empty-state">No transactions found.</div>;
  }

  return (
    <div className="transaction-list">
      {filtered.map(transaction => {
        const isIncome = transaction.type === 'income';
        const sign = isIncome ? '+' : '-';
        const formattedAmount = Math.abs(transaction.amount).toLocaleString('en-US', {minimumFractionDigits: 2});

        return (
          <div key={transaction.id} className="transaction-item">
            <div className="transaction-left">
              <div className={`t-icon ${isIncome ? 'income' : 'expense'}`}>
                {getCategoryIcon(transaction.category)}
              </div>
              <div className="t-details">
                <h4>{transaction.description}</h4>
                <p>{transaction.category} • {formatDate(transaction.date)}</p>
              </div>
            </div>
            <div className="transaction-right">
              <div className={`t-amount ${isIncome ? 'income' : 'expense'}`}>
                {sign}${formattedAmount}
              </div>
              <button 
                className="delete-btn" 
                onClick={() => onDelete(transaction.id)}
                title="Delete Transaction"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TransactionList;

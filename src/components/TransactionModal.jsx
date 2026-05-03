import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import './TransactionModal.css';

const TransactionModal = ({ isOpen, onClose, onAddTransaction }) => {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setType('expense');
      setAmount('');
      setCategory('Food & Dining');
      setDate(new Date().toISOString().split('T')[0]);
      setDescription('');
    }
  }, [isOpen]);

  // Update default category when type changes
  useEffect(() => {
    if (type === 'income') {
      setCategory('Salary');
    } else {
      setCategory('Food & Dining');
    }
  }, [type]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!category || isNaN(amount) || amount <= 0) {
      alert('Please fill out all fields correctly.');
      return;
    }

    const newTransaction = {
      type,
      amount: parseFloat(amount),
      category,
      date,
      description
    };

    onAddTransaction(newTransaction);
    onClose();
  };

  return (
    <div className="modal-overlay active">
      <div className="modal-content glassmorphism">
        <div className="modal-header">
          <h2>Add Transaction</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Type</label>
            <div className="type-selector">
              <input 
                type="radio" 
                id="type-expense" 
                name="type" 
                value="expense" 
                checked={type === 'expense'}
                onChange={() => setType('expense')}
              />
              <label htmlFor="type-expense" className="type-btn expense-btn">Expense</label>
              
              <input 
                type="radio" 
                id="type-income" 
                name="type" 
                value="income"
                checked={type === 'income'}
                onChange={() => setType('income')}
              />
              <label htmlFor="type-income" className="type-btn income-btn">Income</label>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="amount">Amount ($)</label>
            <input 
              type="number" 
              id="amount" 
              step="0.01" 
              placeholder="0.00" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select 
              id="category" 
              className="custom-select" 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="" disabled>Select category</option>
              {type === 'expense' ? (
                <optgroup label="Expense">
                  <option value="Food & Dining">Food & Dining</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Housing">Housing</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Other Expense">Other</option>
                </optgroup>
              ) : (
                <optgroup label="Income">
                  <option value="Salary">Salary</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Investments">Investments</option>
                  <option value="Gifts">Gifts</option>
                  <option value="Other Income">Other</option>
                </optgroup>
              )}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input 
              type="date" 
              id="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input 
              type="text" 
              id="description" 
              placeholder="What was this for?" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required 
            />
          </div>
          
          <button type="submit" className="btn primary-btn full-width">
            Save Transaction
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;

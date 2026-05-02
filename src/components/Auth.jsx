import React, { useState } from 'react';
import { Wallet, LogIn, UserPlus } from 'lucide-react';
import './Auth.css';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password || (!isLogin && !name)) {
      alert('Please fill out all fields.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || {};

    if (isLogin) {
      // Handle Login
      if (users[email] && users[email].password === password) {
        onLogin({ email, name: users[email].name });
      } else {
        alert('Invalid email or password.');
      }
    } else {
      // Handle Signup
      if (users[email]) {
        alert('An account with this email already exists.');
        return;
      }
      
      const newUser = { email, password, name };
      users[email] = newUser;
      localStorage.setItem('users', JSON.stringify(users));
      
      onLogin({ email, name });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glassmorphism">
        <div className="auth-header">
          <Wallet size={40} className="auth-logo-icon" />
          <h2>FinManage</h2>
          <p>{isLogin ? 'Welcome back! Please login.' : 'Create an account to get started.'}</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input 
                type="text" 
                id="name" 
                placeholder="John Doe" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              placeholder="you@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn primary-btn auth-submit-btn">
            {isLogin ? <><LogIn size={18} /> Login</> : <><UserPlus size={18} /> Sign Up</>}
          </button>
        </form>

        <div className="auth-toggle">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              className="toggle-btn" 
              onClick={() => {
                setIsLogin(!isLogin);
                setEmail('');
                setPassword('');
                setName('');
              }}
            >
              {isLogin ? 'Sign up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;

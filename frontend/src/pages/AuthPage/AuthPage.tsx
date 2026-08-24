import Header from '../../components/Header/Header.tsx';
import Button from '../../components/Button/Button.tsx';
import { useState } from 'react';
import './AuthPage.css';

function AuthPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  return (
    <div>
      <main className="auth-main">
        <div className="auth-info-container">
          <h2 className="auth-info-title">
            Stay consistent.
          </h2>
          <p className="auth-info-description">
            Build habits that stick, one day at a time.
          </p>
        </div>
        <div className="auth-form-container">
          <div className="toggle-buttons-container">
            <Button
              className={activeTab === 'login' ? 'active' : ''}
              onClick={() => setActiveTab('login')}
            > 
              Login
            </Button>
            <Button
              className={activeTab === 'register' ? 'active' : ''}
              onClick={() => setActiveTab('register')}
            > 
              Register
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthPage;
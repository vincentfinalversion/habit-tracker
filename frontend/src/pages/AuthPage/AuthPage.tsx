import { useState } from 'react';
import Button from '../../components/Button/Button.tsx';
import LoginForm from '../../components/LoginForm/LoginForm.tsx';
import RegisterForm from '../../components/RegisterForm/RegisterForm.tsx';
import './AuthPage.css';

function AuthPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  return (
    <div className="auth-page">
      <main className="auth-main">
        <div className="auth-info-container">
          <h2 className="auth-info-title">
            myHabits
          </h2>
          <p className="auth-info-description">
            Stay consistent. Build habits that stick, one day at a time.
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
          {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
        </div>
      </main>
    </div>
  );
};

export default AuthPage;
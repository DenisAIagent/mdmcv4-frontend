import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/admin-login.css';

const AdminLogin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulation d'une vérification d'authentification
    // Dans une version réelle, cela serait une requête API sécurisée
    setTimeout(() => {
      if (username === 'admin' && password === 'mdmc2025') {
        // Stocker l'état d'authentification dans localStorage
        localStorage.setItem('mdmc_admin_auth', 'true');
        // Redirection vers le panneau d'administration avec React Router
        navigate('/admin/dashboard');
      } else {
        setError(t('admin.login_error'));
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h1>{t('admin.login')}</h1>
          <p>{t('admin.login_subtitle')}</p>
        </div>

        {error && <div className="admin-login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="username">{t('admin.username')}</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">{t('admin.password')}</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className={`admin-login-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? t('admin.logging_in') : t('admin.login_button')}
          </button>
        </form>

        <div className="admin-login-footer">
          <a href="/">{t('footer.nav_home')}</a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

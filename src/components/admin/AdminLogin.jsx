// src/components/admin/AdminLogin.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import apiService from '../../services/api.service'; // Assurez-vous que ce chemin est correct
import '../../assets/styles/admin-login.css'; // Gardez votre chemin de style

const AdminLogin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation(); // Pour rediriger vers la page précédente après login

  // Utiliser 'email' pour correspondre à ce que le backend attend (authController.js)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Appel via apiService.auth.login, qui utilise Axios configuré
      // avec withCredentials: true. Le backend définira le cookie HttpOnly.
      const response = await apiService.auth.login({ email, password });

      // console.log('Login successful response from apiService:', response); // Pour le debug

      // Si le login est réussi (pas d'erreur lancée par l'intercepteur Axios),
      // le cookie HttpOnly est maintenant défini par le backend.
      // Le frontend n'a pas besoin de stocker ou gérer le token.

      // Rediriger vers le tableau de bord admin ou la page précédente
      const from = location.state?.from?.pathname || '/admin/dashboard';
      navigate(from, { replace: true });
      // Pas besoin de setLoading(false) ici car la navigation change la page.

    } catch (err) { // L'erreur est déjà structurée par l'intercepteur d'api.service.js
      console.error("Login failed:", err.status, err.message, err.data);
      setError(err.message || t('admin.login_error_network'));
      setLoading(false);
    }
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
            {/* Modifier label et id pour 'email' pour la cohérence */}
            <label htmlFor="email">{t('admin.email_label', 'Adresse Email')}</label> {/* Pensez à ajouter 'admin.email_label' à i18n */}
            <input
              type="email" // Utiliser type="email" pour la validation navigateur
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              disabled={loading}
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
              disabled={loading}
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

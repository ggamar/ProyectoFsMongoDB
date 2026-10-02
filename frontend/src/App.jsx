import { useState } from 'react';
import { registerUser, loginUser } from './services/authService';

const emptyUser = { name: '', email: '', password: '' };
const emptyLogin = { email: '', password: '' };

export default function App() {
  const [newUser, setNewUser] = useState(emptyUser);
  const [loginData, setLoginData] = useState(emptyLogin);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await registerUser(newUser);
      setNewUser(emptyUser);
      setShowLogin(true);
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo crear la cuenta. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const loggedInUser = await loginUser(loginData);
      setUser(loggedInUser);
      setLoginData(emptyLogin);
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo iniciar sesión. Revisa tus datos e inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => setUser(null);

  return (
    <div className="App">
      <h1>User Management</h1>
      {user ? (
        <div>
          <h2>Welcome, {user.name}</h2>
          <button type="button" onClick={handleLogout}>Logout</button>
        </div>
      ) : showLogin ? (
        <div>
          <h2>Login</h2>
          <form onSubmit={handleLoginSubmit}>
            <input
              type="email"
              placeholder="Email"
              autoComplete="email"
              required
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              required
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            />
            <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Please wait…' : 'Login'}</button>
          </form>
          <button type="button" onClick={() => { setError(''); setShowLogin(false); }}>Go to Register</button>
        </div>
      ) : (
        <div>
          <h2>Register</h2>
          <form onSubmit={handleRegisterSubmit}>
            <input
              type="text"
              placeholder="Name"
              autoComplete="name"
              required
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              autoComplete="email"
              required
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              autoComplete="new-password"
              required
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />
            <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Please wait…' : 'Create User'}</button>
          </form>
          <button type="button" onClick={() => { setError(''); setShowLogin(true); }}>Go to Login</button>
        </div>
      )}
      {error && <p role="alert">{error}</p>}
    </div>
  );
}

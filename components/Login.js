import { useState } from 'react';
import { useAuth } from '../context/authContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useAuth(); 
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <form onSubmit={onSubmit}>
      {error && <p className="error-message">{error}</p>}
      
      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={onChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={onChange}
          required
        />
      </div>

      <button type="submit" className="auth-button" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default Login;
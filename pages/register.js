import { useState } from 'react';
import { useAuth } from '../context/authContext';

const Register = () => {
 
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const { register } = useAuth(); 
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { name, email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }
    
    try {
      await register(name, email, password);
    } catch (err) {

      const errorMessage = 
        err.response?.data?.errors?.[0]?.msg || // For validation errors (e.g., "Invalid email")
        err.response?.data?.msg ||               // For general errors (e.g., "User already exists")
        'Failed to register. Please try again.';  // For network or other errors
        
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      {error && <p className="error-message">{error}</p>}

      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={onChange}
          autoComplete="name"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={onChange}
          autoComplete="email"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          minLength="6"
          value={password}
          onChange={onChange}
          autoComplete="new-password"
          required
        />
      </div>

      <button type="submit" className="auth-button" disabled={isLoading}>
        {isLoading ? 'Creating Account...' : 'Register'}
      </button>
    </form>
  );
};

export default Register;
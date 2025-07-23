import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useAuth } from '../context/authContext'; 
import Link from 'next/link';
import Head from 'next/head';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ResetPasswordPage = () => {
  const router = useRouter();
  const { token } = router.query;
  const { loginWithToken } = useAuth(); 

  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setMessage('No reset token found. Please request a new link.');
      return;
    }
    setIsLoading(true);
    setMessage('');

    try {
      const res = await axios.post(`${API_URL}/users/reset-password/${token}`, { password });
      // The backend returns a new JWT. We use loginWithToken to log the user in directly.
      await loginWithToken(res.data.token);
      // The context will handle the redirect to /chat
    } catch (error) {
      const errorMessage = error.response?.data?.msg || 'An error occurred while resetting the password.';
      setMessage(errorMessage);
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <Head>
        <title>Reset Password | BrainBytes</title>
      </Head>
      <div className="auth-container">
        <div className="auth-form-wrapper">
          <h2>Reset Your Password</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="password">New Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength="6"
                required
              />
            </div>
            <button type="submit" className="auth-button" disabled={isLoading}>
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
          {message && <p className="error-message" style={{ marginTop: '1rem' }}>{message}</p>}
          <p className="form-link" style={{ textAlign: 'center', marginTop: '1rem' }}>
            <Link href="/login">Back to Login</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordPage;
import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Head from 'next/head';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      const res = await axios.post(`${API_URL}/users/forgot-password`, { email });
      setMessage(res.data.msg);
    } catch (error) {
      setMessage(error.response?.data?.msg || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Forgot Password | BrainBytes</title>
      </Head>
      <div className="auth-container">
        <div className="auth-form-wrapper">
          <h2>Forgot Password</h2>
          <p style={{ marginBottom: '1.5rem', color: '#666' }}>
            Enter your email to receive a password reset token. (Check the backend console for the token).
          </p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="auth-button" disabled={isLoading}>
              {isLoading ? 'Generating Token...' : 'Submit'}
            </button>
          </form>
          {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
          <p className="form-link" style={{ textAlign: 'center', marginTop: '1rem' }}>
            <Link href="/login">Back to Login</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
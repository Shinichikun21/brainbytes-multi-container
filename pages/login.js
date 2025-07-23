import Link from 'next/link';
import Login from '../components/Login'; 

const LoginPage = () => {
  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <h2>Login</h2>
        
        <Login />

              <div className="form-link" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
        <p><Link href="/register">Create an account</Link></p>
        <p><Link href="/forgot-password">Forgot Password?</Link></p>
      </div>
</div>
    </div>
  );
};

export default LoginPage;
import Link from 'next/link';
import { useAuth } from '../context/authContext';

const Layout = ({ children }) => {
  
  const { user, logout } = useAuth();

  return (
    <div className="layout-container">
      <header className="layout-header">
        {}
        <Link href="/chat" className="logo">
          BrainBytes
        </Link>
        
        {}
        <div className="user-info">
          {user && <span>Welcome, {user.name}!</span>}
          
          {}
          <Link href="/profile" className="nav-link">
            My Profile
          </Link>

          <button onClick={logout} className="logout-button">Logout</button>
        </div>
      </header>

      <main className="main-content">
        {/* The 'children' prop renders the actual page content (e.g., the Chat component) */}
        {children}
      </main>
    </div>
  );
};

export default Layout;
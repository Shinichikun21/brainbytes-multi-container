import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/authContext'; // Corrected: Filename is PascalCase
import Head from 'next/head';

const IndexPage = () => {
  // --- 1. Get the auth state and the router ---
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  // --- 2. The Redirection Logic ---
  useEffect(() => {
    // Wait until the authentication check is complete before redirecting.
    if (loading) {
      return;
    }

    // `router.replace` is used to avoid adding this page to the browser's history.
    if (isAuthenticated) {
      router.replace('/chat');
    } else {
      router.replace('/login');
    }
  }, [loading, isAuthenticated, router]);

 
  return (
    <div>
      <Head>
        <title>Redirecting...</title>
      </Head>
      <div className="loading-container">
        <p>Redirecting...</p>
      </div>
    </div>
  );
};

export default IndexPage;
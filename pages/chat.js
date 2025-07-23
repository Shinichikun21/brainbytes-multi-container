import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useAuth } from '../context/authContext';
import Layout from '../components/Layout';
import Chat from '../components/Chat';

const ChatPage = () => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthenticated) {
    return <div className="loading-container"><p>Loading Chat...</p></div>;
  }

  return (
    <Layout>
      <Head>
        <title>AI Chat | BrainBytes</title>
      </Head>
      
      {}
      <Chat />
      
    </Layout>
  );
};

export default ChatPage;
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Chat from '../components/Chat';




export default function Home() {
  const [messages, setMessages] = useState([]);
  const [] = useState('');
  const [, setLoading] = useState(true);
  const [] = useState(false);
  const messageEndRef = useRef(null);

  // Fetch messages from the API
  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/messages');
      setMessages(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setLoading(false);
    }
  };

  // Submit a new message

  // Scroll to bottom when messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load messages on component mount
  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <>

      <Head >
        <title>BrainBytes AI Tutor</title>
<meta name="description" content="AI-powered tutoring platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
       <main>
        <Chat />
      </main>
    </>
     
  );
}
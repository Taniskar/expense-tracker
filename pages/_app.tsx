import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/firebase/config';
import Layout from '@/components/Layout';
import { Spin, ConfigProvider, theme } from 'antd';

export default function App({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <Spin fullscreen />;

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <Layout>
        <Component {...pageProps} user={user} />
      </Layout>
    </ConfigProvider>
  );
}

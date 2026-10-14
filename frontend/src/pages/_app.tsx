import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { getAuth } from '../lib/api';
import { identifyUser, initAnalytics } from '../lib/analytics';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    initAnalytics();
    identifyUser(getAuth()?.user);
  }, []);

  return <Component {...pageProps} />;
}

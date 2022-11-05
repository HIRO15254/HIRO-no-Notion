import '../styles/globals.css';
import { Global, MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import Page from '../components/Page';
import AuthProvider from '../features/auth/hooks/AuthContext';
import { GetAccessControl } from '../types';
import { PagePropsType } from '../types/PagePropsType';

import type { AppProps } from 'next/app';

const useAccessControl = (getAccessControl: GetAccessControl) => {
  const router = useRouter();

  useEffect(() => {
    const control = async () => {
      const accessControl = await getAccessControl();
      if (!accessControl) return;
      router[accessControl.type](accessControl.destination);
    };
    control();
  }, [router]);
};

const accessControl = () => {
  throw new Error('getAccessControl is not implemented');
};

type Props<T> = AppProps<T> & {
  Component: {
    getAccessControl?: GetAccessControl;
  }
};

const MyApp: React.FC<Props<PagePropsType>> = ({ Component, pageProps }) => {
  const { getAccessControl = accessControl } = Component;
  useAccessControl(getAccessControl);
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        /** Put your mantine theme override here */
        colorScheme: 'light',
      }}
    >
      <Global
        styles={(theme) => ({
          body: {
            backgroundColor:
              theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
          },
        })}
      />
      <NotificationsProvider>
        <Head>
          <title>{pageProps.title}</title>
        </Head>
        <AuthProvider>
          <Page>
            <Component {...pageProps} />
          </Page>
        </AuthProvider>
      </NotificationsProvider>
    </MantineProvider>
  );
};

export default MyApp;

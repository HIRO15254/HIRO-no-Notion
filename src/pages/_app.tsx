import '../styles/globals.css';
import { Global, MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import Head from 'next/head';
import React from 'react';

import type { AppProps } from 'next/app';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => (
  <MantineProvider
    withGlobalStyles
    withNormalizeCSS
    theme={{
      /** Put your mantine theme override here */
      colorScheme: 'dark',
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
        <title>HIRO no Notion</title>
      </Head>
      <Component {...pageProps} />
    </NotificationsProvider>
  </MantineProvider>
);

export default MyApp;

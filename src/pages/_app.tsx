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
      colorScheme: 'dark',
    }}
  >
    <Global
      styles={(theme) => ({
        body: {
          backgroundColor:
              theme.colorScheme === 'dark' ? '#191919' : theme.colors.gray[0],
        },
      })}
    />
    <NotificationsProvider>
      <Head>
        <title>HIRO no Notion</title>
      </Head>
      <body>
        <Component {...pageProps} />
      </body>
    </NotificationsProvider>
  </MantineProvider>
);

export default MyApp;

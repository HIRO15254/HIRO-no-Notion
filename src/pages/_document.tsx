import { createGetInitialProps } from '@mantine/next';
import Document, {
  Head, Html, Main, NextScript,
} from 'next/document';
import React from 'react';

const getInitialProps = createGetInitialProps();

// eslint-disable-next-line @typescript-eslint/naming-convention
export default class _document extends Document {
  static getInitialProps = getInitialProps;

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

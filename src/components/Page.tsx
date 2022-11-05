import {
  AppShell, Container,
} from '@mantine/core';
import React, { ReactNode } from 'react';

import CustomHeader from './CustomHeader';

function Page({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <AppShell header={<CustomHeader />} padding="md" fixed={false}>
        <Container>{children}</Container>
      </AppShell>
    </div>
  );
}

export default Page;

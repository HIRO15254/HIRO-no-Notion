import {
  Header, Group, Title,
} from '@mantine/core';
import Link from 'next/link';
import React from 'react';

const CustomHeader = () => (
  <Header
    height="60px"
    px="md"
    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
  >
    <Link href="/" passHref>
      <Title order={3}>HIRO no Notion</Title>
    </Link>
    <Group />
  </Header>
);

export default CustomHeader;

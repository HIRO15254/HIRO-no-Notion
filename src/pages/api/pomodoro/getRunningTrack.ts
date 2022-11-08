import { Client } from '@notionhq/client';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import { TRACKING_DATABASE_ID } from '../../../constants/constants';

import type { NextApiRequest, NextApiResponse } from 'next';

dayjs.extend(utc);
dayjs.extend(timezone);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  const notion = new Client({
    auth: process.env.NOTION_TOKEN,
  });

  await notion.databases.query({
    database_id: TRACKING_DATABASE_ID,
    filter: {
      property: '実行中',
      checkbox: {
        equals: true,
      },
    },
  }).then((response) => {
    const { results } = response;
    res.status(200).json(results);
  }).catch((error) => {
    res.status(400).json({ message: error.message });
  });
};

export default handler;

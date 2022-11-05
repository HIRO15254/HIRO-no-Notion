import { Client } from '@notionhq/client';

import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const notion = new Client({
    auth: process.env.NOTION_TOKEN,
  });
  const databaseId = 'c34e13ef930f459fa71a28f089a218a6';
  const database = await notion.databases.retrieve({ database_id: databaseId });
  return res.status(200).json(database);
};

export default handler;

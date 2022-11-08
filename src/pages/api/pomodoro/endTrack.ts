import { Client, isFullPage } from '@notionhq/client';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import { TRACKING_DATABASE_ID, TASK_DATABASE_ID } from '../../../constants/constants';

import type { NextApiRequest, NextApiResponse } from 'next';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Tokyo');

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  const notion = new Client({
    auth: process.env.NOTION_TOKEN,
  });
  const now = dayjs();

  const runningTracking = await notion.databases.query({
    database_id: TRACKING_DATABASE_ID,
    filter: {
      property: '実行中',
      checkbox: {
        equals: true,
      },
    },
  });

  const runningTask = await notion.databases.query({
    database_id: TASK_DATABASE_ID,
    filter: {
      property: '状態',
      status: {
        equals: '進行中',
      },
    },
  });

  const { results } = runningTracking;
  if (results.length > 1) {
    res.status(400).json({ message: '実行中のトラッキングが複数あります' });
    return;
  }
  if (results.length === 0) {
    res.status(400).json({ message: '実行中のトラッキングがありません' });
    return;
  }

  const runningTrackingPage = results[0];
  if (!isFullPage(runningTrackingPage)) {
    res.status(400).json({ message: '取得したページがデータベースではありません' });
    return;
  }

  if (
    runningTrackingPage.properties['タイプ'].type === 'select'
    && runningTrackingPage.properties['タイプ'].select?.name === 'ポモドーロ'
  ) {
    await notion.pages.update({
      page_id: runningTrackingPage.id,
      properties: {
        実行中: {
          checkbox: false,
        },
        終了時間: {
          date: {
            start: now.tz().format(),
          },
        },
        実行タスク: {
          relation: runningTask.results.map((task) => ({
            id: task.id,
          })),
        },
      },
    }).then(() => {
      res.status(200).json({ message: 'トラッキングを正常に終了しました' });
    }).catch((error) => {
      res.status(500).json({ message: error.message });
    });
  } else {
    await notion.pages.update({
      page_id: runningTrackingPage.id,
      properties: {
        実行中: {
          checkbox: false,
        },
        終了時間: {
          date: {
            start: now.tz().format(),
          },
        },
      },
    }).then(() => {
      res.status(200).json({ message: 'トラッキングを正常に終了しました' });
    }).catch((error) => {
      res.status(500).json({ message: error.message });
    });
  }
};

export default handler;

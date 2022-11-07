import { Client, isFullPage } from '@notionhq/client';
import { CreatePageResponse } from '@notionhq/client/build/src/api-endpoints';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import { TRACKING_DATABASE_ID } from '../../../constants/constants';
import CreateTrackingObject from './pomodoroObject';

import type { NextApiRequest, NextApiResponse } from 'next';

dayjs.extend(utc);
dayjs.extend(timezone);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const notion = new Client({
    auth: process.env.NOTION_TOKEN,
  });
  const now = dayjs();
  const actualDay = now.add(-4, 'h'); // 4時を基準にした今日
  const todayStart = dayjs(`${actualDay.format('YYYY-MM-DD')}T04:00:00+09:00`);

  const todayTracking = await notion.databases.query({
    database_id: TRACKING_DATABASE_ID,
    filter: {
      and: [
        {
          property: '開始時間',
          date: {
            on_or_after: todayStart.utc().format(),
          },
        },
      ],
    },
  });
  const { results } = todayTracking;
  const sessionCount = results.filter(
    (result) => isFullPage(result)
    && result.properties['タイプ'].type === 'select'
    && result.properties['タイプ'].select?.name === 'ポモドーロ',
  ).length;

  if (results.find(
    (result) => isFullPage(result)
    && result.properties['実行中'].type === 'checkbox'
    && result.properties['実行中'].checkbox,
  )) {
    return res.status(200).json({ message: 'Pomodoro or Break already running' });
  }

  await notion.pages.create(
    CreateTrackingObject({
      sessionType: 'ポモドーロ',
      startDate: now,
      minuteLength: 25,
      sessionCount: sessionCount + 1,
    }),
  ).then(
    (response: CreatePageResponse) => res.status(200).json({ message: 'Pomodoro started', response }),
  ).catch(
    (error) => res.status(500).json({ message: 'Error starting Pomodoro', error }),
  );
  return null;
};

export default handler;

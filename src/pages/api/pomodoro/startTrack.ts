import { Client, isFullPage } from '@notionhq/client';
import { CreatePageResponse } from '@notionhq/client/build/src/api-endpoints';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import { TRACKING_DATABASE_ID } from '../../../constants/constants';
import CreateTrackingObject from './trackingObject';

import type { NextApiRequest, NextApiResponse } from 'next';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Tokyo');

const TRACKING_TYPE_TIME = {
  ポモドーロ: 25,
  短休憩: 5,
  長休憩: 15,
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }
  const body = JSON.parse(req.body);
  const trackType: ('ポモドーロ' | '短休憩' | '長休憩') = body.trackType ?? 'ポモドーロ';

  const notion = new Client({
    auth: process.env.NOTION_TOKEN,
  });
  const now = dayjs();
  const actualDay = now.add(-4, 'h'); // 4時を基準にした今日
  const todayStart = dayjs(`${actualDay.tz().format('YYYY-MM-DD')}T04:00:00+09:00`);

  const todayTracking = await notion.databases.query({
    database_id: TRACKING_DATABASE_ID,
    filter: {
      property: '開始時間',
      date: {
        on_or_after: todayStart.utc().format(),
      },
    },
  });
  const { results } = todayTracking;
  const sessionCount = results.filter(
    (result) => isFullPage(result)
    && result.properties['タイプ'].type === 'select'
    && result.properties['タイプ'].select?.name === trackType,
  ).length;

  if (results.find(
    (result) => isFullPage(result)
    && result.properties['実行中'].type === 'checkbox'
    && result.properties['実行中'].checkbox,
  )) {
    res.status(200).json({ message: '既に実行されているトラッキングがあります' });
    return;
  }

  await notion.pages.create(
    CreateTrackingObject({
      sessionType: trackType,
      startDate: now,
      minuteLength: TRACKING_TYPE_TIME[trackType] ?? 25,
      sessionCount: sessionCount + 1,
    }),
  ).then(
    (response: CreatePageResponse) => res.status(200).json({ message: 'トラッキングは正常に開始されました', response }),
  ).catch(
    (error) => res.status(500).json({ message: error.message }),
  );
};

export default handler;

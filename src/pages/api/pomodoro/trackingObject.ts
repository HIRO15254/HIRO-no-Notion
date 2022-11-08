import { CreatePageParameters } from '@notionhq/client/build/src/api-endpoints';
import dayjs, { Dayjs } from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import { TRACKING_DATABASE_ID } from '../../../constants/constants';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Tokyo');

type CreateTrackingObjectInfo = {
  sessionType: 'ポモドーロ' | '短休憩' | '長休憩';
  startDate: Dayjs;
  minuteLength: number;
  sessionCount: number;
};

const CreateTrackingObject = (info: CreateTrackingObjectInfo): CreatePageParameters => {
  const countDate = info.startDate.add(-4, 'h');
  return {
    parent: {
      type: 'database_id',
      database_id: TRACKING_DATABASE_ID,
    },
    properties: {
      開始時間: {
        start: info.startDate.tz().format(),
      },
      終了時間: {
        start: info.startDate.tz().add(info.minuteLength, 'm').format(),
      },
      実行中: true,
      タイプ: {
        name: info.sessionType,
      },
      タイトル: [
        {
          text: {
            content: `${countDate.tz().format('YYYY/MM/DD')} ${info.sessionType}#${info.sessionCount}`,
            link: null,
          },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default',
          },
        },
      ],
    },
  };
};

export default CreateTrackingObject;

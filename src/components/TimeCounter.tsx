import {
  Title,
} from '@mantine/core';
import dayjs, { Dayjs } from 'dayjs';
import React, { useState, useEffect } from 'react';

export type TimeCounterProps = {
  startTime: Dayjs
};

const TimeCounter: React.FC<TimeCounterProps> = (props) => {
  const { startTime } = props;
  const [time, setTime] = useState(dayjs().diff(startTime, 'second', false));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(time + 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [time]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Title size={72}>
        {`${Math.floor(time / 60).toString().padStart(2, '0')}:${(time % 60).toString().padStart(2, '0')}`}
      </Title>
    </div>
  );
};

export default TimeCounter;

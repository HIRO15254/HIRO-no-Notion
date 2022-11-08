import { Button, Text } from '@mantine/core';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

import TimeCounter from '../components/TimeCounter';

const PomodoroPage: React.FC = () => {
  const [mode, setMode] = useState<'start' | 'progress'>('start');
  const [startTime, setStartTime] = useState(dayjs());

  useEffect(() => {
    (async () => {
      const data = await (await fetch('/api/pomodoro/getRunningTrack')).json();
      if (data.length === 1) {
        setStartTime(dayjs(data[0].properties['開始時間'].date.start));
        setMode('progress');
      } else {
        setMode('start');
      }
    })();
  }, [mode]);

  const FinishButtonPressed = async () => {
    await fetch('/api/pomodoro/endTrack', {
      method: 'POST',
    });
    setMode('start');
  };

  return (
    <div>
      {mode === 'start' && (
        <div>
          <Text>Pomodoro is not Started</Text>
          <Button>Start</Button>
        </div>
      )}
      {mode === 'progress' && (
        <div>
          <Text>Pomodoro is Progress</Text>
          <TimeCounter startTime={startTime} />
          <Button onClick={FinishButtonPressed}>Finish</Button>
        </div>
      )}
    </div>
  );
};

export default PomodoroPage;

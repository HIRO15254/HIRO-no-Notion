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
  }, []);

  const FinishButtonPressed = async () => {
    await fetch('/api/pomodoro/endTrack', {
      method: 'POST',
    });
    setMode('start');
  };

  const StartButtonPressed = async (trackType: 'ポモドーロ' | '短休憩' | '長休憩') => {
    await fetch('/api/pomodoro/startTrack', {
      method: 'POST',
      body: JSON.stringify({
        trackType,
      }),
    });
    setMode('progress');
    setStartTime(dayjs());
  };

  const StartPomodoroButtonPressed = () => {
    StartButtonPressed('ポモドーロ');
  };

  const StartShortBreakButtonPressed = () => {
    StartButtonPressed('短休憩');
  };

  const StartLongBreakButtonPressed = () => {
    StartButtonPressed('長休憩');
  };

  return (
    <div>
      {mode === 'start' && (
        <div>
          <Text>Pomodoro is not Started</Text>
          <Button onClick={StartPomodoroButtonPressed}>Start Pomodoro</Button>
          <Button onClick={StartShortBreakButtonPressed}>Start ShortBreak</Button>
          <Button onClick={StartLongBreakButtonPressed}>Start LongBreak</Button>
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

import {
  Button, Center, Title, Group, Stack,
} from '@mantine/core';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

import TimeCounter from '../components/TimeCounter';

const PomodoroPage: React.FC = () => {
  const [mode, setMode] = useState<'start' | 'progress' | 'loading'>('loading');
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
    <Center p="md">
      {mode === 'loading' && (
        <Stack w="100%" maw={400}>
          <Group position="center">
            <Title>Loading...</Title>
          </Group>
        </Stack>
      )}
      {mode === 'start' && (
        <Stack w="100%" maw={400}>
          <Group position="center">
            <Title> Track is not Started</Title>
          </Group>
          <Button onClick={StartPomodoroButtonPressed} color="red" variant="light">Start Pomodoro</Button>
          <Group grow>
            <Button onClick={StartShortBreakButtonPressed} variant="light">Start ShortBreak</Button>
            <Button onClick={StartLongBreakButtonPressed} color="teal" variant="light">Start LongBreak</Button>
          </Group>
        </Stack>
      )}
      {mode === 'progress' && (
        <Stack w="100%" maw={400}>
          <Group position="center">
            <TimeCounter startTime={startTime} />
          </Group>
          <Button onClick={StartPomodoroButtonPressed} variant="light">Finish</Button>
        </Stack>
      )}
    </Center>
  );
};

export default PomodoroPage;

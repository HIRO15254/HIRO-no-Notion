import { Button, Text } from '@mantine/core';
import React, { useEffect, useState } from 'react';

const PomodoroPage: React.FC = () => {
  const [mode, setMode] = useState<'start' | 'progress'>('start');

  useEffect(() => {
    (async () => {
      const data = await (await fetch('/api/pomodoro/getRunningTrack')).json();
      if (data.length > 0) {
        setMode('progress');
      } else {
        setMode('start');
      }
    })();
  }, []);

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
          <Button>Finish</Button>
        </div>
      )}
    </div>
  );
};

export default PomodoroPage;

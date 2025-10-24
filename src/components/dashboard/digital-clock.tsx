'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const DigitalClock = () => {
  const [now, setNow] = useState(new Date());
  const { i18n, t } = useTranslation();

  useEffect(() => {
    const timerId = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  const language = i18n.language.startsWith('zh') ? 'zh-CN' : 'en-US';

  const formattedTime = now.toLocaleTimeString(language, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const formattedDate = now.toLocaleDateString(language, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const dayOfWeekKey = `tasks.weekdaysFull.${now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()}`;

  return (
    <div className="flex items-center justify-center gap-4">
        <div className="text-lg font-medium text-muted-foreground">
            {formattedDate} {t(dayOfWeekKey)}
        </div>
        <div className="text-2xl font-bold font-mono text-foreground">
            {formattedTime}
        </div>
    </div>
  );
};

export default DigitalClock;

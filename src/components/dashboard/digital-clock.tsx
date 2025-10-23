'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const DigitalClock = () => {
  const [now, setNow] = useState(new Date());
  const { i18n } = useTranslation();

  useEffect(() => {
    const timerId = setInterval(() => {
      setNow(new Date());
    }, 1000);

    // Cleanup the interval on component unmount
    return () => {
      clearInterval(timerId);
    };
  }, []);

  // Use i18n language to format date and time
  const language = i18n.language.startsWith('zh') ? 'zh-CN' : 'en-US';

  const formattedTime = now.toLocaleTimeString(language, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return (
    <div className="flex flex-col items-center">
      <div className="text-3xl font-medium text-foreground">
        {formattedTime}
      </div>
    </div>
  );
};

export default DigitalClock;

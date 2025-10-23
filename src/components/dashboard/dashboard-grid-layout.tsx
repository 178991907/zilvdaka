'use client';
import { useState, useEffect, Children } from 'react';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';

const ResponsiveGridLayout = WidthProvider(Responsive);

const getFromLS = (key: string) => {
  let ls: { [key: string]: any } = {};
  if (global.localStorage) {
    try {
      const storedData = localStorage.getItem('dashboard-layout');
      if (storedData) {
        ls = JSON.parse(storedData) || {};
      }
    } catch (e) {
      /*Ignore*/
    }
  }
  return ls[key];
};

const saveToLS = (key: string, value: any) => {
  if (global.localStorage) {
    localStorage.setItem(
      'dashboard-layout',
      JSON.stringify({
        [key]: value,
      })
    );
  }
};

const defaultLayouts = {
    lg: [
        { i: 'pet', x: 0, y: 0, w: 8, h: 4 },
        { i: 'dailyGoal', x: 8, y: 0, w: 4, h: 1 },
        { i: 'xpGained', x: 8, y: 1, w: 4, h: 1 },
        { i: 'petIntro', x: 8, y: 2, w: 4, h: 2 },
        { i: 'tasks', x: 0, y: 4, w: 12, h: 3 },
    ]
};


const DashboardGridLayout = ({ children }: { children: React.ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [layouts, setLayouts] = useState<{[key: string]: Layout[]}>(defaultLayouts);

  useEffect(() => {
    setIsMounted(true);
    const savedLayouts = getFromLS('layouts');
    if (savedLayouts) {
      setLayouts(savedLayouts);
    }
  }, []);
  
  const onLayoutChange = (layout: Layout[], allLayouts: { [key: string]: Layout[] }) => {
    saveToLS('layouts', allLayouts);
    setLayouts(allLayouts);
  };

  if (!isMounted) {
    return null;
  }
  
  return (
    <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={100}
        onLayoutChange={onLayoutChange}
        isDraggable={true}
        isResizable={true}
    >
        {children}
    </ResponsiveGridLayout>
  );
};

export default DashboardGridLayout;

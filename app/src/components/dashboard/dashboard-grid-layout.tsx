'use client';
import { useState, useEffect } from 'react';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';

const ResponsiveGridLayout = WidthProvider(Responsive);

const getFromLS = (key: string) => {
  let ls: { [key: string]: any } = {};
  if (global.localStorage) {
    try {
      const storedData = localStorage.getItem('dashboard-layout-v3');
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
      'dashboard-layout-v3',
      JSON.stringify({
        [key]: value,
      })
    );
  }
};

const defaultLayouts = {
    lg: [
        { i: 'pet', x: 0, y: 0, w: 8, h: 12, minW: 6, minH: 10 },
        { i: 'tasks', x: 0, y: 12, w: 12, h: 8, minW: 6, minH: 6 },
        { i: 'dailyGoal', x: 8, y: 0, w: 4, h: 4, minW: 3, minH: 4 },
        { i: 'xpGained', x: 8, y: 4, w: 4, h: 4, minW: 3, minH: 4 },
        { i: 'petIntro', x: 8, y: 8, w: 4, h: 4, minW: 3, minH: 4 },
    ],
    md: [
        { i: 'pet', x: 0, y: 0, w: 6, h: 10, minW: 4, minH: 8 },
        { i: 'tasks', x: 0, y: 14, w: 10, h: 8, minW: 6, minH: 4 },
        { i: 'dailyGoal', x: 6, y: 0, w: 4, h: 4, minW: 3, minH: 4 },
        { i: 'xpGained', x: 6, y: 4, w: 4, h: 4, minW: 3, minH: 4 },
        { i: 'petIntro', x: 0, y: 10, w: 10, h: 4, minW: 4, minH: 4 },
    ],
};


const DashboardGridLayout = ({ children, isEditing }: { children: React.ReactNode, isEditing: boolean }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [layouts, setLayouts] = useState<{[key: string]: Layout[]}>(() => getFromLS('layouts') || defaultLayouts);

  useEffect(() => {
    setIsMounted(true);
    const savedLayouts = getFromLS('layouts');
    if (savedLayouts) {
        // Basic validation to prevent completely broken layouts
        if (savedLayouts.lg && savedLayouts.lg.every((item: Layout) => item.i && item.w > 0 && item.h > 0)) {
           setLayouts(savedLayouts);
        } else {
           setLayouts(defaultLayouts);
        }
    } else {
        setLayouts(defaultLayouts);
    }
  }, []);
  
  const onLayoutChange = (layout: Layout[], allLayouts: { [key: string]: Layout[] }) => {
    saveToLS('layouts', allLayouts);
    setLayouts(allLayouts);
  };

  if (!isMounted) {
    // Render a placeholder or simplified layout for SSR
    return <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 md:p-8">{children}</div>;
  }
  
  return (
    <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 1, xxs: 1 }}
        rowHeight={30}
        onLayoutChange={onLayoutChange}
        isDraggable={isEditing}
        isResizable={isEditing}
        measureBeforeMount={false}
        useCSSTransforms={true}
        compactType="vertical"
    >
        {children}
    </ResponsiveGridLayout>
  );
};

export default DashboardGridLayout;

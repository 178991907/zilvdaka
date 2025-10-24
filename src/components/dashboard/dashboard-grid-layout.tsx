'use client';
import { useState, useEffect, Children, cloneElement, isValidElement } from 'react';
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
        { i: 'pet', x: 0, y: 0, w: 80, h: 40, minH: 40, minW: 40 },
        { i: 'dailyGoal', x: 80, y: 0, w: 40, h: 10, minH: 10, minW: 20 },
        { i: 'xpGained', x: 80, y: 10, w: 40, h: 10, minH: 10, minW: 20 },
        { i: 'petIntro', x: 80, y: 20, w: 40, h: 20, minH: 20, minW: 30 },
        { i: 'tasks', x: 0, y: 40, w: 120, h: 30, minH: 30, minW: 60 },
    ],
    md: [
        { i: 'pet', x: 0, y: 0, w: 60, h: 40 },
        { i: 'dailyGoal', x: 60, y: 0, w: 40, h: 10 },
        { i: 'xpGained', x: 60, y: 10, w: 40, h: 10 },
        { i: 'petIntro', x: 0, y: 40, w: 60, h: 20 },
        { i: 'tasks', x: 0, y: 60, w: 100, h: 30 },
    ],
    sm: [
        { i: 'pet', x: 0, y: 0, w: 60, h: 40 },
        { i: 'dailyGoal', x: 0, y: 40, w: 30, h: 10 },
        { i: 'xpGained', x: 30, y: 40, w: 30, h: 10 },
        { i: 'petIntro', x: 0, y: 50, w: 60, h: 20 },
        { i: 'tasks', x: 0, y: 70, w: 60, h: 30 },
    ],
    xs: [
        { i: 'pet', x: 0, y: 0, w: 40, h: 40 },
        { i: 'dailyGoal', x: 0, y: 40, w: 40, h: 10 },
        { i: 'xpGained', x: 0, y: 50, w: 40, h: 10 },
        { i: 'petIntro', x: 0, y: 60, w: 40, h: 20 },
        { i: 'tasks', x: 0, y: 80, w: 40, h: 30 },
    ],
    xxs: [
        { i: 'pet', x: 0, y: 0, w: 20, h: 40 },
        { i: 'dailyGoal', x: 0, y: 40, w: 20, h: 10 },
        { i: 'xpGained', x: 0, y: 50, w: 20, h: 10 },
        { i: 'petIntro', x: 0, y: 60, w: 20, h: 20 },
        { i: 'tasks', x: 0, y: 80, w: 20, h: 30 },
    ],
};


const DashboardGridLayout = ({ children, isEditing }: { children: React.ReactNode, isEditing: boolean }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [layouts, setLayouts] = useState<{[key: string]: Layout[]}>(() => getFromLS('layouts') || defaultLayouts);

  useEffect(() => {
    setIsMounted(true);
    // Set layouts from LS on mount
    const savedLayouts = getFromLS('layouts');
    if (savedLayouts) {
        setLayouts(savedLayouts);
    } else {
        setLayouts(defaultLayouts);
    }
  }, []);
  
  const onLayoutChange = (layout: Layout[], allLayouts: { [key: string]: Layout[] }) => {
    saveToLS('layouts', allLayouts);
    setLayouts(allLayouts);
  };

  if (!isMounted) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
             {Children.map(children, child => {
                if (isValidElement(child)) {
                    // This renders a static version for SSR to prevent layout shifts
                    return <div className="h-full">{child}</div>;
                }
                return null;
            })}
        </div>
    );
  }
  
  return (
    <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 120, md: 100, sm: 60, xs: 40, xxs: 20 }}
        rowHeight={10}
        onLayoutChange={onLayoutChange}
        isDraggable={isEditing}
        isResizable={isEditing}
    >
        {children}
    </ResponsiveGridLayout>
  );
};

export default DashboardGridLayout;

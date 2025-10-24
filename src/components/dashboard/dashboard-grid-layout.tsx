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
        { i: 'pet', x: 0, y: 0, w: 10, h: 300, minH: 60, minW: 2 },
        { i: 'dailyGoal', x: 10, y: 0, w: 2, h: 90, minH: 90, minW: 1 },
        { i: 'xpGained', x: 10, y: 90, w: 2, h: 120, minH: 90, minW: 1 },
        { i: 'petIntro', x: 10, y: 210, w: 2, h: 150, minH: 60, minW: 1 },
        { i: 'tasks', x: 0, y: 300, w: 12, h: 120, minH: 60, minW: 2 },
    ],
    md: [
        { i: 'pet', x: 0, y: 0, w: 10, h: 300, minH: 60, minW: 2 },
        { i: 'dailyGoal', x: 0, y: 300, w: 5, h: 90, minH: 90, minW: 1 },
        { i: 'xpGained', x: 5, y: 300, w: 5, h: 90, minH: 90, minW: 1 },
        { i: 'petIntro', x: 0, y: 390, w: 10, h: 150, minH: 60, minW: 1 },
        { i: 'tasks', x: 0, y: 540, w: 10, h: 120, minH: 90, minW: 2 },
    ],
    sm: [
        { i: 'pet', x: 0, y: 0, w: 6, h: 300, minH: 60, minW: 1 },
        { i: 'dailyGoal', x: 0, y: 300, w: 6, h: 90, minH: 90, minW: 1 },
        { i: 'xpGained', x: 0, y: 390, w: 6, h: 90, minH: 90, minW: 1 },
        { i: 'petIntro', x: 0, y: 480, w: 6, h: 150, minH: 60, minW: 1 },
        { i: 'tasks', x: 0, y: 630, w: 6, h: 120, minH: 90, minW: 1 },
    ],
     xs: [
        { i: 'pet', x: 0, y: 0, w: 1, h: 90, minH: 60, minW: 1 },
        { i: 'dailyGoal', x: 0, y: 90, w: 1, h: 90, minH: 90, minW: 1 },
        { i: 'xpGained', x: 0, y: 180, w: 1, h: 90, minH: 90, minW: 1 },
        { i: 'petIntro', x: 0, y: 270, w: 1, h: 150, minH: 60, minW: 1 },
        { i: 'tasks', x: 0, y: 420, w: 1, h: 120, minH: 90, minW: 1 },
    ],
    xxs: [
        { i: 'pet', x: 0, y: 0, w: 1, h: 90, minH: 60, minW: 1 },
        { i: 'dailyGoal', x: 0, y: 90, w: 1, h: 90, minH: 90, minW: 1 },
        { i: 'xpGained', x: 0, y: 180, w: 1, h: 90, minH: 90, minW: 1 },
        { i: 'petIntro', x: 0, y: 270, w: 1, h: 150, minH: 60, minW: 1 },
        { i: 'tasks', x: 0, y: 420, w: 1, h: 120, minH: 90, minW: 1 },
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
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
        cols={{ lg: 12, md: 10, sm: 6, xs: 1, xxs: 1 }}
        rowHeight={1}
        onLayoutChange={onLayoutChange}
        isDraggable={isEditing}
        isResizable={isEditing}
    >
        {children}
    </ResponsiveGridLayout>
  );
};

export default DashboardGridLayout;

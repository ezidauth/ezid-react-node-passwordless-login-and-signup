import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import mapIcon from '@iconify/icons-bi/map';
import lockFill from '@iconify/icons-eva/lock-fill';
import statisticsIcon from '@iconify/icons-whh/statistics';
import bxData from '@iconify/icons-bx/bx-data';

// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon(pieChart2Fill)
  },
  {
    title: 'map',
    path: '',
    icon: getIcon(mapIcon)
  },
  {
    title: 'statistics',
    path: '',
    icon: getIcon(statisticsIcon)
  },
  {
    title: 'data',
    path: '',
    icon: getIcon(bxData)
  },
  {
    title: 'logout',
    path: '/login',
    icon: getIcon(lockFill)
  }
];

export default sidebarConfig;

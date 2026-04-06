import { createBrowserRouter } from 'react-router';
import { HomeScreen } from './screens/HomeScreen';
import { BrowserScreen } from './screens/BrowserScreen';
import { SettingsScreen } from './screens/SettingsScreen';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: HomeScreen,
  },
  {
    path: '/browser',
    Component: BrowserScreen,
  },
  {
    path: '/settings',
    Component: SettingsScreen,
  },
]);

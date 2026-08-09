import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  BellIcon,
  FileTextIcon,
  HomeIcon,
  LifeBuoyIcon,
  LogOutIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UserIcon } from
'lucide-react';
import { AppShell } from '../AppShell';
import { SideNav } from '../SideNav';
import { Topbar } from '../Topbar';
import { Logo } from '../Logo';
import { Toast, ToastViewport } from '../Toast';
import { BottomTabBar } from './BottomTabBar';
import { useYami } from '../../contexts/YamiContext';
import { useAuth } from '../../contexts/AuthContext';
import { isTroubled } from '../../utils/agreement';
import { relativeDay } from '../../utils/format';

const NAV_ROUTES: Record<string, string> = {
  home: '/home',
  agreements: '/agreements',
  resolution: '/resolution',
  reputation: '/reputation',
  notifications: '/notifications',
  verification: '/verification',
  profile: '/profile'
};

function activeIdFromPath(pathname: string): string {
  const match = Object.entries(NAV_ROUTES).find(([, path]) =>
  pathname.startsWith(path)
  );
  return match ? match[0] : 'agreements';
}

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { agreements, notifications, toast, dismissToast, user, settings, updateSettings } =
  useYami();
  const { signOut } = useAuth();

  const troubled = agreements.filter(isTroubled).length;
  const unread = notifications.filter((notification) => !notification.read).length;

  const sections = [
  {
    id: 'main',
    label: 'Overview',
    items: [
    { id: 'home', label: 'Home', icon: HomeIcon },
    {
      id: 'agreements',
      label: 'Agreements',
      icon: FileTextIcon,
      badge: agreements.filter((a) => a.status === 'pending').length || undefined
    },
    {
      id: 'resolution',
      label: 'Resolution',
      icon: LifeBuoyIcon,
      badge: troubled || undefined
    }]

  },
  {
    id: 'trust',
    label: 'Trust',
    items: [
    { id: 'reputation', label: 'Reputation', icon: SparklesIcon },
    { id: 'verification', label: 'Verification', icon: ShieldCheckIcon }]

  },
  {
    id: 'account',
    label: 'Account',
    items: [
    {
      id: 'notifications',
      label: 'Notifications',
      icon: BellIcon,
      badge: unread || undefined
    },
    { id: 'profile', label: 'Profile', icon: UserIcon }]

  }];


  return (
    <div className="min-h-screen w-full bg-background text-text-primary">
      <AppShell
        brand={<Logo variant="full" size={22} wordmark="YAMI" title="YAMI" />}
        sidebar={
        <SideNav
          sections={sections}
          activeId={activeIdFromPath(location.pathname)}
          collapsible={false}
          onNavigate={(item) => navigate(NAV_ROUTES[item.id] ?? '/')}
          aria-label="Primary" />

        }
        topbar={
        <Topbar
          title="YAMI"
          showSearch={false}
          notifications={notifications.slice(0, 5).map((notification) => ({
            id: notification.id,
            title: notification.title,
            description: notification.detail,
            time: relativeDay(notification.date),
            unread: !notification.read
          }))}
          onNotificationSelect={() => navigate('/notifications')}
          user={{ name: user.name, email: user.email }}
          accountMenuItems={[
          {
            id: 'profile',
            label: 'Profile & settings',
            onSelect: () => navigate('/profile')
          },
          {
            id: 'theme',
            label:
            settings.theme === 'dark' ?
            'Switch to light theme' :
            'Switch to dark theme',
            onSelect: () =>
            updateSettings({
              theme: settings.theme === 'dark' ? 'light' : 'dark'
            })
          },
          {
            id: 'signout',
            label: 'Sign out',
            icon: <LogOutIcon className="h-4 w-4" />,
            destructive: true,
            onSelect: () => {
              signOut();
              navigate('/');
            }
          }]
          } />

        }
        maxContentWidth="xl"
        contentClassName="pb-24 lg:pb-10">
        
        <Outlet />
      </AppShell>
      <BottomTabBar resolutionCount={troubled} />
      <ToastViewport position="bottom-center">
        {toast ?
        <Toast
          key={toast.id}
          title={toast.title}
          description={toast.description}
          variant={toast.variant}
          open
          duration={4500}
          onClose={dismissToast} /> :

        null}
      </ToastViewport>
    </div>);

}
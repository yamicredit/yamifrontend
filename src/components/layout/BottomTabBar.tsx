import React from "react";
import { NavLink } from "react-router-dom";
import { FileTextIcon, HomeIcon, LifeBuoyIcon, UserIcon, BoxIcon } from "lucide-react";
import { focusRing, hairline, surface } from "../../utils/ui";
interface TabItem {
  to: string;
  label: string;
  icon: BoxIcon;
  badge?: number;
}
interface BottomTabBarProps {
  resolutionCount: number;
}
export function BottomTabBar({
  resolutionCount
}: BottomTabBarProps) {
  const tabs: TabItem[] = [{
    to: '/home',
    label: 'Home',
    icon: HomeIcon
  }, {
    to: '/agreements',
    label: 'Agreements',
    icon: FileTextIcon
  }, {
    to: '/resolution',
    label: 'Resolution',
    icon: LifeBuoyIcon,
    badge: resolutionCount
  }, {
    to: '/profile',
    label: 'Profile',
    icon: UserIcon
  }];
  return <nav aria-label="Primary" className={`fixed bottom-0 left-0 right-0 z-30 border-t ${hairline} ${surface} lg:hidden`}>
      <ul className="mx-auto flex max-w-xl items-stretch">
        {tabs.map((tab) => <li key={tab.to} className="flex-1">
            <NavLink to={tab.to} end className={({
          isActive
        }) => `${focusRing} flex flex-col items-center gap-1 px-1 py-2.5 text-[11px] font-medium transition-colors ${isActive ? 'text-accent dark:text-accent-dark' : 'text-text-secondary dark:text-text-secondary-dark'}`}>
              {({
            isActive
          }) => <>
                  <span className="relative">
                    <tab.icon className="h-5 w-5" strokeWidth={isActive ? 2.2 : 1.8} aria-hidden="true" />
                    {tab.badge ? <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger-foreground px-1 font-mono text-[9px] font-semibold text-on-danger">
                        {tab.badge}
                      </span> : null}
                  </span>
                  {tab.label}
                </>}
            </NavLink>
          </li>)}
      </ul>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>;
}
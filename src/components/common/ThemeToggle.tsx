import React from 'react';
import { MoonIcon, SunIcon } from 'lucide-react';
import { IconButton } from '../IconButton';
import { useYami } from '../../contexts/YamiContext';

export function ThemeToggle({ size = 'md' }: {size?: 'sm' | 'md' | 'lg';}) {
  const { settings, updateSettings } = useYami();
  const dark = settings.theme === 'dark';

  return (
    <IconButton
      variant="ghost"
      size={size}
      label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={dark}
      onClick={() => updateSettings({ theme: dark ? 'light' : 'dark' })}
      icon={
      dark ?
      <SunIcon className="h-4 w-4" aria-hidden="true" /> :

      <MoonIcon className="h-4 w-4" aria-hidden="true" />

      } />);


}
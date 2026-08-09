/**
 * Shared token-based class strings.
 *
 * Every colour below is a CSS-variable token that is remapped by the `.dark`
 * class in index.css, so components never need `dark:` variants — the theme
 * repaints from a single class toggle on <html>.
 */

export const textPrimary = 'text-text-primary';
export const textSecondary = 'text-text-secondary';
export const hairline = 'border-border';
export const surface = 'bg-surface';
export const surfaceElevated = 'bg-surface-elevated';
export const pageBackground = 'bg-background';

export const card = `rounded-lg border ${hairline} ${surface}`;

export const mono = 'font-mono tabular-nums';

export const focusRing =
'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

export const subtleAccent = 'bg-accent-subtle text-accent-subtle-foreground';
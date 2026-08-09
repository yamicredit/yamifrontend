import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../Logo';
import { ThemeToggle } from '../common/ThemeToggle';
import { AuthAside } from './AuthAside';
import { hairline, textPrimary, textSecondary } from '../../utils/ui';

interface AuthShellProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  asidePoints?: string[];
  asideImage?: string;
  asideImageAlt?: string;
}

const DEFAULT_POINTS = [
'Documented terms both parties can see',
'Verified identities before anything goes active',
'A repayment record that builds your reputation'];


export function AuthShell({
  title,
  description,
  children,
  footer,
  asidePoints = DEFAULT_POINTS,
  asideImage,
  asideImageAlt
}: AuthShellProps) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-text-primary lg:flex-row">
      <aside
        className={`hidden w-[46%] flex-col justify-between border-r bg-surface px-10 py-9 xl:px-14 lg:flex ${hairline}`}>
        
        <Link to="/" aria-label="YAMI home" className="shrink-0">
          <Logo variant="full" size={26} wordmark="YAMI" title="YAMI" />
        </Link>

        <div className="my-8">
          <h2
            className={`max-w-md text-2xl font-semibold leading-tight xl:text-[28px] ${textPrimary}`}>
            
            Trust you already have, finally on the record.
          </h2>
          <p className={`mt-2 max-w-sm text-sm leading-relaxed ${textSecondary}`}>
            Every agreement, repayment and resolution step in one place — for both the
            credit you give and the credit you receive.
          </p>
          <div className="mt-7">
            <AuthAside
              points={asidePoints}
              image={asideImage}
              imageAlt={asideImageAlt} />
            
          </div>
        </div>

        <p className={`shrink-0 text-xs ${textSecondary}`}>
          Lagos · Nigeria — YAMI is credit infrastructure, not a lender.
        </p>
      </aside>

      <main className="flex flex-1 flex-col">
        <header
          className={`flex items-center justify-between border-b px-4 py-3 lg:justify-end lg:border-b-0 ${hairline}`}>
          
          <Link to="/" className="lg:hidden" aria-label="YAMI home">
            <Logo variant="full" size={20} wordmark="YAMI" title="YAMI" />
          </Link>
          <ThemeToggle size="sm" />
        </header>

        <div className="flex flex-1 items-start justify-center px-4 py-8 sm:py-12">
          <div className="w-full max-w-sm">
            <h1 className={`text-xl font-semibold ${textPrimary}`}>{title}</h1>
            <p className={`mt-1 text-sm leading-normal ${textSecondary}`}>{description}</p>
            <div className="mt-6">{children}</div>
            {footer ? <div className="mt-6">{footer}</div> : null}
          </div>
        </div>
      </main>
    </div>);

}
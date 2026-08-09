import React from 'react';
import { motion } from 'framer-motion';
import { CheckIcon, ShieldCheckIcon, SparklesIcon, TrendingUpIcon } from 'lucide-react';
import { Avatar } from '../Avatar';
import { StatusPill } from '../StatusPill';
import { Badge } from '../Badge';
import { images } from '../../data/images';
import { card, hairline, mono, textPrimary, textSecondary } from '../../utils/ui';

const SPARK = [38, 52, 44, 66, 58, 74, 88];

const SCHEDULE = [
{ label: '28 Jun', amount: '₦30,000', done: true },
{ label: '28 Jul', amount: '₦26,000', done: true },
{ label: '28 Aug', amount: '₦30,000', done: false }];


const fade = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] as const }
});

interface AuthAsideProps {
  points: string[];
  image?: string;
  imageAlt?: string;
}

export function AuthAside({
  points,
  image = images.shopkeeper,
  imageAlt = 'A shopkeeper in Lagos serving a customer while holding her phone'
}: AuthAsideProps) {
  return (
    <div className="relative">
      {/* Brand photography */}
      <motion.div
        {...fade(0)}
        className={`overflow-hidden rounded-xl border ${hairline}`}>
        
        <img
          src={image}
          alt={imageAlt}
          className="h-44 w-full max-w-md object-cover xl:h-52"
          loading="eager" />
        
      </motion.div>

      {/* Main agreement card */}
      <motion.div
        {...fade(0.05)}
        className={`${card} relative z-10 -mt-10 ml-6 max-w-sm p-4 shadow-md`}>
        
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Avatar name="Chidi Okonkwo" size="sm" />
            <div>
              <p className={`text-sm font-semibold ${textPrimary}`}>Chidi Okonkwo</p>
              <p className={`text-[11px] ${textSecondary}`}>Cash loan · YAMI-1042</p>
            </div>
          </div>
          <StatusPill status="active" size="sm">
            Active
          </StatusPill>
        </div>

        <div className="mt-3.5">
          <p className={`text-[11px] uppercase tracking-wide ${textSecondary}`}>
            Owed to you
          </p>
          <p className={`${mono} text-2xl font-semibold ${textPrimary}`}>
            ₦64,000
            <span className={`ml-1.5 text-xs font-normal ${textSecondary}`}>
              of ₦120,000
            </span>
          </p>
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '47%' }}
              transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full bg-accent" />
            
          </div>
        </div>

        <ul className={`mt-3.5 space-y-2 border-t pt-3 ${hairline}`}>
          {SCHEDULE.map((row) =>
          <li key={row.label} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2">
                <span
                aria-hidden="true"
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                row.done ?
                'bg-success-background text-success-foreground' :
                'border border-border'}`
                }>
                
                  {row.done ? <CheckIcon className="h-2.5 w-2.5" /> : null}
                </span>
                <span className={`text-xs ${row.done ? textPrimary : textSecondary}`}>
                  {row.label}
                </span>
              </span>
              <span className={`${mono} text-xs ${textPrimary}`}>{row.amount}</span>
            </li>
          )}
        </ul>
      </motion.div>

      {/* Reputation card, offset */}
      <motion.div
        {...fade(0.2)}
        className={`${card} relative z-20 -mt-4 ml-16 w-64 p-3.5 shadow-md`}>
        
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <SparklesIcon
              className={`h-3.5 w-3.5 ${textSecondary}`}
              aria-hidden="true" />
            
            <span className={`text-[11px] uppercase tracking-wide ${textSecondary}`}>
              Reputation
            </span>
          </span>
          <Badge size="sm" variant="success" dot>
            Strong
          </Badge>
        </div>
        <p className={`${mono} mt-1 text-2xl font-semibold ${textPrimary}`}>742</p>
        <div className="mt-2 flex h-8 items-end gap-1" aria-hidden="true">
          {SPARK.map((value, index) =>
          <motion.span
            key={value}
            initial={{ height: 4 }}
            animate={{ height: `${value}%` }}
            transition={{
              duration: 0.5,
              delay: 0.45 + index * 0.05,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="flex-1 rounded-sm bg-accent-subtle"
            style={{ minHeight: 4 }} />

          )}
        </div>
        <p className={`mt-1.5 flex items-center gap-1 text-[11px] ${textSecondary}`}>
          <TrendingUpIcon className="h-3 w-3" aria-hidden="true" />
          94% of repayments on time
        </p>
      </motion.div>

      {/* Resolution chip */}
      <motion.div
        {...fade(0.32)}
        className={`${card} relative z-10 -mt-3 w-56 p-3 shadow-sm`}>
        
        <p className={`text-[11px] font-medium ${textPrimary}`}>Reminder sent</p>
        <p className={`mt-0.5 text-[11px] leading-normal ${textSecondary}`}>
          Structured resolution starts long before a relationship breaks.
        </p>
        <div className="mt-2 flex items-center gap-1" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((step) =>
          <span
            key={step}
            className={`h-1 flex-1 rounded-full ${
            step === 0 ? 'bg-accent' : 'bg-muted'}`
            } />

          )}
        </div>
      </motion.div>

      {/* Trust points */}
      <motion.ul {...fade(0.42)} className="mt-8 max-w-sm space-y-2.5">
        {points.map((point) =>
        <li key={point} className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent-subtle text-accent-subtle-foreground">
              <ShieldCheckIcon className="h-2.5 w-2.5" aria-hidden="true" />
            </span>
            <span className={`text-sm leading-normal ${textSecondary}`}>{point}</span>
          </li>
        )}
      </motion.ul>
    </div>);

}
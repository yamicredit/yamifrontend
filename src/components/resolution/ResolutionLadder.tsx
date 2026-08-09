import React from 'react';
import { CheckIcon } from 'lucide-react';
import type { Resolution } from '../../types/yami';
import { RESOLUTION_STAGES } from '../../utils/agreement';
import { card, hairline, textPrimary, textSecondary } from '../../utils/ui';

interface ResolutionLadderProps {
  resolution?: Resolution;
  compact?: boolean;
}

export function ResolutionLadder({ resolution, compact }: ResolutionLadderProps) {
  const currentIndex = resolution ?
  RESOLUTION_STAGES.findIndex((s) => s.stage === resolution.stage) :
  -1;

  const body =
  <ol className={compact ? 'space-y-1.5' : 'space-y-3'}>
      {RESOLUTION_STAGES.map((stage, index) => {
      const done = index < currentIndex;
      const current = index === currentIndex;
      return (
        <li key={stage.stage} className="flex items-start gap-2.5">
            <span
            aria-hidden="true"
            className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
            done ?
            'border-transparent bg-success-foreground text-on-success' :
            current ?
            'border-transparent bg-accent text-on-accent' :
            'border-border bg-transparent dark:border-border-dark'}`
            }>
            
              {done ? <CheckIcon className="h-2.5 w-2.5" /> : null}
              {current ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : null}
            </span>
            <div className="min-w-0">
              <p
              className={`text-xs font-medium ${
              done || current ? textPrimary : textSecondary}`
              }>
              
                {stage.label}
                {current ?
              <span className="ml-1.5 text-[10px] font-semibold uppercase tracking-wide text-accent dark:text-accent-dark">
                    Now
                  </span> :
              null}
              </p>
              {!compact ?
            <p className={`text-[11px] leading-normal ${textSecondary}`}>
                  {stage.blurb}
                </p> :
            null}
            </div>
          </li>);

    })}
    </ol>;


  if (compact) return body;

  return (
    <section className={card} aria-labelledby="ladder-heading">
      <div className={`border-b px-4 py-3 ${hairline}`}>
        <h2 id="ladder-heading" className={`text-sm font-semibold ${textPrimary}`}>
          Resolution ladder
        </h2>
        <p className={`text-xs ${textSecondary}`}>
          Each step is designed to keep the relationship intact.
        </p>
      </div>
      <div className="px-4 py-3.5">{body}</div>
    </section>);

}
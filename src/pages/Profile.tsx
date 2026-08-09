import React from 'react';
import { Link } from 'react-router-dom';
import { MoonIcon, SunIcon } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Switch } from '../components/Switch';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { SegmentedControl } from '../components/SegmentedControl';
import { PartyRow } from '../components/common/PartyRow';
import { useYami } from '../contexts/YamiContext';
import { VERIFICATION_META } from '../utils/agreement';
import { formatNaira } from '../utils/format';
import { card, hairline, mono, textPrimary, textSecondary } from '../utils/ui';

const CHANNELS: {key: 'sms' | 'email' | 'push' | 'inApp';label: string;description: string;}[] = [
{ key: 'sms', label: 'SMS', description: 'Works without data — best for reminders.' },
{ key: 'email', label: 'Email', description: 'Agreement copies and monthly summaries.' },
{ key: 'push', label: 'Push', description: 'Instant alerts on this device.' },
{ key: 'inApp', label: 'In-app', description: 'Always on inside YAMI.' }];


export function Profile() {
  const { user, settings, updateSettings, reputation } = useYami();

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <PageHeader
        title="Profile & settings"
        description="Your account, how YAMI reaches you, and what you share." />
      

      <section className={`${card} p-4`} aria-labelledby="account-heading">
        <h2 id="account-heading" className="sr-only">
          Account
        </h2>
        <PartyRow
          name={user.name}
          role={user.businessName ?? 'Individual account'}
          verification={user.verification}
          meta={user.location} />
        
        <dl className={`mt-3.5 grid grid-cols-2 gap-3 border-t pt-3.5 ${hairline}`}>
          <div>
            <dt className={`text-[11px] uppercase tracking-wide ${textSecondary}`}>Phone</dt>
            <dd className={`${mono} text-xs ${textPrimary}`}>{user.phone}</dd>
          </div>
          <div>
            <dt className={`text-[11px] uppercase tracking-wide ${textSecondary}`}>Email</dt>
            <dd className={`text-xs ${textPrimary}`}>{user.email}</dd>
          </div>
          <div>
            <dt className={`text-[11px] uppercase tracking-wide ${textSecondary}`}>
              Reputation
            </dt>
            <dd className={`${mono} text-xs ${textPrimary}`}>
              {reputation.score} · {reputation.band}
            </dd>
          </div>
          <div>
            <dt className={`text-[11px] uppercase tracking-wide ${textSecondary}`}>
              Current exposure
            </dt>
            <dd className={`${mono} text-xs ${textPrimary}`}>
              {formatNaira(reputation.currentExposure)}
            </dd>
          </div>
        </dl>
        <div className="mt-3.5 flex flex-wrap items-center gap-2">
          <Badge variant={VERIFICATION_META[user.verification].level >= 2 ? 'success' : 'warning'} dot>
            {VERIFICATION_META[user.verification].label}
          </Badge>
          <Link to="/verification">
            <Button size="sm" variant="secondary">
              Manage verification
            </Button>
          </Link>
        </div>
      </section>

      <section className={card} aria-labelledby="channels-heading">
        <div className={`border-b px-4 py-3 ${hairline}`}>
          <h2 id="channels-heading" className={`text-sm font-semibold ${textPrimary}`}>
            How YAMI reaches you
          </h2>
          <p className={`text-xs ${textSecondary}`}>
            Reminders go out before a payment is due and again if one is missed.
          </p>
        </div>
        <ul className="divide-y divide-border dark:divide-border-dark">
          {CHANNELS.map((channel) =>
          <li key={channel.key} className="px-4 py-3">
              <Switch
              checked={settings.channels[channel.key]}
              disabled={channel.key === 'inApp'}
              onCheckedChange={(checked) =>
              updateSettings({
                channels: { ...settings.channels, [channel.key]: checked }
              })
              }
              label={channel.label}
              description={channel.description} />
            
            </li>
          )}
        </ul>
      </section>

      <section className={card} aria-labelledby="privacy-heading">
        <div className={`border-b px-4 py-3 ${hairline}`}>
          <h2 id="privacy-heading" className={`text-sm font-semibold ${textPrimary}`}>
            Privacy & consent
          </h2>
        </div>
        <div className="space-y-3 px-4 py-3.5">
          <Switch
            checked={settings.shareReputation}
            onCheckedChange={(checked) => updateSettings({ shareReputation: checked })}
            label="Share my reputation with verified businesses"
            description="They see your score and repayment behaviour — never your counterparties." />
          
          <p className={`text-[11px] leading-normal ${textSecondary}`}>
            Payment records cannot be edited or deleted once confirmed. Access to your
            data is logged and available on request.
          </p>
        </div>
      </section>

      <section className={`${card} p-4`} aria-labelledby="appearance-heading">
        <h2 id="appearance-heading" className={`text-sm font-semibold ${textPrimary}`}>
          Appearance
        </h2>
        <div className="mt-2.5">
          <SegmentedControl
            aria-label="Theme"
            options={[
            {
              value: 'light',
              label: 'Light',
              icon: <SunIcon className="h-3.5 w-3.5" aria-hidden="true" />
            },
            {
              value: 'dark',
              label: 'Dark',
              icon: <MoonIcon className="h-3.5 w-3.5" aria-hidden="true" />
            }]
            }
            value={settings.theme}
            onChange={(value) => updateSettings({ theme: value as 'light' | 'dark' })}
            size="sm" />
          
        </div>
      </section>
    </div>);

}
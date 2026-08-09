import React from 'react';
import { Link } from 'react-router-dom';
import { BellIcon } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Skeleton } from '../components/Skeleton';
import { EmptyState } from '../components/common/EmptyState';
import { useYami } from '../contexts/YamiContext';
import { relativeDay } from '../utils/format';
import { card, hairline, mono, textPrimary, textSecondary } from '../utils/ui';

const GROUPS: {
  key: 'urgent' | 'due' | 'info';
  title: string;
  blurb: string;
}[] = [
{
  key: 'urgent',
  title: 'Needs a decision',
  blurb: 'Someone is waiting on you.'
},
{ key: 'due', title: 'Due soon', blurb: 'Payments and confirmations coming up.' },
{ key: 'info', title: 'Updates', blurb: 'Everything else worth knowing.' }];


export function Notifications() {
  const { notifications, markAllNotificationsRead, loading } = useYami();

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton variant="rect" height={72} />
        <Skeleton variant="rect" height={180} />
      </div>);

  }

  const unread = notifications.filter((notification) => !notification.read).length;

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <PageHeader
        title="Notifications"
        description="Reminders and events across SMS, email, push and in-app."
        actions={
        unread ?
        <Button variant="secondary" onClick={markAllNotificationsRead}>
              Mark all read
            </Button> :
        null
        } />
      

      {notifications.length === 0 ?
      <EmptyState
        icon={<BellIcon className="h-5 w-5" />}
        title="Nothing to report"
        description="Reminders about due payments, acceptances and resolution steps will appear here." /> :


      GROUPS.map((group) => {
        const items = notifications.filter(
          (notification) => notification.urgency === group.key
        );
        if (items.length === 0) return null;
        return (
          <section key={group.key} className={card} aria-labelledby={`${group.key}-heading`}>
              <div className={`border-b px-4 py-3 ${hairline}`}>
                <h2
                id={`${group.key}-heading`}
                className={`text-sm font-semibold ${textPrimary}`}>
                
                  {group.title}
                </h2>
                <p className={`text-xs ${textSecondary}`}>{group.blurb}</p>
              </div>
              <ul className="divide-y divide-border dark:divide-border-dark">
                {items.map((notification) => {
                const body =
                <>
                      <div className="flex items-start justify-between gap-3">
                        <p className={`text-xs font-medium ${textPrimary}`}>
                          {notification.title}
                        </p>
                        {!notification.read ?
                    <Badge size="sm" variant="primary" dot>
                            New
                          </Badge> :
                    null}
                      </div>
                      <p className={`mt-0.5 text-[11px] leading-normal ${textSecondary}`}>
                        {notification.detail}
                      </p>
                      <p className={`mt-1 ${mono} text-[10px] ${textSecondary}`}>
                        {relativeDay(notification.date)}
                      </p>
                    </>;

                return (
                  <li key={notification.id}>
                      {notification.agreementId ?
                    <Link
                      to={`/agreements/${notification.agreementId}`}
                      className="block px-4 py-3 transition-colors hover:bg-muted-hover">
                      
                          {body}
                        </Link> :

                    <div className="px-4 py-3">{body}</div>
                    }
                    </li>);

              })}
              </ul>
            </section>);

      })
      }
    </div>);

}
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileTextIcon, PlusIcon } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/Button';
import { SegmentedControl } from '../components/SegmentedControl';
import { Select } from '../components/Select';
import { DataTable } from '../components/DataTable';
import { StatusPill } from '../components/StatusPill';
import { Skeleton } from '../components/Skeleton';
import { AgreementCard } from '../components/agreements/AgreementCard';
import { EmptyState } from '../components/common/EmptyState';
import { useYami } from '../contexts/YamiContext';
import type { Agreement } from '../types/yami';
import {
  ECOSYSTEM_META,
  STATUS_META,
  nextInstalment,
  outstandingAmount } from
'../utils/agreement';
import { dueLabel, formatDate, formatNaira } from '../utils/format';
import { mono, textPrimary, textSecondary } from '../utils/ui';

type DirectionFilter = 'all' | 'lent' | 'borrowed';

const STATUS_OPTIONS = [
{ value: 'all', label: 'All statuses' },
{ value: 'pending', label: 'Pending acceptance' },
{ value: 'active', label: 'Active' },
{ value: 'in_resolution', label: 'In resolution' },
{ value: 'restructured', label: 'Restructured' },
{ value: 'acquired', label: 'Acquired by YAMI' },
{ value: 'in_recovery', label: 'In recovery' },
{ value: 'settled', label: 'Settled' },
{ value: 'declined', label: 'Declined' }];


const ECOSYSTEM_OPTIONS = [
{ value: 'all', label: 'All relationships' },
{ value: 'individual', label: 'Person to person' },
{ value: 'wholesale', label: 'Wholesaler to retailer' },
{ value: 'retail', label: 'Retailer to consumer' }];


export function Agreements() {
  const navigate = useNavigate();
  const { agreements, loading } = useYami();
  const [direction, setDirection] = useState<DirectionFilter>('all');
  const [status, setStatus] = useState('all');
  const [ecosystem, setEcosystem] = useState('all');

  const filtered = useMemo(
    () =>
    agreements.filter((agreement) => {
      if (direction !== 'all' && agreement.direction !== direction) return false;
      if (status !== 'all' && agreement.status !== status) return false;
      if (ecosystem !== 'all' && agreement.ecosystem !== ecosystem) return false;
      return true;
    }),
    [agreements, direction, status, ecosystem]
  );

  const columns = [
  {
    id: 'counterparty',
    header: 'Counterparty',
    cell: (row: Agreement) =>
    <div>
          <p className={`text-sm font-medium ${textPrimary}`}>
            {row.counterparty.name}
          </p>
          <p className={`text-xs ${textSecondary}`}>{row.description}</p>
        </div>,

    sortValue: (row: Agreement) => row.counterparty.name
  },
  {
    id: 'direction',
    header: 'Direction',
    cell: (row: Agreement) =>
    <span className={`text-xs ${textSecondary}`}>
          {row.direction === 'lent' ? 'I lent' : 'I borrowed'} ·{' '}
          {ECOSYSTEM_META[row.ecosystem].short}
        </span>,

    sortValue: (row: Agreement) => row.direction
  },
  {
    id: 'principal',
    header: 'Principal',
    align: 'right' as const,
    cell: (row: Agreement) =>
    <span className={`${mono} text-sm ${textPrimary}`}>
          {formatNaira(row.principal)}
        </span>,

    sortValue: (row: Agreement) => row.principal
  },
  {
    id: 'outstanding',
    header: 'Outstanding',
    align: 'right' as const,
    cell: (row: Agreement) =>
    <span className={`${mono} text-sm font-semibold ${textPrimary}`}>
          {formatNaira(outstandingAmount(row))}
        </span>,

    sortValue: (row: Agreement) => outstandingAmount(row)
  },
  {
    id: 'due',
    header: 'Next due',
    align: 'right' as const,
    cell: (row: Agreement) => {
      const instalment = nextInstalment(row);
      return (
        <span className={`${mono} text-xs ${textSecondary}`}>
            {instalment ? formatDate(instalment.dueDate) : '—'}
          </span>);

    },
    sortValue: (row: Agreement) => nextInstalment(row)?.dueDate ?? ''
  },
  {
    id: 'status',
    header: 'Status',
    cell: (row: Agreement) =>
    <StatusPill status={STATUS_META[row.status].pill} size="sm">
          {STATUS_META[row.status].label}
        </StatusPill>,

    sortValue: (row: Agreement) => row.status
  }];


  return (
    <div className="space-y-4">
      <PageHeader
        title="Agreements"
        description="Everything you have given on credit and everything you have received."
        actions={
        <Button
          leadingIcon={<PlusIcon className="h-4 w-4" />}
          onClick={() => navigate('/agreements/new')}>
          
            New agreement
          </Button>
        }>
        
        <div className="flex flex-col gap-3 pt-3 sm:flex-row sm:items-center">
          <SegmentedControl
            aria-label="Filter by direction"
            options={[
            { value: 'all', label: 'All' },
            { value: 'lent', label: 'I lent' },
            { value: 'borrowed', label: 'I borrowed' }]
            }
            value={direction}
            onChange={(value) => setDirection(value as DirectionFilter)}
            size="sm" />
          
          <div className="flex flex-1 gap-2">
            <Select
              options={STATUS_OPTIONS}
              value={status}
              onChange={setStatus}
              size="sm"
              className="flex-1" />
            
            <Select
              options={ECOSYSTEM_OPTIONS}
              value={ecosystem}
              onChange={setEcosystem}
              size="sm"
              className="flex-1" />
            
          </div>
        </div>
      </PageHeader>

      {loading ?
      <div className="space-y-3">
          <Skeleton variant="rect" height={128} />
          <Skeleton variant="rect" height={128} />
          <Skeleton variant="rect" height={128} />
        </div> :
      filtered.length === 0 ?
      <EmptyState
        icon={<FileTextIcon className="h-5 w-5" />}
        title="No agreements match these filters"
        description="Try a different direction, status or relationship type — or document a new credit relationship."
        action={
        <Button variant="secondary" onClick={() => navigate('/agreements/new')}>
              New agreement
            </Button>
        } /> :


      <>
          <div className="space-y-2.5 lg:hidden">
            {filtered.map((agreement) =>
          <AgreementCard key={agreement.id} agreement={agreement} />
          )}
          </div>
          <div className="hidden lg:block">
            <DataTable
            columns={columns}
            data={filtered}
            getRowId={(row) => row.id}
            pageSize={10}
            caption="All credit agreements"
            onRowClick={(row) => navigate(`/agreements/${row.id}`)}
            emptyTitle="No agreements"
            emptyDescription="Nothing matches the current filters." />
          
          </div>
          <p className={`text-[11px] ${textSecondary}`}>
            {filtered.length} agreement{filtered.length > 1 ? 's' : ''} ·{' '}
            {dueLabel(
            nextInstalment(filtered[0])?.dueDate ?? filtered[0].dueDate
          )}{' '}
            on the first row.
          </p>
        </>
      }
    </div>);

}
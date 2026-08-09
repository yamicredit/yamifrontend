import React, { useState } from 'react';
import { Drawer } from '../Drawer';
import { Button } from '../Button';
import { TextInput } from '../TextInput';
import { Select } from '../Select';
import { Textarea } from '../Textarea';
import type { Agreement } from '../../types/yami';
import { outstandingAmount } from '../../utils/agreement';
import { formatNaira } from '../../utils/format';
import { subtleAccent } from '../../utils/ui';
import type { RestructureInput } from '../../contexts/YamiContext';

interface RestructureDrawerProps {
  agreement: Agreement;
  open: boolean;
  onClose: () => void;
  onSubmit: (input: RestructureInput) => void;
}

const COUNT_OPTIONS = [2, 3, 4, 6, 8].map((count) => ({
  value: String(count),
  label: `${count} payments`
}));

const START_OPTIONS = [
{ value: '7', label: 'In one week' },
{ value: '14', label: 'In two weeks' },
{ value: '30', label: 'In one month' }];


export function RestructureDrawer({
  agreement,
  open,
  onClose,
  onSubmit
}: RestructureDrawerProps) {
  const outstanding = outstandingAmount(agreement);
  const [count, setCount] = useState('4');
  const [start, setStart] = useState('14');
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | undefined>();

  const perPayment = Math.ceil(outstanding / Number(count) / 500) * 500;

  const handleSubmit = () => {
    if (reason.trim().length < 10) {
      setError('Explain the change in a sentence so the other party can decide.');
      return;
    }
    onSubmit({
      newInstalmentAmount: perPayment,
      newInstalmentCount: Number(count),
      firstPaymentInDays: Number(start),
      reason: reason.trim()
    });
    setReason('');
    setError(undefined);
    onClose();
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      side="bottom"
      size="lg"
      title="Propose new terms"
      description={`Spread the ${formatNaira(outstanding)} still outstanding over a schedule that works.`}
      footer={
      <div className="flex gap-2">
          <Button variant="secondary" fullWidth onClick={onClose}>
            Cancel
          </Button>
          <Button fullWidth onClick={handleSubmit}>
            Send proposal
          </Button>
        </div>
      }>
      
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Number of payments"
            options={COUNT_OPTIONS}
            value={count}
            onChange={setCount} />
          
          <Select
            label="First payment"
            options={START_OPTIONS}
            value={start}
            onChange={setStart} />
          
        </div>

        <div className={`rounded-lg px-3.5 py-3 ${subtleAccent}`}>
          <p className="text-xs">New schedule</p>
          <p className="font-mono text-lg font-semibold tabular-nums">
            {count} × {formatNaira(perPayment)}
          </p>
          <p className="mt-0.5 text-[11px]">
            Every two weeks until the balance is cleared.
          </p>
        </div>

        <Textarea
          label="Why are the terms changing?"
          placeholder="e.g. Market was shut for eight days and sales dropped."
          value={reason}
          error={error}
          rows={3}
          onChange={(event) => {
            setReason(event.target.value);
            setError(undefined);
          }} />
        

        <TextInput
          label="Outstanding balance"
          value={formatNaira(outstanding)}
          readOnly
          disabled
          fullWidth
          hint="The amount owed does not change — only the schedule." />
        
      </div>
    </Drawer>);

}
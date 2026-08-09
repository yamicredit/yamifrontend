import React, { useState } from 'react';
import { Drawer } from '../Drawer';
import { Button } from '../Button';
import { TextInput } from '../TextInput';
import { Select } from '../Select';
import type { Agreement, PaymentMethod } from '../../types/yami';
import { outstandingAmount } from '../../utils/agreement';
import { formatNaira } from '../../utils/format';
import { textSecondary } from '../../utils/ui';
import type { RecordPaymentInput } from '../../contexts/YamiContext';

interface RecordPaymentDrawerProps {
  agreement: Agreement;
  open: boolean;
  onClose: () => void;
  onSubmit: (input: RecordPaymentInput) => void;
}

const METHOD_OPTIONS = [
{ value: 'transfer', label: 'Bank transfer' },
{ value: 'cash', label: 'Cash' },
{ value: 'pos', label: 'POS / card' },
{ value: 'goods_return', label: 'Goods returned' }];


export function RecordPaymentDrawer({
  agreement,
  open,
  onClose,
  onSubmit
}: RecordPaymentDrawerProps) {
  const outstanding = outstandingAmount(agreement);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<PaymentMethod>('transfer');
  const [reference, setReference] = useState('');
  const [error, setError] = useState<string | undefined>();

  const reset = () => {
    setAmount('');
    setMethod('transfer');
    setReference('');
    setError(undefined);
  };

  const handleSubmit = () => {
    const value = Number(amount.replace(/[^0-9.]/g, ''));
    if (!value || value <= 0) {
      setError('Enter the amount that was paid.');
      return;
    }
    if (value > outstanding) {
      setError(`That is more than the ${formatNaira(outstanding)} outstanding.`);
      return;
    }
    onSubmit({ amount: value, method, reference: reference || undefined });
    reset();
    onClose();
  };

  return (
    <Drawer
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      side="bottom"
      size="md"
      title="Record a payment"
      description={`${formatNaira(outstanding)} outstanding on ${agreement.reference}`}
      footer={
      <div className="flex gap-2">
          <Button
          variant="secondary"
          fullWidth
          onClick={() => {
            reset();
            onClose();
          }}>
          
            Cancel
          </Button>
          <Button fullWidth onClick={handleSubmit}>
            Record payment
          </Button>
        </div>
      }>
      
      <div className="space-y-4">
        <TextInput
          label="Amount paid"
          required
          inputMode="numeric"
          placeholder="0"
          value={amount}
          error={error}
          onChange={(event) => {
            setAmount(event.target.value);
            setError(undefined);
          }}
          leadingIcon={<span className="text-sm">₦</span>}
          fullWidth />
        
        <Select
          label="How was it paid?"
          options={METHOD_OPTIONS}
          value={method}
          onChange={(value) => setMethod(value as PaymentMethod)} />
        
        <TextInput
          label="Reference (optional)"
          hint="Transfer reference or teller number helps the other party confirm faster."
          placeholder="e.g. GTB/8841203"
          value={reference}
          onChange={(event) => setReference(event.target.value)}
          fullWidth />
        
        <p className={`text-xs leading-normal ${textSecondary}`}>
          YAMI does not move money. The payment is logged here and stays as
          &ldquo;awaiting confirmation&rdquo; until the other party confirms they
          received it.
        </p>
      </div>
    </Drawer>);

}
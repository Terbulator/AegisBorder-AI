import { Modal } from '../ui';

export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirm', danger = false }) {
  return (
    <Modal open={open} onClose={onClose} title={title || 'Confirm Action'}
      footer={
        <>
          <button onClick={onClose} className="btn-secondary text-xs">Cancel</button>
          <button onClick={() => { onConfirm(); onClose(); }}
            className={danger ? 'btn-danger text-xs' : 'btn-primary text-xs'}>
            {confirmLabel}
          </button>
        </>
      }>
      <p className="text-sm text-slate-600">{message || 'Are you sure you want to proceed?'}</p>
    </Modal>
  );
}

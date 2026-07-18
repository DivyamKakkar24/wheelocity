import Dialog, { type DialogProps } from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { type ReactNode } from 'react';

export interface AppDialogProps extends Omit<DialogProps, 'title'> {
  title: string;
  actions?: ReactNode;
  onClose: () => void;
}

/** Project-standard dialog — wraps MUI Dialog with title bar, close button, and actions slot. */
export default function AppDialog({ title, children, actions, onClose, ...rest }: AppDialogProps) {
  return (
    <Dialog onClose={onClose} {...rest}>
      <DialogTitle sx={{ pr: 6 }}>
        {title}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
          size="small"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>{children}</DialogContent>

      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
}

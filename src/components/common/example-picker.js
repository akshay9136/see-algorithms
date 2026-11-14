import { useId, useState } from 'react';
import {
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Popover,
} from '@mui/material';

function ExamplePicker({ examples, onSelect, disabled }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const popoverId = useId();
  const open = Boolean(anchorEl);

  return (
    <>
      <Button
        size="small"
        sx={{ fontWeight: 600 }}
        variant="outlined"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? popoverId : undefined}
        disabled={disabled}
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        Examples
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{
          paper: {
            id: popoverId,
            role: 'dialog',
            'aria-modal': true,
            'aria-label': 'Choose an example',
            sx: { width: 400 },
          },
        }}
      >
        <List sx={{ py: 0 }}>
          {examples.map((example, index) => (
            <ListItem key={example.id} disablePadding>
              <ListItemButton
                autoFocus={open && index === 0}
                disabled={disabled}
                onClick={() => {
                  setAnchorEl(null);
                  onSelect(example);
                }}
              >
                <ListItemText
                  primary={example.name}
                  secondary={example.prompt}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Popover>
    </>
  );
}

export default ExamplePicker;

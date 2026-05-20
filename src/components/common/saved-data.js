import { useState } from 'react';
import {
  Button,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
} from '@mui/material';
import { DeleteOutline, ListAlt } from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import Spinner from '@/components/spinner';

function ListItems(props) {
  const { savedItems, onSelect, onDelete } = props;

  return (
    <List
      sx={{ minWidth: 300 }}
      subheader={
        <ListSubheader sx={{ fontSize: 16 }}>Saved Data Items</ListSubheader>
      }
    >
      {savedItems?.map((item) => (
        <ListItemButton key={item.id} onClick={() => onSelect(item)}>
          <ListItemText primary={new Date(item.createdAt).toLocaleString()} />
          <IconButton onClick={(e) => onDelete(e, item.id)}>
            <DeleteOutline />
          </IconButton>
        </ListItemButton>
      ))}
    </List>
  );
}

export default function SavedDataList({
  loading,
  onSelect,
  deleteItem,
  ...rest
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { data: session } = useSession();

  const handleSelect = (item) => {
    setDrawerOpen(false);
    onSelect(JSON.parse(item.data));
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    deleteItem(id);
  };

  return (
    <div>
      {session && (
        <Button
          onClick={() => setDrawerOpen(true)}
          className="savedDataBtn"
          aria-label="Open Saved Data"
        >
          <ListAlt /> Saved Data
        </Button>
      )}
      {!drawerOpen && <Spinner spinning={loading} />}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ModalProps={{ keepMounted: true }}
      >
        <ListItems {...rest} onSelect={handleSelect} onDelete={handleDelete} />
        <Spinner spinning={loading} />
      </Drawer>
    </div>
  );
}

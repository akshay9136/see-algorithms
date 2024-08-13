import React, { useState } from 'react';
import { Menu, ListItem, ListItemText } from '@mui/material';

export var showMenu = () => {};

function List() {
  const [options, setOptions] = useState({});
  const { anchorEl, anchorOrigin, menuItems, onSelect } = options;
  showMenu = (options) => setOptions(options);

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      keepMounted={false}
      anchorOrigin={anchorOrigin}
      onClose={() => setOptions({})}
    >
      {Array.isArray(menuItems) &&
        menuItems.map((item) => (
          <ListItem
            key={item.value}
            button
            onClick={() => {
              onSelect(item);
              setOptions({});
            }}
          >
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
    </Menu>
  );
}

export default List;

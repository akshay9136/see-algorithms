import React, { useContext } from 'react';
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Category, MeetingRoom } from '@mui/icons-material';
import { useRouter } from 'next/router';
import styles from './sider.module.css';
import { showMenu } from '../menu/menu';
import { Algorithms } from '@/common/constants';
import AppContext from '@/common/context';

function Sider(props) {
  const { categories, userAuth, setContext } = useContext(AppContext);
  const router = useRouter();

  const handleSelect = ({ catname, value }) => {
    const key = catname.split(' ').join('-').toLowerCase();
    router.push(`/${key}/${value}`);
    props.onClose();
  };

  const getMenuOptions = (e) => ({
    anchorEl: e.currentTarget,
    anchorOrigin: { vertical: 'center', horizontal: 'center' },
    onSelect: handleSelect,
  });

  return (
    <List className={styles.sider}>
      {categories.map(({ catname, algorithms }) => (
        <ListItemButton
          key={catname}
          className={styles.listItem}
          onClick={(e) => {
            showMenu({
              ...getMenuOptions(e),
              menuItems: algorithms.map((algoId) => ({
                label: Algorithms[algoId],
                value: algoId,
                catname,
              })),
            });
          }}
        >
          <ListItemIcon>
            <Category className={styles.listItemIcon} />
          </ListItemIcon>
          <ListItemText primary={catname} className={styles.listItemText} />
        </ListItemButton>
      ))}
      {userAuth && (
        <ListItemButton
          className={`${styles.listItem} ${styles.logout}`}
          onClick={() => {
            setContext({ userAuth: null });
            localStorage.removeItem('userAuth');
            props.onClose();
            history.push('/');
          }}
        >
          <ListItemIcon>
            <MeetingRoom className={styles.listItemIcon} />
          </ListItemIcon>
          <ListItemText primary="Logout" className={styles.listItemText} />
        </ListItemButton>
      )}
    </List>
  );
}

export default Sider;

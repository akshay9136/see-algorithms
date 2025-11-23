import { useContext } from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from '@mui/material';
import styles from '@/styles/data-items.module.css';
import AppContext from '@/common/context';
import { createGraph } from '@/helpers/drawGraph';
import { useRouter } from 'next/router';
import { DeleteOutline } from '@mui/icons-material';

function DataItems() {
  const { savedData, setContext } = useContext(AppContext);
  const { pathname } = useRouter();

  const handleSelect = (algoData) => {
    const data = JSON.parse(algoData);
    if (pathname.includes('graph')) {
      createGraph(data);
      setContext({
        isDirGraph: data.directed,
        playStatus: 0,
      });
    }
  };

  const handleRemove = (e, dataId) => {
    e.stopPropagation();
    // removeAlgoData(dataId);
  };

  return (
    <List
      className={styles.dataItems}
      subheader={
        <ListSubheader component="div" className={styles.listHeader}>
          Saved Data Items
        </ListSubheader>
      }
    >
      {savedData.map(({ dataId, algoData, createdOn }) => (
        <ListItem
          button
          key={dataId}
          className={styles.listItem}
          onClick={() => handleSelect(algoData)}
        >
          <ListItemText
            primary={new Date(createdOn + ' UTC').toLocaleString()}
            className={styles.ListItemText}
          />
          <ListItemIcon onClick={(e) => handleRemove(e, dataId)}>
            <DeleteOutline className={styles.deleteIcon} />
          </ListItemIcon>
        </ListItem>
      ))}
    </List>
  );
}

export default DataItems;

import React, { useContext } from 'react';
import { List, ListItemButton } from '@mui/material';
import styles from './sider.module.css';
import { Algorithms } from '@/common/constants';
import AppContext from '@/common/context';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Link from 'next/link';

function Sider({ selected }) {
  const { categories } = useContext(AppContext);

  const getPathname = (catname, algoId) => {
    const category = catname.split(' ').join('-').toLowerCase();
    return `/${category}/${algoId}`;
  };

  return (
    <div className={styles.sider}>
      {categories.map(({ catname, algorithms }) => (
        <Accordion key={catname} disableGutters>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            className={styles.category}
          >
            {catname}
          </AccordionSummary>
          <AccordionDetails>
            <List className="p-0">
              {algorithms.map((algoId) => (
                <ListItemButton
                  key={algoId}
                  component={Link}
                  href={getPathname(catname, algoId)}
                  selected={algoId === selected}
                >
                  {Algorithms[algoId]}
                </ListItemButton>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}

export default Sider;

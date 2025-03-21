import React from 'react';
import { List, ListItemButton } from '@mui/material';
import styles from './sider.module.css';
import { categories } from '@/common/appData';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Link from 'next/link';

function Sider({ selected }) {
  const getPathname = (catname, algoId) => {
    const category = catname.split(' ').join('-').toLowerCase();
    return `/${category}/${algoId}`;
  };

  return (
    <div className={styles.sider}>
      {Object.keys(categories).map((cat) => (
        <Accordion key={cat} disableGutters>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            className={styles.category}
          >
            {cat}
          </AccordionSummary>
          <AccordionDetails>
            <List className="p-0">
              {categories[cat].map(({ id, name }) => (
                <ListItemButton
                  key={id}
                  component={Link}
                  href={getPathname(cat, id)}
                  selected={id === selected}
                >
                  {name}
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

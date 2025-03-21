import React from 'react';
import { List, ListItemButton } from '@mui/material';
import styles from './sider.module.css';
import { algorithms, categories } from '@/common/appData';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Link from 'next/link';

function Sider({ selected }) {
  const algo = algorithms.findObj('id', selected) || {};
  const { category = 'Sorting' } = algo;

  const getPathname = (cat, algoId) => {
    const _cat = cat.split(' ').join('-').toLowerCase();
    return `/${_cat}/${algoId}`;
  };

  return (
    <div className={styles.sider}>
      {Object.keys(categories).map((cat) => (
        <Accordion
          key={cat}
          defaultExpanded={cat === category}
          disableGutters
        >
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

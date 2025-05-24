import React, { useEffect, useState } from 'react';
import { List, ListItemButton, Typography } from '@mui/material';
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
  const [expanded, setExpanded] = useState('');

  const getPathname = (cat, algoId) => {
    const _cat = cat.split(' ').join('-').toLowerCase();
    return `/${_cat}/${algoId}`;
  };

  useEffect(() => {
    if (category) setExpanded(category);
  }, [category]);

  return (
    <div className={styles.sider}>
      {Object.keys(categories).map((cat) => {
        const isExpanded = cat === expanded;
        return (
          <div key={cat} className={styles.accordion}>
            <Accordion
              expanded={isExpanded}
              onChange={() => (isExpanded ? setExpanded('') : setExpanded(cat))}
              disableGutters
              elevation={0}
              sx={{
                boxShadow: 'none',
                background: 'transparent',
                '&:before': { display: 'none' },
              }}
            >
              <AccordionSummary
                expandIcon={
                  <ExpandMoreIcon
                    className={`${styles.expandIcon} ${
                      isExpanded ? styles.expandIconExpanded : ''
                    }`}
                  />
                }
                className={styles.category}
              >
                <Typography variant="button" className={styles.categoryText}>
                  {cat}
                </Typography>
              </AccordionSummary>
              <AccordionDetails className={styles.accordionDetails}>
                <List className={styles.algorithmList}>
                  {categories[cat].map(({ id, name }) => {
                    const isSelected = id === selected;
                    return (
                      <ListItemButton
                        key={id}
                        component={Link}
                        href={getPathname(cat, id)}
                        className={`${styles.listItem} ${
                          isSelected ? styles.listItemSelected : ''
                        }`}
                        disableRipple
                      >
                        <Typography
                          variant="subtitle1"
                          className={styles.algorithmText}
                        >
                          {name}
                        </Typography>
                      </ListItemButton>
                    );
                  })}
                </List>
              </AccordionDetails>
            </Accordion>
          </div>
        );
      })}
    </div>
  );
}

export default Sider;

import { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  ListItemButton,
  List,
  Typography,
} from '@mui/material';
import styles from '@/styles/sider.module.css';
import { algorithms, categories } from '@/common/appData';
import { ExpandMore } from '@mui/icons-material';
import Link from 'next/link';

function Sider({ selected }) {
  const algo = algorithms.findObj('id', selected) || {};
  const { category = 'Sorting' } = algo;
  const [expanded, setExpanded] = useState('');

  const getPathname = (_cat, algoId) => {
    const catId = _cat.split(' ').join('-').toLowerCase();
    return `/${catId}/${algoId}`;
  };

  useEffect(() => {
    if (category) setExpanded(category);
  }, [category]);

  return (
    <div className={styles.sider}>
      {Object.keys(categories).map((category) => {
        const isExpanded = category === expanded;
        return (
          <div key={category} className={styles.accordion}>
            <Accordion
              expanded={isExpanded}
              onChange={() =>
                isExpanded ? setExpanded('') : setExpanded(category)
              }
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
                  <ExpandMore
                    className={`${styles.expandIcon} ${
                      isExpanded ? styles.expandIconExpanded : ''
                    }`}
                  />
                }
                className={styles.category}
                sx={{
                  '& .MuiAccordionSummary-content': {
                    margin: 0,
                  },
                }}
              >
                <Typography variant="subtitle1" className={styles.categoryText}>
                  {category.toUpperCase()}
                </Typography>
              </AccordionSummary>
              <AccordionDetails className={styles.accordionDetails}>
                <List className={styles.algorithmList}>
                  {categories[category].map(({ id, name }) => {
                    const isSelected = id === selected;
                    return (
                      <ListItemButton
                        key={id}
                        component={Link}
                        href={getPathname(category, id)}
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

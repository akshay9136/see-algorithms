import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  ListItemButton,
  List,
  Typography,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { algorithms, categories } from '@/common/appData';
import styles from '@/styles/sider.module.css';
import Link from 'next/link';

function Sider({ selected }) {
  const algo = algorithms.findObj('id', selected) || {};
  const { query } = useRouter();
  const { category = query.category } = algo;
  const [expanded, setExpanded] = useState(category || 'Sorting');

  const getPathname = (_cat, algoId) => {
    const catId = _cat.split(' ').join('-').toLowerCase();
    return `/${catId}/${algoId}`;
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
              onChange={() => {
                isExpanded ? setExpanded('') : setExpanded(cat);
              }}
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
                  {cat.toUpperCase()}
                </Typography>
              </AccordionSummary>

              <AccordionDetails className={styles.accordionDetails}>
                <List className={styles.algorithmList}>
                  {categories[cat].map(({ id, name, path }) => {
                    const isSelected = id === selected;
                    return (
                      <ListItemButton
                        key={id}
                        href={path || getPathname(cat, id)}
                        component={Link}
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

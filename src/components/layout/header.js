import {
  Typography,
  Menu,
  MenuItem,
  IconButton,
  Button,
  Box,
} from '@mui/material';
import {
  MenuOpen,
  Info,
  Policy,
  Description,
  MoreVert,
  Email,
  Favorite,
} from '@mui/icons-material';
import styles from '@/styles/header.module.css';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

const SPONSOR_URL = 'https://github.com/sponsors/akshay9136';

function Header(props) {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const navigate = (path) => {
    router.push(path);
    closeMenu();
  };

  const openLink = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    closeMenu();
  };

  const mdBlock = { xs: 'none', md: 'block' };
  const mdFlex = { xs: 'none', md: 'flex' };
  const mdNone = { md: 'none' };

  return (
    <Box display="flex" className={styles.header}>
      <Box display="flex" alignItems="center">
        <MenuOpen
          onClick={() => props.toggleMenu()}
          className={styles.menuIcon}
          color="primary"
          sx={{ display: mdNone }}
        />
        <Box sx={{ display: mdBlock, height: 40 }}>
          <Image
            src="/logo.png"
            alt="logo"
            priority
            width="200"
            height="40"
            className={styles.logo}
            onClick={() => router.push('/')}
          />
        </Box>
        <Typography
          variant="button"
          fontWeight={600}
          className={styles.heading}
          onClick={() => router.push('/')}
          sx={{ display: mdNone }}
        >
          SEE ALGORITHMS
        </Typography>
      </Box>
      {/* Desktop Navigation */}
      <Box sx={{ display: mdFlex, alignItems: 'center' }}>
        <Button
          onClick={() => navigate('/about')}
          startIcon={<Info />}
          className={styles.navButton}
        >
          About
        </Button>
        <Button
          onClick={() => navigate('/contact')}
          startIcon={<Email />}
          className={styles.navButton}
        >
          Contact
        </Button>
        <Button
          onClick={() => navigate('/privacy')}
          startIcon={<Policy />}
          className={styles.navButton}
        >
          Privacy
        </Button>
        <Button
          onClick={() => navigate('/terms')}
          startIcon={<Description />}
          className={styles.navButton}
        >
          Terms
        </Button>
        <Button
          onClick={() => openLink(SPONSOR_URL)}
          startIcon={<Favorite fontSize="small" />}
          className={styles.navButton}
        >
          Sponsor
        </Button>
      </Box>
      {/* Mobile Navigation - Dropdown Menu */}
      <Box sx={{ display: { md: 'none' } }}>
        <IconButton
          onClick={openMenu}
          size="small"
          sx={{ ml: 1 }}
          aria-controls={open ? 'info-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <MoreVert sx={{ color: 'white' }} />
        </IconButton>
        <Menu
          id="info-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={closeMenu}
          MenuListProps={{
            'aria-labelledby': 'info-button',
          }}
        >
          <MenuItem onClick={() => navigate('/about')}>
            <Info sx={{ mr: 1 }} fontSize="small" />
            About Us
          </MenuItem>
          <MenuItem onClick={() => navigate('/contact')}>
            <Email sx={{ mr: 1 }} fontSize="small" />
            Contact Us
          </MenuItem>
          <MenuItem onClick={() => navigate('/privacy')}>
            <Policy sx={{ mr: 1 }} fontSize="small" />
            Privacy Policy
          </MenuItem>
          <MenuItem onClick={() => navigate('/terms')}>
            <Description sx={{ mr: 1 }} fontSize="small" />
            Terms of Service
          </MenuItem>
          <MenuItem onClick={() => openLink(SPONSOR_URL)}>
            <Favorite sx={{ mr: 1 }} fontSize="small" />
            Sponsor Us
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}

export default Header;

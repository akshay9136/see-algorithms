import React from 'react';
import {
  MenuOpen,
  Info,
  Policy,
  Description,
  MoreVert,
  Email,
} from '@mui/icons-material';
import styles from './header.module.css';
import { useRouter } from 'next/router';
import Image from 'next/image';
import {
  Typography,
  Menu,
  MenuItem,
  IconButton,
  Button,
} from '@mui/material';
import { useState } from 'react';

function Header(props) {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path) => {
    router.push(path);
    handleClose();
  };

  return (
    <div className={`${styles.header} d-flex`}>
      <div className="d-flex align-items-center">
        <MenuOpen
          onClick={() => props.toggleMenu()}
          className={`d-md-none d-sm-block ${styles.menuIcon}`}
          color="primary"
        />
        <Image
          src="/logo.png"
          alt="logo"
          priority
          width="200"
          height="40"
          className={`${styles.logo} d-none d-md-block`}
          onClick={() => router.push('/')}
          style={{ cursor: 'pointer' }}
        />
        <Typography
          variant="button"
          fontWeight={600}
          className={`${styles.heading} d-md-none d-sm-block`}
          onClick={() => router.push('/')}
          style={{ cursor: 'pointer' }}
        >
          SEE ALGORITHMS
        </Typography>
      </div>
      {/* Desktop Navigation */}
      <div className={`d-none d-md-flex align-items-center`}>
        <Button
          onClick={() => handleNavigation('/about')}
          startIcon={<Info />}
          className={styles.navButton}
          sx={{ color: '#1976d2', textTransform: 'none', fontWeight: 500 }}
        >
          About
        </Button>
        <Button
          onClick={() => handleNavigation('/contact')}
          startIcon={<Email />}
          className={styles.navButton}
          sx={{ color: '#1976d2', textTransform: 'none', fontWeight: 500 }}
        >
          Contact
        </Button>
        <Button
          onClick={() => handleNavigation('/privacy')}
          startIcon={<Policy />}
          className={styles.navButton}
          sx={{ color: '#1976d2', textTransform: 'none', fontWeight: 500 }}
        >
          Privacy
        </Button>
        <Button
          onClick={() => handleNavigation('/terms')}
          startIcon={<Description />}
          className={styles.navButton}
          sx={{ color: '#1976d2', textTransform: 'none', fontWeight: 500 }}
        >
          Terms
        </Button>
      </div>

      {/* Mobile Navigation - Dropdown Menu */}
      <div className="d-md-none d-block">
        <IconButton
          onClick={handleClick}
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
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'info-button',
          }}
        >
          <MenuItem onClick={() => handleNavigation('/about')}>
            <Info sx={{ mr: 1 }} fontSize="small" />
            About Us
          </MenuItem>
          <MenuItem onClick={() => handleNavigation('/contact')}>
            <Email sx={{ mr: 1 }} fontSize="small" />
            Contact Us
          </MenuItem>
          <MenuItem onClick={() => handleNavigation('/privacy')}>
            <Policy sx={{ mr: 1 }} fontSize="small" />
            Privacy Policy
          </MenuItem>
          <MenuItem onClick={() => handleNavigation('/terms')}>
            <Description sx={{ mr: 1 }} fontSize="small" />
            Terms of Service
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
}

export default Header;

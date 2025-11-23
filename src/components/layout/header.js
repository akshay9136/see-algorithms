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
} from '@mui/icons-material';
import styles from '@/styles/header.module.css';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

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

  const buttonStyle = {
    color: '#1976d2',
    textTransform: 'none',
    fontWeight: 500,
  };

  return (
    <Box display="flex" className={styles.header}>
      <Box display="flex" alignItems="center">
        <MenuOpen
          onClick={() => props.toggleMenu()}
          className={`d-lg-none ${styles.menuIcon}`}
          color="primary"
        />
        <Image
          src="/logo.png"
          alt="logo"
          priority
          width="200"
          height="40"
          className={`${styles.logo} d-none d-lg-block`}
          onClick={() => router.push('/')}
          style={{ cursor: 'pointer' }}
        />
        <Typography
          variant="button"
          fontWeight={600}
          className={`${styles.heading} d-lg-none`}
          onClick={() => router.push('/')}
          style={{ cursor: 'pointer' }}
        >
          SEE ALGORITHMS
        </Typography>
      </Box>
      {/* Desktop Navigation */}
      <Box className="d-none d-lg-flex" alignItems="center">
        <Button
          onClick={() => handleNavigation('/about')}
          startIcon={<Info />}
          className={styles.navButton}
          sx={buttonStyle}
        >
          About
        </Button>
        <Button
          onClick={() => handleNavigation('/contact')}
          startIcon={<Email />}
          className={styles.navButton}
          sx={buttonStyle}
        >
          Contact
        </Button>
        <Button
          onClick={() => handleNavigation('/privacy')}
          startIcon={<Policy />}
          className={styles.navButton}
          sx={buttonStyle}
        >
          Privacy
        </Button>
        <Button
          onClick={() => handleNavigation('/terms')}
          startIcon={<Description />}
          className={styles.navButton}
          sx={buttonStyle}
        >
          Terms
        </Button>
      </Box>
      {/* Mobile Navigation - Dropdown Menu */}
      <Box className="d-lg-none">
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
      </Box>
    </Box>
  );
}

export default Header;

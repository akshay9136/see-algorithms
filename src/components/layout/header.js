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
  MoreVert,
  AccountBalanceWallet,
  Article,
  DarkMode,
  LightMode,
} from '@mui/icons-material';
import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import AppContext from '@/common/context';
import UserAuth from './user-auth';
import styles from '@/styles/header.module.css';
import Image from 'next/image';

function Header(props) {
  const router = useRouter();
  const { darkMode, toggleDarkMode } = useContext(AppContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => setAnchorEl(null);

  const navigate = (path) => {
    router.push(path);
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
      <Box sx={{ display: mdFlex, alignItems: 'center', gap: 0.5 }}>
        <IconButton
          onClick={toggleDarkMode}
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          size="small"
          sx={{ mr: 1 }}
        >
          {darkMode ? (
            <LightMode fontSize="small" />
          ) : (
            <DarkMode fontSize="small" />
          )}
        </IconButton>
        <Button
          onClick={() => navigate('/articles')}
          startIcon={<Article />}
          className={styles.navButton}
        >
          Articles
        </Button>
        <Button
          onClick={() => navigate('/about')}
          startIcon={<Info />}
          className={styles.navButton}
        >
          About
        </Button>
        <UserAuth />
      </Box>

      {/* Mobile Navigation */}
      <Box sx={{ display: { md: 'none' } }}>
        <IconButton
          id="dark-mode-button"
          onClick={toggleDarkMode}
          size="small"
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          sx={{ mr: 0.5 }}
        >
          {darkMode ? (
            <LightMode sx={{ color: 'white' }} />
          ) : (
            <DarkMode sx={{ color: 'white' }} />
          )}
        </IconButton>
        <IconButton
          id="info-button"
          onClick={openMenu}
          size="small"
          aria-controls={isOpen ? 'info-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={isOpen ? 'true' : undefined}
        >
          <MoreVert sx={{ color: 'white' }} />
        </IconButton>
        <Menu
          id="info-menu"
          anchorEl={anchorEl}
          open={isOpen}
          onClose={closeMenu}
          MenuListProps={{
            'aria-labelledby': 'info-button',
          }}
        >
          <MenuItem onClick={() => navigate('/articles')}>
            <Article sx={{ mr: 1 }} fontSize="small" />
            Articles
          </MenuItem>
          <MenuItem onClick={() => navigate('/buy-credits')}>
            <AccountBalanceWallet sx={{ mr: 1 }} fontSize="small" />
            <Typography>AI Credits</Typography>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}

export default Header;

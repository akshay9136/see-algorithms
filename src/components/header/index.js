import React from 'react';
import { MenuOpen, GitHub } from '@mui/icons-material';
import styles from './header.module.css';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Typography } from '@mui/material';

function Header(props) {
    const router = useRouter();

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
            <div>
                <GitHub
                    onClick={() => {
                        window.location.href =
                            'https://github.com/akshay9136/see-algorithms';
                    }}
                    style={{ cursor: 'pointer' }}
                />
            </div>
        </div>
    );
}

export default Header;

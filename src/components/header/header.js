import React from 'react';
import { MenuOpen, GitHub } from '@mui/icons-material';
import styles from './header.module.css';
import { useRouter } from 'next/router';

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
                <h5
                    className={styles.heading}
                    onClick={() => router.push('/')}
                    style={{ cursor: 'pointer' }}
                >
                    SEE Algorithms
                </h5>
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

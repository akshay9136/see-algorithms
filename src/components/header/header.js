import React from 'react';
import { MenuOpen, GitHub, AcUnit, StrikethroughS } from '@mui/icons-material';
import styles from './header.module.css';
import { useRouter } from 'next/router';

function Header(props) {
    const router = useRouter();

    return (
        <div className={`${styles.header} d-flex`}>
            <div className="d-flex">
                <MenuOpen
                    onClick={() => props.toggleMenu()}
                    className={`d-md-none d-sm-block ${styles.menuIcon}`}
                    color="primary"
                />
                <StrikethroughS fontSize="large" className="me-1" />
                <h4
                    className={styles.heading}
                    onClick={() => router.push('/')}
                    style={{ cursor: 'pointer' }}
                >
                    algorithms
                </h4>
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

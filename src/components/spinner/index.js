import { Backdrop, CircularProgress } from '@mui/material';

function Spinner({ spinning, className, children }) {
    return (
        <div className={className}>
            <Backdrop open={spinning} style={{ zIndex: 100 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
            {children}
        </div>
    );
}

export default Spinner;

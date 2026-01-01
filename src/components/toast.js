import { useState } from 'react';
import { Snackbar } from '@mui/material';
import { Alert } from '@mui/material';

export var showToast = () => {};

function Toast() {
    const [options, setOptions] = useState({});
    const { message, variant } = options;

    showToast = (options) => setOptions(options);

    return (
        <Snackbar
            open={Boolean(message)}
            autoHideDuration={3000}
            onClose={() => setOptions({})}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            {message && (
                <Alert
                    severity={variant}
                    sx={{ fontWeight: 600, fontSize: '1rem' }}
                >
                    {message}
                </Alert>
            )}
        </Snackbar>
    );
}

export default Toast;

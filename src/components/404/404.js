import React from 'react';
import { Button } from '@mui/material';
import { useHistory } from 'react-router-dom';

const PageNotFound = () => {
    const history = useHistory();
    return (
        <div>
            <h1>404</h1>
            <hr />
            <h4>Oops! page not found</h4>
            <br />
            <Button variant="contained" color="primary" onClick={() => history.goBack()}>
                Go Back
            </Button>
        </div>
    );
};

export default PageNotFound;

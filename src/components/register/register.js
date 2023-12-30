import React, { useRef, useState } from 'react';
import { TextField, Button } from '@mui/material';
import { Alert } from '@mui/material';
import { useMutation } from '@apollo/client';
import { Form, FormField } from 'react-form-decorator';
import { showToast } from '../toast/toast';
import Spinner from '../spinner/spinner';
import { REGISTER } from '../../graphql/mutations';
import { Link } from 'react-router-dom';

function Register({ history }) {
    const formRef = useRef(null);
    const [message, setMessage] = useState('');
    const [register, { loading }] = useMutation(REGISTER, {
        onCompleted(data) {
            const { status, message } = data.register;
            if (status) {
                showToast({
                    message: 'A verification link has been sent to your email account.',
                    variant: 'success',
                });
                history.push('/login');
            } else {
                setMessage(message);
            }
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        formRef.current.validateForm().then((values) => {
            const { password2, ...rest } = values;
            register({ variables: rest });
        });
    };

    const comparePassword = (value) => {
        const { input } = formRef.current.formState;
        if (value !== input.password) {
            return ['error', 'Passwords do not match!'];
        }
        return [];
    };

    return (
        <Form
            ref={formRef}
            className="register"
            onSubmit={handleSubmit}
            inputDecorator={(_, { inputEl, status, message }) =>
                React.cloneElement(inputEl, {
                    variant: 'outlined',
                    size: 'small',
                    className: 'formInput',
                    helperText: message,
                    error: status === 'error',
                })
            }
        >
            <Spinner spinning={loading}>
                <p>Sign up to explore new features!</p>
                <FormField name="email" required>
                    {(props) => <TextField type="email" label="Email" {...props} />}
                </FormField>
                <FormField name="password" required>
                    {(props) => <TextField type="password" label="Password" {...props} />}
                </FormField>
                <FormField name="password2" required validate={comparePassword}>
                    {(props) => <TextField type="password" label="Confirm Password" {...props} />}
                </FormField>
                <FormField name="displayName" required>
                    {(props) => <TextField label="Display Name" {...props} />}
                </FormField>
                {message && <Alert severity="error">{message}</Alert>}
                <div className="formFooter">
                    <Button type="submit" variant="contained" color="primary">
                        Sign up
                    </Button>
                    <div>
                        Already have an account? <Link to="/login">Log in</Link>
                    </div>
                </div>
            </Spinner>
        </Form>
    );
}

export default Register;

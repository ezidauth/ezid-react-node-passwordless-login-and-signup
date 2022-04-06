import * as Yup from 'yup';
import { useFormik } from 'formik';
import axios from 'axios';
import { useState } from 'react';

// material
import { Stack, TextField, Typography, Zoom, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------

const baseURL = 'http://localhost:5001';

const LoginForm = () => {
  const [checkEmailText, setCheckEmailText] = useState(false);

  const displayEmailTextHandler = () => {
    setCheckEmailText(!checkEmailText);
  };

  const resetHandler = () => {
    setCheckEmailText(!checkEmailText);
  };

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required')
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      remember: true
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      displayEmailTextHandler();
      submitForm(values);
    }
  });

  const { errors, touched, isSubmitting, setSubmitting, handleSubmit, getFieldProps } = formik;

  const submitForm = (values) => {
    axios
      .post(`${baseURL}/login`, {
        headers: {
          key: 'Content-Type',
          accepts: 'application/json'
        },
        data: {
          email: `${values.email}`
        }
      })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
    setSubmitting(false);
  };

  const form = (
    <Zoom in={!checkEmailText}>
      <form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Email address"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />
        </Stack>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          sx={{ mt: '3rem' }}
        >
          Login
        </LoadingButton>
      </form>
    </Zoom>
  );

  const checkEmailTextElement = (
    <Box>
      <Zoom in={checkEmailText}>
        <Stack spacing={3} display="flex" justifyContent="center" alignItems="center">
          <Typography variant="h3">Check your Email!</Typography>

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            sx={{ mt: '3rem' }}
            onClick={resetHandler}
          >
            Enter details again
          </LoadingButton>
        </Stack>
      </Zoom>
    </Box>
  );

  return <>{checkEmailText ? checkEmailTextElement : form}</>;
};

export default LoginForm;

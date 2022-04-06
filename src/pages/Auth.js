import { motion } from 'framer-motion';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import React, { useEffect, useCallback } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';

// material
import { styled } from '@mui/material/styles';
import { Box, Button, Typography, Container } from '@mui/material';
// components
import { MotionContainer, varBounceIn } from '../components/animate';
import Page from '../components/Page';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10)
}));

// ----------------------------------------------------------------------

export default function Auth() {
  // call Ezid on page load
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  // const callbackURL = urlParams.get("callback_url");
  //   console.log(window.location.origin);
  //   console.log(`the code is: ${code}\n the callback_url is: ${callbackURL}`);
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(['idToken']);

  const clearCookie = () => {
    removeCookie('idToken');
  };

  // Cannot get rid of dependency issues even with useCallback
  const authoriseRequest = useCallback(() => {
    axios
      .post('http://localhost:5001/auth', {
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          auth_code: code
        }
      })
      .then((response) => {
        console.log(response);
        setCookie('idToken', response.data.id_token, {
          path: '/'
        });
        navigate(`/`, { replace: true });
      })
      .catch((error) => {
        console.log(error);
        navigate('/invalid', { replace: true });
      });
  }, [code, navigate, setCookie]);

  useEffect(() => {
    clearCookie();
    authoriseRequest();
  }, [authoriseRequest]);

  return (
    <RootStyle title="Authenticating | PlanetTree">
      <Container>
        <MotionContainer initial="initial" open>
          <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
            <motion.div variants={varBounceIn}>
              <Typography variant="h3" paragraph>
                Just A Moment
              </Typography>
            </motion.div>
            <Typography sx={{ color: 'text.secondary' }}>
              We're authenticating you, sit tight! If you aren't redirected - please click the
              button below
            </Typography>

            <motion.div variants={varBounceIn}>
              <Box
                component="img"
                src="/static/illustrations/illustration_register.png"
                sx={{
                  height: 260,
                  mx: 'auto',
                  my: { xs: 5, sm: 10 },
                  display: 'block',
                  margin: '0 auto'
                }}
              />
            </motion.div>

            <Button to="/" size="large" variant="contained" component={RouterLink}>
              Redirect Me
            </Button>
          </Box>
        </MotionContainer>
      </Container>
    </RootStyle>
  );
}

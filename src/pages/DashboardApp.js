// React, Cookies, Navigation
import React, { useEffect, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import axios from 'axios';

// material
import { Box, Grid, Container, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import {
  AppSurfaceTemperature,
  AppAtmosphericCO2,
  AppSeaLevel,
  AppDailyRainfall,
  AppClimateTimeline,
  AppEmissionsByRegion,
  AppGlobalCO2Emissions,
  AppPollution
} from '../components/_dashboard/app';

// ----------------------------------------------------------------------
const DashboardApp = (props) => {
  const navigate = useNavigate();
  const { cookies } = props;

  useEffect(() => {
    // console.log('The cookie is', cookies.idToken);
    if (cookies.get('idToken') === undefined || cookies.get('idToken') === null) {
      navigate(`/invalid`, { replace: true });
    }

    axios
      .get('http://localhost:5001/home', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer: ${cookies.get('idToken')}`
        }
      })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
        navigate(`/invalid`, { replace: true });
      });
  }, []);

  return (
    <Page title="PlanetTree Dashboard">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Hi, Welcome back</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppDailyRainfall />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppSurfaceTemperature />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppSeaLevel />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppAtmosphericCO2 />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppGlobalCO2Emissions />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppEmissionsByRegion />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppClimateTimeline />
          </Grid>
          <Grid item xs={12} md={6} lg={8}>
            <AppPollution />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default withCookies(DashboardApp);

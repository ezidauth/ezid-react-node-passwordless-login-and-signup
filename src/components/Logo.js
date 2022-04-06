import PropTypes from 'prop-types';
// material
import { Box } from '@mui/material';

import logo from '../images/planet-tree-logo-with-name-removebg-preview.jpg';

// ----------------------------------------------------------------------

Logo.propTypes = {
  sx: PropTypes.object
};

export default function Logo({ sx }) {
  return (
    <Box
      component="img"
      src={logo}
      sx={{
        width: 150,
        height: 85.5,

        ...sx
      }}
    />
  );
}

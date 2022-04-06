import PropTypes from 'prop-types';
import { createContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import { Icon } from '@iconify/react';
import menu2Fill from '@iconify/icons-eva/menu-2-fill';
import jwtDecode from 'jwt-decode';
// material
import { alpha, styled } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar, IconButton } from '@mui/material';
// components
import { MHidden } from '../../components/@material-extend';
//
import Searchbar from './Searchbar';
import AccountPopover from './AccountPopover';
import NotificationsPopover from './NotificationsPopover';

import { accountImage } from '../../_mocks_/accountImage';
import { getRandomColor } from '../../_mocks_/getRandomColor';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;
const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.72),
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`
  }
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5)
  }
}));

// ----------------------------------------------------------------------

DashboardNavbar.propTypes = {
  onOpenSidebar: PropTypes.func
};

const accountInfoContext = createContext({});

function DashboardNavbar(props) {
  const navigate = useNavigate();
  const { cookies, onOpenSidebar } = props;

  useEffect(() => {
    try {
      const decodedToken = jwtDecode(cookies.get('idToken'));
      accountInfoContext.email = decodedToken.email;
      accountInfoContext.firstLetter = decodedToken.email[0].toUpperCase();
      accountInfoContext.imageURL = accountImage(
        50,
        decodedToken.email[0].toUpperCase(),
        getRandomColor()
      ); // generate profile photo
    } catch (err) {
      navigate(`/invalid`, { replace: true });
    }
  }, []);

  return (
    <accountInfoContext.Provider value={accountInfoContext}>
      <RootStyle>
        <ToolbarStyle>
          <MHidden width="lgUp">
            <IconButton onClick={onOpenSidebar} sx={{ mr: 1, color: 'text.primary' }}>
              <Icon icon={menu2Fill} />
            </IconButton>
          </MHidden>

          <Searchbar />
          <Box sx={{ flexGrow: 1 }} />
          <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
            <NotificationsPopover />
            <AccountPopover />
          </Stack>
        </ToolbarStyle>
      </RootStyle>
    </accountInfoContext.Provider>
  );
}

export { accountInfoContext };
export default withCookies(DashboardNavbar);

// import Cookies from 'js-cookie';
// import jwtDecode from 'jwt-decode'; // jwt library having webpack 5.0 issues currently (02/02/2022)
// import { getRandomColor } from './getRandomColor';
// import { accountImage } from './accountImage';
// ----------------------------------------------------------------------

// const decodedToken = jwtDecode(Cookies.get('idToken'));
// const firstLetterofEmail = decodedToken.email[0].toUpperCase();
// const imageURL = accountImage(50, firstLetterofEmail, getRandomColor()); // generate profile photo
// console.log(firstLetterofEmail);

const account = {
  email: 'decodedToken.email',
  photoURL: null,
  firstLetter: 'S'
};

export default account;

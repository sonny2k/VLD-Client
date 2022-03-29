import jwtDecode from 'jwt-decode';
import { verify, sign } from 'jsonwebtoken';
import axios from './axios';

// ----------------------------------------------------------------------

// const isValidToken = (accessToken) => {
//   if (!accessToken) {
//     return false;
//   }

//   // ----------------------------------------------------------------------

//   const decoded = jwtDecode(accessToken);
//   const currentTime = Date.now() / 1000;

//   return decoded.exp > currentTime;
// };


// function HandleTokenExpired() {
//   let expiredTimer;

//   window.clearTimeout(expiredTimer);
//   const timeLeft = 5000;
//   console.log(timeLeft);
//   expiredTimer = window.setTimeout(() => {
//     console.log('expired');
//     setSession(null);
//     window.location.replace('/auth/login')
//   }, timeLeft);
// };

// ----------------------------------------------------------------------

const setSession = (accessToken) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    // This function below will handle when token is expired
    // const { exp } = jwtDecode(accessToken);
    // handleTokenExpired(exp);
  } else {
    localStorage.removeItem('accessToken');
    delete axios.defaults.headers.common.Authorization;
  }
};

export { setSession, verify, sign };

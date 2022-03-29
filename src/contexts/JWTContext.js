import { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
// utils
import axios from '../utils/axios';
import { setSession } from '../utils/jwt';

// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  account: null,
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, account } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      account,
    };
  },
  LOGIN: (state, action) => {
    const { account } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      account,
    };
  },
  UPDATEINFO: (state, action) => {
    const { account } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      account,
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    account: null,
  }),
  REGISTER: (state, action) => {
    const { account } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      account
    };
  },
  CHANGEPASS: (state, action) => {
    const { message } = action.payload;

    return {
      ...state,
      isAuthenticated: false,
      account: null,
      message,
    };
  },
  RESETPASSWORD: (state, action) => {
    const { message } = action.payload;

    return {
      ...state,
      message,
    };
  },
};

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

const AuthContext = createContext({
  ...initialState,
  method: 'jwt',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  sendcode: () => Promise.resolve(),
  verifycode: () => Promise.resolve(),
  createuser: () => Promise.resolve(),
  updateinfo: () => Promise.resolve(),
  changepass: () => Promise.resolve(),
  resetpassword: () => Promise.resolve(),
});

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem('accessToken');

        if (accessToken) {
          setSession(accessToken);

          const response = await axios.get('/api/user/account/info');
          const { account } = response.data;

          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              account,
            },
          });
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              account: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            account: null,
          },
        });
      }
    };

    initialize();
  }, []);

  const login = async (phone, password) => {
    const response = await axios.post('/api/user/auth/login', {
      phone,
      password,
    });
    const { accessToken, account } = response.data;
    setSession(accessToken);
    dispatch({
      type: 'LOGIN',
      payload: {
        account,
      },
    });
  };

  const updateinfo = async (fname, lname, email, birthday, gender, city, district, ward, street) => {
    const response = await axios.put('/api/user/account/info', {
      fname, lname, email, birthday, gender, city, ward, district, street
    });
    const { account } = response.data;
    dispatch({
      type: 'UPDATEINFO',
      payload: {
        account,
      },
    });
  };

  const changepass = async (password, newpass) => {
    const response = await axios.post('/api/user/changepassword', {
      password, newpass
    });
    const { message } = response.data;
    setSession(null);
    dispatch({
      type: 'CHANGEPASS',
      payload: {
        message,
      },
    });
  };

  const register = async (profilepic, birthday, gender, email, phone, password, fname, lname, city, district, ward, street, role) => {
    const response = await axios.post('/api/user/auth/register', {
      profilepic, 
      birthday, 
      gender, 
      email,
      phone,
      password,
      city, 
      district, 
      ward, 
      street,
      fname,
      lname,
      role,
    });
    const { accessToken, account } = response.data;
    await setSession(accessToken);
    // await axios.post('/api/user/auth/createuser', {
    //   id,
    // });
    dispatch({
      type: 'REGISTER',
      payload: {
        account,
      },
    });
  };

  const logout = async () => {
    setSession(null);
    dispatch({ type: 'LOGOUT' });
  };

  const resetpassword = async ( phone, newpassword ) => {
    const response = await axios.post('/api/user/auth/resetpassword', {
      phone,
      newpassword,
    });
    const { mess } = response.data;

    dispatch({
      type: 'RESETPASSWORD',
      payload: {
        mess,
      },
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
        register,
        updateinfo,
        changepass,
        resetpassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
  }

export { AuthContext, AuthProvider };

import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  uses: [],
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET MEDICINES
    getUserSuccess(state, action) {
      const uses = action.payload;
      state.isLoading = false;
      state.uses = uses;
    },
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getUse() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/admin/user/viewUser');
      dispatch(slice.actions.getUserSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ---------------------------------------------------------------------

import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  docdetail: {},
};

const slice = createSlice({
  name: 'doctordetail',
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
    getDoctorDetailSuccess(state, action) {
      const docdetail = action.payload;

      state.isLoading = false;
      state.docdetail = docdetail;
    },
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getDocDetail() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/doctor/account/info');
      dispatch(slice.actions.getDoctorDetailSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ---------------------------------------------------------------------

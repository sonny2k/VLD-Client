import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  sups: [],
};

const slice = createSlice({
  name: 'supplier',
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
    getSupplierSuccess(state, action) {
      const sups = action.payload;
      state.isLoading = false;
      state.sups = sups;
    },
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getSupplier() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/admin/supplier/viewSupplier');
      dispatch(slice.actions.getSupplierSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ---------------------------------------------------------------------

import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  productcates: [],
};

const slice = createSlice({
  name: 'productcate',
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
    getProductSuccess(state, action) {
      const productcates = action.payload;
      state.isLoading = false;
      state.productcates = productcates;
    },
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getProductcate() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/admin/product/viewProductCategory');
      dispatch(slice.actions.getProductSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ---------------------------------------------------------------------

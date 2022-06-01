import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  departs: [],
};

const slice = createSlice({
  name: 'department',
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
    getDepartSuccess(state, action) {
      const departs = action.payload;
      state.isLoading = false;
      state.departs = departs;
    },
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getDepart() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/admin/department/viewListDepartment');
      dispatch(slice.actions.getDepartSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ---------------------------------------------------------------------

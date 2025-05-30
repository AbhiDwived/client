import { createSlice } from '@reduxjs/toolkit';

// Load vendor from localStorage if available
const loadVendorFromStorage = () => {
  const vendorStr = localStorage.getItem('vendor');
  return vendorStr ? JSON.parse(vendorStr) : null;
};

const initialState = {
  vendor: loadVendorFromStorage(),
  token: localStorage.getItem('vendorToken') || null,
  isAuthenticated: !!localStorage.getItem('vendorToken'),
  loading: false,
  error: null,
};

const vendorSlice = createSlice({
  name: 'vendor',
  initialState,
  reducers: {
    setVendorCredentials: (state, action) => {
      let { token, vendor } = action.payload;

      // Ensure the vendor object always has role: 'vendor'
      if (vendor && vendor.role !== 'vendor') {
        vendor = { ...vendor, role: 'vendor' };
      }

      state.token = token;
      state.vendor = vendor;
      state.isAuthenticated = true;

      localStorage.setItem('vendorToken', token);
      localStorage.setItem('vendor', JSON.stringify(vendor));
    },
    logoutVendor: (state) => {
      state.vendor = null;
      state.token = null;
      state.isAuthenticated = false;

      localStorage.removeItem('vendorToken');
      localStorage.removeItem('vendor');
    },
    clearVendorError: (state) => {
      state.error = null;
    },
  },
});

export const { setVendorCredentials, logoutVendor, clearVendorError } = vendorSlice.actions;

export default vendorSlice.reducer;
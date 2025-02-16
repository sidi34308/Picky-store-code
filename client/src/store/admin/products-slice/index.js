import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
axios.defaults.withCredentials = true; // to allow axios send cookie data
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const initialState = {
  isLoading: false,
  productList: [],
};

export const addNewProduct = createAsyncThunk(
  "/products/addnewproduct",
  async (formData) => {
    console.log(formData, "formData");
    const result = await axios.post(
      `${API_BASE_URL}/api/admin/products/add`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return result?.data;
  }
);

export const fetchAllProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async () => {
    const result = await axios.get(`${API_BASE_URL}/api/admin/products/get`);

    return result?.data;
  }
);

export const editProduct = createAsyncThunk(
  "/products/editProduct",
  async ({ id, formData }) => {
    const result = await axios.put(
      `${API_BASE_URL}/api/admin/products/edit/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return result?.data;
  }
);

export const deleteProduct = createAsyncThunk(
  "/products/deleteProduct",
  async (id) => {
    const result = await axios.delete(
      `${API_BASE_URL}/api/admin/products/delete/${id}`
    );

    return result?.data;
  }
);
export const toggleProductVisibility = createAsyncThunk(
  "adminProducts/toggleProductVisibility",
  async ({ id, hidden }, { rejectWithValue }) => {
    try {
      console.log(
        `Toggling visibility for product ID: ${id}, hidden: ${hidden}`
      );
      const response = await axios.patch(
        `${API_BASE_URL}/api/admin/products/${id}/visibility`, // Ensure the correct API path
        { hidden }
      );
      console.log("Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error toggling product visibility:", error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);

const AdminProductsSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.productList = [];
      })
      .addCase(toggleProductVisibility.fulfilled, (state, action) => {
        const updatedProduct = action.payload.data; // Use data from response
        console.log("Updated product:", updatedProduct);
        const index = state.productList.findIndex(
          (product) => product._id === updatedProduct._id // Use _id instead of id
        );
        if (index !== -1) {
          state.productList[index].hidden = updatedProduct.hidden;
        }
      });
  },
});

export default AdminProductsSlice.reducer;

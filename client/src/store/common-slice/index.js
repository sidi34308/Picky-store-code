import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"; // Ensure fallback to localhost

export const addFeatureImage = createAsyncThunk(
  "common/addFeatureImage",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/common/feature/add`, // Ensure the correct endpoint
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set the correct content type
          },
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getFeatureImages = createAsyncThunk(
  "common/getFeatureImages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/common/feature/get`
      );
      console.log("Feature images fetched:", response.data.data); // Debugging: Check the response
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteFeatureImage = createAsyncThunk(
  "common/deleteFeatureImage",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/common/feature/delete/${id}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const commonSlice = createSlice({
  name: "commonFeature",
  initialState: {
    featureImageList: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addFeatureImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFeatureImage.fulfilled, (state, action) => {
        state.loading = false;
        state.featureImageList.push(action.payload);
      })
      .addCase(addFeatureImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getFeatureImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeatureImages.fulfilled, (state, action) => {
        state.loading = false;
        state.featureImageList = action.payload;
      })
      .addCase(getFeatureImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteFeatureImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFeatureImage.fulfilled, (state, action) => {
        state.loading = false;
        state.featureImageList = state.featureImageList.filter(
          (image) => image._id !== action.meta.arg
        );
      })
      .addCase(deleteFeatureImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default commonSlice.reducer;

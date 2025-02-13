import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ...existing code...

export const getFeatureImages = createAsyncThunk(
  "common/getFeatureImages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/admin/products/feature-images"
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addFeatureImage = createAsyncThunk(
  "common/addFeatureImage",
  async (file, { rejectWithValue }) => {
    try {
      const data = new FormData();
      data.append("file", file);
      const response = await axios.post(
        "http://localhost:5000/api/admin/products/upload-feature-image",
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteFeatureImage = createAsyncThunk(
  "common/deleteFeatureImage",
  async (key, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/products/delete-feature-image",
        { key }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// ...existing code...

const commonSlice = createSlice({
  name: "common",
  initialState: {
    featureImageList: [],
    // ...existing code...
  },
  reducers: {
    // ...existing code...
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeatureImages.fulfilled, (state, action) => {
        state.featureImageList = action.payload;
      })
      .addCase(addFeatureImage.fulfilled, (state, action) => {
        state.featureImageList.push(action.payload);
      })
      .addCase(deleteFeatureImage.fulfilled, (state, action) => {
        state.featureImageList = state.featureImageList.filter(
          (image) => image.key !== action.payload.key
        );
      });
  },
});

export const { actions, reducer } = commonSlice;
export default reducer;
// export { getFeatureImages, addFeatureImage, deleteFeatureImage };

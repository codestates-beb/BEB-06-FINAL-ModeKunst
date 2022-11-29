import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import axios from "axios";

export const adminLogin = createAsyncThunk(
  "admin/login",
  async (data, thunkAPI) => {
    try {
      const result = await axios.post(
        "http://localhost:8000/admin/login",
        {
          email: data.email,
          password: data.password,
        },
        { withCredentials: true }
      );
      Swal.fire({
        icon: "success",
        text: `${result.data.message}`,
      });
      return result.data.data;
    } catch (error) {
      Swal.fire({
        icon: "warning",
        text: "다시 시도해주세요.",
      });
      alert(error.response.data.message);
    }
  }
);

export const adminLogout = createAsyncThunk("admin/logout", async () => {
  await axios.get("http://localhost:8000/admin/logout", {
    withCredentials: true,
  });
});

const initialAdminState = {
  isAdmin: false,
  nickname: "",
  email: "",
};

export const AdminState = createSlice({
  name: "admin",
  initialState: initialAdminState,
  extraReducers: builder => {
    builder
      .addCase(adminLogin.fulfilled, (state, action) => {
        const adminData = action.payload;
        state.isAdmin = true;
        state.nickname = adminData.nickname;
        state.email = adminData.email;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.ErrorReasion = action.error;
      })
      .addCase(adminLogout.fulfilled, (state, action) => {
        state.nickname = "";
        state.email = "";
        state.isAdmin = false;
      })
      .addCase(adminLogout.rejected, (state, action) => {
        state.ErrorReasion = action.error;
      });
  },
});

export default AdminState.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const login = createAsyncThunk("users/login", async (data, thunkAPI) => {
  const result = await axios.post("http://localhost:8000/users/login", {
    email: data.email,
    password: data.password,
  }, { withCredentials: true });
  return result.data.data;
});

export const logout = createAsyncThunk("users/logout", async () => {
  await axios.get("http://localhost:8000/users/logout", { withCredentials: true });
});

const initialUserState = {
  userInfo: {
    email: "",
    address: "",
    gender: "",
    height: "",
    nickname: "",
    phone_number: "",
    profile_img: "",
    sns_url: "",
    token_amount: "",
    weight: "",
  },
  isLoggedIn: false,
};

export const userState = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state, action) => {
        console.log(action);
      })
      .addCase(login.fulfilled, (state, action) => {
        const userData = action.payload;
        state.userInfo.id = userData.id;
        state.userInfo.address = userData.address;
        state.userInfo.email = userData.email;
        state.userInfo.gender = userData.gender;
        state.userInfo.height = userData.height;
        state.userInfo.nickname = userData.nickname;
        state.userInfo.phone_number = userData.phone_number;
        state.userInfo.profile_img = userData.profile_img;
        state.userInfo.sns_url = userData.sns_url;
        state.userInfo.token_amount = userData.token_amount;
        state.userInfo.weight = userData.weight;
        state.isLoggedIn = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.ErrorReasion = action.error;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.userInfo = initialUserState.userInfo;
        state.isLoggedIn = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.ErrorReasion = action.error;
      });
  },
});

export default userState.reducer;

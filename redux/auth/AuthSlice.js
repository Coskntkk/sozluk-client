import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { errorNote, successNote } from "@/utils/ToastNotify";
import { decodeToken, isExpired } from 'react-jwt';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const initialState = {
  user: {},
  roleName: "",
  isAuthenticated: false,
  loading: false,
};

export const register = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const resp = await axios.post(`${apiUrl}/auth/register`, {
        ...userData
      });
      if (resp.status === 200) {
        const { x_refresh_token, x_access_token } = resp.headers
        localStorage.setItem("token", x_access_token);
        localStorage.setItem("reftoken", x_refresh_token);
        return resp.data;
      } else {
        return thunkAPI.rejectWithValue("auth failed");
      }
    } catch (err) {
      errorNote(err.response.data.message);
      return thunkAPI.rejectWithValue("something went wrong");
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (data, thunkAPI) => {
    try {
      const resp = await axios.post(`${apiUrl}/auth/login`, data);
      if (resp.status === 200) {
        const { refresh_token, access_token } = resp.data
        localStorage.setItem("token", access_token);
        localStorage.setItem("reftoken", refresh_token);
        const userdata = decodeToken(access_token)
        return userdata;
      } else {
        return thunkAPI.rejectWithValue("auth failed");
      }
    } catch (err) {
      errorNote(err.response.data.message);
      return thunkAPI.rejectWithValue("something went wrong");
    }
  }
);

export const checkLogin = createAsyncThunk(
  "auth/checkLogin",
  async (data, thunkAPI) => {
    try {
      const access_token = localStorage.getItem("token");
      if (!access_token)
        return thunkAPI.rejectWithValue("auth failed");
      const userdata = decodeToken(access_token)
      if (!userdata)
        return thunkAPI.rejectWithValue("auth failed");
      return userdata;
    } catch (err) {
      errorNote(err.response.data.message);
      return thunkAPI.rejectWithValue("something went wrong");
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (data, thunkAPI) => {
    const { navigate } = data;

    await axios
      .post(`${apiUrl}/auth/logout`, {
        token: localStorage.getItem("token"),
      })
      .then((res) => {
        if (res.status === 200) {
          localStorage.clear();
          navigate("/login");
          successNote(res.data.message);
        }
      })
      .catch((err) => {
        navigate("/login");
        localStorage.clear();
        return thunkAPI.rejectWithValue("something went wrong");
      });
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuth: (state) => {
      state.user = {};
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (store) => {
      store.loading = true
    });
    builder.addCase(login.fulfilled, (store, { payload }) => {
      store.user = payload.user;
      store.isAuthenticated = true;
      store.loading = false;
    });
    builder.addCase(login.rejected, (store, { payload }) => {
      store.user = {};
      store.isAuthenticated = false;
      store.loading = false;
    });
    builder.addCase(checkLogin.fulfilled, (store, { payload }) => {
      store.user = payload.user;
      store.isAuthenticated = true;
      store.loading = false;
    });
    builder.addCase(checkLogin.rejected, (store, { payload }) => {
      store.user = {};
      store.isAuthenticated = false;
      store.loading = false;
    });
  }
});

export const { clearAuth, setUser } = authSlice.actions;

export default authSlice.reducer;

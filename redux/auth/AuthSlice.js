import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AuthService from "@/services/AuthService";
import { errorNote, successNote } from "@/utils/ToastNotify";

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
      const resp = await AuthService.register(userData);
      if (resp.status === 200) {
        successNote(resp.data.message);
        return resp.data;
      }
      return thunkAPI.rejectWithValue("auth failed");
    } catch (err) {
      errorNote(err.response?.data?.message ?? "Something went wrong");
      return thunkAPI.rejectWithValue("something went wrong");
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (data, thunkAPI) => {
    try {
      const resp = await AuthService.login(data);
      const user = AuthService.getUserFromResponse(resp);
      if (!user) {
        return thunkAPI.rejectWithValue("auth failed");
      }
      return { user };
    } catch (err) {
      errorNote(err.response?.data?.message ?? "Something went wrong");
      return thunkAPI.rejectWithValue("something went wrong");
    }
  }
);

export const checkLogin = createAsyncThunk(
  "auth/checkLogin",
  async (_data, thunkAPI) => {
    try {
      const resp = await AuthService.getMe();
      const user = AuthService.getUserFromResponse(resp);
      if (!user) {
        return thunkAPI.rejectWithValue("auth failed");
      }
      return { user };
    } catch {
      return thunkAPI.rejectWithValue("auth failed");
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (data, thunkAPI) => {
    const { navigate } = data;
    try {
      await AuthService.logout();
    } catch {
      // clear session even if logout request fails
    } finally {
      navigate.push("/auth/login");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuth: (state) => {
      state.user = {};
      state.isAuthenticated = false;
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
    builder.addCase(login.rejected, (store) => {
      store.user = {};
      store.isAuthenticated = false;
      store.loading = false;
    });
    builder.addCase(checkLogin.fulfilled, (store, { payload }) => {
      store.user = payload.user;
      store.isAuthenticated = true;
      store.loading = false;
    });
    builder.addCase(checkLogin.rejected, (store) => {
      store.user = {};
      store.isAuthenticated = false;
      store.loading = false;
    });
    builder.addCase(logout.fulfilled, (store) => {
      store.user = {};
      store.isAuthenticated = false;
      store.loading = false;
    });
  }
});

export const { clearAuth, setUser } = authSlice.actions;

export default authSlice.reducer;

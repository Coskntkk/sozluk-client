import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { errorNote, successNote } from "../../utils/ToastNotify";
const apiUrl = process.env.REACT_APP_API_URL;
const initialState = {
  user: {},
  roleName: "",
  loading: false,
};

export const login = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    const { userInfo } = userData;

    try {
      const resp = await axios.post(`${apiUrl}/auth/login`, {
        userInfo,
      });

      if (resp.status === 200) {
        const { refresh_token, access_token } = resp.headers
        console.log(resp.headers);
        localStorage.setItem("token", access_token);
        localStorage.setItem("reftoken", refresh_token);
        // successNote(resp.data.message);

        return resp.data;
      }
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
  extraReducers: {
    [login.pending]: (state, action) => {
      state.loading = true;
    },
    [login.fulfilled]: (state, action) => {
      state.user = action.payload.user;
      state.loading = false;
    },
    [login.rejected]: (state, action) => {
      state.user = {};
      state.loading = false;
      state.error = action.payload;
    },
    [logout.fulfilled]: (state, action) => {
      state.user = {};
    },
  },
});

export const { clearAuth, setUser } = authSlice.actions;

export default authSlice.reducer;

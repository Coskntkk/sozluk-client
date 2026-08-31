import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import AuthService from '@/services/AuthService';
import { getAccessToken, clearAccessToken } from '@/services/TokenService';
import { errorNote, successNote } from '@/utils/ToastNotify';
import { User, RegisterDto, LoginDto } from '@/types';

export interface AuthState {
  user: User | null;
  roleId: number | null;
  roleName: string;
  isAuthenticated: boolean;
  isInitialized: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  roleId: null,
  roleName: '',
  isAuthenticated: false,
  isInitialized: false,
  loading: false,
};

export const register = createAsyncThunk(
  'auth/register',
  async (userData: RegisterDto, thunkAPI) => {
    try {
      const resp = await AuthService.register(userData);
      successNote(resp?.data?.message || 'Registered successfully');
      // If backend logs in immediately or returns user, fetch me
      const meResp = await AuthService.getMe();
      const user = AuthService.getUserFromResponse(meResp);
      if (user) {
        return { user };
      }
      return { user: null };
    } catch (err: any) {
      const msg = err.response?.data?.message ?? 'Registration failed';
      errorNote(msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (data: LoginDto, thunkAPI) => {
    try {
      const resp = await AuthService.login(data);
      const user = AuthService.getUserFromResponse(resp);
      if (!user) {
        return thunkAPI.rejectWithValue('Authentication failed');
      }
      successNote('Logged in successfully');
      return { user };
    } catch (err: any) {
      const msg = err.response?.data?.message ?? 'Invalid credentials';
      errorNote(msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const checkLogin = createAsyncThunk(
  'auth/checkLogin',
  async (_data: void, thunkAPI) => {
    try {
      let token = getAccessToken();
      if (!token) {
        try {
          const refreshResp = await AuthService.refresh();
          token =
            refreshResp?.data?.data?.accessToken ||
            refreshResp?.data?.accessToken ||
            refreshResp?.data?.token ||
            getAccessToken();
        } catch {
          return thunkAPI.rejectWithValue('No active session');
        }
      }

      if (!token) {
        return thunkAPI.rejectWithValue('No active session');
      }

      const resp = await AuthService.getMe();
      const user = AuthService.getUserFromResponse(resp);
      if (!user) {
        return thunkAPI.rejectWithValue('No active session');
      }
      return { user };
    } catch (err) {
      clearAccessToken();
      return thunkAPI.rejectWithValue('Session expired');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (data?: { router?: any }, _thunkAPI?: any) => {
    try {
      await AuthService.logout();
    } catch {
      // Continue cleanup regardless of server response
    } finally {
      clearAccessToken();
      if (data?.router) {
        data.router.push('/auth/login');
      }
    }
  }
);

const getRoleName = (roleId?: number | null, roleObj?: any): string => {
  if (roleObj && typeof roleObj === 'object' && roleObj.name) return roleObj.name;
  if (typeof roleObj === 'string') return roleObj;
  switch (roleId) {
    case 1:
      return 'Rookie';
    case 2:
      return 'Author';
    case 3:
      return 'Moderator';
    case 4:
      return 'Admin';
    default:
      return 'Guest';
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuth: (state) => {
      state.user = null;
      state.roleId = null;
      state.roleName = 'Guest';
      state.isAuthenticated = false;
      state.isInitialized = true;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      const user = action.payload;
      state.user = user;
      state.roleId = user?.roleId ?? null;
      state.roleName = user ? getRoleName(user.roleId, user.role) : 'Guest';
      state.isAuthenticated = !!user;
      state.isInitialized = true;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(login.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(login.fulfilled, (state, { payload }) => {
      state.user = payload.user;
      state.roleId = payload.user?.roleId ?? null;
      state.roleName = getRoleName(payload.user?.roleId, payload.user?.role);
      state.isAuthenticated = true;
      state.isInitialized = true;
      state.loading = false;
    });
    builder.addCase(login.rejected, (state) => {
      state.user = null;
      state.roleId = null;
      state.roleName = 'Guest';
      state.isAuthenticated = false;
      state.isInitialized = true;
      state.loading = false;
    });

    // Check Login
    builder.addCase(checkLogin.fulfilled, (state, { payload }) => {
      state.user = payload.user;
      state.roleId = payload.user?.roleId ?? null;
      state.roleName = getRoleName(payload.user?.roleId, payload.user?.role);
      state.isAuthenticated = true;
      state.isInitialized = true;
      state.loading = false;
    });
    builder.addCase(checkLogin.rejected, (state) => {
      state.user = null;
      state.roleId = null;
      state.roleName = 'Guest';
      state.isAuthenticated = false;
      state.isInitialized = true;
      state.loading = false;
    });

    // Register
    builder.addCase(register.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(register.fulfilled, (state, { payload }) => {
      if (payload.user) {
        state.user = payload.user;
        state.roleId = payload.user?.roleId ?? null;
        state.roleName = getRoleName(payload.user?.roleId, payload.user?.role);
        state.isAuthenticated = true;
      }
      state.isInitialized = true;
      state.loading = false;
    });
    builder.addCase(register.rejected, (state) => {
      state.loading = false;
      state.isInitialized = true;
    });

    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.roleId = null;
      state.roleName = 'Guest';
      state.isAuthenticated = false;
      state.isInitialized = true;
      state.loading = false;
    });
  },
});

export const { clearAuth, setUser } = authSlice.actions;
export default authSlice.reducer;

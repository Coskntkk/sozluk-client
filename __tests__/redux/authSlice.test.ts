import authReducer, {
  clearAuth,
  setUser,
  AuthState,
} from '@/redux/auth/AuthSlice';
import { User } from '@/types';

describe('authSlice Reducer', () => {
  const initialState: AuthState = {
    user: null,
    roleId: null,
    roleName: '',
    isAuthenticated: false,
    isInitialized: false,
    loading: false,
  };

  it('should return initial state when passed an empty action', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setUser with an Admin user', () => {
    const mockUser: User = {
      id: 1,
      username: 'coskun',
      email: 'coskun@example.com',
      roleId: 4,
      createdAt: '2026-08-30T10:00:00Z',
    };

    const nextState = authReducer(initialState, setUser(mockUser));

    expect(nextState.isAuthenticated).toBe(true);
    expect(nextState.isInitialized).toBe(true);
    expect(nextState.user).toEqual(mockUser);
    expect(nextState.roleId).toBe(4);
    expect(nextState.roleName).toBe('Admin');
  });

  it('should handle setUser with a Rookie user', () => {
    const mockUser: User = {
      id: 2,
      username: 'newbie',
      email: 'newbie@example.com',
      roleId: 1,
      createdAt: '2026-08-30T10:00:00Z',
    };

    const nextState = authReducer(initialState, setUser(mockUser));

    expect(nextState.isAuthenticated).toBe(true);
    expect(nextState.roleName).toBe('Rookie');
  });

  it('should handle clearAuth', () => {
    const loggedInState: AuthState = {
      user: { id: 1, username: 'coskun', email: 'coskun@example.com', roleId: 4, createdAt: '2026-08-30T10:00:00Z' },
      roleId: 4,
      roleName: 'Admin',
      isAuthenticated: true,
      isInitialized: true,
      loading: false,
    };

    const nextState = authReducer(loggedInState, clearAuth());

    expect(nextState.isAuthenticated).toBe(false);
    expect(nextState.user).toBeNull();
    expect(nextState.roleId).toBeNull();
    expect(nextState.roleName).toBe('Guest');
  });
});

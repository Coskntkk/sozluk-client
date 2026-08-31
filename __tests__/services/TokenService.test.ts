import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from '@/services/TokenService';

describe('TokenService', () => {
  beforeEach(() => {
    clearAccessToken();
    localStorage.clear();
  });

  it('should set and get access token in memory', () => {
    setAccessToken('test-jwt-token');
    expect(getAccessToken()).toBe('test-jwt-token');
  });

  it('should clear access token from memory and localStorage', () => {
    setAccessToken('token-to-clear');
    expect(getAccessToken()).toBe('token-to-clear');

    clearAccessToken();
    expect(getAccessToken()).toBeNull();
    expect(localStorage.getItem('accessToken')).toBeNull();
  });

  it('should fallback to localStorage if in-memory token is empty', () => {
    localStorage.setItem('accessToken', 'stored-local-token');
    expect(getAccessToken()).toBe('stored-local-token');
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/redux/auth/AuthSlice';
import UserComponent from '@/components/User/User';
import { UserProfile } from '@/types';

const createMockStore = (initialAuthState?: any) => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        user: null,
        roleId: null,
        roleName: 'Guest',
        isAuthenticated: false,
        isInitialized: true,
        loading: false,
        ...initialAuthState,
      },
    },
  });
};

describe('UserComponent', () => {
  const mockAdminProfile: UserProfile = {
    id: 1,
    username: 'coskun',
    email: 'coskun@example.com',
    roleId: 4,
    role: { id: 4, name: 'Admin' },
    bio: 'Platform Creator & Admin',
    entryCount: 42,
    followerCount: 15,
    followingCount: 3,
    createdAt: '2024-01-01T00:00:00.000Z',
  };

  it('renders user profile with Admin badge', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <UserComponent
          username="coskun"
          initialProfile={mockAdminProfile}
          initialEntries={[]}
        />
      </Provider>
    );

    expect(screen.getByText('coskun')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('Platform Creator & Admin')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders Rookie role badge correctly', () => {
    const store = createMockStore();
    const rookieProfile: UserProfile = {
      ...mockAdminProfile,
      id: 2,
      username: 'newbie_user',
      roleId: 1,
      role: { id: 1, name: 'Rookie' },
    };

    render(
      <Provider store={store}>
        <UserComponent
          username="newbie_user"
          initialProfile={rookieProfile}
          initialEntries={[]}
        />
      </Provider>
    );

    expect(screen.getByText('newbie_user')).toBeInTheDocument();
    expect(screen.getByText('Rookie')).toBeInTheDocument();
  });

  it('renders dual tabs for authored and voted entries', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <UserComponent
          username="coskun"
          initialProfile={mockAdminProfile}
          initialEntries={[]}
        />
      </Provider>
    );

    expect(screen.getByText(/Authored Entries/)).toBeInTheDocument();
    expect(screen.getByText(/Voted Entries/)).toBeInTheDocument();
  });
});

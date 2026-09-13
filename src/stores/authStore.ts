import { create } from 'zustand';
import { UserSummary, AuthResponse } from '../types/domain';

interface AuthState {
  user: UserSummary | null;
  token: string | null;
  refreshToken: string | null;
  activeCampus: string;
  activeAcademicYear: string;
  setAuth: (data: AuthResponse) => void;
  logout: () => void;
  setActiveCampus: (campus: string) => void;
  setActiveAcademicYear: (year: string) => void;
}

const storedUser = localStorage.getItem('edusuite_user');
const initialUser: UserSummary | null = storedUser ? JSON.parse(storedUser) : null;
const initialToken = localStorage.getItem('edusuite_token');
const initialRefreshToken = localStorage.getItem('edusuite_refresh_token');

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  token: initialToken,
  refreshToken: initialRefreshToken,
  activeCampus: 'Apex Tech Campus (Engineering & Higher Ed)',
  activeAcademicYear: '2026-2027',

  setAuth: (data: AuthResponse) => {
    localStorage.setItem('edusuite_token', data.accessToken);
    localStorage.setItem('edusuite_refresh_token', data.refreshToken);
    localStorage.setItem('edusuite_user', JSON.stringify(data.user));
    set({
      user: data.user,
      token: data.accessToken,
      refreshToken: data.refreshToken,
    });
  },

  logout: () => {
    localStorage.removeItem('edusuite_token');
    localStorage.removeItem('edusuite_refresh_token');
    localStorage.removeItem('edusuite_user');
    set({ user: null, token: null, refreshToken: null });
  },

  setActiveCampus: (campus: string) => set({ activeCampus: campus }),
  setActiveAcademicYear: (year: string) => set({ activeAcademicYear: year }),
}));

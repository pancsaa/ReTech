// frontend/src/store/authStore.ts
import { create } from 'zustand'
import type { User } from "../types/type.user"; 

// Állapot típus
interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean

  // Műveletek
  login: (userData: User, token: string) => void
  logout: () => void

  // Opcionális: ha később kell user frissítés (pl. egyenleg változás)
  updateUser: (updatedUser: Partial<User>) => void
}

// Store létrehozása
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: (userData, token) => {
    // Mentés localStorage-ba (hogy refresh után is megmaradjon)
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))

    set({
      user: userData,
      token,
      isAuthenticated: true,
    })
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    set({
      user: null,
      token: null,
      isAuthenticated: false,
    })
  },

  updateUser: (updatedUser) => {
    set((state) => {
      if (!state.user) return state
      const newUser = { ...state.user, ...updatedUser }
      localStorage.setItem('user', JSON.stringify(newUser))
      return { user: newUser }
    })
  },
}))
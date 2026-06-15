import { create } from 'zustand'
import { io } from 'socket.io-client'
import toast from 'react-hot-toast'
import { axiosInstance } from '../lib/axios'

const BASE_URL = import.meta.env.MODE === 'development'
  ? 'http://localhost:5001'
  : '/'

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const { data } = await axiosInstance.get('/auth/check')
      set({ authUser: data })
      get().connectSocket(data)
    } catch {
      set({ authUser: null })
    } finally {
      set({ isCheckingAuth: false })
    }
  },

  signup: async (formData) => {
    set({ isSigningUp: true })
    try {
      const { data } = await axiosInstance.post('/auth/signup', formData)
      set({ authUser: data })
      toast.success('Account created successfully')
      get().connectSocket(data)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create account')
    } finally {
      set({ isSigningUp: false })
    }
  },

  login: async (formData) => {
    set({ isLoggingIn: true })
    try {
      const { data } = await axiosInstance.post('/auth/login', formData)
      set({ authUser: data })
      toast.success('Logged in successfully')
      get().connectSocket(data)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to log in')
    } finally {
      set({ isLoggingIn: false })
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout')
      set({ authUser: null })
      toast.success('Logged out successfully')
      get().disconnectSocket()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to log out')
    }
  },

  updateProfile: async (formData) => {
    set({ isUpdatingProfile: true })
    try {
      const { data } = await axiosInstance.put('/auth/update-profile', formData)
      set({ authUser: data })
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      set({ isUpdatingProfile: false })
    }
  },

  connectSocket: (user = get().authUser) => {
    if (!user || get().socket?.connected) return

    const socket = io(BASE_URL, {
      query: {
        userId: user._id,
      },
    })

    socket.connect()
    set({ socket })

    socket.on('getOnlineUsers', (userIds) => {
      set({ onlineUsers: userIds })
    })
  },

  disconnectSocket: () => {
    get().socket?.disconnect()
    set({ socket: null, onlineUsers: [] })
  },
}))

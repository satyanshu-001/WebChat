import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast'
import { useAuthStore } from './useAuthStore'

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true })
    try {
      const { data } = await axiosInstance.get('/messages/users')
      set({ users: data })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error loading users')
    } finally {
      set({ isUsersLoading: false })
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true })
    try {
      const { data } = await axiosInstance.get(`/messages/${userId}`)
      set({ messages: data })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error loading messages')
    } finally {
      set({ isMessagesLoading: false })
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get()
    try {
      const { data } = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      )
      set({ messages: [...messages, data] })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message')
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get()
    if (!selectedUser) return
    const socket = useAuthStore.getState().socket
    socket?.on('newMessage', (message) => {
      if (message.senderId === selectedUser._id) {
        set({ messages: [...get().messages, message] })
      }
    })
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket
    socket?.off('newMessage')
  },

  setSelectedUser: (user) => set({ selectedUser: user, messages: [] }),
}))
import { defineStore } from 'pinia'
import { users } from '@/users'
import type { User } from './types'

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null as User | null,
    selectedChatUser: null as User | null,
    isChatAreaVisible: false
  }),
  getters: {
    isAuthenticated: (state) => !!state.currentUser
  },
  actions: {
    setCurrentUser(userId: string) {
      const user = users.find((user) => user.id === userId)
      this.resetSelectedChatUser()
      this.currentUser = user || null
    },
    selectChatUser(userId: string) {
      const user = users.find((user) => user.id === userId)
      this.selectedChatUser = user || null
    },
    resetSelectedChatUser() {
      this.selectedChatUser = null
    },
    toggleChatAreaVisibility() {
      this.isChatAreaVisible = !this.isChatAreaVisible
    }
  }
})

import { defineStore } from 'pinia'

export const useMessageStore = defineStore('message', {
  state: () => ({
    messages: JSON.parse(localStorage.getItem('messages') || '[]')
  }),
  actions: {
    sendMessage(message: any) {
      this.messages.push(message)
      localStorage.setItem('messages', JSON.stringify(this.messages))
    },
    loadMessages() {
      this.messages = JSON.parse(localStorage.getItem('messages') || '[]')
    }
  }
})

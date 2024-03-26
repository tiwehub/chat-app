<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useMessageStore } from '@/stores/messageStore'
import { users } from '@/users'
import { gsap } from '@/utils/gsapInit'
import type { Message } from '@/stores/types'

const userStore = useUserStore()
const messageStore = useMessageStore()

const chats = computed(() => {
  const currentUser = userStore.currentUser
  if (!currentUser) {
    return []
  }

  return users
    .filter((user) => user.id !== currentUser.id)
    .map((user) => {
      const exchangedMessages = messageStore.messages.filter(
        (m: Message) =>
          (m.senderId === currentUser.id && m.receiverId === user.id) ||
          (m.senderId === user.id && m.receiverId === currentUser.id)
      )

      exchangedMessages.sort(
        (a: Message, b: Message) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )

      const lastMessage = exchangedMessages[0]

      return {
        id: user.id,
        name: user.name,
        lastMessage: lastMessage ? lastMessage.text : 'Последнее сообщение неизвестно',
        time: lastMessage
          ? new Date(lastMessage.timestamp).toLocaleTimeString()
          : 'Время неизвестно',
        avatar: user.avatar
      }
    })
})

const selectChatUser = (userId: string) => {
  userStore.selectChatUser(userId)
  if (window.innerWidth < 768) {
    userStore.toggleChatAreaVisibility()
  }
}

const animateBorder = (element: HTMLElement) => {
  gsap.to(element, {
    boxShadow: '0 0 8px rgba(236, 239, 243, 1)',
    repeat: -1,
    yoyo: true,
    duration: 0.5,
    ease: 'power1.inOut'
  })
}

const stopAnimation = (element: HTMLElement) => {
  gsap.killTweensOf(element)

  gsap.to(element, {
    boxShadow: '0 0 0px rgba(0, 0, 0, 0)',
    duration: 0.5,
    ease: 'power1.out'
  })
}

const handleMouseEnter = (event: Event) => {
  const target = event.target as HTMLElement
  if (target instanceof HTMLElement) {
    animateBorder(target)
  }
}

const handleMouseLeave = (event: Event) => {
  const target = event.target as HTMLElement
  if (target instanceof HTMLElement) {
    stopAnimation(target)
  }
}
</script>

<template>
  <div class="chats-container">
    <div
      v-for="chat in chats"
      :key="chat.id"
      class="message"
      @click="selectChatUser(chat.id)"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <img class="chat__avatar" :src="chat.avatar" alt="Avatar" />
      <div class="chat__info">
        <div class="chat__name">{{ chat.name }}</div>
        <div class="chat__last-message">{{ chat.lastMessage }}</div>
      </div>
      <div class="chat__time">{{ chat.time }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

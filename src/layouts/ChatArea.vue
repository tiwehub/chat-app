<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import type { Ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useMessageStore } from '@/stores/messageStore'

const userStore = useUserStore()
const messageStore = useMessageStore()

const windowWidth = ref(window.innerWidth)

const messagesContainer: Ref<HTMLElement | null> = ref(null)

const selectedChatUser = computed(() => userStore.selectedChatUser)
const newMessage = ref('')

const messages = computed(() =>
  messageStore.messages.filter(
    (message: any) =>
      (message.senderId === userStore.currentUser?.id &&
        message.receiverId === selectedChatUser.value?.id) ||
      (message.senderId === selectedChatUser.value?.id &&
        message.receiverId === userStore.currentUser?.id)
  )
)

const sendMessage = () => {
  if (newMessage.value.trim()) {
    messageStore.sendMessage({
      senderId: userStore.currentUser?.id,
      receiverId: selectedChatUser.value?.id,
      text: newMessage.value,
      timestamp: new Date().toISOString()
    })
    newMessage.value = ''
    nextTick(() => {
      scrollToBottom()
    })
  }
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const updateMessages = () => {
  messageStore.loadMessages()
}

onMounted(() => {
  window.addEventListener('storage', updateMessages)
})

onUnmounted(() => {
  window.removeEventListener('storage', updateMessages)
})
const toggleChatAreaVisibility = () => {
  userStore.toggleChatAreaVisibility()
}

const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', updateWindowWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWindowWidth)
})
</script>

<template>
  <div class="chat">
    <div v-if="selectedChatUser" class="chat__header">
      <button v-if="windowWidth < 768" @click="toggleChatAreaVisibility" class="chat__back-button">
        <svg
          width="11"
          height="20"
          viewBox="0 0 11 20"
          fill="none"
          class="me-2.5"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.5794 19.5598C10.8487 19.2778 11 18.8954 11 18.4967C11 18.098 10.8487 17.7157 10.5794 17.4337L3.46782 9.99092L10.5794 2.54815C10.8411 2.26457 10.9859 1.88476 10.9826 1.49052C10.9793 1.09629 10.8282 0.719168 10.5619 0.44039C10.2955 0.161613 9.93515 0.00348333 9.55846 5.75214e-05C9.18177 -0.00336829 8.81886 0.148185 8.5479 0.422076L0.420639 8.92788C0.151304 9.20985 0 9.59222 0 9.99092C0 10.3896 0.151304 10.772 0.420639 11.054L8.5479 19.5598C8.81732 19.8416 9.18268 20 9.56363 20C9.94459 20 10.3099 19.8416 10.5794 19.5598Z"
            fill="white"
          />
        </svg>
      </button>
      <img :src="selectedChatUser.avatar" alt="Avatar" class="chat__avatar" />
      <h2 class="chat__name">{{ selectedChatUser.name }}</h2>
    </div>
    <div v-else class="chat__no-selection">
      Выберите, кому хотели бы написать !
      <a href="https://t.me/tiwehub" class="chat__link">Разработал: Малютин Т.А.</a>
      <a href="https://github.com/tiwehub/chat-app.git" class="chat__link">Github</a>
      <p class="chat__no-selection-date">26.03.2024</p>
    </div>
    <div class="chat__messages" ref="messagesContainer">
      <div
        v-for="(message, index) in messages"
        :key="index"
        class="chat__message"
        :class="{ 'chat__message--mine': message.senderId === userStore.currentUser?.id }"
      >
        {{ message.text }}
      </div>
    </div>
    <div v-if="selectedChatUser" class="chat__input-area">
      <input
        v-model="newMessage"
        @keyup.enter="sendMessage"
        type="text"
        placeholder="Напишите сообщение..."
        class="chat__input"
      />
      <button @click="sendMessage" class="chat__send-button">Отправить</button>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

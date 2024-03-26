<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import ChatArea from '@/layouts/ChatArea.vue'
import ChatList from '@/layouts/ChatList.vue'
import UserPanel from '@/layouts/UserPanel.vue'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()

const windowWidth = ref(window.innerWidth)

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
  <div class="flex h-[93vh] sm:h-screen">
    <UserPanel />
    <ChatList v-if="!userStore.isChatAreaVisible || windowWidth >= 768" />
    <ChatArea v-if="userStore.isChatAreaVisible || windowWidth >= 768" />
  </div>
</template>

<style lang="scss" scoped></style>

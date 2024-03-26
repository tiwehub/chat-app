<script setup lang="ts">
import { ref, watchEffect, onMounted, onUnmounted } from 'vue'
import { gsap } from '@/utils/gsapInit'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'

const router = useRouter()

const userStore = useUserStore()

const sidebarVisible = ref(true)
const windowWidth = ref(window.innerWidth)

const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth
}

window.addEventListener('resize', updateWindowWidth)

const getChatmdarginLeft = () => {
  if (windowWidth.value > 768) {
    return sidebarVisible.value ? '10rem' : '0rem'
  } else {
    return '0rem'
  }
}

watchEffect(() => {
  const chatmdarginLeft = getChatmdarginLeft()

  gsap.to('.chats-container', {
    marginLeft: chatmdarginLeft,
    duration: 0.5,
    ease: 'Power3.easeInOut'
  })
})

const toggleSidebar = (event: MouseEvent) => {
  event.stopPropagation()
  sidebarVisible.value = !sidebarVisible.value
  const sidebarTargetX = sidebarVisible.value ? 0 : '-100%'

  gsap.to('.sidebar', { x: sidebarTargetX, duration: 0.5, ease: 'Power3.easeInOut' })
}

const handleClickOutside = (event: MouseEvent) => {
  if (window.innerWidth <= 768) {
    const sidebar = document.querySelector('.sidebar') as HTMLElement
    if (
      sidebar &&
      event.target instanceof Element &&
      !sidebar.contains(event.target) &&
      sidebarVisible.value
    ) {
      sidebarVisible.value = false
      gsap.to('.sidebar', { x: '-100%', duration: 0.5, ease: 'Power3.easeInOut' })
    }
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWindowWidth)
  document.removeEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWindowWidth)
})

const logout = () => {
  userStore.resetSelectedChatUser()
  userStore.currentUser = null
  router.push('/')
}
</script>

<template>
  <div class="sidebar">
    <div class="sidebar__content">
      <div v-if="userStore.currentUser" class="sidebar__user-info">
        <img :src="userStore.currentUser.avatar" alt="Аватар" class="sidebar__avatar" />
        <div class="sidebar__user-text">
          <div class="sidebar__name">
            {{ userStore.currentUser.name }}
          </div>
          <div class="sidebar__username">@{{ userStore.currentUser.username }}</div>
        </div>
      </div>
    </div>
    <button @click="logout" class="sidebar__logout-button">Выйти</button>
    <button @click="toggleSidebar($event)" class="sidebar__toggle-button md:block"></button>
  </div>
  <button @click="toggleSidebar($event)" class="sidebar__mobile-toggle">
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      class="md:hidden fill-white stroke-white"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3 7H21" stroke-width="1.5" stroke-linecap="round" />
      <path d="M9.48999 12H21" stroke-width="1.5" stroke-linecap="round" />
      <path d="M3 12H5.99" stroke-width="1.5" stroke-linecap="round" />
      <path d="M3 17H21" stroke-width="1.5" stroke-linecap="round" />
    </svg>
  </button>
</template>

<style lang="scss" scoped></style>

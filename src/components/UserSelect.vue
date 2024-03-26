<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gsap } from '@/utils/gsapInit'
import { users } from '@/users'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'

const router = useRouter()

const userStore = useUserStore()

const containerRef = ref<HTMLElement | null>(null)
const selectedUser = ref('')

const login = (userId: string | number) => {
  selectedUser.value = String(userId)
  userStore.setCurrentUser(selectedUser.value)
  router.push('/chat')
}

onMounted(() => {
  if (containerRef.value) {
    gsap.from(containerRef.value, {
      opacity: 0,
      y: -20,
      duration: 1,
      ease: 'power3.out'
    })

    gsap.to(containerRef.value.querySelectorAll('.user-card__item'), {
      opacity: 1,
      y: 0,
      stagger: 0.2,
      duration: 0.6,
      delay: 0.6,
      ease: 'power3.out'
    })
  }
})

const animateIn = (event: MouseEvent) => {
  gsap.to(event.currentTarget, {
    scale: 1.05,
    borderColor: '#eceff133',
    borderWidth: '1px',
    duration: 0.4,
    ease: 'power1.out'
  })
}

const animateOut = (event: MouseEvent) => {
  gsap.to(event.currentTarget, {
    scale: 1,
    borderColor: 'transparent',
    borderWidth: '0px',
    duration: 0.4,
    ease: 'power1.in'
  })
}
</script>

<template>
  <div class="user-card">
    <div ref="containerRef" class="user-card__container">
      <h2 class="user-card__title">Выберите пользователя:</h2>
      <div
        v-for="user in users"
        :key="user.id"
        class="user-card__item"
        @mouseenter="animateIn"
        @mouseleave="animateOut"
      >
        <div class="user-card__info">
          <img :src="user.avatar" alt="Аватар" class="user-card__avatar" />
          <div>
            <div class="user-card__username">{{ user.username }}</div>
            <div class="user-card__fullname">{{ user.name }}</div>
          </div>
        </div>
        <button @click="login(user.id)" class="user-card__button">Войти</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

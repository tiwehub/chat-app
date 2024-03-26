import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import HomePage from '@/views/LoginView.vue'
import ChatView from '@/views/ChatView.vue'

const routes = [
  { path: '/', component: HomePage },
  {
    path: '/chat',
    component: ChatView,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    next({ path: '/' })
  } else {
    next()
  }
})

export default router

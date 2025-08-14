import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import UserList from '@/views/UserList.vue'
import UserCreate from '@/views/UserCreate.vue'
import UserEdit from '@/views/UserEdit.vue'
import IconShowcase from '@/components/IconShowcase.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/users',
    name: 'UserList',
    component: UserList
  },
  {
    path: '/users/create',
    name: 'UserCreate',
    component: UserCreate
  },
  {
    path: '/users/:id/edit',
    name: 'UserEdit',
    component: UserEdit,
    props: true
  },
  {
    path: '/icons',
    name: 'IconShowcase',
    component: IconShowcase
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

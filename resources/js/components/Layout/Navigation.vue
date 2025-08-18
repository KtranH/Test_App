<template>
  <nav class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <h1 class="text-2xl font-bold text-gray-900">Test API</h1>
          </div>
          <div class="hidden md:ml-6 md:flex md:space-x-8">
            <router-link 
              to="/" 
              class="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-2"
              :class="{ 'bg-gray-100 text-gray-900': $route.name === 'Dashboard' }"
            >
              <LayoutDashboard class="w-4 h-4" />
              Dashboard
            </router-link>
            <router-link 
              to="/users" 
              class="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-2"
              :class="{ 'bg-gray-100 text-gray-900': $route.name === 'UserList' }"
            >
              <Users class="w-4 h-4" />
              Users
            </router-link>
            <router-link 
              to="/icons" 
              class="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-2"
              :class="{ 'bg-gray-100 text-gray-900': $route.name === 'IconShowcase' }"
            >
              <Palette class="w-4 h-4" />
              Icons
            </router-link>
            <router-link 
              to="/settings/2fa" 
              class="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-2"
              :class="{ 'bg-gray-100 text-gray-900': $route.name === 'TwoFactorSettings' }"
            >
              <Shield class="w-4 h-4" />
              2FA
            </router-link>
          </div>
        </div>
        
        <div class="flex items-center space-x-4">
          <div class="relative">
            <button class="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              <div class="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                <User class="w-4 h-4 text-gray-700" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { LayoutDashboard, Users, User, Palette, Shield } from 'lucide-vue-next'
</script>

<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Icon Showcase - Lucide Icons</h2>
    
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      <div 
        v-for="icon in icons" 
        :key="icon.name"
        class="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer group"
        @click="copyIconName(icon.name)"
        :title="`Click to copy: ${icon.name}`"
      >
        <component :is="icon.component" class="w-8 h-8 text-gray-600 group-hover:text-gray-900 mb-2" />
        <span class="text-xs text-gray-500 text-center font-mono">{{ icon.name }}</span>
      </div>
    </div>

    <!-- Copy notification -->
    <div 
      v-if="showCopyNotification" 
      class="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300"
      :class="{ 'opacity-0': !showCopyNotification }"
    >
      Icon name copied to clipboard!
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  // Navigation & Layout
  LayoutDashboard,
  Home,
  Menu,
  Settings,
  Search,
  Bell,
  
  // User & People
  User,
  Users,
  UserPlus,
  UserMinus,
  UserCheck,
  UserX,
  
  // Actions
  Plus,
  Minus,
  Edit,
  Save,
  Trash2,
  Copy,
  Download,
  Upload,
  Eye,
  EyeOff,
  
  // Communication
  Mail,
  MessageCircle,
  Phone,
  Send,
  
  // Security
  Lock,
  Unlock,
  Shield,
  Key,
  
  // Status
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  
  // Time
  Clock,
  Calendar,
  Timer,
  
  // Files & Data
  File,
  Folder,
  Database,
  BarChart3,
  PieChart,
  
  // Arrows
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  
  // Loading
  Loader2,
  RefreshCw,
  
  // Other
  Heart,
  Star,
  Bookmark,
  Share2,
  MoreHorizontal,
  MoreVertical
} from 'lucide-vue-next'

const showCopyNotification = ref(false)

const icons = [
  { name: 'LayoutDashboard', component: LayoutDashboard },
  { name: 'Home', component: Home },
  { name: 'Menu', component: Menu },
  { name: 'Settings', component: Settings },
  { name: 'Search', component: Search },
  { name: 'Bell', component: Bell },
  { name: 'User', component: User },
  { name: 'Users', component: Users },
  { name: 'UserPlus', component: UserPlus },
  { name: 'UserMinus', component: UserMinus },
  { name: 'UserCheck', component: UserCheck },
  { name: 'UserX', component: UserX },
  { name: 'Plus', component: Plus },
  { name: 'Minus', component: Minus },
  { name: 'Edit', component: Edit },
  { name: 'Save', component: Save },
  { name: 'Trash2', component: Trash2 },
  { name: 'Copy', component: Copy },
  { name: 'Download', component: Download },
  { name: 'Upload', component: Upload },
  { name: 'Eye', component: Eye },
  { name: 'EyeOff', component: EyeOff },
  { name: 'Mail', component: Mail },
  { name: 'MessageCircle', component: MessageCircle },
  { name: 'Phone', component: Phone },
  { name: 'Send', component: Send },
  { name: 'Lock', component: Lock },
  { name: 'Unlock', component: Unlock },
  { name: 'Shield', component: Shield },
  { name: 'Key', component: Key },
  { name: 'CheckCircle', component: CheckCircle },
  { name: 'XCircle', component: XCircle },
  { name: 'AlertTriangle', component: AlertTriangle },
  { name: 'Info', component: Info },
  { name: 'HelpCircle', component: HelpCircle },
  { name: 'Clock', component: Clock },
  { name: 'Calendar', component: Calendar },
  { name: 'Timer', component: Timer },
  { name: 'File', component: File },
  { name: 'Folder', component: Folder },
  { name: 'Database', component: Database },
  { name: 'BarChart3', component: BarChart3 },
  { name: 'PieChart', component: PieChart },
  { name: 'ArrowLeft', component: ArrowLeft },
  { name: 'ArrowRight', component: ArrowRight },
  { name: 'ArrowUp', component: ArrowUp },
  { name: 'ArrowDown', component: ArrowDown },
  { name: 'ChevronLeft', component: ChevronLeft },
  { name: 'ChevronRight', component: ChevronRight },
  { name: 'Loader2', component: Loader2 },
  { name: 'RefreshCw', component: RefreshCw },
  { name: 'Heart', component: Heart },
  { name: 'Star', component: Star },
  { name: 'Bookmark', component: Bookmark },
  { name: 'Share2', component: Share2 },
  { name: 'MoreHorizontal', component: MoreHorizontal },
  { name: 'MoreVertical', component: MoreVertical }
]

const copyIconName = async (iconName) => {
  try {
    await navigator.clipboard.writeText(iconName)
    showCopyNotification.value = true
    setTimeout(() => {
      showCopyNotification.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy icon name:', err)
  }
}
</script>

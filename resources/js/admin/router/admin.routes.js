import AdminLayout from '@/admin/components/layout/AdminLayout.vue'

export const adminRoutes = [
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      {
        path: '',
        redirect: { name: 'admin.products' }
      },
      {
        path: 'dashboard',
        name: 'admin.dashboard',
        component: () => import('@/admin/views/Dashboard.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'attributes',
        name: 'admin.attributes',
        component: () => import('@/admin/views/Attributes/AttributeIndex.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'products',
        name: 'admin.products',
        component: () => import('@/admin/views/Products/ProductIndex.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'products/create',
        name: 'admin.products.create',
        component: () => import('@/admin/views/Products/ProductCreate.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'products/:id',
        name: 'admin.products.edit',
        component: () => import('@/admin/views/Products/ProductEdit.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'categories',
        name: 'admin.categories',
        component: () => import('@/admin/views/Categories/CategoryIndex.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'inventory',
        name: 'admin.inventory',
        component: () => import('@/admin/views/Inventory/InventoryIndex.vue'),
        meta: { requiresAuth: true }
      }
    ]
  }
]



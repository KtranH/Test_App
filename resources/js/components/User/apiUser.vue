<template>
  <div class="space-y-6">
    <!-- API Overview -->
    <div
      class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200"
    >
      <div class="flex items-center gap-3 mb-4">
        <div class="p-2 bg-blue-100 rounded-lg">
          <svg
            class="w-6 h-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-blue-900">
            User API Documentation
          </h3>
          <p class="text-blue-700">
            Tài liệu đầy đủ về các endpoint API quản lý user
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div class="bg-white rounded-lg p-3 border border-blue-200">
          <div class="font-medium text-blue-900">Base URL</div>
          <div class="text-blue-700 font-mono">/api/users</div>
        </div>
        <div class="bg-white rounded-lg p-3 border border-blue-200">
          <div class="font-medium text-blue-900">Authentication</div>
          <div class="text-blue-700">
            Bearer Token hoặc có thể dùng Http only cookie
          </div>
        </div>
        <div class="bg-white rounded-lg p-3 border border-blue-200">
          <div class="font-medium text-blue-900">Format</div>
          <div class="text-blue-700">JSON</div>
        </div>
      </div>
    </div>

    <!-- API Endpoints -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-900">API Endpoints</h3>

      <!-- GET /users - Paginated -->
      <div class="border border-gray-200 rounded-lg overflow-hidden">
        <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
              >
                GET
              </span>
              <span class="font-mono text-sm text-gray-700">/users</span>
              <span class="text-sm text-gray-500"
                >Phân trang danh sách user</span
              >
            </div>
            <button
              @click="toggleEndpoint('getUsers')"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg
                class="w-5 h-5"
                :class="expandedEndpoints.getUsers ? 'rotate-180' : ''"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        <div v-if="expandedEndpoints.getUsers" class="p-4 bg-white">
          <div class="space-y-4">
            <div>
              <h4 class="font-medium text-gray-900 mb-2">Parameters</h4>
              <div class="bg-gray-50 rounded-lg p-3">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span class="font-medium text-gray-700">limit</span>
                    <span class="text-gray-500 ml-2">(number)</span>
                    <div class="text-gray-600 text-xs mt-1">
                      Số user mỗi trang (default: 10)
                    </div>
                  </div>
                  <div>
                    <span class="font-medium text-gray-700">offset</span>
                    <span class="text-gray-500 ml-2">(number)</span>
                    <div class="text-gray-600 text-xs mt-1">
                      Vị trí bắt đầu (default: 0)
                    </div>
                  </div>
                  <div>
                    <span class="font-medium text-gray-700">filter</span>
                    <span class="text-gray-500 ml-2">(string)</span>
                    <div class="text-gray-600 text-xs mt-1">
                      Bộ lọc tìm kiếm
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 class="font-medium text-gray-900 mb-2">Example Request</h4>
              <div class="bg-gray-900 rounded-lg p-3">
                <pre
                  class="text-green-400 text-sm overflow-x-auto"
                ><code>GET /api/users?limit=10&offset=0
Authorization: Bearer {token}</code></pre>
              </div>
            </div>

            <div>
              <h4 class="font-medium text-gray-900 mb-2">Response</h4>
              <div class="bg-gray-900 rounded-lg p-3">
                <pre class="text-green-400 text-sm overflow-x-auto">
                    <code>{
                        "data": {
                            "data": [
                            {
                                "id": 1,
                                "name": "Nguyễn Văn A",
                                "email": "nguyenvana@example.com",
                                "role": "admin",
                                "status": "active",
                                "created_at": "2024-01-15"
                            }
                            ],
                            "meta": {
                            "paging": {
                                "total": 100,
                                "limit": 10,
                                "offset": 0
                            }
                            }
                        }
                    }
                    </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- GET /users - Search -->
      <div class="border border-gray-200 rounded-lg overflow-hidden">
        <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                GET
              </span>
              <span class="font-mono text-sm text-gray-700"
                >/users?filters=...</span
              >
              <span class="text-sm text-gray-500"
                >Tìm kiếm user trong toàn bộ database</span
              >
            </div>
            <button
              @click="toggleEndpoint('searchUsers')"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg
                class="w-5 h-5"
                :class="expandedEndpoints.searchUsers ? 'rotate-180' : ''"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        <div v-if="expandedEndpoints.searchUsers" class="p-4 bg-white">
          <div class="space-y-4">
            <div>
              <h4 class="font-medium text-gray-900 mb-2">Filter Syntax</h4>
              <div class="bg-gray-50 rounded-lg p-3">
                <div class="text-sm text-gray-700">
                  <p class="mb-2">Sử dụng cú pháp filter để tìm kiếm:</p>
                  <div class="font-mono bg-gray-100 p-2 rounded text-xs">
                    name lk "query%" or email lk "query%"
                  </div>
                  <p class="mt-2 text-xs text-gray-600">
                    <strong>lk</strong> = like (tìm kiếm gần đúng)<br />
                    <strong>%</strong> = wildcard (ký tự bất kỳ)
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 class="font-medium text-gray-900 mb-2">Example Request</h4>
              <div class="bg-gray-900 rounded-lg p-3">
                <pre
                  class="text-green-400 text-sm overflow-x-auto"
                ><code>GET /api/users?filters=name lk "Nguyễn%" or email lk "nguyen%"
Authorization: Bearer {token}</code></pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- POST /users -->
      <div class="border border-gray-200 rounded-lg overflow-hidden">
        <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
              >
                POST
              </span>
              <span class="font-mono text-sm text-gray-700">/users</span>
              <span class="text-sm text-gray-500">Tạo user mới</span>
            </div>
            <button
              @click="toggleEndpoint('createUser')"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg
                class="w-5 h-5"
                :class="expandedEndpoints.createUser ? 'rotate-180' : ''"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        <div v-if="expandedEndpoints.createUser" class="p-4 bg-white">
          <div class="space-y-4">
            <div>
              <h4 class="font-medium text-gray-900 mb-2">Request Body</h4>
              <div class="bg-gray-900 rounded-lg p-3">
                <pre class="text-green-400 text-sm overflow-x-auto"><code>{
  "name": "Tên User",
  "email": "email@example.com",
  "role": "user",
  "status": "active"
}</code></pre>
              </div>
            </div>

            <div>
              <h4 class="font-medium text-gray-900 mb-2">Example Request</h4>
              <div class="bg-gray-900 rounded-lg p-3">
                <pre
                  class="text-green-400 text-sm overflow-x-auto"
                ><code>POST /api/users
Content-Type: application/json
Authorization: Bearer {token}

{
  "name": "Trần Thị B",
  "email": "tranthib@example.com",
  "role": "user",
  "status": "active"
}</code></pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- PUT /users/{id} -->
      <div class="border border-gray-200 rounded-lg overflow-hidden">
        <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
              >
                PUT
              </span>
              <span class="font-mono text-sm text-gray-700">/users/{id}</span>
              <span class="text-sm text-gray-500">Cập nhật user</span>
            </div>
            <button
              @click="toggleEndpoint('updateUser')"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg
                class="w-5 h-5"
                :class="expandedEndpoints.updateUser ? 'rotate-180' : ''"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        <div v-if="expandedEndpoints.updateUser" class="p-4 bg-white">
          <div class="space-y-4">
            <div>
              <h4 class="font-medium text-gray-900 mb-2">Request Body</h4>
              <div class="bg-gray-900 rounded-lg p-3">
                <pre class="text-green-400 text-sm overflow-x-auto"><code>{
  "name": "Tên User Mới",
  "status": "inactive"
}</code></pre>
              </div>
            </div>

            <div>
              <h4 class="font-medium text-gray-900 mb-2">Example Request</h4>
              <div class="bg-gray-900 rounded-lg p-3">
                <pre
                  class="text-green-400 text-sm overflow-x-auto"
                ><code>PUT /api/users/1
Content-Type: application/json
Authorization: Bearer {token}

{
  "name": "Nguyễn Văn A (Updated)",
  "status": "inactive"
}</code></pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- DELETE /users/{id} -->
      <div class="border border-gray-200 rounded-lg overflow-hidden">
        <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
              >
                DELETE
              </span>
              <span class="font-mono text-sm text-gray-700">/users/{id}</span>
              <span class="text-sm text-gray-500">Xóa user</span>
            </div>
            <button
              @click="toggleEndpoint('deleteUser')"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg
                class="w-5 h-5"
                :class="expandedEndpoints.deleteUser ? 'rotate-180' : ''"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        <div v-if="expandedEndpoints.deleteUser" class="p-4 bg-white">
          <div class="space-y-4">
            <div>
              <h4 class="font-medium text-gray-900 mb-2">Example Request</h4>
              <div class="bg-gray-900 rounded-lg p-3">
                <pre
                  class="text-green-400 text-sm overflow-x-auto"
                ><code>DELETE /api/users/1
Authorization: Bearer {token}</code></pre>
              </div>
            </div>

            <div>
              <h4 class="font-medium text-gray-900 mb-2">Response</h4>
              <div class="bg-gray-900 rounded-lg p-3">
                <pre class="text-green-400 text-sm overflow-x-auto"><code>{
  "message": "User deleted successfully",
  "status": "success"
}</code></pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Status Codes -->
    <div class="bg-gray-50 rounded-lg p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">
        HTTP Status Codes
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <span
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
              >200</span
            >
            <span class="text-sm text-gray-700">OK - Thành công</span>
          </div>
          <div class="flex items-center gap-2">
            <span
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >201</span
            >
            <span class="text-sm text-gray-700">Created - Tạo thành công</span>
          </div>
          <div class="flex items-center gap-2">
            <span
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >204</span
            >
            <span class="text-sm text-gray-700"
              >No Content - Xóa thành công</span
            >
          </div>
        </div>
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <span
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
              >400</span
            >
            <span class="text-sm text-gray-700"
              >Bad Request - Dữ liệu không hợp lệ</span
            >
          </div>
          <div class="flex items-center gap-2">
            <span
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
              >401</span
            >
            <span class="text-sm text-gray-700"
              >Unauthorized - Chưa xác thực</span
            >
          </div>
          <div class="flex items-center gap-2">
            <span
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
              >500</span
            >
            <span class="text-sm text-gray-700"
              >Internal Server Error - Lỗi server</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// State để quản lý việc mở/đóng các endpoint
const expandedEndpoints = ref({
  getUsers: false,
  searchUsers: false,
  createUser: false,
  updateUser: false,
  deleteUser: false,
});

// Function để toggle endpoint
const toggleEndpoint = (endpoint) => {
  expandedEndpoints.value[endpoint] = !expandedEndpoints.value[endpoint];
};
</script>

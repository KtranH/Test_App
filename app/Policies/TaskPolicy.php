<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;

class TaskPolicy
{
    /**
     * Xem danh sách task
     * - user: được xem (sẽ bị filter chỉ thấy task của mình ở controller)
     * - admin: được xem tất cả
     * - super_admin: được xem tất cả
     */
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['user', 'admin', 'super_admin']);
    }

    /**
     * Xem chi tiết task
     * - user: chỉ xem được task của mình
     * - admin: xem được tất cả
     * - super_admin: xem được tất cả
     */
    public function view(User $user, Task $task): bool
    {
        if ($user->isSuperAdmin()) {
            return true;
        }

        if ($user->isAdmin()) {
            return true; // admin có thể xem mọi task
        }

        // user thường chỉ xem task của chính mình
        return $task->user_id === $user->id;
    }

    /**
     * Tạo task
     * - user: chỉ được tạo task cho chính mình (user_id = auth()->id())
     * - admin: chỉ được tạo task cho user thường (không phải admin/super_admin)
     * - super_admin: tạo được cho bất kỳ ai
     */
    public function create(User $user, ?Task $task = null): bool
    {
        if ($user->isSuperAdmin()) {
            return true;
        }

        if ($task === null) {
            // Nếu không có instance, fallback theo role
            return $user->isAdmin() || $user->isUser();
        }

        if ($user->isAdmin()) {
            // admin chỉ được tạo task cho user thường
            $owner = $task->user()->first();
            if ($owner instanceof User) {
                return $owner->isUser();
            }
            // nếu chưa có quan hệ, dựa theo user_id
            return $task->user_id !== null && $task->user_id !== $user->id;
        }

        // user thường chỉ tạo cho chính mình
        return $task->user_id === $user->id;
    }

    /**
     * Cập nhật task
     * - user: chỉ cập nhật task của mình
     * - admin: chỉ cập nhật task của user thường
     * - super_admin: cập nhật tất cả
     */
    public function update(User $user, Task $task): bool
    {
        if ($user->isSuperAdmin()) {
            return true;
        }

        if ($user->isAdmin()) {
            $owner = $task->user()->first();
            if ($owner instanceof User) {
                return $owner->isUser();
            }
            return false;
        }

        return $task->user_id === $user->id;
    }

    /**
     * Xóa task
     * - user: không được xóa
     * - admin: chỉ xóa task của user thường
     * - super_admin: xóa tất cả
     */
    public function delete(User $user, Task $task): bool
    {
        if ($user->isSuperAdmin()) {
            return true;
        }

        if ($user->isAdmin()) {
            $owner = $task->user()->first();
            if ($owner instanceof User) {
                return $owner->isUser();
            }
            return false;
        }

        // user thường không được xóa
        return false;
    }

    /**
     * Restore (nếu có soft delete)
     */
    public function restore(User $user, Task $task): bool
    {
        return $this->delete($user, $task);
    }

    /**
     * Force delete
     */
    public function forceDelete(User $user, Task $task): bool
    {
        return $this->delete($user, $task);
    }
}



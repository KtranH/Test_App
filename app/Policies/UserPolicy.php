<?php

namespace App\Policies;

use App\Models\User;
class UserPolicy
{
    /**
     * Xem danh sách user
     * - user: có thể xem
     * - admin: có thể xem 
     * - super_admin: có thể xem
     */
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['user', 'admin', 'super_admin']);
    }

    /**
     * Xem thông tin một user cụ thể
     * - user: chỉ xem được chính mình
     * - admin: xem được tất cả
     * - super_admin: xem được tất cả
     */
    public function view(User $user, User $model): bool
    {
        // User chỉ xem được chính mình
        if ($user->isUser()) {
            return $user->id === $model->id;
        }

        // Admin và Super admin xem được tất cả
        return $user->canManage();
    }

    /**
     * Tạo user mới
     * - user: không được tạo
     * - admin: được tạo
     * - super_admin: được tạo
     */
    public function create(User $user): bool
    {
        return $user->canManage();
    }

    /**
     * Cập nhật user
     * - user: chỉ cập nhật được chính mình (thông tin cơ bản)
     * - admin: cập nhật được tất cả NHƯNG không được cập nhật admin khác
     * - super_admin: cập nhật được tất cả
     */
    public function update(User $user, User $model): bool
    {
        return $user->canManageUser($model);
    }

    /**
     * Xóa user
     * - user: không được xóa
     * - admin: xóa được user thường NHƯNG không được xóa admin khác
     * - super_admin: xóa được tất cả
     */
    public function delete(User $user, User $model): bool
    {
        // User không được xóa gì cả
        if ($user->isUser()) {
            return false;
        }

        // Không ai được xóa chính mình
        if ($user->id === $model->id) {
            return false;
        }

        // Super admin xóa được tất cả (trừ chính mình)
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Admin chỉ xóa được user thường
        if ($user->isAdmin()) {
            return $model->isUser();
        }

        return false;
    }

    /**
     * Restore user (nếu có soft delete)
     */
    public function restore(User $user, User $model): bool
    {
        return $this->delete($user, $model);
    }

    /**
     * Force delete user
     */
    public function forceDelete(User $user, User $model): bool
    {
        return $this->delete($user, $model);
    }
}

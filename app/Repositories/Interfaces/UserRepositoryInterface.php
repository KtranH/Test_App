<?php

declare(strict_types=1);

namespace App\Repositories\Interfaces;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Http\Requests\AuthRequest;

interface UserRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Tìm user theo email
     */
    public function findByEmail(string $email): ?User;

    /**
     * Tạo user mới từ AuthRequest
     */
    public function createFromRequest(AuthRequest $request): User;

    /**
     * Tìm users theo role
     */
    public function findByRole(string $role): Collection;

    /**
     * Tìm users theo status
     */
    public function findByStatus(string $status): Collection;

    /**
     * Tìm kiếm users
     */
    public function search(string $query): Collection;
}

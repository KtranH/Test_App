<?php

declare(strict_types=1);

namespace App\Interfaces;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Http\Requests\AuthRequest;


interface UserRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Tìm user theo email
     * @param string $email
     * @return User|null
     */
    public function findByEmail(string $email): ?User;

    /**
     * Tạo user mới từ AuthRequest
     * @param AuthRequest $request
     * @return User
     */
    public function createFromRequest(AuthRequest $request): User;

    /**
     * Tạo user mới từ array data
     * @param array $data
     * @return User
     */
    public function createFromArray(array $data): User;

    /**
     * Tìm users theo role
     * @param string $role
     * @return Collection
     */
    public function findByRole(string $role): Collection;

    /**
     * Tìm users theo status
     * @param string $status
     * @return Collection
     */
    public function findByStatus(string $status): Collection;

    /**
     * Tìm kiếm users
     * @param string $query
     * @return Collection
     */
    public function search(string $query): Collection;
}

<?php

declare(strict_types=1);

namespace App\Repositories\Interfaces;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

interface BaseRepositoryInterface
{
    /**
     * Lấy tất cả records
     */
    public function all(): Collection;

    /**
     * Lấy records với pagination
     */
    public function paginate(int $perPage = 15): LengthAwarePaginator;

    /**
     * Tìm record theo ID
     */
    public function find(int $id): ?Model;

    /**
     * Tạo record mới
     */
    public function create(array $data): Model;

    /**
     * Cập nhật record
     */
    public function update(int $id, array $data): bool;

    /**
     * Xóa record
     */
    public function delete(int $id): bool;

    /**
     * Kiểm tra record có tồn tại
     */
    public function exists(int $id): bool;
}

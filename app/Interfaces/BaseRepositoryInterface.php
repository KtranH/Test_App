<?php

declare(strict_types=1);

namespace App\Interfaces;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

interface BaseRepositoryInterface
{
    /**
     * Lấy tất cả records
     * @return Collection
     */
    public function all(): Collection;

    /**
     * Lấy records với pagination
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function paginate(int $perPage = 15): LengthAwarePaginator;

    /**
     * Tìm record theo ID
     * @param int $id
     * @return Model|null
     */
    public function find(int $id): ?Model;

    /**
     * Tạo record mới
     * @param array $data
     * @return Model
     */
    public function create(array $data): Model;

    /**
     * Cập nhật record
     * @param int $id
     * @param array $data
     * @return bool
     */
    public function update(int $id, array $data): bool;

    /**
     * Xóa record
     * @param int $id
     * @return bool
     */
    public function delete(int $id): bool;

    /**
     * Kiểm tra record có tồn tại
     * @param int $id
     * @return bool
     */
    public function exists(int $id): bool;
}

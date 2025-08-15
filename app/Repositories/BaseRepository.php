<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Repositories\Interfaces\BaseRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

abstract class BaseRepository implements BaseRepositoryInterface
{
    protected Model $model;

    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    /**
     * Lấy tất cả records
     */
    public function all(): Collection
    {
        return $this->model->all();
    }

    /**
     * Lấy records với pagination
     */
    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->paginate($perPage);
    }

    /**
     * Tìm record theo ID
     */
    public function find(int $id): ?Model
    {
        return $this->model->find($id);
    }

    /**
     * Tạo record mới
     */
    public function create(array $data): Model
    {
        return $this->model->create($data);
    }

    /**
     * Cập nhật record
     */
    public function update(int $id, array $data): bool
    {
        $model = $this->find($id);
        
        if (!$model) {
            return false;
        }

        return $model->update($data);
    }

    /**
     * Xóa record
     */
    public function delete(int $id): bool
    {
        $model = $this->find($id);
        
        if (!$model) {
            return false;
        }

        return $model->delete();
    }

    /**
     * Kiểm tra record có tồn tại
     */
    public function exists(int $id): bool
    {
        return $this->model->where('id', $id)->exists();
    }
}

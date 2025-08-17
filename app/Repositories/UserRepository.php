<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\User;
use App\Repositories\BaseRepository;
use App\Interfaces\UserRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\AuthRequest;
    
class UserRepository extends BaseRepository implements UserRepositoryInterface
{
    public function __construct(User $model)
    {
        parent::__construct($model);    
    }

    /**
     * Override find để return User thay vì Model
     * @param int $id
     * @return User|null
     */
    public function find(int $id): ?User
    {
        return $this->model->find($id);
    }

    /**
     * Override create để return User thay vì Model
     * @param array $data
     * @return User
     */
    public function create(array $data): User
    {
        return $this->model->create($data);
    }

    /**
     * Tìm user theo email
     */
    public function findByEmail(string $email): ?User
    {
        return $this->model->where('email', $email)->first();
    }

    /**
     * Tạo user mới từ AuthRequest
     * @param AuthRequest $request
     * @return User
     */
    public function createFromRequest(AuthRequest $request): User
    {
        $data = [
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role ?? 'user',
            'status' => $request->status ?? 'active',
        ];
        return $this->model->create($data);
    }

    /**
     * Tạo user mới từ array data
     * @param array $data
     * @return User
     */
    public function createFromArray(array $data): User
    {
        $userData = [
            'name' => $data['name'],
            'email' => $data['email'],
            'email_verified_at' => now(),
            'password' => Hash::make($data['password']),
            'role' => $data['role'] ?? 'user',
            'status' => $data['status'] ?? 'active',
        ];
        return $this->model->create($userData);
    }

    /**
     * Override update để hash password
     * @param int $id
     * @param array $data
     * @return bool
     */
    public function update(int $id, array $data): bool
    {
        // Hash password nếu có
        if (isset($data['password'])) $data['password'] = Hash::make($data['password']);
        return parent::update($id, $data);
    }

    /**
     * Tìm users theo role
     * @param string $role
     * @return Collection
     */
    public function findByRole(string $role): Collection
    {
        return $this->model->where('role', $role)->get();
    }

    /**
     * Tìm users theo status
     * @param string $status
     * @return Collection
     */
    public function findByStatus(string $status): Collection
    {
        return $this->model->where('status', $status)->get();
    }

    /**
     * Tìm kiếm users
     * @param string $query
     * @return Collection
     */
    public function search(string $query): Collection
    {
        return $this->model
            ->where('name', 'like', "%{$query}%")
            ->orWhere('email', 'like', "%{$query}%")
            ->get();
    }
}

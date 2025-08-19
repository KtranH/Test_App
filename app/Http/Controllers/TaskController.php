<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Froiden\RestAPI\ApiController;
use App\Http\Requests\TaskRequest\StoreRequest;
use App\Http\Requests\TaskRequest\UpdateRequest;
use App\Http\Requests\TaskRequest\DestroyRequest;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class TaskController extends ApiController
{
    use AuthorizesRequests;
    
    protected $model = Task::class;

    protected $defaultLimit = 10;

    protected $storeRequest = StoreRequest::class;
    protected $updateRequest = UpdateRequest::class;
    protected $deleteRequest = DestroyRequest::class;

    /**
     * Constructor - đảm bảo user đã authenticate
     */
    public function __construct()
    {
        parent::__construct();
    }
    /**
     * Tùy biến index 
     * @param mixed $query
     */
    protected function modifyIndex($query)
    {
        // Authorization: xem danh sách
        $this->authorize('viewAny', Task::class);
        // Kiểm tra name user có giá trị không
        if (request()->has('name')) {
            $name = request()->get('name');
            $query->whereHas('user', function($q) use ($name) {
                $q->where('name', 'like', "%{$name}%");
            });
        }
        return $query;
    }

    /**
     * Tùy biến show 1 task
     * @param mixed $query
     */
    protected function modifyShow($query)
    {
        $id = request()->route('id');
        if ($id) {
            $task = Task::findOrFail($id);
            $this->authorize('view', $task);
        }
        return $query;
    }

    /**
     * Tùy biến store 1 task
     * @param Task $task
     * @return Task
     */
    protected function storing(Task $task): Task
    {
        // Lấy user_id từ payload để kiểm soát quyền tạo
        $task->user_id = request()->input('user_id', $task->user_id);
        $this->authorize('create', $task);
        return $task;
    }

    /**
     * Tùy biến update 1 task
     * @param Task $task
     * @return Task
     */
    protected function updating(Task $task): Task
    {
        $this->authorize('update', $task);
        return $task;
    }

    /**
     * Tùy biến delete 1 task
     * @param Task $task
     * @return Task
     */
    protected function destroying(Task $task): Task
    {
        $this->authorize('delete', $task);
        // Chỉ cho phép xóa khi status thuộc các trạng thái cho phép
        $allowedStatuses = ['pending', 'completed', 'cancelled'];
        if (!in_array($task->status, $allowedStatuses, true)) {
            abort(422, 'Chỉ được xóa task khi trạng thái là pending, completed hoặc cancelled');
        }
        return $task;
    }
}
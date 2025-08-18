<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use App\Models\User;
use App\Policies\UserPolicy;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        User::class => UserPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        // Đăng ký policies
        $this->registerPolicies();

        // Có thể thêm các Gate tùy chỉnh ở đây
        // Gate::define('admin-access', function (User $user) {
        //     return $user->canManage();
        // });
    }
}

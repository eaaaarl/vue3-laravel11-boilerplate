import { createRouter, createWebHistory } from "vue-router";
import LoginLayout from "@/layouts/LoginLayout.vue";
import AdminLayout from "@/layouts/AdminLayout.vue";
import { useAuthStore } from "./store/Auth";
import { useToast } from "vue-toastification";
import _PrintLayout from "./layouts/_PrintLayout.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/print',
            component: _PrintLayout,
            children: [
                {
                    path: '/print/students',
                    name: 'student-print-page',
                    component: () => import('@/pages/Print/StudentPrint.vue'),
                    meta: {
                        title: 'Print Page',
                        requiresAuth: true
                    }
                }
            ]
        },
        {
            path: '/',
            component: LoginLayout,
            children: [
                {
                    path: '',
                    name: 'login-page',
                    component: () => import('@/pages/LoginPage.vue'),
                    meta: {
                        title: 'Login'
                    }
                }
            ]
        },
        {
            path: '/admin',
            component: AdminLayout,
            children: [
                {
                    path: '/dashboard',
                    name: 'dashboard-page',
                    component: () => import('@/pages/DashboardPage.vue'),
                    meta: {
                        title: 'Dashboard',
                        requiresAuth: true
                    }
                },
                {
                    path: '/student',
                    name: 'student-page',
                    component: () => import('@/pages/StudentPage.vue'),
                    meta: {
                        title: 'Student',
                        requiresAuth: true
                    }
                },
                {
                    path: '/form/:operation',
                    name: 'student-form-page',
                    component: () => import('@/pages/studentFormPage.vue'),
                    meta: {
                        title: 'Form Student',
                        requiresAuth: true
                    }
                },
            ]
        },
    ]
});

router.afterEach((to, from, next) => {
    let title = "Main";
    if (to.meta.title) {
        title += ' | ' + to.meta.title;
    }
    document.title = title;
});

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();
    const toast = useToast();

    const isProtectedRoute = to.matched.some(
        (record) => record.meta.requiresAuth
    )

    await authStore.refresh();
    const isAuthenticated = authStore.isAuthenticated;

    if (isProtectedRoute && !isAuthenticated) {
        toast.error('Session Expired. Please login to proceed!');
        return next({ name: 'login-page' });
    }

    if (to.name !== 'login-page') {
        document.body.classList.remove('login-page');
    } else {
        document.body.classList.add('login-page');
    }
    next();
});

export default router;
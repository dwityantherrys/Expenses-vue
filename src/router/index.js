import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

// Daftar routes
const routes = [
    {
        path: '/',
        redirect: () => {
            // Redirect berdasarkan status autentikasi menggunakan JWT
            console.log(localStorage.getItem('authToken'));
            return localStorage.getItem('authToken') ? '/dashboard' : '/auth/login';
        }
    },
    {
        path: '/auth/login',
        name: 'login',
        component: () => import('@/views/pages/auth/Login.vue')
    },
    {
        path: '/auth/access',
        name: 'accessDenied',
        component: () => import('@/views/pages/auth/Access.vue')
    },
    {
        path: '/auth/error',
        name: 'error',
        component: () => import('@/views/pages/auth/Error.vue')
    },
    {
        path: '/landing',
        name: 'landing',
        component: () => import('@/views/pages/Landing.vue')
    },
    {
        path: '/pages/notfound',
        name: 'notfound',
        component: () => import('@/views/pages/NotFound.vue')
    },
    {
        path: '/',
        component: AppLayout,
        children: [
            {
                path: '/dashboard',
                name: 'dashboard',
                component: () => import('@/views/Dashboard.vue'),
                meta: { requiresAuth: true } // Hanya akses jika login
            },
            {
                path: '/uikit/formlayout',
                name: 'formlayout',
                component: () => import('@/views/uikit/FormLayout.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/uikit/input',
                name: 'input',
                component: () => import('@/views/uikit/InputDoc.vue')
            },
            {
                path: '/uikit/button',
                name: 'button',
                component: () => import('@/views/uikit/ButtonDoc.vue')
            },
            {
                path: '/uikit/table',
                name: 'table',
                component: () => import('@/views/uikit/TableDoc.vue')
            },
            {
                path: '/uikit/table-pengajuan',
                name: 'table-pengajuan',
                component: () => import('@/views/uikit/Table_Pengajuan.vue')
            },
            {
                path: '/uikit/table-persetujuan',
                name: 'table-persetujuan',
                component: () => import('@/views/uikit/Table_Persetujuan.vue')
            },
            {
                path: '/pages/input-pengajuan',
                name: 'input-pengajuan',
                component: () => import('@/views/pages/Input_Pengajuan.vue')
            },
            {
                path: '/pages/persetujuan',
                name: 'persetujuan',
                component: () => import('@/views/pages/Persetujuan.vue')
            },
            {
                path: '/uikit/list',
                name: 'list',
                component: () => import('@/views/uikit/ListDoc.vue')
            },
            {
                path: '/uikit/tree',
                name: 'tree',
                component: () => import('@/views/uikit/TreeDoc.vue')
            },
            {
                path: '/uikit/panel',
                name: 'panel',
                component: () => import('@/views/uikit/PanelsDoc.vue')
            },
            {
                path: '/uikit/overlay',
                name: 'overlay',
                component: () => import('@/views/uikit/OverlayDoc.vue')
            },
            {
                path: '/uikit/media',
                name: 'media',
                component: () => import('@/views/uikit/MediaDoc.vue')
            },
            {
                path: '/uikit/message',
                name: 'message',
                component: () => import('@/views/uikit/MessagesDoc.vue')
            },
            {
                path: '/uikit/file',
                name: 'file',
                component: () => import('@/views/uikit/FileDoc.vue')
            },
            {
                path: '/uikit/menu',
                name: 'menu',
                component: () => import('@/views/uikit/MenuDoc.vue')
            },
            {
                path: '/uikit/charts',
                name: 'charts',
                component: () => import('@/views/uikit/ChartDoc.vue')
            },
            {
                path: '/uikit/misc',
                name: 'misc',
                component: () => import('@/views/uikit/MiscDoc.vue')
            },
            {
                path: '/uikit/timeline',
                name: 'timeline',
                component: () => import('@/views/uikit/TimelineDoc.vue')
            },
            {
                path: '/pages/empty',
                name: 'empty',
                component: () => import('@/views/pages/Empty.vue')
            },
            {
                path: '/pages/crud',
                name: 'crud',
                component: () => import('@/views/pages/Crud.vue')
            },
            {
                path: '/documentation',
                name: 'documentation',
                component: () => import('@/views/pages/Documentation.vue')
            }
            // Tambahkan rute lainnya di sini, pastikan menambahkan meta: { requiresAuth: true } untuk halaman yang butuh autentikasi
        ]
    }
];

// Buat instance router
const router = createRouter({
    history: createWebHistory(),
    routes
});

// Tambahkan router guard untuk autentikasi
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('authToken'); // Ambil token dari localStorage

    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (!token) {
            // Redirect ke halaman login jika tidak ada token
            next({ name: 'login' });
        } else {
            // Token ada, lanjutkan
            next();
        }
    } else {
        next(); // Untuk rute tanpa autentikasi
    }
});

export default router;

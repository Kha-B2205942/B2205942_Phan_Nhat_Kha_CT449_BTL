import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import LoginView from "../views/LoginView.vue";
import Register from "../views/Register.vue";
import Home from "../views/Home.vue";
import ProfileView from "../views/ProfileView.vue";
import BookDetail from "../views/BookDetail.vue";
import BorrowHistory from "../views/BorrowHistory.vue";
import Explore from "../views/Explore.vue";

const routes = [
    {
        path: "/",
        name: "home",
        component: Home,
    },
    {
        path: "/login",
        name: "login",
        component: LoginView,
    },
    {
        path: "/register",
        name: "register",
        component: Register,
    },
    {
        path: "/profile",
        name: "profile",
        component: ProfileView,
        meta: { requiresAuth: true }
    },
    {
        path: "/history",
        name: "BorrowHistory",
        component: BorrowHistory,
        meta: { requiresAuth: true }
    },
    {
        path: "/explore",
        name: "explore",
        component: Explore,
    },
    
    {
        path: '/sach/:id',
        name: 'BookDetail',
        component: BookDetail,
        meta: { requiresAuth: true }
    },

    {
        path: "/:pathMatch(.*)*",
        redirect: "/login",
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    const isLoggedIn = !!authStore.token;

    if (to.meta.requiresAuth && !isLoggedIn) {
        return next({ name: "login" });
    }
    if (isLoggedIn && to.name === 'login') {
        return next({ path: "/" });
    }
    next();
});

export default router;
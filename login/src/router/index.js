import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import SignupView from '../views/SignupView.vue';
import PaginaView from '../views/PaginaView.vue';

const routes = [
  { path: '/', name: 'login', component: LoginView },
  { path: '/signup', name: 'signup', component: SignupView },
  { path: '/pagina', name: 'pagina', component: PaginaView, meta: { requiresAuth: true } },
  { path: '/registrarse', redirect: '/signup' }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// Guard de navegación
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    // Si la ruta requiere autenticación y el usuario no está autenticado, redirige a login
    next({ name: 'login' });
  } else {
    next(); // Permite el acceso a la ruta
  }
});

export default router;
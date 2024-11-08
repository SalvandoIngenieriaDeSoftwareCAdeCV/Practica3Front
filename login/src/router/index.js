import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import SignupView from '../views/SignupView.vue';
import PaginaAdminView from '../views/PaginaAdminView.vue';
import PaginaUsuarioView from '../views/PaginaUsuarioView.vue';

const routes = [
  { path: '/', name: 'login', component: LoginView },
  { path: '/signup', name: 'signup', component: SignupView },
  { path: '/admin', name: 'PaginaAdminView', component: PaginaAdminView, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/usuario', name: 'PaginaUsuarioView', component: PaginaUsuarioView, meta: { requiresAuth: true, role: 'user' } },
  { path: '/registrarse', redirect: '/signup' }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// Guard de navegación
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const userRole = localStorage.getItem("userRole"); // Almacena el rol del usuario en el localStorage después del login

  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    // Redirige a login si la ruta requiere autenticación y el usuario no está autenticado
    next({ name: 'login' });
  } else if (to.meta.role === 'admin' && userRole !== 'admin') {
    // Redirige a usuario si el usuario intenta acceder a una ruta de administrador sin el rol adecuado
    next({ name: 'PaginaUsuarioView' });
  } else if (to.meta.role === 'user' && userRole !== 'user') {
    // Redirige a admin si el usuario intenta acceder a una ruta de usuario sin el rol adecuado
    next({ name: 'PaginaAdminView' });
  } else {
    next(); // Permite el acceso a la ruta
  }
});

export default router;
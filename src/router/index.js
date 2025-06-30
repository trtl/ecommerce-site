import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import ProductPage from '@/views/ProductPage.vue';
import ContactPage from '@/views/ContactPage.vue';
import AboutPage from '@/views/AboutPage.vue';
import PrivacyPage from '@/views/PrivacyPage.vue';
import ShippingPage from '@/views/ShippingPage.vue';
import ItemPage from "@/views/ItemPage.vue";
import CartPage from "@/views/CartPage.vue";
import CheckoutPage from "@/views/CheckoutPage.vue";
import ProfilePage from '@/views/ProfilePage.vue';
import AdminPage from '@/views/AdminPage.vue';
import LoginPage from '@/views/LoginPage.vue';
import SignupPage from '@/views/SignupPage.vue';
import { useUserStore } from '@/store/user'


const routes = [
  { path: '/', component: HomePage },
  { path: '/products', component: ProductPage },
  { path: '/contacts', component: ContactPage },
  { path: '/about', component: AboutPage },
  { path: '/privacy-policy', component: PrivacyPage },
  { path: '/shipping-returns', component: ShippingPage },
  { path: "/product/:id", component: ItemPage, props: true },
  { path: "/cart", component: CartPage },
  { path: "/checkout", name: "CheckoutPage", component: CheckoutPage },
  { path: '/profile', name: 'Profile', component: ProfilePage, meta: { requiresAuth: true } },
  { path: '/login', name: 'Login',component: LoginPage },
  { path: '/signup', name: 'Signup', component: SignupPage },
  { path: '/admin', name: 'Admin', component: AdminPage, meta: { requiresAuth: true, isAdmin: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// navigation guard
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();

  if (!userStore.isInitialized) {
    await userStore.initializeAuth();
  }

  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next({ name: "Login" });
  } else if (to.meta.isAdmin && userStore.userInfo.role !== "admin") {
    next({ path: "/" });
  } else {
    next(); 
  }
});

export default router;
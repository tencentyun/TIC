import Vue from 'vue';
import VueRouter from 'vue-router';
import Main from '../views/Main.vue';
import store from '../store/index';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Main',
    component: Main,
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue'),
  },
];

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const { classInfo } = store.state;
  if (to.path === '/login') {
    next();
  } else {
    if (classInfo && classInfo.sdkAppId && classInfo.userId && classInfo.userSig) {
      next();
    } else {
      next('/login');
    }
  }
});
export default router;

import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import goTo from 'vuetify/es5/services/goto';
import Todo from '../views/Todo.vue';
import Tasks from '../views/Tasks.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/todo',
  },
  {
    path: '/todo',
    name: 'Todo',
    component: Todo,
  },
  {
    path: '/todo/:userId',
    name: 'Tasks',
    component: Tasks,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    let scrollTo = 0;

    if (savedPosition) {
      scrollTo = savedPosition.y;
    }

    //@ts-ignore
    return goTo(scrollTo);
  },
});

export default router;

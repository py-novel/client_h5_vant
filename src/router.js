import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const routes = [
  {
    path: '*',
    redirect: '/shelf'
  },
  {
    name: 'shelf',
    component: () => import('./views/shelf'),
    meta: {
      title: '公羊阅读'
    }
  },
  {
    name: 'read',
    component: () => import('./views/read'),
    meta: {
      title: '公羊阅读'
    }
  },
  {
    name: 'classify',
    component: () => import('./views/classify'),
    meta: {
      title: '公羊阅读'
    }
  },
  {
    name: 'intro',
    component: () => import('./views/intro'),
    meta: {
      title: '公羊阅读'
    }
  },
  {
    name: 'oauth',
    component: () => import('./views/oauth'),
    meta: {
      title: '公羊阅读'
    }
  },
  {
    name: 'search',
    component: () => import('./views/search'),
    meta: {
      title: '公羊阅读'
    }
  },
];

// add route path
routes.forEach(route => {
  route.path = route.path || '/' + (route.name || '');
});

const router = new Router({ routes });

router.beforeEach((to, from, next) => {
  const title = to.meta && to.meta.title;
  if (title) {
    document.title = title;
  }
  next();
});

export {
  router
};

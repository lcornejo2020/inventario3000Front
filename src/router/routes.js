
const routes = [
  { path: '/', redirect: '/home' },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'home', component: () => import('pages/Index.vue') },
      { path: 'inventario', component: () => import('pages/Inventario.vue') }
    ]
  },
  {
    path: '/login', component: () => import('pages/Login.vue')
  },
  {
    path: '/logout', component: () => import('pages/Logout.vue')
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes

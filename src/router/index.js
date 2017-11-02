import Login from '@/components/Login'
import Home from '@/components/Home'

let routes = [
  {
    path: '/',
    component: Login,
    name: 'Login'
  },
  {
    path: '/login',
    component: Login,
    name: 'Login'
  },
  {
    path: '/home',
    component: Home,
    name: 'Home'
  }
];

export default routes;

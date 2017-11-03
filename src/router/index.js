import Login from '@/components/Login'
import Home from '@/components/Home'
import TableView from '@/components/TableView'
import Where from '@/components/404'


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
    name: 'Home',
    children: [
      { path: '/tableView', component: TableView, name: 'tableView'},
      { path: '/where', component: Where, name: 'Where'},

    ]
  }
];

export default routes;

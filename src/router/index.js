import Login from '@/components/Login'
import MainFrame from '@/components/MainFrame'
import TableView from '@/components/TableView'
import Where from '@/components/404'
import ManagerWaitWork from '@/components/manager/waitWork'
import CaseList from '@/components/manager/caseList'
import Working from '@/components/worker/working'


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
    path: '/mainFrame',
    component: MainFrame,
    name: 'mainFrame',
    children: [
      { path: '/tableView', component: TableView, name: 'tableView'},
      { path: '/where', component: Where, name: 'Where'},
      { path: '/manager/waitWork', component: ManagerWaitWork, name: 'ManagerWaitWork'},
      { path: '/worker/working', component: Working, name: 'Working'},
    ]
  },
  {
    path:'/manager/caseList',
    component: CaseList,
    name: 'CaseList'
  }
];

export default routes;

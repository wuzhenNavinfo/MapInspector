import Login from '@/components/Login'
import MainFrame from '@/components/MainFrame'
import TableView from '@/components/TableView'
import Where from '@/components/404'
import WaitWork from '@/components/manager/waitWork'
import CaseList from '@/components/manager/caseList'


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
      { path: '/manager/waitWork', component: WaitWork, name: 'WaitWork'},
      // { path: '/manager/caseList', component: CaseList, name: 'CaseList'}
    ]
  },
  {
    path:'/manager/caseList',
    component: CaseList,
    name: 'CaseList'
  }
];

export default routes;

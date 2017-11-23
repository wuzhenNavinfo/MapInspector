import Login from '@/components/Login'
import MainFrame from '@/components/MainFrame'
import TableView from '@/components/TableView'
import Where from '@/components/404'
import ManagerWaitWork from '@/components/manager/waitWork'
import CaseList from '@/components/manager/caseList'
import AuditIssue from '@/components/manager/auditIssue'
import WaitWork from '@/components/worker/waitWork'
import enterIssue from '@/components/worker/enterIssue'
import AlreadyWork from '@/components/worker/alreadyWork'


let routes = [
  {
    path: '/',
    component: Login,
    name: 'Login' // name需要保持唯一,通过router.push({name:'Login'})方式切换路由
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
      { path: '/worker/waitWork', component: WaitWork, name: 'WaitWork'},
      { path: '/worker/submited', component: Where, name: 'Where'},
      { path: '/worker/completed', component: Where, name: 'Where'},
      { path: '/worker/alreadyWork', component: AlreadyWork, name: 'AlreadyWork'}
    ]
  },
  {
    path: '/manager/caseList', component: CaseList, name: 'CaseList'
  },
  { path: '/worker/enterIssue', component: enterIssue, name: 'enterIssue'},
  { path: '/worker/auditIssue', component: AuditIssue, name: 'AuditIssue'}
];

export default routes;

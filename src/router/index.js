import Login from '@/components/Login'
import Register from '@/components/Register'
import ResetPassword from '@/components/ResetPassword'
import MainFrame from '@/components/MainFrame'
import ManagerWaitWork from '@/components/manager/waitWork'
import ManagerCaseList from '@/components/manager/caseList'
import AuditIssue from '@/components/manager/auditIssue'
import AlreadyAudit from '@/components/manager/alreadyAudit'
import WaitWork from '@/components/worker/waitWork'
import enterIssue from '@/components/worker/enterIssue'
import AlreadyWork from '@/components/worker/alreadyWork'
import AlreadyCompleted from '@/components/worker/alreadyCompleted'
import WorkerCaseList from '@/components/worker/caseList'
import AuditedList from '@/components/user/auditedList'
import WaitAuditList from '@/components/user/waitAuditList'
import AuditNoPass from '@/components/user/auditNoPass'



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
    path: '/register',
    component: Register,
    name: 'Register'
  },
  {
    path: '/resetPassword',
    component: ResetPassword,
    name: 'ResetPassword'
  },
  {
    path: '/mainFrame',
    component: MainFrame,
    name: 'mainFrame',
    children: [
      { path: '/user/auditedList', component: AuditedList, name: 'AuditedList'},
      { path: '/user/waitAuditList', component: WaitAuditList, name: 'WaitAuditList'},
      { path: '/user/auditNoPass', component: AuditNoPass, name: 'AuditNoPass'},
      { path: '/manager/waitWork', component: ManagerWaitWork, name: 'ManagerWaitWork'},
      { path: '/manager/alreadyAudit', component: AlreadyAudit, name: 'AlreadyAudit'},
      { path: '/worker/waitWork', component: WaitWork, name: 'WaitWork'},
      { path: '/worker/alreadyWork', component: AlreadyWork, name: 'AlreadyWork'},
      { path: '/worker/alreadyCompleted', component: AlreadyCompleted, name: 'AlreadyCompleted'},
    ]
  },
  { path: '/manager/caseList', component: ManagerCaseList, name: 'ManagerCaseList' },
  { path: '/manager/auditIssue', component: AuditIssue, name: 'AuditIssue'},
  { path: '/worker/enterIssue', component: enterIssue, name: 'enterIssue'},
  { path: '/worker/caseList', component: WorkerCaseList, name: 'WorkerCaseList' }
];

export default routes;

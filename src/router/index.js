import { createRouter, createWebHistory } from 'vue-router'
import { useLoadingStore } from '@/stores/LoadingStore'
import keycloak from '@/composable/keycloak'
import LoginForm from '@/views/Auth/LoginFormNew.vue'
import Dashboard from '@/views/Dashboard/Dashboard.vue'
import DashboardDetails from '@/views/Dashboard/DashboardDetails.vue'
import DevicesList from '@/views/Devices/DevicesList.vue'
import DumpTruck from '@/views/Map/DumpTruck/MainMap.vue'
import Excavator from '@/views/Map/Excavator/NotFound.vue'
import LightVehicle from '@/views/Map/LightVehicle/NotFound.vue'
import DM from '@/views/Map/DM/NotFound.vue'
import DevicesRealtime from '@/views/Dashboard/DevicesRealtime'
import Violation from '@/views/Violation/ViolationMain.vue'
import DeviceDetails from '@/views/Devices/DeviceDetails.vue'
import ResetPassword from '@/views/Auth/ResetPassword.vue'
import MainMap from '@/views/Map/MainMap.vue'
import NotFound from '@/views/error/NotFound.vue'
import Setting from '@/views/Setting/Setting.vue'
import Report from '@/views/Report/Report.vue'
import StreamingDashboard from '@/views/Dashboard/StreamingDashboard.vue'

const routes = [
  { path: '/', name: 'Login Page', component: LoginForm, meta: { requiresAuth:false, title: 'Intellisense Fleet Management System - Login' } },
  { path: '/reset-password', name: 'ResetPassword', component: ResetPassword, meta: { requiresAuth:false} },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth:true }},
  { path: '/streaming', name: 'StreamingDashboard', component: StreamingDashboard, meta: { requiresAuth:true }},
  { path: '/dashboard/details/:id', name: 'Dashboard Details', component: DashboardDetails,props: true, meta: { requiresAuth:true }},
  { path: '/dumptruck', name: 'DumpTruck', component: DumpTruck, meta: { requiresAuth:true } },
  { path: '/excavator', name: 'Excavator', component: Excavator, meta: { requiresAuth:true } },
  { path: '/lightvehicle', name: 'LightVehicle', component: LightVehicle, meta: { requiresAuth:true } },
  { path: '/dm', name: 'DM', component: DM, meta: { requiresAuth:true } },
  { path: '/devices-realtime', name: 'DevicesRealtime', component: DevicesRealtime, meta: { requiresAuth:true } },
  { path: '/violation', name: 'Violation', component: Violation, meta: { requiresAuth:true } },
  { path: '/report', name: 'Report', component: Report, meta: { requiresAuth:true } },
  
  { path: '/devices', name: 'Devices List', component: DevicesList, meta: { requiresAuth:true }},
  { path: '/devices/details/:id', name: 'Device Details', component: DeviceDetails, props: true, meta: { requiresAuth:true }},
  { path: '/geolocation', name: 'MainMap', component: MainMap, meta: { requiresAuth:true } },
  { path: '/setting', name: 'Setting', component: Setting, meta: { requiresAuth:true } },

  { path: '/:catchALL(.*)', name: 'NotFound', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(process.env.VUE_APP_BASE_URL),
  routes
})

router.beforeEach(async (to, from,  next) => {
  document.title = 'Teman Indobara | Terukur dan Aman'
  if (to.meta.requiresAuth && !localStorage.getItem('auth.accessToken')){
    keycloak.login()
    // next({ name: 'Dashboard'})
  } else if (to.meta.requiresAuth && localStorage.getItem('auth.accessToken') || to.meta.freeAccess){
    next()
  } else if (!to.meta.requiresAuth && localStorage.getItem('auth.accessToken')){
    next({name: 'Dashboard'})
  } else next()
  }) 


export default router
import Vue from 'vue'
import VueRouter from 'vue-router'
import RegistryView from '../views/RegistryView.vue'
import ReferenceContentView from '../views/ReferenceContentView.vue'
import ReferencePropertiesView from '../views/ReferencePropertiesView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Registry',
    component: RegistryView
  },
  {
    path: '/reference/:code',
    name: 'ReferenceContent',
    component: ReferenceContentView,
    props: true // Передаем :code как props в компонент
  },
  {
    path: '/properties/:code',
    name: 'ReferenceProperties',
    component: ReferencePropertiesView,
    props: true
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

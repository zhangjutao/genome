import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/index'
import window from '@/../static/config.js'
let BasePath = window.g.basePath

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: BasePath,
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      
      children:[
        {path: 'map',name: 'map',component:  resolve => require(['@/views/Map'], resolve)},
        {path: 'home',name: 'home',component:  resolve => require(['@/views/home'], resolve)},
        {path: 'jbrowse',name: 'jbrowse',component:  resolve => require(['@/views/JBrowse'], resolve)},
        {path: 'version',name: 'version',component:  resolve => require(['@/views/version'], resolve)},
        {path: 'blast',name: 'blast',component:  resolve => require(['@/views/BLAST'], resolve)},
        {path: 'primerDesign',name: 'primerDesign',component:  resolve => require(['@/views/primerDesign'], resolve)},
        {path: 'download',name: 'download',component:  resolve => require(['@/views/Download'], resolve)},
        {path: 'Acknowledgement',name: 'Acknowledgement',component:  resolve => require(['@/views/Acknowledgement'], resolve)},
        {path: 'backStage',name: 'backStage',component:  resolve => require(['@/views/backStage/backStage'], resolve)},
        {path: 'preview',name: 'preview',component:  resolve => require(['@/views/backStage/preview'], resolve)},
        {path: 'login',name: 'login',component:  resolve => require(['@/views/backStage/login'], resolve)},
        {
          path: 'geneInfo',
          name: 'geneInfo',
          component:  resolve => require(['@/views/GeneInfo'], resolve),
          children: [
            {path:'base',name:'base',component:  resolve => require(['@/views/genesInfo/base'], resolve)},
            {path:'sequence',name:'sequence',component:  resolve => require(['@/views/genesInfo/sequence'], resolve)},
            {path:'anno',name:'anno',component:  resolve => require(['@/views/genesInfo/annotation'], resolve)},
            {path:'structure',name:'structure',component:  resolve => require(['@/views/genesInfo/structure'], resolve)},
          ],
          // redirect: '/geneInfo/base'
        }
      ],
      redirect: 'map'
    },
    {
      path: '*',
      component: resolve => require(['@/views/pageError'], resolve)
    },
  ]
})

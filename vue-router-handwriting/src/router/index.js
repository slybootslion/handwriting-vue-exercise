import Vue from 'vue'
import VueRouter from '../vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: About,
    children: [
      {
        path: 'a',
        component: {
          render(h) {
            return <h3>router a</h3>
          }
        }
      },
      {
        path: 'b',
        component: {
          render(h) {
            return <h3>router b</h3>
          }
        }
      },
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from , next) => {
  setTimeout(() => {
    console.log('1')
    next()
  }, 1000)
})

router.beforeEach((to, from, next) => {
  setTimeout(() => {
    console.log('2')
    next()
  }, 1500)
})

export default router

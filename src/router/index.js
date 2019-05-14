import Vue from 'vue'
import Router from 'vue-router'
import GoodsList from '@/views/GoodsList'
import CartList from '@/views/CartList'
import Address from '@/views/Address'
import OrderConfirm from '@/views/OrderConfirm'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'GoodsList',
      component: GoodsList
    },
    {
      path: '/cart',
      name: 'CartList',
      component: CartList
    },
    {
      path: '/address',
      name: 'Address',
      component: Address
    },
    {
      path: '/orderConfirm',
      name: 'orderConfirm',
      component: OrderConfirm
    }
  ]
})

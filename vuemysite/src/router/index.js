import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/pages/Login'
import Dashboard from '@/components/Dashboard'
import Products from '@/components/pages/Products'
import CustomerOrders from '@/components/pages/CustomerOrders'
import Cuppon from '@/components/pages/Cuppon'


Vue.use(Router)

export default new Router({
	routes: [
		{
			path: '/',
			name: 'HelloWorld',
			component: HelloWorld,
			meta: { requiresAuth: true }
		},
		{
			path: '/login',
			name: 'Login',
			component: Login
		},
		{
			path: '/admin',
			name: 'Dashboard',
			component: Dashboard,
			children: [
				{
					path: 'products',
					name: 'Products',
					component: Products,
					meta: { requiresAuth: true }
				},
				{
					path: 'cuppon',
					name: 'cuppon',
					component: Cuppon,
					meta: { requiresAuth: true }
				},
			]
		},
		{
			path: '/',
			name: 'Dashboard',
			component: Dashboard,
			children: [
				{
					path: 'customer_orders',
					name: 'CustomerOrders',
					component: CustomerOrders
				},
			]
		}
	]
})

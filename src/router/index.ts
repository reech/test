import Vue from "vue"
import VueRouter, { RouteConfig } from "vue-router"
import Home from "../views/Home.vue"
const Price = () => import("@/views/Price.vue") // webpack-chunked to reduce loading time

Vue.use(VueRouter)

export const routes: Array<RouteConfig> = [
	{
		path: "/",
		name: "Home",
		component: Home,
	},
	{
		path: "/price",
		name: "Price",
		component: Price,
		props: true
	},
]

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes,
})

export default router

import Vue from 'vue'
import VueRouter from "vue-router";
import Login from "../components/Login";
import LuckyWheel from "../components/LuckyWheel";
import Server from "../components/Server";

Vue.use(VueRouter)

export default new VueRouter({
    routes: [
        {
            path: '/',
            redirect: '/Login'
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/luckyWheel',
            name: 'luckyWheel',
            component: LuckyWheel
        },
        {
            path: '/server',
            name: 'server',
            component: Server
        }
    ]
})
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

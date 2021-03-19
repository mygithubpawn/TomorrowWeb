import Vue from 'vue'
import App from './App'
import router from './router'
import VueRouter from "vue-router";
import ElementUI from 'element-ui'
import qs from 'qs';
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import 'font-awesome/css/font-awesome.min.css'
import moment from 'moment'
import da from "element-ui/src/locale/lang/da"
import wordcloud from 'vue-wordcloud'
import leftMen from './layout/left-menu'
import topHeader from './layout/top-header'
import userInfo from './pawn/portal/arctieVim/user-info'
import indexBottom from './pawn/portal/arctieVim/index-bottom'
import commBottom from './pawn/portal/arctieVim/comm-bottom.vue'
import articleList from './pawn/portal/arctieVim/articleList.vue'
import communityList from './pawn/portal/arctieVim/community-list'
import communityArticleList from './pawn/portal/arctieVim/community-article-list.vue'
import communityNavigation from './pawn/portal/arctieVim/navigation-bar.vue'
import retrievePassword from './pawn/portal/arctieVim/retrieve-password'

axios.defaults.withCredentials = true;
//注册组件
Vue.prototype.$qs = qs;
Vue.prototype.$axios = axios;
Vue.component('wordcloud', wordcloud);
Vue.component('leftMen', leftMen);
Vue.component('topHeader', topHeader);
Vue.component('userInfo', userInfo);
Vue.component('indexBottom', indexBottom);
Vue.component('commBottom', commBottom);
Vue.component('articleList', articleList);
Vue.component('communityList', communityList);
Vue.component('communityArticleList', communityArticleList);
Vue.component('communityNavigation', communityNavigation);
Vue.component('retrievePassword', retrievePassword);

Vue.use(qs);
Vue.use(mavonEditor);
Vue.use(VueRouter);
Vue.use(ElementUI);

import {LoginGet} from './api/api'
import * as api from "./api/api";
Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
//如果是登录界面，则需要放行
  if (to.path === '/login'
      || to.path==='/'
      || to.path==='/404'
      || to.path==='/portal/community/bbs'
      || to.path==='/portal/article') {
    next();
  } else {
    //检查用户角色
    api.LoginGet().then(result => {
        let res = result.data;
        // console.log(sresult)
        // console.log(res.code);
        if (res.code == '200') {
          //成功，判断用户角色
          //如果是管理员，放行
          // if (res.data.userFromToken.roles === 'role_admin') {
          //   if (to.path === '/admin/box') {
          //   }
          //   next();
          // } else {
          //   if (to.path === '/user/list') {
          //   }
          //   next();
          // }
        } else {
          //跳转到登陆页面
          next({
            path: '/login',
          })
        }
      });
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})

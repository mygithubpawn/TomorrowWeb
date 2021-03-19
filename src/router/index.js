import Vue from 'vue'
import VueRouter from "vue-router";

Vue.use(VueRouter);

export const routes = [
  {
    name: 'base-view',
    path: '/user',
    mode: 'history',
    component: () => import('../layout/base-view'),
    children: [
      //主页
      {
        path: '/index',
        name: '博客信息',
        icon: 'el-icon-s-data',
        hidden: false,
        requireLogin: true,
        component: () => import('../pawn/dashboard/index'),
      },
      //类容管理
      {
        path: '/content',
        name: '文章',
        icon: 'el-icon-reading',
        hidden: false,
        requireLogin: true,
        component: () => import('../layout/right-content'),
        children: [
          {
            path: '/content/pot-article',
            name: '文章发布',
            icon: 'el-icon-edit-outline',
            hidden: false,
            component: () => import('../pawn/content/pot-article'),
          },
          {
            path: '/content/manage-article',
            name: '文章管理',
            icon: 'el-icon-notebook-1',
            hidden: false,
            component: () => import('../pawn/content/manage-article'),
          },
          {
            path: '/content/manage-recycle',
            name: '回收站',
            icon: 'el-icon-delete',
            hidden: false,
            component: () => import('../pawn/content/manage-recycle'),
          },
        ]
      },

      {
        path: '/operation',
        name: '运营',
        icon: 'el-icon-loading',
        hidden: false,
        component: () => import('../layout/right-content'),
        children: [
          {
            path: '/operation/manage-category',
            name: '分类管理',
            icon: 'el-icon-pie-chart',
            hidden: false,
            component: () => import('../pawn/operation/manage-category'),
          },
          {
            path: '/operation/loop',
            name: '轮播管理',
            icon: 'el-icon-help',
            hidden: false,
            component: () => import('../pawn/operation/loop'),
          },
          {
            path: '/content/manage-comment',
            name: '评论管理',
            icon: 'el-icon-chat-dot-square',
            hidden: false,
            component: () => import('../pawn/content/manage-comment'),
          },
          {
            path: '/content/manage-image',
            name: '图片管理',
            icon: 'el-icon-picture-outline',
            hidden: false,
            component: () => import('../pawn/content/manage-image'),
            children: [
              {
                path: '/content/cover-image',
                name: '文章封面管理',
                hidden: false,
                component: () => import('../pawn/content/imageModule/cover-image'),
              },
              {
                path: '/content/photo-album',
                name: '相册管理',
                hidden: false,
                component: () => import('../pawn/content/imageModule/photo-album'),
              },
            ]
          },
        ]
      },
      //设置
      {
        path: '/sattings',
        name: '设置',
        icon: 'el-icon-setting',
        hidden: false,
        component: () => import('../layout/right-content'),
        children: [
          {
            path: '/sattings/websize-info',
            name: '博客信息',
            icon: 'el-icon-warning-outline',
            hidden: false,
            component: () => import('../pawn/sattings/websize-info'),
          },
          {
            path: '/sattings/email',
            name: '邮箱修改',
            icon: 'el-icon-info',
            hidden: false,
            component: () => import('../pawn/sattings/email'),
          },
          {
            path: '/user/reset-password',
            name: '修改密码',
            icon: 'el-icon-key',
            hidden: false,
            component: () => import('../pawn/user/reset-password'),
          },
          {
            path: '/sattings/info',
            name: '用户信息',
            icon: 'el-icon-user',
            hidden: false,
            component: () => import('../pawn/sattings/info'),
          },
          {
            path: '/sattings/friend-link',
            name: '友情连接',
            icon: 'el-icon-s-promotion',
            hidden: false,
            component: () => import('../pawn/sattings/friend-link'),
          },
          {
            path: '/sattings/feedback',
            name: '用户反馈',
            icon: 'el-icon-message',
            hidden: false,
            component: () => import('../pawn/sattings/feedback'),
          },
        ]
      },
    ]
  },
  {
    path: '/login',
    name: '登陆',
    icon: 'el-icon-user-solid',
    requireLogin: false,
    component: () => import('../pawn/login/login-cun'),
  },
  {
    path: '/',
    name: '网站首页',
    requireLogin: false,
    component: () => import('../pawn/portal/community'),
  },
  {
    path: '/portal/adman/backstage',
    name: '管理员后台管理',
    requireLogin: false,
    component: () => import('../pawn/portal/adman-backstage'),
    children: [
      {
        path: '/admin/box',
        name: '网站信息',
        hidden: false,
        component: () => import('../pawn/portal/admin-index.vue'),
      },
      //用户管理
      {
        path: '/user',
        name: '用户',
        hidden: false,
        component: () => import('../layout/right-content'),
        children: [
          {
            path: '/user/list',
            name: '用户列表',
            icon: 'el-icon-s-check',
            competence: false,
            hidden: false,
            component: () => import('../pawn/user/list'),
          },
          {
            path: '/deactivate/list',
            name: '用户列表',
            icon: 'el-icon-s-check',
            competence: false,
            hidden: false,
            component: () => import('../pawn/user/deactivate-user.vue'),
          },

        ]
      },

      {
        path: '/admin',
        name: '文章管理',
        hidden: false,
        component: () => import('../layout/right-content'),
        children: [
          {
            path: '/admin/review',
            name: '文章审核',
            hidden: false,
            component: () => import('../pawn/portal/ad-article-review'),
          },
          {
            path: '/admin/list',
            name: '文章列表',
            hidden: false,
            component: () => import('../pawn/portal/admin-article-list'),
          },
          ]
      },
      {
        path: '/admin',
        name: '网站管理',
        hidden: false,
        component: () => import('../layout/right-content'),
        children: [
          {
            path: '/admin/announcement',
            name: '发布公告',
            hidden: false,
            component: () => import('../pawn/portal/admin-annouce'),
          },
          {
            path: '/admin/announcement/list',
            name: '公告列表',
            hidden: false,
            component: () => import('../pawn/portal/admin-annouce-list.vue'),
          },
          ]
      }
    ]
  },
  {
    path: '/portal/article',
    name: '文章详情',
    requireLogin: false,
    component: () => import('../pawn/portal/article'),
    children: [

    ]
  },
  {
    path: '/portal/rivers',
    name: '江湖首页',
    requireLogin: false,
    component: () => import('../pawn/portal/rivers-and-lakes'),
    children: [
      {
        path: '/portal/community/bbs',
        name: '江湖',
        requireLogin: false,
        component: () => import('../pawn/portal/arctieVim/community-list'),
      },
    ]
  },
      {
        path: '/community/news/list',
        name: '消息列表',
        requireLogin: false,
        component: () => import('../pawn/portal/news-list'),
      },
  {
    path: '/portal',
    name: '家',
    icon: 'el-icon-user-solid',
    requireLogin: false,
    component: () => import('../pawn/portal/index'),
    children: [
      {
        path: '/portal/class/capacity/list',
        name: '搜索文章列表',
        requireLogin: false,
        component: () => import('../pawn/portal/class-capacity-list'),
      },
      {
        path: '/portal/categories/list',
        name: '分类获取文章列表',
        requireLogin: false,
        component: () => import('../pawn/portal/categories-list'),
      },
      {
        path: '/portal/label/list',
        name: '标签获取文章列表',
        requireLogin: false,
        component: () => import('../pawn/portal/label-list'),
      },
      {
        path: '/portal/about',
        name: '关于',
        requireLogin: false,
        component: () => import('../pawn/portal/about'),
      },
      {
        path: '/portal/timeline',
        name: '时间轴',
        requireLogin: false,
        component: () => import('../pawn/portal/timeline')
      },
      {
        path: '/portal/photo',
        name: '照片墙',
        requireLogin: false,
        component: () => import('../pawn/portal/photo-wall')
      },
      {
        path: '/portal/family',
        name: '首页',
        requireLogin: false,
        component: () => import('../pawn/portal/family'),
        children: [
          {
            path: 'classified/articles',
            name: '用户文章',
            component: () => import('../pawn/portal/arctieVim/classified'),
          },
          {
            path: 'classified/comment',
            name: '社区文章',
            component: () => import('../pawn/portal/arctieVim/comment-user-list'),
          },
          {
            path: 'classified/local',
            name: '本地文章',
            component: () => import('../pawn/portal/arctieVim/local-article-list'),
          },
        ]
      },
      {
        path: '/portal/family',
        name: '首页',
        requireLogin: false,
        component: () => import('../pawn/portal/family'),
      },
      {
        path: '/portal/link',
        name: '友情链接',
        requireLogin: false,
        component: () => import('../pawn/portal/link'),
      },

    ]
  },

  {
    path: "/404",
    name: "notFound",
    component: () => import('../pawn/login/web-404'),
  },
  {
    path: "*", // 此处需特别注意置于最底部
    redirect: "/404",
  }
];

export default new VueRouter({
  routes
})

//push
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

//replace
const VueRouterReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace (to) {
  return VueRouterReplace.call(this, to).catch(err => err)
}




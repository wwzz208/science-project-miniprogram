export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/mall/index',
    'pages/custom/index',
    'pages/profile/index',
    'pages/product-detail/index',
    'pages/search/index',
    'pages/activity/index',
    'pages/login/index',
    'pages/order/index',
    'pages/ai-chat/index',
    'pages/settings/index',
    'pages/help/index',
    'pages/message/index',
    'pages/works/index',
    'pages/favorite/index',
    'pages/admin/login',
    'pages/admin/dashboard'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '科普优创小助手',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#999999',
    selectedColor: '#2563EB',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: './assets/tabbar/home.png',
        selectedIconPath: './assets/tabbar/home-active.png'
      },
      {
        pagePath: 'pages/mall/index',
        text: '项目广场',
        iconPath: './assets/tabbar/grid.png',
        selectedIconPath: './assets/tabbar/grid-active.png'
      },
      {
        pagePath: 'pages/custom/index',
        text: '定制',
        iconPath: './assets/tabbar/wrench.png',
        selectedIconPath: './assets/tabbar/wrench-active.png'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的',
        iconPath: './assets/tabbar/user.png',
        selectedIconPath: './assets/tabbar/user-active.png'
      }
    ]
  }
})

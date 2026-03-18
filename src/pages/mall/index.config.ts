export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '项目广场',
      navigationStyle: 'custom',
      enablePullDownRefresh: true,
      backgroundTextStyle: 'dark'
    })
  : {
      navigationBarTitleText: '项目广场',
      navigationStyle: 'custom',
      enablePullDownRefresh: true,
      backgroundTextStyle: 'dark'
    }

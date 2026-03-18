export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '我的',
      navigationStyle: 'custom',
      enablePullDownRefresh: true
    })
  : {
      navigationBarTitleText: '我的',
      navigationStyle: 'custom',
      enablePullDownRefresh: true
    }

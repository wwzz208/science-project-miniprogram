export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '科普优创小助手',
      enablePullDownRefresh: true,
      backgroundTextStyle: 'dark'
    })
  : {
      navigationBarTitleText: '科普优创小助手',
      enablePullDownRefresh: true,
      backgroundTextStyle: 'dark'
    }

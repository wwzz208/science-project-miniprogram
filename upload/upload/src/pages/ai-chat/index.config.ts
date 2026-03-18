export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: 'AI导师',
      enablePullDownRefresh: false
    })
  : {
      navigationBarTitleText: 'AI导师',
      enablePullDownRefresh: false
    }

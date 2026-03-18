export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '定制工坊',
      navigationStyle: 'custom',
      enablePullDownRefresh: false
    })
  : {
      navigationBarTitleText: '定制工坊',
      navigationStyle: 'custom',
      enablePullDownRefresh: false
    }

export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '管理后台',
      navigationStyle: 'custom'
    })
  : {
      navigationBarTitleText: '管理后台',
      navigationStyle: 'custom'
    }

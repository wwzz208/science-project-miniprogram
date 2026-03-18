export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '管理员登录',
      navigationStyle: 'custom'
    })
  : {
      navigationBarTitleText: '管理员登录',
      navigationStyle: 'custom'
    }

export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '消息中心',
      navigationStyle: 'custom'
    })
  : {
      navigationBarTitleText: '消息中心',
      navigationStyle: 'custom'
    }

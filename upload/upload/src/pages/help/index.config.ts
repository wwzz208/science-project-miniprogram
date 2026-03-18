export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '帮助文档',
      navigationStyle: 'custom'
    })
  : {
      navigationBarTitleText: '帮助文档',
      navigationStyle: 'custom'
    }

# 中小学科创产品小程序设计指南

## 品牌定位

**应用类型**：科创教育电商平台
**设计风格**：科技感 + 教育属性 + 趣味性
**目标用户**：
- 学生/家长（C端）：追求炫酷、个性化
- 教师/学校（B端）：专业、批量采购
- 管理员：后台管理

## 配色方案

### 主色板（科技感）
- **主色**：`bg-blue-600` `text-blue-600` - 科技蓝，代表创新与未来
- **主色深**：`bg-blue-700` `text-blue-700` - 按钮激活态
- **主色浅**：`bg-blue-50` `text-blue-50` - 背景装饰

### 辅助色（活力感）
- **活力橙**：`bg-orange-500` `text-orange-500` - 强调操作、促销
- **创新绿**：`bg-emerald-500` `text-emerald-500` - 成功、环保主题
- **教育紫**：`bg-purple-500` `text-purple-500` - 课程、培训

### 中性色
- **主标题**：`text-gray-900` - `text-xl font-bold`
- **副标题**：`text-gray-700` - `text-base font-medium`
- **正文**：`text-gray-600` - `text-sm`
- **辅助文字**：`text-gray-400` - `text-xs`
- **分割线**：`border-gray-200`
- **背景色**：`bg-gray-50`（页面背景）、`bg-white`（卡片背景）

### 语义色
- **成功**：`bg-green-500` `text-green-500`
- **警告**：`bg-yellow-500` `text-yellow-500`
- **错误**：`bg-red-500` `text-red-500`
- **信息**：`bg-blue-500` `text-blue-500`

## 字体规范

### H1 - 页面标题
- 样式：`text-2xl font-bold text-gray-900`
- 使用场景：页面顶部主标题

### H2 - 区块标题
- 样式：`text-lg font-bold text-gray-800`
- 使用场景：模块标题、卡片标题

### H3 - 卡片内标题
- 样式：`text-base font-semibold text-gray-800`
- 使用场景：商品名称、项目名称

### Body - 正文
- 样式：`text-sm text-gray-600`
- 使用场景：描述文字、详情说明

### Caption - 辅助文字
- 样式：`text-xs text-gray-400`
- 使用场景：价格标签、时间戳、提示文字

## 间距系统

### 页面边距
- 标准边距：`p-4`
- 内边距：`px-4 py-4`
- 水平边距：`px-4`
- 垂直边距：`py-4`

### 组件间距
- 卡片间距：`gap-4`
- 列表项间距：`gap-3`
- 按钮组间距：`gap-2`
- 小元素间距：`gap-2`

### 内部间距
- 卡片内边距：`p-4`
- 输入框内边距：`px-4 py-3`
- 按钮内边距：`px-6 py-3`

## 组件规范

### 按钮样式

#### 主按钮
```tsx
<View className="w-full bg-blue-600 rounded-xl px-6 py-3 active:bg-blue-700">
  <Text className="block text-white font-medium text-center">确定</Text>
</View>
```

#### 次按钮
```tsx
<View className="w-full bg-white border border-gray-300 rounded-xl px-6 py-3 active:bg-gray-50">
  <Text className="block text-gray-700 font-medium text-center">取消</Text>
</View>
```

#### 文字按钮
```tsx
<Text className="text-blue-600 font-medium text-sm">查看详情</Text>
```

#### 禁用态
```tsx
<View className="w-full bg-gray-300 rounded-xl px-6 py-3">
  <Text className="block text-gray-500 font-medium text-center">提交</Text>
</View>
```

### 卡片样式

#### 标准卡片
```tsx
<View className="bg-white rounded-2xl p-4 shadow-sm">
  <Text className="block text-lg font-bold text-gray-900 mb-2">标题</Text>
  <Text className="block text-sm text-gray-600">内容描述</Text>
</View>
```

#### 商品卡片
```tsx
<View className="bg-white rounded-2xl overflow-hidden shadow-sm">
  <Image className="w-full h-40" src="..." />
  <View className="p-4">
    <Text className="block text-base font-semibold text-gray-800 mb-1">商品名称</Text>
    <View className="flex justify-between items-center">
      <Text className="text-orange-500 font-bold text-lg">¥199</Text>
      <Text className="text-xs text-gray-400">已售 128</Text>
    </View>
  </View>
</View>
```

### 输入框样式（跨端兼容）
```tsx
<View className="bg-gray-50 rounded-xl px-4 py-3">
  <Input className="w-full bg-transparent text-sm" placeholder="请输入..." />
</View>
```

### Textarea 样式（跨端兼容）
```tsx
<View className="bg-gray-50 rounded-2xl p-4">
  <Textarea
    style={{ width: '100%', minHeight: '100px', backgroundColor: 'transparent' }}
    placeholder="请输入详细描述..."
    maxlength={500}
  />
</View>
```

### 空状态组件
```tsx
<View className="flex flex-col items-center justify-center py-16">
  <View className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-4">
    <Text className="text-4xl">🔍</Text>
  </View>
  <Text className="block text-sm text-gray-500 mb-2">暂无内容</Text>
  <Text className="block text-xs text-gray-400">快去探索更多精彩内容吧</Text>
</View>
```

### 加载状态
```tsx
<View className="flex items-center justify-center py-8">
  <View className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
</View>
```

### 标签样式
```tsx
<View className="bg-blue-50 px-3 py-1 rounded-full">
  <Text className="text-xs text-blue-600">编程</Text>
</View>
```

### 导航结构

#### TabBar 配置
- **首页**：`pages/index/index` - 首页（展示、推荐、活动）
- **商城**：`pages/mall/index` - 商城（成品、分类、搜索）
- **定制**：`pages/custom/index` - 定制工坊（个性化配置、AI辅助）
- **我的**：`pages/profile/index` - 我的（个人信息、作品、订单）

#### 页面跳转规范
- TabBar 切换：`Taro.switchTab({ url: '/pages/mall/index' })`
- 普通页面：`Taro.navigateTo({ url: '/pages/product/detail?id=123' })`
- 返回：`Taro.navigateBack()`

## 交互规范

### 下拉刷新
- 启用：`enablePullDownRefresh: true`
- 样式：`backgroundTextStyle: 'dark'`（白色背景使用 dark）

### 上拉加载
- 滚动到底部自动触发
- 显示加载状态
- 无更多数据提示

### 手势反馈
- 按钮点击：`active:bg-xxx`（深色背景）
- 长按反馈：使用 `onLongPress` 事件
- 骨架屏：首次加载时显示

## 小程序约束

### 包体积限制
- 主包：2MB
- 整体：20MB（包含分包）
- 优化策略：图片压缩、分包加载

### 图片策略
- 商品图片：使用 WebP 格式，压缩到 200KB 以内
- 封面图：建议尺寸 750x750，支持长图
- 占位图：使用项目内静态资源
- 3D/AR预览：使用 CDN 加速

### 性能优化
- 列表分页：每页 20 条
- 图片懒加载：`lazyLoad`
- 骨架屏：首次加载避免白屏
- 防抖节流：搜索、滚动事件

### 跨端兼容
- Text 必须使用 `block` 类换行
- Input/Textarea 必须使用 View 包裹
- Fixed + Flex 使用 inline style
- 原生组件需要平台检测

## 品牌元素

### Logo 使用
- 首页顶部：显示完整 Logo
- 导航栏：显示简化版 Logo 或文字
- 图标尺寸：32x32 或 40x40

### 品牌色应用场景
- **主色（蓝）**：品牌识别、主按钮、选中态
- **活力橙**：促销标签、特价标识、紧急操作
- **创新绿**：环保主题、可持续产品、成功状态
- **教育紫**：课程、培训、学习资源

### 渐变色使用
- 标题背景：`bg-gradient-to-r from-blue-600 to-blue-700`
- 活动Banner：`bg-gradient-to-r from-orange-500 to-pink-500`
- 卡片高亮：`bg-gradient-to-br from-blue-50 to-purple-50`

## 特殊组件

### 轮播图
- 指示器颜色：`active-dot-color="#1890ff"`
- 自动播放：`autoplay interval={3000}`
- 圆角：`rounded-2xl`

### 搜索框
```tsx
<View className="bg-white rounded-full px-4 py-2 flex items-center gap-2 shadow-sm">
  <Search size={20} color="#9CA3AF" />
  <Input className="flex-1 bg-transparent text-sm" placeholder="搜索科创产品..." />
</View>
```

### 评分组件
```tsx
<View className="flex gap-1">
  {[1,2,3,4,5].map((star) => (
    <Star key={star} size={16} color={star <= rating ? '#F59E0B' : '#D1D5DB'} fill={star <= rating} />
  ))}
</View>
```

### 徽章组件
```tsx
<View className="bg-red-500 rounded-full px-2 py-0.5 absolute -top-1 -right-1">
  <Text className="text-xs text-white font-medium">99+</Text>
</View>
```

## 响应式设计

### 屏幕适配
- 使用 Tailwind 响应式类：`w-full`、`max-w-md`、`text-sm`
- 避免固定像素：使用 `rpx` 或百分比
- 字体缩放：使用 `text-xs`、`text-sm` 等相对单位

### 横屏适配
- 关键内容垂直居中
- 横向布局优先使用 flex
- 避免 `fixed` 定位遮挡内容

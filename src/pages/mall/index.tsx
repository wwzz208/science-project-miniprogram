import { View, Text, ScrollView } from '@tarojs/components'
import { Search, SlidersHorizontal, ShoppingBag, ArrowLeft } from 'lucide-react-taro'
import Taro, { useLoad } from '@tarojs/taro'
import { useState } from 'react'
import { Network } from '@/network'
import './index.css'
import './filter.css'

interface FilterOption {
  label: string
  value: string
  checked: boolean
}

interface Product {
  id: number
  name: string
  description: string
  category: string
  image: string
  ageRange: string
  tags: string[]
  teacherName: string
  teacherPhone: string
  price: number
  stock: number
  sales: number
  createdAt: string
}

const MallPage = () => {
  const [filterVisible, setFilterVisible] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [loading, setLoading] = useState(false)

  // 分类选项
  const [categoryOptions, setCategoryOptions] = useState<FilterOption[]>([
    { label: '全部', value: 'all', checked: true },
    { label: '编程', value: '编程', checked: false },
    { label: '机器人', value: '机器人', checked: false },
    { label: '电子套件', value: '电子', checked: false },
    { label: '传感器', value: '传感器', checked: false },
    { label: '3D打印', value: '3D打印', checked: false },
    { label: '人工智能', value: '人工智能', checked: false },
  ])

  // 从后端加载的产品数据
  const [projects, setProjects] = useState<Product[]>([])

  // 筛选后的项目
  const [filteredProjects, setFilteredProjects] = useState<Product[]>([])

  // 加载产品数据
  const loadProducts = async () => {
    try {
      setLoading(true)
      console.log('开始加载产品数据...')

      const res = await Network.request({
        url: '/api/products',
        method: 'GET'
      })

      console.log('产品数据响应:', res.data)

      if (res.data.code === 200 && res.data.data?.list) {
        const productList = res.data.data.list
        setProjects(productList)
        setFilteredProjects(productList)
        console.log(`成功加载 ${productList.length} 个产品`)
      } else {
        console.error('加载产品数据失败:', res.data.msg)
        Taro.showToast({
          title: '加载失败，请重试',
          icon: 'none'
        })
      }
    } catch (error) {
      console.error('加载产品数据异常:', error)
      Taro.showToast({
        title: '网络错误，请重试',
        icon: 'none'
      })
    } finally {
      setLoading(false)
    }
  }

  // 页面加载时获取数据
  useLoad(() => {
    Taro.setNavigationBarTitle({ title: '科普项目' })
    loadProducts()
  })

  // 下拉刷新
  const onRefresh = () => {
    loadProducts()
  }

  const handleSearch = () => {
    Taro.showToast({ title: '搜索功能开发中', icon: 'none' })
  }

  const handleCategory = (category: string) => {
    setSelectedCategory(category)

    if (category === '全部') {
      setFilteredProjects(projects)
    } else {
      const filtered = projects.filter(project => project.category === category)
      setFilteredProjects(filtered)
    }
  }

  const handleFilter = () => {
    setFilterVisible(true)
  }

  const handleProject = (id: number) => {
    Taro.navigateTo({
      url: `/pages/product-detail/index?id=${id}`
    })
  }

  const handleCategorySelect = (index: number) => {
    const newOptions = categoryOptions.map((opt, i) => ({
      ...opt,
      checked: i === index
    }))
    setCategoryOptions(newOptions)
  }

  const handleReset = () => {
    const resetCategories = categoryOptions.map((opt, i) => ({
      ...opt,
      checked: i === 0
    }))
    setCategoryOptions(resetCategories)
  }

  const handleConfirm = () => {
    const category = categoryOptions.find(opt => opt.checked)

    if (category) {
      if (category.value === 'all') {
        setFilteredProjects(projects)
      } else {
        const filtered = projects.filter(project => project.category === category.value)
        setFilteredProjects(filtered)
      }
      setSelectedCategory(category.label)
    }

    setFilterVisible(false)
  }

  return (
    <View className="mall-page">
      {/* 自定义导航栏 */}
      <View className="custom-navbar">
        <View className="navbar-content">
          <View className="navbar-left block" onClick={() => Taro.switchTab({ url: '/pages/index/index' })}>
            <ArrowLeft size={24} color="#333" />
          </View>
          <Text className="navbar-title">科普项目</Text>
          <View className="navbar-right"></View>
        </View>
      </View>

      {/* 搜索栏 */}
      <View className="sticky-search-bar">
        <View className="bg-white px-4 py-3 flex items-center gap-3">
          <View
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 flex items-center gap-2 block"
            onClick={handleSearch}
          >
            <Search size={18} color="#9CA3AF" />
            <Text className="block text-sm text-gray-400 flex-1">搜索科普项目...</Text>
          </View>
          <View className="p-2 block" onClick={handleFilter}>
            <SlidersHorizontal size={20} color="#2563EB" />
          </View>
        </View>
      </View>

      {/* 分类导航 */}
      <View className="bg-white px-4 py-4 flex gap-4 overflow-x-auto">
        {['全部', '编程', '机器人', '电子套件', '传感器', '3D打印', '人工智能'].map((category) => (
          <View key={category} className="flex-shrink-0" onClick={() => handleCategory(category)}>
            <View className={`${selectedCategory === category ? 'bg-blue-600' : 'bg-blue-50'} px-4 py-2 rounded-full block`}>
              <Text className={`block text-sm font-medium ${selectedCategory === category ? 'text-white' : 'text-blue-600'}`}>{category}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* 项目列表 */}
      <ScrollView className="product-list" scrollY refresherEnabled onRefresherRefresh={onRefresh}>
        <View className="px-4 py-4 grid grid-cols-2 gap-4">
          {loading ? (
            <View className="col-span-2 py-20 text-center">
              <Text className="block text-gray-400 text-sm">加载中...</Text>
            </View>
          ) : (
            <>
              {/* 项目卡片 */}
              {filteredProjects.map((project) => (
                <View
                  key={project.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm block"
                  onClick={() => handleProject(project.id)}
                >
                  <View className="w-full h-40 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                    <ShoppingBag size={48} color="#2563EB" />
                  </View>
                  <View className="p-3">
                    <Text className="block text-base font-semibold text-gray-800 mb-1 truncate">
                      {project.name}
                    </Text>
                    <Text className="block text-xs text-gray-400 mb-2">适合 {project.ageRange} 岁</Text>
                    <View className="flex items-center gap-1 mb-2">
                      <Text className="block text-xs text-gray-500">指导老师：</Text>
                      <Text className="block text-xs text-blue-600 font-medium">{project.teacherName}</Text>
                    </View>
                    <View className="bg-blue-50 rounded-lg px-3 py-2 text-center">
                      <Text className="block text-sm text-blue-600 font-medium">查看详情</Text>
                    </View>
                  </View>
                </View>
              ))}

              {filteredProjects.length === 0 && (
                <View className="col-span-2 py-20 text-center">
                  <Text className="block text-gray-400 text-sm">暂无符合条件的项目</Text>
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>

      {/* 筛选弹窗 */}
      {filterVisible && (
        <View className="filter-modal-mask block" onClick={() => setFilterVisible(false)}>
          <View className="filter-modal-content block" onClick={(e) => e.stopPropagation()}>
            {/* 弹窗头部 */}
            <View className="filter-modal-header">
              <Text className="filter-modal-title">筛选</Text>
              <View className="filter-modal-close block" onClick={() => setFilterVisible(false)}>
                <Text className="text-gray-400 text-xl">×</Text>
              </View>
            </View>

            {/* 筛选内容 */}
            <View className="filter-modal-body">
              <Text className="block text-sm font-medium text-gray-700 mb-3">分类</Text>
              <View className="filter-options">
                {categoryOptions.map((option, index) => (
                  <View
                    key={option.value}
                    className={`filter-option ${option.checked ? 'filter-option-checked' : ''}`}
                    onClick={() => handleCategorySelect(index)}
                  >
                    <Text className="block text-sm">{option.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* 弹窗底部 */}
            <View className="filter-modal-footer">
              <View className="flex gap-3">
                <View className="flex-1 py-3 rounded-lg bg-gray-100 text-center" onClick={handleReset}>
                  <Text className="block text-sm text-gray-600">重置</Text>
                </View>
                <View className="flex-1 py-3 rounded-lg bg-blue-600 text-center" onClick={handleConfirm}>
                  <Text className="block text-sm text-white">确认</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

export default MallPage

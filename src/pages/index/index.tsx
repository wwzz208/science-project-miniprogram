import { View, Text, ScrollView, Swiper, SwiperItem, Image } from '@tarojs/components'
import {
  Zap,
  Sparkles,
  Award,
  ChevronRight,
  Search,
  Clock,
  Users
} from 'lucide-react-taro'
import { useState, useEffect } from 'react'
import Taro, { useLoad } from '@tarojs/taro'
import { Network } from '@/network'
import './index.css'

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

const IndexPage = () => {
  const [hotProducts, setHotProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useLoad(() => {
    Taro.setNavigationBarTitle({ title: '科普优创小助手' })
  })

  useEffect(() => {
    loadHotProducts()
  }, [])

  const loadHotProducts = async () => {
    try {
      const res = await Network.request({
        url: '/api/products'
      })
      console.log('热门推荐数据:', res.data)

      // 后端返回的数据结构: { code, msg, data: { list: [...] } }
      const productList = res.data.data?.list || []
      console.log('产品列表:', productList)

      // 按销量排序，取前2个
      const sortedProducts = productList
        .sort((a: Product, b: Product) => b.sales - a.sales)
        .slice(0, 2)

      setHotProducts(sortedProducts)
    } catch (error) {
      console.error('加载热门推荐失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 下拉刷新
  const onRefresh = async () => {
    await loadHotProducts()
    Taro.stopPullDownRefresh()
  }

  const handleSearch = () => {
    Taro.navigateTo({ url: '/pages/search/index' })
  }

  const handleCategory = (_category: string) => {
    // 跳转到项目广场页面，将来可以扩展为根据分类筛选
    Taro.switchTab({
      url: '/pages/mall/index'
    })
  }

  const handleProduct = (id: number) => {
    Taro.navigateTo({
      url: `/pages/product-detail/index?id=${id}`
    })
  }

  const handleActivity = () => {
    Taro.navigateTo({ url: '/pages/activity/index' })
  }

  const handleBanner = (banner: string) => {
    Taro.showToast({ title: banner, icon: 'none' })
  }

  return (
    <View className="index-page">
      <ScrollView className="page-content" scrollY onRefresherRefresh={onRefresh} refresherEnabled refresherTriggered={loading}>
        {/* 搜索栏 */}
        <View className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 pt-4 pb-6">
          <View className="flex items-center gap-3 mb-4">
            <View
              className="flex-1 bg-white/20 backdrop-blur rounded-full px-4 py-2 flex items-center gap-2 block"
              onClick={handleSearch}
            >
              <Search size={18} color="rgba(255,255,255,0.8)" />
              <Text className="block text-sm text-white/80 flex-1">搜索科普项目...</Text>
            </View>
          </View>
          <Text className="block text-2xl font-bold text-white mb-1">探索科技之美</Text>
          <Text className="block text-sm text-blue-100">让创意变为现实</Text>
        </View>

        {/* 轮播图 */}
        <View className="px-4 py-4">
          <Swiper
            className="banner-swiper"
            circular
            indicatorDots
            autoplay
            interval={3000}
            indicatorColor="#D1D5DB"
            indicatorActiveColor="#2563EB"
          >
            <SwiperItem onClick={() => handleBanner('寒假创客活动')}>
              <View className="banner-item bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6">
                <Text className="block text-xl font-bold text-white mb-2">寒假创客活动</Text>
                <Text className="block text-sm text-white/80 mb-4">探索科技，创新未来</Text>
                <View className="bg-white/20 backdrop-blur px-4 py-2 rounded-full inline-block">
                  <Text className="text-sm text-white font-medium">立即查看</Text>
                </View>
              </View>
            </SwiperItem>

            <SwiperItem onClick={() => handleBanner('AI编程训练营')}>
              <View className="banner-item bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6">
                <Text className="block text-xl font-bold text-white mb-2">AI编程训练营</Text>
                <Text className="block text-sm text-white/80 mb-4">零基础入门人工智能</Text>
                <View className="bg-white/20 backdrop-blur px-4 py-2 rounded-full inline-block">
                  <Text className="text-sm text-white font-medium">立即报名</Text>
                </View>
              </View>
            </SwiperItem>

            <SwiperItem onClick={() => handleBanner('机器人竞赛')}>
              <View className="banner-item bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6">
                <Text className="block text-xl font-bold text-white mb-2">机器人竞赛</Text>
                <Text className="block text-sm text-white/80 mb-4">全国青少年机器人挑战赛</Text>
                <View className="bg-white/20 backdrop-blur px-4 py-2 rounded-full inline-block">
                  <Text className="text-sm text-white font-medium">了解详情</Text>
                </View>
              </View>
            </SwiperItem>
          </Swiper>
        </View>

        {/* 分类导航 */}
        <View className="px-4 py-2">
          <View className="grid grid-cols-4 gap-4">
            <View className="flex flex-col items-center block" onClick={() => handleCategory('编程')}>
              <View className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-2">
                <Zap size={28} color="#2563EB" />
              </View>
              <Text className="block text-xs text-gray-700">编程</Text>
            </View>

            <View className="flex flex-col items-center block" onClick={() => handleCategory('机器人')}>
              <View className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-2">
                <Sparkles size={28} color="#8B5CF6" />
              </View>
              <Text className="block text-xs text-gray-700">机器人</Text>
            </View>

            <View className="flex flex-col items-center block" onClick={() => handleCategory('电子')}>
              <View className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-2">
                <Award size={28} color="#10B981" />
              </View>
              <Text className="block text-xs text-gray-700">电子</Text>
            </View>

            <View className="flex flex-col items-center block" onClick={() => handleCategory('更多')}>
              <View className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-2">
                <ChevronRight size={28} color="#F59E0B" />
              </View>
              <Text className="block text-xs text-gray-700">更多</Text>
            </View>
          </View>
        </View>

        {/* 热门推荐 */}
        <View className="px-4 py-4">
          <View className="flex justify-between items-center mb-4">
            <Text className="block text-lg font-bold text-gray-900">🔥 热门推荐</Text>
            <View
              className="block text-sm text-blue-600"
              onClick={() => Taro.switchTab({ url: '/pages/mall/index' })}
            >
              查看更多
            </View>
          </View>

          {loading ? (
            <View className="flex justify-center py-8">
              <Text className="block text-sm text-gray-400">加载中...</Text>
            </View>
          ) : (
            <View className="grid grid-cols-2 gap-4">
              {hotProducts.map((product) => (
                <View
                  key={product.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm block"
                  onClick={() => handleProduct(product.id)}
                >
                  <View className="w-full h-36 bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
                    {product.image ? (
                      <Image
                        src={product.image}
                        mode="aspectFill"
                        className="w-full h-full"
                      />
                    ) : (
                      <Zap size={48} color="#2563EB" />
                    )}
                  </View>
                  <View className="p-3">
                    <Text className="block text-base font-semibold text-gray-800 mb-1 truncate">
                      {product.name}
                    </Text>
                    <View className="flex items-center gap-1">
                      <Users size={14} color="#2563EB" />
                      <Text className="block text-xs text-blue-600">{product.teacherName}指导</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* 最新活动 */}
        <View className="px-4 py-4">
          <View className="flex justify-between items-center mb-4">
            <Text className="block text-lg font-bold text-gray-900">🎯 最新活动</Text>
          </View>

          <View
            className="bg-white rounded-2xl p-4 shadow-sm mb-3 block"
            onClick={() => handleActivity()}
          >
            <View className="flex gap-3">
              <View className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock size={32} color="white" />
              </View>
              <View className="flex-1">
                <Text className="block text-base font-semibold text-gray-800 mb-2">
                  寒假创客营报名开启
                </Text>
                <View className="flex items-center gap-4 mb-2">
                  <View className="flex items-center gap-1">
                    <Users size={14} color="#9CA3AF" />
                    <Text className="block text-xs text-gray-500">128人已报名</Text>
                  </View>
                  <View className="flex items-center gap-1">
                    <Clock size={14} color="#9CA3AF" />
                    <Text className="block text-xs text-gray-500">活动进行中</Text>
                  </View>
                </View>
                <View className="flex items-center justify-between">
                  <Text className="block text-xs text-orange-500 font-medium">火热进行中</Text>
                  <ChevronRight size={16} color="#9CA3AF" />
                </View>
              </View>
            </View>
          </View>

          <View
            className="bg-white rounded-2xl p-4 shadow-sm block"
            onClick={() => handleActivity()}
          >
            <View className="flex gap-3">
              <View className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Award size={32} color="white" />
              </View>
              <View className="flex-1">
                <Text className="block text-base font-semibold text-gray-800 mb-2">
                  全国青少年科创作品大赛
                </Text>
                <View className="flex items-center gap-4 mb-2">
                  <View className="flex items-center gap-1">
                    <Users size={14} color="#9CA3AF" />
                    <Text className="text-xs text-gray-500">256人参赛</Text>
                  </View>
                </View>
                <View className="flex items-center justify-between">
                  <Text className="text-xs text-purple-500 font-medium">丰厚奖品等你来</Text>
                  <ChevronRight size={16} color="#9CA3AF" />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* 底部占位，避免被TabBar遮挡 */}
        <View className="h-4"></View>
      </ScrollView>
    </View>
  )
}

export default IndexPage

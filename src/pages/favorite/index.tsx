import { View, Text, ScrollView, Image } from '@tarojs/components'
import {
  Heart,
  Calendar,
  ArrowLeft
} from 'lucide-react-taro'
import Taro, { useLoad } from '@tarojs/taro'
import { useState } from 'react'
import './index.css'

interface FavoriteProduct {
  id: number
  name: string
  category: string
  image: string
  price: number
  ageRange: string
}

interface FavoriteActivity {
  id: number
  title: string
  description: string
  date: string
  location: string
  status: string
  image: string
}

const FavoritePage = () => {
  const [activeTab, setActiveTab] = useState('product')
  const [products, setProducts] = useState<FavoriteProduct[]>([
    {
      id: 1,
      name: '智能编程机器人项目',
      category: '机器人',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200&h=200&fit=crop',
      price: 0,
      ageRange: '8-12岁'
    },
    {
      id: 2,
      name: '电子创客入门项目',
      category: '电子',
      image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=200&h=200&fit=crop',
      price: 0,
      ageRange: '10-15岁'
    }
  ])

  const [activities, setActivities] = useState<FavoriteActivity[]>([
    {
      id: 2,
      title: '科创教师培训会',
      description: '面向中小学科创教师的培训活动，提升教学能力。',
      date: '2024-02-15',
      location: '北京市海淀区',
      status: '报名中',
      image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=200&h=200&fit=crop'
    }
  ])

  useLoad(() => {
    Taro.setNavigationBarTitle({ title: '我的收藏' })
  })

  const handleBack = () => {
    Taro.navigateBack()
  }

  const handleProductClick = (productId: number) => {
    Taro.navigateTo({ url: `/pages/product-detail/index?id=${productId}` })
  }

  const handleActivityClick = (activity: FavoriteActivity) => {
    Taro.showModal({
      title: activity.title,
      content: `${activity.description}\n\n时间：${activity.date}\n地点：${activity.location}\n状态：${activity.status}`,
      showCancel: false
    })
  }

  const handleUnfavoriteProduct = (productId: number, e: any) => {
    e.stopPropagation()
    Taro.showModal({
      title: '取消收藏',
      content: '确定要取消收藏这个项目吗？',
      success: (res) => {
        if (res.confirm) {
          setProducts(products.filter(p => p.id !== productId))
          Taro.showToast({ title: '已取消收藏', icon: 'success' })
        }
      }
    })
  }

  const handleUnfavoriteActivity = (activityId: number, e: any) => {
    e.stopPropagation()
    Taro.showModal({
      title: '取消收藏',
      content: '确定要取消收藏这个活动吗？',
      success: (res) => {
        if (res.confirm) {
          setActivities(activities.filter(a => a.id !== activityId))
          Taro.showToast({ title: '已取消收藏', icon: 'success' })
        }
      }
    })
  }

  return (
    <View className="favorite-page">
      {/* 自定义导航栏 */}
      <View className="custom-navbar">
        <View className="navbar-content">
          <View className="navbar-left block" onClick={handleBack}>
            <ArrowLeft size={24} color="#333" />
          </View>
          <Text className="navbar-title">我的收藏</Text>
          <View className="navbar-right"></View>
        </View>
      </View>

      {/* 标签切换 */}
      <View className="tab-bar px-4 py-4 bg-white">
        <View className="flex gap-2">
          <View
            className={`tab-item flex-1 py-2 px-4 rounded-full text-center block ${activeTab === 'product' ? 'tab-active' : 'tab-inactive'}`}
            onClick={() => setActiveTab('product')}
          >
            <Text className={`text-sm font-medium ${activeTab === 'product' ? 'text-white' : 'text-gray-600'}`}>
              科创项目 ({products.length})
            </Text>
          </View>
          <View
            className={`tab-item flex-1 py-2 px-4 rounded-full text-center block ${activeTab === 'activity' ? 'tab-active' : 'tab-inactive'}`}
            onClick={() => setActiveTab('activity')}
          >
            <Text className={`text-sm font-medium ${activeTab === 'activity' ? 'text-white' : 'text-gray-600'}`}>
              活动 ({activities.length})
            </Text>
          </View>
        </View>
      </View>

      <ScrollView className="favorite-content" scrollY>
        {/* 科创项目 */}
        {activeTab === 'product' && (
          <View className="section px-4 py-4">
            {products.length === 0 ? (
              <View className="empty-state">
                <Heart size={64} color="#d1d5db" />
                <Text className="block text-gray-500 text-center mt-4">暂无收藏项目</Text>
              </View>
            ) : (
              <View className="product-list">
                {products.map((product) => (
                  <View
                    key={product.id}
                    className="product-item bg-white rounded-2xl p-3 mb-3 shadow-sm flex items-center gap-3"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <Image src={product.image} mode="aspectFill" className="product-image" />
                    <View className="product-info flex-1">
                      <Text className="block text-sm font-bold text-gray-900 mb-1 line-clamp-1">{product.name}</Text>
                      <View className="flex items-center gap-2 mb-1">
                        <View className="product-category bg-blue-50 px-2 py-1 rounded-full">
                          <Text className="text-xs text-blue-600">{product.category}</Text>
                        </View>
                        <Text className="text-xs text-gray-500">{product.ageRange}</Text>
                      </View>
                    </View>
                    <View
                      className="unfavorite-btn block"
                      onClick={(e) => handleUnfavoriteProduct(product.id, e)}
                    >
                      <Heart size={20} color="#EF4444" />
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* 活动 */}
        {activeTab === 'activity' && (
          <View className="section px-4 py-4">
            {activities.length === 0 ? (
              <View className="empty-state">
                <Heart size={64} color="#d1d5db" />
                <Text className="block text-gray-500 text-center mt-4">暂无收藏活动</Text>
              </View>
            ) : (
              <View className="activity-list">
                {activities.map((activity) => (
                  <View
                    key={activity.id}
                    className="activity-item bg-white rounded-2xl overflow-hidden mb-3 shadow-sm"
                    onClick={() => handleActivityClick(activity)}
                  >
                    <Image src={activity.image} mode="aspectFill" className="activity-image" />
                    <View className="activity-info p-3">
                      <View className="flex items-start justify-between mb-2">
                        <View className="flex-1">
                          <Text className="block text-sm font-bold text-gray-900 mb-1">{activity.title}</Text>
                          <View className="flex items-center gap-2">
                            <View className="activity-status bg-green-50 px-2 py-1 rounded-full">
                              <Text className="text-xs text-green-600">{activity.status}</Text>
                            </View>
                          </View>
                        </View>
                        <View
                          className="unfavorite-btn block"
                          onClick={(e) => handleUnfavoriteActivity(activity.id, e)}
                        >
                          <Heart size={20} color="#EF4444" />
                        </View>
                      </View>
                      <Text className="block text-xs text-gray-600 line-clamp-2 mb-2">{activity.description}</Text>
                      <View className="flex items-center gap-4">
                        <View className="flex items-center gap-1">
                          <Calendar size={14} color="#666" />
                          <Text className="text-xs text-gray-500">{activity.date}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  )
}

export default FavoritePage

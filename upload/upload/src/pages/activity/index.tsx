import { View, Text, ScrollView } from '@tarojs/components'
import { Calendar, Flame, ChevronRight } from 'lucide-react-taro'
import Taro, { useLoad, useDidShow } from '@tarojs/taro'
import { useState } from 'react'
import { Network } from '@/network'
import './index.css'

interface Activity {
  id: number
  title: string
  description: string
  date: string
  location: string
  status: string
}

const ActivityPage = () => {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  const loadActivities = async () => {
    try {
      const res = await Network.request({ url: '/api/activities' })
      console.log('活动列表响应:', res.data)
      if (res.data.code === 200) {
        setActivities(res.data.data)
      }
    } catch (error) {
      console.error('加载活动列表失败:', error)
      Taro.showToast({ title: '加载失败，请重试', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  useLoad(() => {
    Taro.setNavigationBarTitle({ title: '最新活动' })
    loadActivities()
  })

  // 监听页面显示，重新加载数据
  useDidShow(() => {
    loadActivities()
  })

  const handleActivityClick = (activity: Activity) => {
    Taro.showModal({
      title: activity.title,
      content: `${activity.description}\n\n活动时间：${activity.date}\n活动地点：${activity.location}`,
      showCancel: false,
      confirmText: '知道了'
    })
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case '进行中':
      case 'ongoing':
        return '进行中'
      case '报名中':
        return '报名中'
      case '即将开始':
      case 'upcoming':
        return '即将开始'
      case '已结束':
      case 'ended':
        return '已结束'
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case '进行中':
      case 'ongoing':
      case '报名中':
        return '#10B981'
      case '即将开始':
      case 'upcoming':
        return '#2563EB'
      case '已结束':
      case 'ended':
        return '#9CA3AF'
      default:
        return '#9CA3AF'
    }
  }

  return (
    <View className="activity-page">
      <ScrollView className="activity-content" scrollY>
        {/* 头部 */}
        <View className="activity-header">
          <Calendar size={48} color="#2563EB" />
          <Text className="block text-2xl font-bold text-gray-900 mt-4">最新活动</Text>
          <Text className="block text-sm text-gray-500 mt-2">精彩活动，不容错过</Text>
        </View>

        {/* 活动列表 */}
        <View className="activity-list">
          {loading ? (
            <View className="text-center py-8 text-gray-400">加载中...</View>
          ) : activities.length === 0 ? (
            <View className="text-center py-8 text-gray-400">暂无活动</View>
          ) : (
            activities.map((activity) => (
              <View
                key={activity.id}
                className="activity-card block"
                onClick={() => handleActivityClick(activity)}
              >
                <View className="activity-image">
                  <View className="activity-image-placeholder">
                    <Flame size={48} color="#F97316" />
                  </View>
                  <View className="activity-status" style={{ backgroundColor: getStatusColor(activity.status) }}>
                    <Text className="activity-status-text">{getStatusText(activity.status)}</Text>
                  </View>
                </View>
                <View className="activity-info">
                  <Text className="activity-title">{activity.title}</Text>
                  <Text className="activity-description">{activity.description}</Text>
                  <View className="activity-meta">
                    <Text className="activity-date">
                      {activity.date} | {activity.location}
                    </Text>
                    <ChevronRight size={16} color="#9CA3AF" />
                  </View>
                </View>
                <View className="activity-arrow">
                  <ChevronRight size={20} color="#9CA3AF" />
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  )
}

export default ActivityPage

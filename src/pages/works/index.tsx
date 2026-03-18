import { View, Text, ScrollView, Image } from '@tarojs/components'
import {
  Star,
  Plus,
  ArrowLeft,
  Camera,
  Trophy,
  Calendar,
  Heart
} from 'lucide-react-taro'
import Taro, { useLoad } from '@tarojs/taro'
import { useState } from 'react'
import './index.css'

interface Work {
  id: number
  title: string
  description: string
  image: string
  category: string
  date: string
  likes: number
}

const WorksPage = () => {
  const [works, setWorks] = useState<Work[]>([
    {
      id: 1,
      title: '智能垃圾分类机器人',
      description: '基于视觉识别的垃圾分类机器人，可以自动识别并分类投放垃圾。',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop',
      category: '机器人',
      date: '2024-01-10',
      likes: 128
    },
    {
      id: 2,
      title: '智能温控系统',
      description: '使用Arduino开发的智能温度控制系统，可以自动调节室内温度。',
      image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=400&h=300&fit=crop',
      category: '电子',
      date: '2024-01-08',
      likes: 96
    },
    {
      id: 3,
      title: '3D打印创意灯具',
      description: '使用3D打印技术制作的多功能创意灯具，支持多种灯光模式。',
      image: 'https://images.unsplash.com/photo-1535378437327-b7107adfb2f6?w=400&h=300&fit=crop',
      category: '3D打印',
      date: '2024-01-05',
      likes: 87
    },
    {
      id: 4,
      title: 'AI图像识别小车',
      description: '基于人工智能的图像识别小车，可以识别道路标志并自动导航。',
      image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=400&h=300&fit=crop',
      category: '人工智能',
      date: '2024-01-03',
      likes: 156
    }
  ])

  useLoad(() => {
    Taro.setNavigationBarTitle({ title: '我的作品集' })
  })

  const handleBack = () => {
    Taro.navigateBack()
  }

  const handleAddWork = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0]
        const newWork: Work = {
          id: Date.now(),
          title: '我的作品 ' + new Date().toLocaleDateString(),
          description: '用户上传的作品',
          image: tempFilePath,
          category: '自定义',
          date: new Date().toISOString().split('T')[0],
          likes: 0
        }
        setWorks([newWork, ...works])
        Taro.showToast({ title: '上传成功', icon: 'success' })
      }
    })
  }

  const handleWorkClick = (work: Work) => {
    Taro.showModal({
      title: work.title,
      content: `${work.description}\n\n分类：${work.category}\n日期：${work.date}\n点赞：${work.likes}`,
      showCancel: false
    })
  }

  return (
    <View className="works-page">
      {/* 自定义导航栏 */}
      <View className="custom-navbar">
        <View className="navbar-content">
          <View className="navbar-left block" onClick={handleBack}>
            <ArrowLeft size={24} color="#333" />
          </View>
          <Text className="navbar-title">我的作品集</Text>
          <View className="navbar-right block" onClick={handleAddWork}>
            <Plus size={24} color="#2563EB" />
          </View>
        </View>
      </View>

      {/* 统计信息 */}
      <View className="stats-bar px-4 py-4 bg-white">
        <View className="flex justify-around">
          <View className="stat-item">
            <View className="stat-icon">
              <Trophy size={24} color="#F59E0B" />
            </View>
            <Text className="stat-value">{works.length}</Text>
            <Text className="stat-label">作品数</Text>
          </View>
          <View className="stat-item">
            <View className="stat-icon">
              <Heart size={24} color="#EF4444" />
            </View>
            <Text className="stat-value">{works.reduce((sum, w) => sum + w.likes, 0)}</Text>
            <Text className="stat-label">获赞数</Text>
          </View>
          <View className="stat-item">
            <View className="stat-icon">
              <Calendar size={24} color="#2563EB" />
            </View>
            <Text className="stat-value">Lv.3</Text>
            <Text className="stat-label">等级</Text>
          </View>
        </View>
      </View>

      <ScrollView className="works-content" scrollY>
        {works.length === 0 ? (
          <View className="empty-state">
            <Star size={64} color="#d1d5db" />
            <Text className="block text-gray-500 text-center mt-4 mb-4">暂无作品</Text>
            <View className="upload-btn block" onClick={handleAddWork}>
              <Camera size={24} color="#2563EB" />
              <Text className="block text-sm text-blue-600 mt-2">点击上传作品</Text>
            </View>
          </View>
        ) : (
          <View className="works-grid px-4 py-4">
            {works.map((work) => (
              <View key={work.id} className="work-card bg-white rounded-2xl overflow-hidden shadow-sm" onClick={() => handleWorkClick(work)}>
                <Image src={work.image} mode="aspectFill" className="work-image" />
                <View className="work-info p-3">
                  <Text className="block text-sm font-bold text-gray-900 mb-1 line-clamp-1">{work.title}</Text>
                  <Text className="block text-xs text-gray-500 mb-2 line-clamp-2">{work.description}</Text>
                  <View className="flex items-center justify-between">
                    <View className="work-category bg-blue-50 px-2 py-1 rounded-full">
                      <Text className="text-xs text-blue-600">{work.category}</Text>
                    </View>
                    <View className="flex items-center gap-1">
                      <Heart size={14} color="#EF4444" />
                      <Text className="text-xs text-gray-500">{work.likes}</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  )
}

export default WorksPage

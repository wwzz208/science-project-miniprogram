import { View, Text, ScrollView, Image } from '@tarojs/components'
import { Phone, Share2, ArrowLeft, User, Loader, Package } from 'lucide-react-taro'
import Taro, { useLoad, useRouter } from '@tarojs/taro'
import { useState } from 'react'
import { Network } from '@/network'
import './index.css'

interface ProductDetail {
  id: number
  name: string
  description: string
  category: string
  image: string
  ageRange: string
  tags: string[]
  teacherName: string
  teacherPhone: string
  createdAt: string
}

const ProductDetailPage = () => {
  const router = useRouter()
  const productId = router.params.id || '1'

  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useLoad(() => {
    Taro.setNavigationBarTitle({ title: '项目详情' })
    loadProductDetail()
  })

  const loadProductDetail = async () => {
    try {
      setLoading(true)
      const res = await Network.request({
        url: `/api/products/${productId}`
      })
      console.log('产品详情响应:', res.data)

      if (res.data.code === 200 && res.data.data) {
        setProduct(res.data.data)
      } else {
        Taro.showToast({
          title: res.data.msg || '加载失败',
          icon: 'none'
        })
      }
    } catch (error) {
      console.error('加载产品详情失败:', error)
      Taro.showToast({
        title: '网络错误，请重试',
        icon: 'none'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    Taro.navigateBack()
  }

  const handleShare = () => {
    Taro.showToast({ title: '分享功能开发中', icon: 'none' })
  }

  const handleCallTeacher = () => {
    if (!product?.teacherPhone) return

    Taro.makePhoneCall({
      phoneNumber: product.teacherPhone,
      success: () => {
        console.log('拨打电话成功')
      },
      fail: (err) => {
        console.error('拨打电话失败', err)
        Taro.showToast({ title: '拨打电话失败', icon: 'none' })
      }
    })
  }

  if (loading) {
    return (
      <View className="product-detail-page">
        <View className="loading-container">
          <Loader className="animate-spin" size={40} color="#2563EB" />
          <Text className="loading-text">加载中...</Text>
        </View>
      </View>
    )
  }

  if (!product) {
    return (
      <View className="product-detail-page">
        <View className="error-container">
          <Text className="error-text">产品不存在或已下架</Text>
        </View>
      </View>
    )
  }

  return (
    <View className="product-detail-page">
      <ScrollView className="detail-content" scrollY scrollWithAnimation>
        {/* 顶部导航栏 */}
        <View className="nav-bar">
          <View className="nav-back block" onClick={handleBack}>
            <ArrowLeft size={24} color="#fff" />
          </View>
          <Text className="nav-title">项目详情</Text>
          <View className="nav-share block" onClick={handleShare}>
            <Share2 size={24} color="#fff" />
          </View>
        </View>

        {/* 项目图片 */}
        <View className="product-images">
          <Image src={product.image} mode="aspectFit" className="product-image" />
        </View>

        {/* 项目基本信息 */}
        <View className="product-info bg-white">
          <View className="info-header">
            <Text className="block text-xl font-bold text-gray-900 mb-2">{product.name}</Text>
            <View className="flex items-center gap-2 mb-2">
              <View className="bg-blue-50 px-3 py-1 rounded-full">
                <Text className="text-xs text-blue-600">{product.category}</Text>
              </View>
              <View className="bg-green-50 px-3 py-1 rounded-full">
                <Text className="text-xs text-green-600">专业指导</Text>
              </View>
            </View>
          </View>

          <View className="info-tags">
            {product.tags.map((tag, index) => (
              <View key={index} className="tag-item">
                <Text className="block text-xs text-blue-600">{tag}</Text>
              </View>
            ))}
          </View>

          <View className="info-meta">
            <View className="meta-item">
              <Text className="meta-label">适用年龄</Text>
              <Text className="meta-value">{product.ageRange}</Text>
            </View>
            <View className="meta-item">
              <Text className="meta-label">指导老师</Text>
              <Text className="meta-value">{product.teacherName}</Text>
            </View>
          </View>
        </View>

        {/* 老师信息 */}
        <View className="section bg-white">
          <View className="section-header">
            <User size={20} color="#2563EB" />
            <Text className="section-title">指导老师</Text>
          </View>
          <View className="teacher-info">
            <View className="teacher-header">
              <View className="teacher-avatar">
                <Text className="teacher-avatar-text">{product.teacherName.charAt(0)}</Text>
              </View>
              <View className="teacher-detail">
                <Text className="block text-base font-bold text-gray-900 mb-1">{product.teacherName}</Text>
                <Text className="block text-sm text-gray-500">专业指导老师</Text>
              </View>
            </View>
            <View className="teacher-contact mt-4">
              <View className="contact-item" onClick={handleCallTeacher}>
                <Phone size={20} color="#2563EB" />
                <View className="contact-info">
                  <Text className="block text-sm text-gray-800">电话咨询</Text>
                  <Text className="block text-xs text-gray-500">{product.teacherPhone}</Text>
                </View>
                <Text className="contact-action block">拨打</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 项目描述 */}
        <View className="section bg-white">
          <View className="section-header">
            <Package size={20} color="#2563EB" />
            <Text className="section-title">项目介绍</Text>
          </View>
          <Text className="block text-sm text-gray-600 leading-relaxed">
            {product.description}
          </Text>
        </View>
      </ScrollView>

      {/* 底部咨询栏 */}
      <View className="bottom-bar">
        <View className="bar-consult" onClick={handleCallTeacher}>
          <Phone size={24} color="white" />
          <Text className="bar-text">电话咨询老师</Text>
        </View>
      </View>
    </View>
  )
}

export default ProductDetailPage

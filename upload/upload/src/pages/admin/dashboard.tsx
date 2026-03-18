import { View, Text, ScrollView, Input, Textarea } from '@tarojs/components'
import { Package, ShoppingCart, LogOut, Plus, FileText, Trash2, ArrowLeft, Calendar } from 'lucide-react-taro'
import Taro, { useLoad } from '@tarojs/taro'
import { useState } from 'react'
import { Network } from '@/network'
import './dashboard.css'

interface Product {
  id: number
  name: string
  price: string
  category: string
  stock: string
  description: string
  teacherName: string
  teacherPhone: string
  image?: string
  tags?: string[]
  ageRange?: string
}

interface Activity {
  id: number
  title: string
  description: string
  date: string
  location: string
  status: string
}

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('products')
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [activities, setActivities] = useState<Activity[]>([])

  // 添加产品弹窗状态
  const [showProductModal, setShowProductModal] = useState(false)
  const [editingProductId, setEditingProductId] = useState<number | null>(null)
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    category: '',
    stock: '',
    description: '',
    teacherName: '',
    teacherPhone: '',
    image: '',
    tags: '',
    ageRange: '',
  })

  // 添加活动弹窗状态
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [editingActivityId, setEditingActivityId] = useState<number | null>(null)
  const [activityForm, setActivityForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    status: '报名中',
  })

  useLoad(() => {
    Taro.setNavigationBarTitle({ title: '管理后台' })

    // 检查登录状态
    const isAdmin = Taro.getStorageSync('isAdmin')
    if (!isAdmin) {
      Taro.redirectTo({ url: '/pages/admin/login' })
      return
    }

    // 加载数据
    loadProducts()
    loadOrders()
    loadActivities()
  })

  const loadProducts = async () => {
    try {
      const res = await Network.request({ url: '/api/admin/products' })
      console.log('产品列表响应:', res.data)
      if (res.data.code === 200) {
        setProducts(res.data.data)
      }
    } catch (error) {
      console.error('加载产品列表失败:', error)
    }
  }

  const loadOrders = async () => {
    try {
      const res = await Network.request({ url: '/api/admin/orders' })
      console.log('订单列表响应:', res.data)
      if (res.data.code === 200) {
        setOrders(res.data.data)
      }
    } catch (error) {
      console.error('加载订单列表失败:', error)
    }
  }

  const loadActivities = async () => {
    try {
      const res = await Network.request({ url: '/api/admin/activities' })
      console.log('活动列表响应:', res.data)
      if (res.data.code === 200) {
        setActivities(res.data.data)
      }
    } catch (error) {
      console.error('加载活动列表失败:', error)
    }
  }

  const handleLogout = () => {
    Taro.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          Taro.removeStorageSync('isAdmin')
          Taro.removeStorageSync('adminToken')
          Taro.redirectTo({ url: '/pages/admin/login' })
        }
      },
    })
  }

  const handleAddProduct = () => {
    setShowProductModal(true)
  }

  const handleProductSubmit = async () => {
    if (!productForm.name || !productForm.price || !productForm.category) {
      Taro.showToast({ title: '请填写必要信息', icon: 'none' })
      return
    }

    try {
      const url = editingProductId
        ? `/api/admin/products/${editingProductId}`
        : '/api/admin/products'
      const method = editingProductId ? 'PUT' : 'POST'

      const submitData = {
        ...productForm,
        price: parseFloat(productForm.price) || 0,
        stock: parseInt(productForm.stock) || 0,
        tags: productForm.tags ? productForm.tags.split(',').map(t => t.trim()).filter(t => t) : [],
        image: productForm.image || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=400&fit=crop',
        ageRange: productForm.ageRange || '8-18岁',
      }

      const res = await Network.request({
        url,
        method,
        data: submitData,
      })
      console.log(editingProductId ? '编辑产品响应:' : '添加产品响应:', res.data)
      if (res.data.code === 200) {
        Taro.showToast({ title: editingProductId ? '编辑成功' : '添加成功', icon: 'success' })
        setShowProductModal(false)
        setEditingProductId(null)
        setProductForm({
          name: '',
          price: '',
          category: '',
          stock: '',
          description: '',
          teacherName: '',
          teacherPhone: '',
          image: '',
          tags: '',
          ageRange: '',
        })
        loadProducts()
      } else {
        Taro.showToast({ title: res.data.msg || (editingProductId ? '编辑失败' : '添加失败'), icon: 'none' })
      }
    } catch (error) {
      console.error(editingProductId ? '编辑产品失败:' : '添加产品失败:', error)
      Taro.showToast({ title: (editingProductId ? '编辑' : '添加') + '失败，请重试', icon: 'none' })
    }
  }

  const handleDeleteProduct = async (id: number) => {
    Taro.showModal({
      title: '确认删除',
      content: '确定要删除这个产品吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            const result = await Network.request({
              url: `/api/admin/products/${id}`,
              method: 'DELETE',
            })
            console.log('删除产品响应:', result.data)
            if (result.data.code === 200) {
              Taro.showToast({ title: '删除成功', icon: 'success' })
              loadProducts()
            } else {
              Taro.showToast({ title: result.data.msg || '删除失败', icon: 'none' })
            }
          } catch (error) {
            console.error('删除产品失败:', error)
            Taro.showToast({ title: '删除失败，请重试', icon: 'none' })
          }
        }
      },
    })
  }

  const handleAddActivity = () => {
    setShowActivityModal(true)
  }

  const handleActivitySubmit = async () => {
    if (!activityForm.title || !activityForm.date || !activityForm.location) {
      Taro.showToast({ title: '请填写必要信息', icon: 'none' })
      return
    }

    try {
      const url = editingActivityId
        ? `/api/admin/activities/${editingActivityId}`
        : '/api/admin/activities'
      const method = editingActivityId ? 'PUT' : 'POST'

      const res = await Network.request({
        url,
        method,
        data: activityForm,
      })
      console.log(editingActivityId ? '编辑活动响应:' : '添加活动响应:', res.data)
      if (res.data.code === 200) {
        Taro.showToast({ title: editingActivityId ? '编辑成功' : '添加成功', icon: 'success' })
        setShowActivityModal(false)
        setEditingActivityId(null)
        setActivityForm({
          title: '',
          description: '',
          date: '',
          location: '',
          status: '报名中',
        })
        loadActivities()
      } else {
        Taro.showToast({ title: res.data.msg || (editingActivityId ? '编辑失败' : '添加失败'), icon: 'none' })
      }
    } catch (error) {
      console.error(editingActivityId ? '编辑活动失败:' : '添加活动失败:', error)
      Taro.showToast({ title: (editingActivityId ? '编辑' : '添加') + '失败，请重试', icon: 'none' })
    }
  }

  const handleEditActivity = (id: number) => {
    const activity = activities.find((a: any) => a.id === id)
    if (activity) {
      setEditingActivityId(id)
      setActivityForm({
        title: activity.title,
        description: activity.description,
        date: activity.date,
        location: activity.location,
        status: activity.status,
      })
      setShowActivityModal(true)
    }
  }

  const handleEditProduct = (id: number) => {
    const product = products.find((p: any) => p.id === id)
    if (product) {
      setEditingProductId(id)
      setProductForm({
        name: product.name,
        price: product.price,
        category: product.category,
        stock: product.stock,
        description: product.description,
        teacherName: product.teacherName,
        teacherPhone: product.teacherPhone,
        image: product.image || '',
        tags: Array.isArray(product.tags) ? product.tags.join(',') : (product.tags || ''),
        ageRange: product.ageRange || '',
      })
      setShowProductModal(true)
    }
  }

  const handleDeleteActivity = async (id: number) => {
    Taro.showModal({
      title: '确认删除',
      content: '确定要删除这个活动吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            const result = await Network.request({
              url: `/api/admin/activities/${id}`,
              method: 'DELETE',
            })
            console.log('删除活动响应:', result.data)
            if (result.data.code === 200) {
              Taro.showToast({ title: '删除成功', icon: 'success' })
              loadActivities()
            } else {
              Taro.showToast({ title: result.data.msg || '删除失败', icon: 'none' })
            }
          } catch (error) {
            console.error('删除活动失败:', error)
            Taro.showToast({ title: '删除失败，请重试', icon: 'none' })
          }
        }
      },
    })
  }

  const handleBack = () => {
    Taro.switchTab({ url: '/pages/index/index' })
  }

  // 删除模拟数据，使用从后端获取的数据

  return (
    <View className="admin-dashboard-page">
      {/* 顶部导航 */}
      <View className="admin-header">
        <View className="header-left block" onClick={handleBack}>
          <ArrowLeft size={24} color="#fff" />
        </View>
        <Text className="header-title">管理后台</Text>
        <View className="header-right block" onClick={handleLogout}>
          <LogOut size={24} color="#fff" />
        </View>
      </View>

      <ScrollView className="dashboard-content" scrollY>
        {/* 统计卡片 */}
        <View className="stats-section">
          <View className="stat-card">
            <Package size={32} color="#2563EB" />
            <Text className="stat-value">{products.length}</Text>
            <Text className="stat-label">产品总数</Text>
          </View>
          <View className="stat-card">
            <ShoppingCart size={32} color="#10B981" />
            <Text className="stat-value">{orders.length}</Text>
            <Text className="stat-label">订单总数</Text>
          </View>
          <View className="stat-card">
            <Calendar size={32} color="#F59E0B" />
            <Text className="stat-value">{activities.length}</Text>
            <Text className="stat-label">活动总数</Text>
          </View>
        </View>

        {/* 标签页切换 */}
        <View className="tab-section">
          <View
            className={`tab-item ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <Text className="tab-text">产品管理</Text>
          </View>
          <View
            className={`tab-item ${activeTab === 'activities' ? 'active' : ''}`}
            onClick={() => setActiveTab('activities')}
          >
            <Text className="tab-text">活动管理</Text>
          </View>
          <View
            className={`tab-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <Text className="tab-text">订单管理</Text>
          </View>
        </View>

        {/* 商品管理 */}
        {activeTab === 'products' && (
          <View className="content-section">
            <View className="section-header">
              <Text className="section-title">产品列表</Text>
              <View className="btn-add block" onClick={handleAddProduct}>
                <Plus size={20} color="#fff" />
                <Text className="block text-white text-sm ml-1">添加产品</Text>
              </View>
            </View>

            <View className="product-list">
              {products.length === 0 ? (
                <View className="empty-state">
                  <Text className="block text-gray-400 text-center">暂无产品数据</Text>
                </View>
              ) : (
                products.map((product: any) => (
                  <View key={product.id} className="product-card">
                    <View className="product-info">
                      <Text className="block text-base font-semibold text-gray-800">{product.name}</Text>
                      <Text className="block text-xs text-gray-500 mt-1">{product.category}</Text>
                      <View className="flex items-center gap-4 mt-2">
                        <Text className="text-sm text-orange-500 font-medium">¥{product.price}</Text>
                        <Text className="text-xs text-gray-400">销量：{product.sales}</Text>
                        <Text className="text-xs text-gray-400">库存：{product.stock}</Text>
                      </View>
                    </View>
                    <View className="product-actions">
                      <View className="action-btn block" onClick={() => handleEditProduct(product.id)}>
                        <FileText size={18} color="#2563EB" />
                      </View>
                      <View className="action-btn block" onClick={() => handleDeleteProduct(product.id)}>
                        <Trash2 size={18} color="#EF4444" />
                      </View>
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>
        )}

        {/* 活动管理 */}
        {activeTab === 'activities' && (
          <View className="content-section">
            <View className="section-header">
              <Text className="section-title">活动列表</Text>
              <View className="btn-add block" onClick={handleAddActivity}>
                <Plus size={20} color="#fff" />
                <Text className="block text-white text-sm ml-1">添加活动</Text>
              </View>
            </View>

            <View className="activity-list">
              {activities.length === 0 ? (
                <View className="empty-state">
                  <Text className="block text-gray-400 text-center">暂无活动数据</Text>
                </View>
              ) : (
                activities.map((activity: any) => (
                  <View key={activity.id} className="activity-card">
                    <View className="activity-info">
                      <View className="flex justify-between items-start">
                        <Text className="block text-base font-semibold text-gray-800">{activity.title}</Text>
                        <View className={`status-badge ${activity.status === '报名中' ? 'pending' : activity.status === '进行中' ? 'paid' : 'shipped'}`}>
                          <Text className="text-xs text-white">{activity.status}</Text>
                        </View>
                      </View>
                      <Text className="block text-sm text-gray-600 mt-1">{activity.description}</Text>
                      <View className="flex items-center gap-2 mt-2">
                        <Text className="text-xs text-gray-400">{activity.date}</Text>
                        <Text className="text-xs text-gray-400">{activity.location}</Text>
                      </View>
                    </View>
                    <View className="activity-actions">
                      <View className="action-btn block" onClick={() => handleEditActivity(activity.id)}>
                        <FileText size={18} color="#2563EB" />
                      </View>
                      <View className="action-btn block" onClick={() => handleDeleteActivity(activity.id)}>
                        <Trash2 size={18} color="#EF4444" />
                      </View>
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>
        )}

        {/* 订单管理 */}
        {activeTab === 'orders' && (
          <View className="content-section">
            <View className="section-header">
              <Text className="section-title">订单列表</Text>
            </View>

            <View className="order-list">
              {orders.length === 0 ? (
                <View className="empty-state">
                  <Text className="block text-gray-400 text-center">暂无订单数据</Text>
                </View>
              ) : (
                orders.map((order: any) => (
                  <View key={order.id} className="order-card">
                    <View className="order-info">
                      <View className="flex justify-between items-start">
                        <Text className="block text-base font-semibold text-gray-800">{order.customer}</Text>
                        <View className={`status-badge ${order.status === '待支付' ? 'pending' : order.status === '已支付' ? 'paid' : 'shipped'}`}>
                          <Text className="text-xs text-white">{order.status}</Text>
                        </View>
                      </View>
                      <Text className="block text-sm text-gray-600 mt-1">{order.product}</Text>
                      <Text className="block text-orange-500 font-medium mt-1">¥{order.amount}</Text>
                      <Text className="block text-xs text-gray-400 mt-2">{order.date}</Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* 添加产品弹窗 */}
      {showProductModal && (
        <View className="modal-mask">
          <View className="modal-container">
            <View className="modal-header">
              <Text className="block text-lg font-semibold text-gray-900">
                {editingProductId ? '编辑产品' : '添加产品'}
              </Text>
              <Text
                className="block text-gray-500 cursor-pointer"
                onClick={() => {
                  setShowProductModal(false)
                  setEditingProductId(null)
                }}
              >
                ✕
              </Text>
            </View>
            <View className="modal-body">
              <View className="form-item block">
                <Text className="block text-sm text-gray-700 mb-2">产品名称 *</Text>
                <View className="bg-gray-50 rounded-xl px-4 py-3">
                  <Input
                    style={{ width: '100%', backgroundColor: 'transparent' }}
                    placeholder="请输入产品名称"
                    value={productForm.name}
                    onInput={(e) => setProductForm({ ...productForm, name: e.detail.value })}
                  />
                </View>
              </View>

              <View className="form-item block">
                <Text className="block text-sm text-gray-700 mb-2">价格 *</Text>
                <View className="bg-gray-50 rounded-xl px-4 py-3">
                  <Input
                    style={{ width: '100%', backgroundColor: 'transparent' }}
                    placeholder="请输入价格"
                    type="number"
                    value={productForm.price}
                    onInput={(e) => setProductForm({ ...productForm, price: e.detail.value })}
                  />
                </View>
              </View>

              <View className="form-item block">
                <Text className="block text-sm text-gray-700 mb-2">分类 *</Text>
                <View className="bg-gray-50 rounded-xl px-4 py-3">
                  <Input
                    style={{ width: '100%', backgroundColor: 'transparent' }}
                    placeholder="请输入分类"
                    value={productForm.category}
                    onInput={(e) => setProductForm({ ...productForm, category: e.detail.value })}
                  />
                </View>
              </View>

              <View className="form-item block">
                <Text className="block text-sm text-gray-700 mb-2">库存</Text>
                <View className="bg-gray-50 rounded-xl px-4 py-3">
                  <Input
                    style={{ width: '100%', backgroundColor: 'transparent' }}
                    placeholder="请输入库存"
                    type="number"
                    value={productForm.stock}
                    onInput={(e) => setProductForm({ ...productForm, stock: e.detail.value })}
                  />
                </View>
              </View>

              <View className="form-item block">
                <Text className="block text-sm text-gray-700 mb-2">产品描述</Text>
                <View className="bg-gray-50 rounded-xl p-4">
                  <Textarea
                    style={{ width: '100%', minHeight: '80px', backgroundColor: 'transparent' }}
                    placeholder="请输入产品描述"
                    value={productForm.description}
                    onInput={(e) => setProductForm({ ...productForm, description: e.detail.value })}
                  />
                </View>
              </View>

              <View className="form-item block">
                <Text className="block text-sm text-gray-700 mb-2">老师姓名</Text>
                <View className="bg-gray-50 rounded-xl px-4 py-3">
                  <Input
                    style={{ width: '100%', backgroundColor: 'transparent' }}
                    placeholder="请输入老师姓名"
                    value={productForm.teacherName}
                    onInput={(e) => setProductForm({ ...productForm, teacherName: e.detail.value })}
                  />
                </View>
              </View>

              <View className="form-item block">
                <Text className="block text-sm text-gray-700 mb-2">老师联系方式</Text>
                <View className="bg-gray-50 rounded-xl px-4 py-3">
                  <Input
                    style={{ width: '100%', backgroundColor: 'transparent' }}
                    placeholder="请输入老师联系方式"
                    value={productForm.teacherPhone}
                    onInput={(e) => setProductForm({ ...productForm, teacherPhone: e.detail.value })}
                  />
                </View>
              </View>

              <View className="form-item block">
                <Text className="block text-sm text-gray-700 mb-2">产品图片</Text>
                <View className="bg-gray-50 rounded-xl px-4 py-3">
                  <Input
                    style={{ width: '100%', backgroundColor: 'transparent' }}
                    placeholder="请输入图片URL"
                    value={productForm.image}
                    onInput={(e) => setProductForm({ ...productForm, image: e.detail.value })}
                  />
                </View>
              </View>

              <View className="form-item block">
                <Text className="block text-sm text-gray-700 mb-2">标签（用逗号分隔）</Text>
                <View className="bg-gray-50 rounded-xl px-4 py-3">
                  <Input
                    style={{ width: '100%', backgroundColor: 'transparent' }}
                    placeholder="例如：编程,机器人,Scratch"
                    value={productForm.tags}
                    onInput={(e) => setProductForm({ ...productForm, tags: e.detail.value })}
                  />
                </View>
              </View>

              <View className="form-item block">
                <Text className="block text-sm text-gray-700 mb-2">适用年龄</Text>
                <View className="bg-gray-50 rounded-xl px-4 py-3">
                  <Input
                    style={{ width: '100%', backgroundColor: 'transparent' }}
                    placeholder="例如：8-12岁"
                    value={productForm.ageRange}
                    onInput={(e) => setProductForm({ ...productForm, ageRange: e.detail.value })}
                  />
                </View>
              </View>
            </View>
            <View className="modal-footer">
              <View
                className="modal-btn cancel-btn block"
                onClick={() => {
                  setShowProductModal(false)
                  setEditingProductId(null)
                }}
              >
                <Text className="block text-sm text-gray-700">取消</Text>
              </View>
              <View
                className="modal-btn confirm-btn block"
                onClick={handleProductSubmit}
              >
                <Text className="block text-sm text-white">确认</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* 添加活动弹窗 */}
      {showActivityModal && (
        <View className="modal-mask">
          <View className="modal-container">
            <View className="modal-header">
              <Text className="block text-lg font-semibold text-gray-900">
                {editingActivityId ? '编辑活动' : '添加活动'}
              </Text>
              <Text
                className="block text-gray-500 cursor-pointer"
                onClick={() => {
                  setShowActivityModal(false)
                  setEditingActivityId(null)
                }}
              >
                ✕
              </Text>
            </View>
            <View className="modal-body">
              <View className="form-item block">
                <Text className="block text-sm text-gray-700 mb-2">活动标题 *</Text>
                <View className="bg-gray-50 rounded-xl px-4 py-3">
                  <Input
                    style={{ width: '100%', backgroundColor: 'transparent' }}
                    placeholder="请输入活动标题"
                    value={activityForm.title}
                    onInput={(e) => setActivityForm({ ...activityForm, title: e.detail.value })}
                  />
                </View>
              </View>

              <View className="form-item block">
                <Text className="block text-sm text-gray-700 mb-2">活动描述</Text>
                <View className="bg-gray-50 rounded-xl p-4">
                  <Textarea
                    style={{ width: '100%', minHeight: '80px', backgroundColor: 'transparent' }}
                    placeholder="请输入活动描述"
                    value={activityForm.description}
                    onInput={(e) => setActivityForm({ ...activityForm, description: e.detail.value })}
                  />
                </View>
              </View>

              <View className="form-item block">
                <Text className="block text-sm text-gray-700 mb-2">活动日期 *</Text>
                <View className="bg-gray-50 rounded-xl px-4 py-3">
                  <Input
                    style={{ width: '100%', backgroundColor: 'transparent' }}
                    placeholder="请输入活动日期 (YYYY-MM-DD)"
                    value={activityForm.date}
                    onInput={(e) => setActivityForm({ ...activityForm, date: e.detail.value })}
                  />
                </View>
              </View>

              <View className="form-item block">
                <Text className="block text-sm text-gray-700 mb-2">活动地点 *</Text>
                <View className="bg-gray-50 rounded-xl px-4 py-3">
                  <Input
                    style={{ width: '100%', backgroundColor: 'transparent' }}
                    placeholder="请输入活动地点"
                    value={activityForm.location}
                    onInput={(e) => setActivityForm({ ...activityForm, location: e.detail.value })}
                  />
                </View>
              </View>

              <View className="form-item block">
                <Text className="block text-sm text-gray-700 mb-2">活动状态</Text>
                <View className="bg-gray-50 rounded-xl px-4 py-3">
                  <Input
                    style={{ width: '100%', backgroundColor: 'transparent' }}
                    placeholder="请输入活动状态"
                    value={activityForm.status}
                    onInput={(e) => setActivityForm({ ...activityForm, status: e.detail.value })}
                  />
                </View>
              </View>
            </View>
            <View className="modal-footer">
              <View
                className="modal-btn cancel-btn block"
                onClick={() => {
                  setShowActivityModal(false)
                  setEditingActivityId(null)
                }}
              >
                <Text className="block text-sm text-gray-700">取消</Text>
              </View>
              <View
                className="modal-btn confirm-btn block"
                onClick={handleActivitySubmit}
              >
                <Text className="block text-sm text-white">确认</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

export default AdminDashboardPage

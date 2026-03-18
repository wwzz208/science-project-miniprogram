import { View, Text, ScrollView } from '@tarojs/components'
import { Package } from 'lucide-react-taro'
import Taro, { useLoad } from '@tarojs/taro'
import { useState } from 'react'
import './index.css'

interface Order {
  id: number
  orderNo: string
  products: Array<{ name: string; price: number; quantity: number }>
  totalAmount: number
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled'
  createTime: string
}

const OrderPage = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'paid' | 'shipped' | 'completed'>('all')
  const [orders] = useState<Order[]>([
    {
      id: 1,
      orderNo: 'ORD202401150001',
      products: [{ name: '智能编程机器人套件', price: 299, quantity: 1 }],
      totalAmount: 299,
      status: 'paid',
      createTime: '2024-01-15 14:30:00'
    },
    {
      id: 2,
      orderNo: 'ORD202401140001',
      products: [{ name: '电子创客入门套装', price: 199, quantity: 2 }],
      totalAmount: 398,
      status: 'shipped',
      createTime: '2024-01-14 10:20:00'
    },
    {
      id: 3,
      orderNo: 'ORD202401130001',
      products: [
        { name: '3D打印入门套装', price: 399, quantity: 1 },
        { name: 'Arduino开发板', price: 159, quantity: 1 }
      ],
      totalAmount: 558,
      status: 'completed',
      createTime: '2024-01-13 16:45:00'
    },
  ])

  useLoad(() => {
    Taro.setNavigationBarTitle({ title: '我的订单' })
  })

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '待支付'
      case 'paid':
        return '待发货'
      case 'shipped':
        return '待收货'
      case 'completed':
        return '已完成'
      case 'cancelled':
        return '已取消'
      default:
        return ''
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#F59E0B'
      case 'paid':
        return '#2563EB'
      case 'shipped':
        return '#10B981'
      case 'completed':
        return '#6B7280'
      case 'cancelled':
        return '#EF4444'
      default:
        return '#6B7280'
    }
  }

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeTab)

  return (
    <View className="order-page">
      <ScrollView className="order-content" scrollY>
        {/* 标签页 */}
        <View className="order-tabs">
          <View
            className={`tab-item ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <Text className="tab-text">全部</Text>
          </View>
          <View
            className={`tab-item ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            <Text className="tab-text">待支付</Text>
          </View>
          <View
            className={`tab-item ${activeTab === 'paid' ? 'active' : ''}`}
            onClick={() => setActiveTab('paid')}
          >
            <Text className="tab-text">待发货</Text>
          </View>
          <View
            className={`tab-item ${activeTab === 'shipped' ? 'active' : ''}`}
            onClick={() => setActiveTab('shipped')}
          >
            <Text className="tab-text">待收货</Text>
          </View>
          <View
            className={`tab-item ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            <Text className="tab-text">已完成</Text>
          </View>
        </View>

        {/* 订单列表 */}
        <View className="order-list">
          {filteredOrders.length === 0 ? (
            <View className="empty-state">
              <Package size={48} color="#9CA3AF" />
              <Text className="block text-gray-400 text-sm mt-4">暂无订单</Text>
            </View>
          ) : (
            filteredOrders.map((order) => (
              <View key={order.id} className="order-card">
                <View className="order-header">
                  <Text className="order-no">订单号：{order.orderNo}</Text>
                  <View className="order-status" style={{ color: getStatusColor(order.status) }}>
                    <Text className="order-status-text">{getStatusText(order.status)}</Text>
                  </View>
                </View>

                {order.products.map((product, index) => (
                  <View key={index} className="order-product">
                    <View className="product-icon">
                      <Package size={24} color="#2563EB" />
                    </View>
                    <View className="product-info">
                      <Text className="product-name">{product.name}</Text>
                      <Text className="product-quantity">× {product.quantity}</Text>
                    </View>
                    <Text className="product-price">¥{product.price}</Text>
                  </View>
                ))}

                <View className="order-footer">
                  <Text className="order-total">
                    共 {order.products.length} 件商品，合计：
                    <Text className="order-amount">¥{order.totalAmount}</Text>
                  </Text>
                  <View className="order-actions">
                    {order.status === 'pending' && (
                      <View className="action-btn primary block">
                        <Text className="action-btn-text">去支付</Text>
                      </View>
                    )}
                    {order.status === 'shipped' && (
                      <View className="action-btn primary block">
                        <Text className="action-btn-text">确认收货</Text>
                      </View>
                    )}
                    <View className="action-btn block">
                      <Text className="action-btn-text">查看详情</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  )
}

export default OrderPage

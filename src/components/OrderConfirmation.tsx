import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ordersAPI } from '../services/api';

const OrderConfirmation: React.FC = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderId) return;
    setLoading(true);
    ordersAPI.getOrder(orderId)
      .then((res: { data: { data: { order: any } } }) => {
        setOrder(res.data.data.order);
        setError('');
      })
      .catch((err: any) => {
        setError('Failed to fetch order details');
        setOrder(null);
      })
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  if (!order) return <div className="min-h-screen flex items-center justify-center">Order not found.</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full text-center">
        <h2 className="text-3xl font-bold text-orange-600 mb-4">Order Confirmed!</h2>
        <p className="text-lg mb-2">Thank you for your order.</p>
        <div className="my-4">
          <div className="text-gray-700 text-lg font-semibold">Order ID:</div>
          <div className="text-2xl font-mono text-green-700">{order.id || order.orderNumber}</div>
        </div>
        <div className="mb-4">
          <span className="font-semibold">Status:</span> <span className="text-blue-600">{order.status}</span>
        </div>
        <div className="mb-6">
          <span className="font-semibold">Total:</span> <span className="text-orange-600 font-bold">₹{order.total}</span>
        </div>
        <Link to="/order" className="inline-block bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-full font-bold transition-all duration-300">Order More</Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;

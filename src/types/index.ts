export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'inactive';
  customerType?: 'regular' | 'vip' | 'premium';
  lastOrderDate?: string | null;
  loyaltyPoints?: number;
  notes?: string;
}

export interface ComboItem {
  id: string;
  quantity: number;
  name: string;
  spiceLevel?: 'none' | 'mild' | 'medium' | 'hot' | 'very-hot';
}
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  popular: boolean;
  available: boolean;
  isCombo: boolean; // New field to identify combo items
  comboItems?: ComboItem[]; // Array of items included in the combo (only for combo items)
  ingredients?: string[];
  allergens?: string[];
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  spiceLevel?: 'none' | 'mild' | 'medium' | 'hot' | 'very-hot';
  preparationTime?: number;
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
  };
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// export interface MenuItem {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   image: string;
//   category: string;
//   popular: boolean;
//   available: boolean;
//   ingredients?: string[];
//   allergens?: string[];
//   isVegetarian?: boolean;
//   isVegan?: boolean;
//   isGlutenFree?: boolean;
//   spiceLevel?: 'none' | 'mild' | 'medium' | 'hot' | 'very-hot';
//   preparationTime?: number;
//   nutritionalInfo?: {
//     calories?: number;
//     protein?: number;
//     carbs?: number;
//     fat?: number;
//     fiber?: number;
//   };
//   tags?: string[];
//   createdAt?: string;
//   updatedAt?: string;
// }

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  orderType: 'dine-in' | 'takeaway' | 'delivery' | 'catering'; // add 'catering'
  orderDate?: string;
  createdAt?: string;
  deliveryAddress?: string;
  specialInstructions?: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod?: 'cash' | 'card' | 'upi' | 'online';
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  assignedStaff?: string;
  rating?: {
    food?: number;
    service?: number;
    delivery?: number;
    overall?: number;
    review?: string;
  };
  eventDetails?: {
    eventType?: string;
    guestCount?: number;
    eventDate?: string;
    eventTime?: string;
    venue?: string;
  };
}

export interface AdminStats {
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
  todayOrders: number;
  pendingOrders: number;
  popularItems: MenuItem[];
}

export interface ContactForm {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: 'reservation' | 'catering' | 'feedback' | 'complaint' | 'other';
  message: string;
  status: 'new' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  response?: {
    message: string;
    respondedBy: string;
    respondedAt: string;
  };
  notes?: Array<{
    message: string;
    addedBy: string;
    addedAt: string;
  }>;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'chef' | 'waiter' | 'manager' | 'delivery' | 'cashier';
  status: 'active' | 'inactive';
  joinDate: string;
  salary?: number;
  shift?: 'morning' | 'evening' | 'night';
  permissions: string[];
}

export interface Inventory {
  id: string;
  itemName: string;
  category: 'vegetables' | 'meat' | 'dairy' | 'spices' | 'grains' | 'beverages' | 'other';
  quantity: number;
  unit: 'kg' | 'liters' | 'pieces' | 'packets';
  minimumStock: number;
  supplier: string;
  costPerUnit: number;
  expiryDate?: string;
  lastUpdated: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'expired';
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  type: 'percentage' | 'fixed-amount' | 'buy-one-get-one' | 'free-delivery';
  value: number;
  minimumOrderAmount?: number;
  applicableItems?: string[];
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageLimit?: number;
  usedCount: number;
  code?: string;
}

export interface Analytics {
  dailySales: Array<{
    date: string;
    sales: number;
    orders: number;
  }>;
  topSellingItems: Array<{
    itemId: string;
    itemName: string;
    quantitySold: number;
    revenue: number;
  }>;
  customerSegments: {
    new: number;
    returning: number;
    vip: number;
  };
  orderTypes: {
    dineIn: number;
    takeaway: number;
    delivery: number;
  };
  peakHours: Array<{
    hour: number;
    orderCount: number;
  }>;
}
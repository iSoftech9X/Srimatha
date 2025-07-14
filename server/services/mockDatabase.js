// // Mock database service for development
// import { mockMenuItems, mockUsers, mockOrders, mockContacts } from '../data/mockData.js';

// class MockDatabase {
//   constructor() {
//     this.menuItems = [...mockMenuItems];
//     this.users = [...mockUsers];
//     this.orders = [...mockOrders];
//     this.contacts = [...mockContacts];
//     this.connected = false;
//   }

//   async connect() {
//     // Simulate connection delay
//     await new Promise(resolve => setTimeout(resolve, 100));
//     this.connected = true;
//     console.log('Mock database connected successfully');
//     return true;
//   }

//   isConnected() {
//     return this.connected;
//   }

//   // Menu Items
//   async findMenuItems(query = {}, options = {}) {
//     let items = [...this.menuItems];
    
//     // Apply filters
//     if (query.category) {
//       items = items.filter(item => item.category === query.category);
//     }
//     if (query.isVegetarian !== undefined) {
//       items = items.filter(item => item.isVegetarian === query.isVegetarian);
//     }
//     if (query.isAvailable !== undefined) {
//       items = items.filter(item => item.isAvailable === query.isAvailable);
//     }

//     // Apply pagination
//     const limit = options.limit || 10;
//     const skip = options.skip || 0;
//     const paginatedItems = items.slice(skip, skip + limit);

//     return {
//       items: paginatedItems,
//       total: items.length,
//       page: Math.floor(skip / limit) + 1,
//       totalPages: Math.ceil(items.length / limit)
//     };
//   }

//   async findMenuItemById(id) {
//     return this.menuItems.find(item => item._id === id);
//   }

//   async createMenuItem(itemData) {
//     const newItem = {
//       _id: Date.now().toString(),
//       ...itemData,
//       createdAt: new Date(),
//       updatedAt: new Date()
//     };
//     this.menuItems.push(newItem);
//     return newItem;
//   }

//   async updateMenuItem(id, updateData) {
//     const index = this.menuItems.findIndex(item => item._id === id);
//     if (index !== -1) {
//       this.menuItems[index] = {
//         ...this.menuItems[index],
//         ...updateData,
//         updatedAt: new Date()
//       };
//       return this.menuItems[index];
//     }
//     return null;
//   }

//   async deleteMenuItem(id) {
//     const index = this.menuItems.findIndex(item => item._id === id);
//     if (index !== -1) {
//       return this.menuItems.splice(index, 1)[0];
//     }
//     return null;
//   }

//   // Users
//   async findUserByEmail(email) {
//     return this.users.find(user => user.email === email);
//   }

//   async findUserById(id) {
//     return this.users.find(user => user._id === id);
//   }

//   async createUser(userData) {
//     const newUser = {
//       _id: Date.now().toString(),
//       ...userData,
//       createdAt: new Date(),
//       updatedAt: new Date()
//     };
//     this.users.push(newUser);
//     return newUser;
//   }

//   // Orders
//   async findOrders(query = {}, options = {}) {
//     let orders = [...this.orders];
    
//     // Apply filters
//     if (query.customerId) {
//       orders = orders.filter(order => order.customerId === query.customerId);
//     }
//     if (query.status) {
//       orders = orders.filter(order => order.status === query.status);
//     }

//     // Apply pagination
//     const limit = options.limit || 10;
//     const skip = options.skip || 0;
//     const paginatedOrders = orders.slice(skip, skip + limit);

//     return {
//       orders: paginatedOrders,
//       total: orders.length,
//       page: Math.floor(skip / limit) + 1,
//       totalPages: Math.ceil(orders.length / limit)
//     };
//   }

//   async createOrder(orderData) {
//     const newOrder = {
//       _id: Date.now().toString(),
//       ...orderData,
//       createdAt: new Date(),
//       updatedAt: new Date()
//     };
//     this.orders.push(newOrder);
//     return newOrder;
//   }

//   async updateOrder(id, updateData) {
//     const index = this.orders.findIndex(order => order._id === id);
//     if (index !== -1) {
//       this.orders[index] = {
//         ...this.orders[index],
//         ...updateData,
//         updatedAt: new Date()
//       };
//       return this.orders[index];
//     }
//     return null;
//   }

//   // Dashboard stats
//   async getDashboardStats() {
//     const totalOrders = this.orders.length;
//     const totalRevenue = this.orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
//     const todayOrders = this.orders.filter(order => {
//       const today = new Date();
//       const orderDate = new Date(order.createdAt);
//       return orderDate.toDateString() === today.toDateString();
//     }).length;
//     const pendingOrders = this.orders.filter(order => order.status === 'pending').length;

//     return {
//       totalCustomers: this.users.filter(user => user.role === 'customer').length,
//       totalOrders,
//       totalRevenue,
//       todayOrders,
//       pendingOrders,
//       popularItems: this.menuItems.slice(0, 5)
//     };
//   }
// }

// export default new MockDatabase();
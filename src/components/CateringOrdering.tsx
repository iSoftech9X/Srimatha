
import React, { useState, useEffect } from "react";
import {
  Star,
  Plus,
  ShoppingCart,
  Users,
  Calendar,
  X,
  History,
  Minus,
  Search,
  Home,
  ChevronDown,
  ChevronUp,
  Eye,
  Gift,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { menuAPI, ordersAPI, authAPI } from "../services/api";
import toast from "react-hot-toast";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

type OrderItem = {
  id: number;
  order_id: number;
  menu_item_id: number;
  quantity: number;
  price: string;
  special_instructions: string | null;
  name: string;
  description: string;
};

type EventDetails = {
  eventType?: string;
  eventDate?: string;
  numberOfPersons?: number;
};

type ApiOrder = {
  id: number;
  order_number: string;
  customer_id: number;
  status: string;
  subtotal: string;
  total: string;
  payment_status: string;
  order_type: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  eventDetails?: EventDetails;
  event_number_of_persons?: number;
  event_date?: string;
  event_type?: string;
};

type Address = {
  street: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
};

type ComboItem = {
  name: string;
  quantity: number;
  spice_level: string;
};

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  available: boolean;
  category: string;
  image: string | null;
  isCombo: boolean;
  comboItems?: ComboItem[];
  isGlutenFree: boolean;
  isVegan: boolean;
  isVegetarian: boolean;
  preparationTime: number;
  spiceLevel: string;
};

type CartItem = {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
};

const CateringOrdering: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { cart, addToCart, removeFromCart, clearCart, updateCartQuantity } =
    useApp();
  const navigate = useNavigate();

  const [showCart, setShowCart] = useState(false);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [menuCategories, setMenuCategories] = useState<
    { id: string; name: string }[]
  >([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [allItemsLoaded, setAllItemsLoaded] = useState(false);
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(
    null
  );
  const [showCancelForm, setShowCancelForm] = useState<number | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [showAddressConfirmation, setShowAddressConfirmation] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address>({
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
  });
  const [isUpdatingAddress, setIsUpdatingAddress] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [numberOfPersons, setNumberOfPersons] = useState<number>(1);
  const [eventDate, setEventDate] = useState<string>("");
  const [eventType, setEventType] = useState<string>("");
  const [eventTypes] = useState<string[]>([
    "Wedding",
    "Corporate Event",
    "Birthday Party",
    "Anniversary",
    "Graduation",
    "Other",
  ]);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [showDropdown, setShowDropdown] = useState<number | null>(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState<
    Record<string, boolean>
  >({});
  const [viewingComboId, setViewingComboId] = useState<string | null>(null);

  const toggleDescription = (itemId: string) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchUserProfile = async () => {
    if (!user) return;

    setLoadingProfile(true);
    try {
      const response = await authAPI.getProfile();
      const userData = response.data?.user || response.data?.data?.user;

      if (userData) {
        const newAddress = {
          street: userData.address_street || "",
          city: userData.address_city || "",
          state: userData.address_state || "",
          zipcode: userData.address_zipcode || "",
          country: userData.address_country || "",
        };

        setSelectedAddress(newAddress);

        if (updateUser) {
          updateUser(userData);
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchAllItems = async (
    page = 1,
    accumulatedItems: MenuItem[] = []
  ): Promise<MenuItem[]> => {
    try {
      const response = await menuAPI.getItems({
        isAvailable: true,
        page,
        limit: 1000000,
      });

      const newItems = response.data.items || response.data.data?.items || [];
      const allItems = [...accumulatedItems, ...newItems];

      if (page < (response.data.totalPages || 1)) {
        return fetchAllItems(page + 1, allItems);
      }

      return allItems;
    } catch (error) {
      console.error("Error fetching items:", error);
      return accumulatedItems;
    }
  };

  const fetchOrderHistory = async () => {
    if (!user) return;

    setLoadingOrders(true);
    setOrderError("");
    try {
      const response = await ordersAPI.getMyOrders({
        includeItems: true,
        expand: "items.menu_item",
        limit: 1000000, // Added high limit to fetch all orders
      });
      setOrders(response.data.orders || response.data.data?.orders || []);
    } catch (err) {
      setOrderError("Failed to load order history");
      console.error("Error fetching orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const cancelOrder = async (id: number) => {
    if (!user || !cancelReason.trim()) {
      toast.error("Please provide a cancellation reason");
      return;
    }

    setCancellingOrderId(id);
    try {
      await ordersAPI.cancelOrder(id, cancelReason.trim());
      toast.success("Order cancelled successfully");
      setOrders(
        orders.map((order) =>
          order.id === id ? { ...order, status: "cancelled" } : order
        )
      );
      setShowCancelForm(null);
      setCancelReason("");
      setShowDropdown(null);
    } catch (err) {
      toast.error("Failed to cancel order. Please try again.");
      console.error("Error cancelling order:", err);
    } finally {
      setCancellingOrderId(null);
    }
  };

  const handleCancelClick = (orderId: number) => {
    setShowCancelForm(orderId);
    setCancelReason("");
  };

  const handleCancelFormClose = () => {
    setShowCancelForm(null);
    setCancelReason("");
  };

  const handleIncrement = (cartItemId: string) => {
    const item = cart.find((item) => item.id === cartItemId);
    if (item) {
      updateCartQuantity(cartItemId, item.quantity + 1);
    }
  };

  const handleDecrement = (cartItemId: string) => {
    const item = cart.find((item) => item.id === cartItemId);
    if (item) {
      if (item.quantity > 1) {
        updateCartQuantity(cartItemId, item.quantity - 1);
      } else {
        removeFromCart(cartItemId);
      }
    }
  };

  const handleAddToCart = (item: MenuItem) => {
    addToCart(item, 1);
  };

  const updateUserAddress = async () => {
    if (!user) return;

    setIsUpdatingAddress(true);
    try {
      const patchData = {
        address: {
          street: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          zipcode: selectedAddress.zipcode,
          country: selectedAddress.country,
        },
      };

      const response = await authAPI.patchProfile(patchData);

      toast.success("Address updated successfully!");
      setIsEditingAddress(false);
      await fetchUserProfile();
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error("Failed to update address. Please try again.");
    } finally {
      setIsUpdatingAddress(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!eventDate) {
      toast.error("Please select an event date");
      return;
    }

    if (!eventType) {
      toast.error("Please select an event type");
      return;
    }

    if (numberOfPersons < 1) {
      toast.error("Number of persons must be at least 1");
      return;
    }

    try {
      const orderPayload = {
        userName: user?.name,
        userEmail: user?.email,
        userPhone: user?.phone,
        address: selectedAddress,
        items: cart.map((item) => ({
          menuItemId: item.menuItem.id,
          name: item.menuItem.name,
          quantity: item.quantity,
          price: item.menuItem.price,
          specialInstructions: item.specialInstructions,
        })),
        eventDetails: {
          numberOfPersons,
          eventDate,
          eventType,
        },
        subtotal: cartTotal,
        total: cartTotal,
        paymentStatus: "pending",
        orderType: "catering",
      };

      await ordersAPI.createOrder(orderPayload);
      setShowSuccessPopup(true);
      clearCart();
      setShowCart(false);
      setShowAddressConfirmation(false);
      if (showOrderHistory) {
        fetchOrderHistory();
      }
    } catch (err) {
      toast.error("Failed to place order. Please try again.");
      console.error("Error placing order:", err);
    }
  };

  const handleCheckoutClick = () => {
    if (!user) {
      (window as any).openAuthModal("login");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setShowAddressConfirmation(true);
    setIsEditingAddress(false);
    fetchUserProfile();
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [categoriesResponse, items] = await Promise.all([
          menuAPI.getCategories(),
          fetchAllItems(),
        ]);

        const filterCategories = [
          { id: "all", name: "All Dishes" },
          { id: "combos", name: "Combos" },
        ];

        setMenuCategories(filterCategories);
        setMenuItems(items);
        setAllItemsLoaded(true);
        setError("");
      } catch (err) {
        setError("Failed to load menu items");
        console.error("Error loading menu:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (showOrderHistory && user) {
      fetchOrderHistory();
    }
  }, [showOrderHistory, user]);

  useEffect(() => {
    if (!allItemsLoaded) return;

    const params = new URLSearchParams(window.location.search);
    const itemId = params.get("item");
    if (itemId && menuItems.length > 0) {
      const item = menuItems.find((i) => i.id === itemId);
      if (item) {
        addToCart(item, 1);
        params.delete("item");
        window.history.replaceState(
          {},
          "",
          `${window.location.pathname}${
            params.toString() ? "?" + params.toString() : ""
          }`
        );
      }
    }
  }, [menuItems, allItemsLoaded]);

  const cartTotal = cart.reduce(
    (total, item) => total + parseFloat(item.menuItem.price) * item.quantity,
    0
  );
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === "all" || (activeCategory === "combos" && item.isCombo);

    return matchesSearch && matchesCategory && item.available;
  });

  const groupedItems = filteredItems.reduce((acc, item) => {
    const categoryId = item.category || "other";
    const categoryName = item.isCombo ? "Combos" : item.category || "Other";

    if (!acc[categoryId]) {
      acc[categoryId] = {
        categoryName,
        items: [],
      };
    }
    acc[categoryId].items.push(item);
    return acc;
  }, {} as Record<string, { categoryName: string; items: MenuItem[] }>);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const canCancelOrder = (status: string) => {
    return status === "pending";
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "preparing":
        return "bg-purple-100 text-purple-800";
      case "ready":
        return "bg-indigo-100 text-indigo-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const toggleOrderExpand = (orderId: number) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const toggleDropdown = (orderId: number) => {
    setShowDropdown(showDropdown === orderId ? null : orderId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? "shadow-md" : ""
        }`}
      >
        <Header />
        {!showOrderHistory && (
          <div
            className={`bg-white transition-all duration-300 ${
              isScrolled ? "py-2" : "py-4"
            }`}
          >
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-between items-center">
                {!isScrolled && (
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                      Catering Services
                    </h1>
                    <p className="text-gray-600">
                      Premium catering for your special events
                    </p>
                  </div>
                )}
                <div className="flex items-center gap-4">
                  {!isScrolled && (
                    <span className="text-sm text-gray-600">
                      <span style={{ fontWeight: "bolder", color: "black" }}>
                        Welcome,
                      </span>
                      <span style={{ fontWeight: "bolder", color: "#501608" }}>
                        {" "}
                        {user?.name}
                      </span>
                    </span>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowOrderHistory(!showOrderHistory)}
                      className={`relative px-4 py-3 rounded-full font-medium flex items-center gap-2 transition-colors duration-300 ${
                        showOrderHistory
                          ? "bg-[#501608] text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      } ${isScrolled ? "py-2" : ""}`}
                    >
                      <History size={18} />
                      <span className="hidden sm:inline">My Orders</span>
                    </button>
                    <button
                      onClick={() => setShowCart(true)}
                      className="relative bg-[#501608] hover:bg-[#722010] text-white px-6 py-3 rounded-full font-semibold flex items-center justify-center gap-2 transition-colors duration-300"
                    >
                      <ShoppingCart size={20} />
                      {isScrolled ? (
                        <span>{cartItemCount}</span>
                      ) : (
                        <span className="hidden sm:inline">Selected Items</span>
                      )}
                      {cartItemCount > 0 && !isScrolled && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                          {cartItemCount}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {showOrderHistory ? (
          <div className="mb-12 bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Your Order History
                </h2>
                <p className="text-gray-600">Past catering orders</p>
              </div>
              <button
                onClick={() => setShowOrderHistory(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Close order history"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {loadingOrders ? (
              <div className="p-6 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#501608] border-t-transparent"></div>
                <p className="mt-2 text-gray-600">Loading your orders...</p>
              </div>
            ) : orderError ? (
              <div className="p-6 text-center text-red-500">{orderError}</div>
            ) : orders.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <History size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No past orders found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-6 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">
                          Order #{order.order_number || `ORD-${order.id}`}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                        <div className="relative">
                          <button
                            onClick={() => toggleDropdown(order.id)}
                            className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-gray-500"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </button>
                          {showDropdown === order.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                              {canCancelOrder(order.status) && (
                                <button
                                  onClick={() => handleCancelClick(order.id)}
                                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                  Cancel Order
                                </button>
                              )}
                              <button
                                onClick={() => toggleOrderExpand(order.id)}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                {expandedOrderId === order.id
                                  ? "Hide Items"
                                  : "View Items"}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        {order.order_type === "catering" ? (
                          <span className="flex items-center gap-1">
                            <Gift size={14} /> Catering Order
                          </span>
                        ) : (
                          <span>Total: ₹{order.total}</span>
                        )}
                      </div>
                      <button
                        onClick={() => toggleOrderExpand(order.id)}
                        className="text-sm text-[#501608] hover:underline flex items-center gap-1"
                      >
                        {expandedOrderId === order.id ? (
                          <>
                            <span>Hide Details</span>
                            <ChevronUp size={16} />
                          </>
                        ) : (
                          <>
                            <span>View Details</span>
                            <ChevronDown size={16} />
                          </>
                        )}
                      </button>
                    </div>

                    {expandedOrderId === order.id && (
                      <div className="mt-4 bg-gray-50 p-4 rounded-lg space-y-4">
                        {order.order_type === "catering" && (
                          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                              <Gift size={16} className="text-[#501608]" />
                              Event Details
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <span className="text-sm text-gray-500">
                                  Event Type:
                                </span>
                                <p className="text-gray-800 font-medium">
                                  {order.event_type || "N/A"}
                                </p>
                              </div>
                              <div>
                                <span className="text-sm text-gray-500">
                                  Event Date:
                                </span>
                                <p className="text-gray-800 font-medium">
                                  {order.event_date
                                    ? formatDate(order.event_date)
                                    : "N/A"}
                                </p>
                              </div>
                              <div>
                                <span className="text-sm text-gray-500">
                                  Number of Persons:
                                </span>
                                <p className="text-gray-800 font-medium">
                                  {order.event_number_of_persons || "N/A"}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                       
<div>
  <h4 className="font-medium text-gray-700 mb-3">
    Ordered Items:
  </h4>
  <div className="space-y-3">
    {order.items && order.items.length > 0 ? (
      <div className="flex flex-wrap gap-3"> {/* Changed to flex row layout */}
        {order.items.map((item) => (
          <div
            key={item.id}
            className="bg-white p-3 rounded-md shadow-sm" /* Removed flex justify-between */
          >
            <p className="font-medium text-gray-800">
              {item.quantity}x {item.name}
            </p>
            {item.special_instructions && (
              <p className="text-xs text-orange-600 mt-1">
                {item.special_instructions}
              </p>
            )}
          </div>
        ))}
      </div>
    ) : (
      <p className="text-sm text-gray-500">
        No item details available
      </p>
    )}
  </div>
</div>
                        <div className="border-t pt-3 mt-3">
                          <div className="flex justify-between text-sm">
                           
                          </div>
                         
                        </div>
                      </div>
                    )}

                    {showCancelForm === order.id && (
                      <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-700 mb-2">
                          Cancel Order
                        </h4>
                        <textarea
                          value={cancelReason}
                          onChange={(e) => setCancelReason(e.target.value)}
                          placeholder="Please provide a reason for cancellation..."
                          className="w-full p-2 border border-gray-300 rounded-md mb-2"
                          rows={3}
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={handleCancelFormClose}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-300"
                          >
                            Back
                          </button>
                          <button
                            onClick={() => cancelOrder(order.id)}
                            disabled={
                              !cancelReason.trim() ||
                              cancellingOrderId === order.id
                            }
                            className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors duration-300 disabled:opacity-50"
                          >
                            {cancellingOrderId === order.id
                              ? "Cancelling..."
                              : "Confirm Cancellation"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setShowOrderHistory(false)}
                className="w-full bg-[#501608] hover:bg-[#722010] text-white py-3 rounded-lg font-semibold transition-colors duration-300"
              >
                Back to Catering Menu
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-[#e88824] rounded-2xl p-8 md:p-12 text-white mb-12">
              <div className="max-w-3xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Make Your Event Unforgettable
                </h2>
                <p className="text-xl mb-6">
                  From intimate gatherings to grand celebrations, our catering
                  services bring exceptional flavors and professional service to
                  your special occasions.
                </p>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3">
                    <Users className="text-orange-200" size={24} />
                    <span>Any Group Size</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="text-orange-200" size={24} />
                    <span>Flexible Scheduling</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Star className="text-orange-200" size={24} />
                    <span>Premium Quality</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveCategory("all")}
                  className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                    activeCategory === "all"
                      ? "bg-[#501608] hover:bg-[#722010] text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-orange-100 hover:text-orange-600"
                  }`}
                >
                  All Dishes
                </button>
                <button
                  onClick={() => setActiveCategory("combos")}
                  className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                    activeCategory === "combos"
                      ? "bg-[#501608] hover:bg-[#722010] text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-orange-100 hover:text-orange-600"
                  }`}
                >
                  Combos
                </button>
              </div>

              <div className="flex-1 w-full max-w-2xl">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search dishes..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#501608] focus:border-[#501608]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-20 text-xl text-gray-500">
                Loading menu...
              </div>
            ) : error ? (
              <div className="text-center py-20 text-xl text-red-500">
                {error}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-xl">
                  No items found matching your search
                </p>
              </div>
            ) : (
              <div className="space-y-12 mb-12">
                {Object.entries(groupedItems).map(
                  ([categoryId, { categoryName, items }]) => (
                    <div
                      key={categoryId}
                      className="bg-white rounded-xl shadow-md overflow-hidden"
                    >
                      <div className="p-6 border-b border-gray-200">
                        <h2
                          className="text-xl font-bold "
                          style={{ color: "#501608" }}
                        >
                          {categoryName}
                        </h2>
                      </div>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                        {items.map((item) => {
                          const cartItem = cart.find(
                            (cartItem) => cartItem.menuItem.id === item.id
                          );
                          const quantity = cartItem ? cartItem.quantity : 0;
                          const isComboAdded = item.isCombo && !!cartItem;

                          return (
                            <div
                              key={item.id}
                              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
                            >
                              <div className="p-6 flex gap-4 flex-grow">
                                <div className="flex-shrink-0">
                                  <img
                                    src={item.image || "/placeholder.png"}
                                    alt={item.name}
                                    className="w-24 h-24 object-cover rounded-full mx-auto"
                                  />
                                </div>
                                <div className="flex-grow">
                                  <div className="flex justify-between items-start mb-3">
                                    <h4 className="text-lg font-bold text-gray-800">
                                      {item.name}
                                    </h4>
                                    {item.isCombo && (
                                      <button
                                        onClick={() =>
                                          setViewingComboId(item.id)
                                        }
                                        className="text-[#501608] hover:text-[#722010] p-1"
                                        title="View combo items"
                                      >
                                        <Eye size={18} />
                                      </button>
                                    )}
                                  </div>
                                  <div className="text-gray-600 mb-4 text-sm relative">
                                    <p
                                      className={`${
                                        expandedDescriptions[item.id]
                                          ? ""
                                          : "line-clamp-2"
                                      } transition-all duration-200`}
                                    >
                                      {item.description}
                                    </p>
                                    {item.description &&
                                      item.description.length > 100 && (
                                        <button
                                          onClick={() =>
                                            toggleDescription(item.id)
                                          }
                                          className="text-[#501608] hover:underline text-xs mt-1"
                                        >
                                          {expandedDescriptions[item.id]
                                            ? "Show less"
                                            : "Show more"}
                                        </button>
                                      )}
                                  </div>
                                  {item.isCombo && (
                                    <div className="flex items-center justify-between">
                                      <span className="text-lg font-bold text-[#501608]">
                                        ₹ {item.price}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="p-4 border-t mt-auto flex justify-end">
                                {item.isCombo ? (
                                  <button
                                    onClick={() =>
                                      !isComboAdded && handleAddToCart(item)
                                    }
                                    disabled={isComboAdded}
                                    className={`py-2 px-4 rounded-full font-semibold transition-colors duration-300 ${
                                      isComboAdded
                                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                        : "bg-[#501608] hover:bg-[#722010] text-white"
                                    }`}
                                  >
                                    {isComboAdded ? "Added" : "Add"}
                                  </button>
                                ) : quantity > 0 ? (
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() =>
                                        handleDecrement(cartItem!.id)
                                      }
                                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full p-2 transition-colors duration-300"
                                    >
                                      <Minus size={16} />
                                    </button>
                                    <span className="w-8 text-center">
                                      {quantity}
                                    </span>
                                    <button
                                      onClick={() =>
                                        handleIncrement(cartItem!.id)
                                      }
                                      className="bg-[#501608] hover:bg-[#722010] text-white rounded-full p-2 transition-colors duration-300"
                                    >
                                      <Plus size={16} />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => handleAddToCart(item)}
                                    className="bg-[#501608] hover:bg-[#722010] text-white py-2 px-4 rounded-full font-semibold transition-colors duration-300"
                                  >
                                    Add
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </>
        )}
      </div>

      {viewingComboId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Combo Items
                </h3>
                <button
                  onClick={() => setViewingComboId(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-800 mb-2">
                  {menuItems.find((item) => item.id === viewingComboId)?.name}
                </h4>
                <p className="text-[#501608] font-bold text-lg">
                  ₹{" "}
                  {menuItems.find((item) => item.id === viewingComboId)?.price}
                </p>
              </div>

              <div className="space-y-4">
                {menuItems
                  .find((item) => item.id === viewingComboId)
                  ?.comboItems?.map((comboItem, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">
                          {comboItem.name}
                        </h4>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setViewingComboId(null)}
                  className="px-4 py-2 bg-[#501608] text-white rounded-md hover:bg-[#722010]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  Catering Cart
                </h3>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <ShoppingCart
                    size={48}
                    className="mx-auto mb-4 text-gray-300"
                  />
                  <p>Your catering cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h4 className="font-medium text-gray-800 mb-4">
                      Event Details
                    </h4>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Number of Persons
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={numberOfPersons}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === "") {
                              setNumberOfPersons("");
                            } else {
                              setNumberOfPersons(Math.max(1, parseInt(val)));
                            }
                          }}
                          onBlur={() => {
                            if (numberOfPersons === "" || numberOfPersons < 1) {
                              setNumberOfPersons(1);
                            }
                          }}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="Enter number of persons"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Event Date
                        </label>
                        <input
                          type="date"
                          value={eventDate}
                          onChange={(e) => setEventDate(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Event Type
                        </label>
                        <input
                          type="text"
                          value={eventType}
                          onChange={(e) => setEventType(e.target.value)}
                          placeholder="Enter event type"
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200">
                            <img
                              src={item.menuItem.image || "/placeholder.png"}
                              alt={item.menuItem.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-gray-800">
                              {item.menuItem.name}
                              {item.menuItem.isCombo && (
                                <span className="ml-2 text-[#501608] font-bold">
                                  ₹ {item.menuItem.price}
                                </span>
                              )}
                            </h4>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <X size={16} />
                            </button>
                          </div>
                          {item.menuItem.isCombo && (
                            <div className="text-xs text-gray-500 mt-1">
                              <p className="font-medium">Includes:</p>
                              <ul className="list-disc list-inside">
                                {item.menuItem.comboItems?.map(
                                  (comboItem, idx) => (
                                    <li key={idx}>
                                      {comboItem.quantity}x {comboItem.name} (
                                      {comboItem.spice_level})
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}
                          {item.specialInstructions && (
                            <p className="text-xs text-orange-600 mt-1">
                              <strong>Details:</strong>{" "}
                              {item.specialInstructions}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDecrement(item.id)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full p-1 transition-colors duration-300"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleIncrement(item.id)}
                            className="bg-[#501608] hover:bg-[#722010] text-white rounded-full p-1 transition-colors duration-300"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-gray-200 p-6 bg-white">
                <button
                  onClick={handleCheckoutClick}
                  className="w-full bg-[#501608] hover:bg-[#722010] text-white py-3 rounded-lg font-semibold transition-colors duration-300"
                >
                  Place Catering Order
                </button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Our team will contact you within 2 hours to confirm details
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {showAddressConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {isEditingAddress
                    ? "Edit Delivery Address"
                    : "Confirm Delivery Address"}
                </h3>
                <button
                  onClick={() => {
                    setShowAddressConfirmation(false);
                    setIsEditingAddress(false);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              {loadingProfile ? (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#501608] border-t-transparent"></div>
                  <p className="mt-2 text-gray-600">Loading address...</p>
                </div>
              ) : isEditingAddress ? (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={selectedAddress.street}
                      onChange={(e) =>
                        setSelectedAddress({
                          ...selectedAddress,
                          street: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Enter street address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={selectedAddress.city}
                      onChange={(e) =>
                        setSelectedAddress({
                          ...selectedAddress,
                          city: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Enter city"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        value={selectedAddress.state}
                        onChange={(e) =>
                          setSelectedAddress({
                            ...selectedAddress,
                            state: e.target.value,
                          })
                        }
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Enter state"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Zip Code
                      </label>
                      <input
                        type="text"
                        value={selectedAddress.zipcode}
                        onChange={(e) =>
                          setSelectedAddress({
                            ...selectedAddress,
                            zipcode: e.target.value,
                          })
                        }
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Enter zip code"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      value={selectedAddress.country}
                      onChange={(e) =>
                        setSelectedAddress({
                          ...selectedAddress,
                          country: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Enter country"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="font-medium text-gray-700">Street:</p>
                    <p>{selectedAddress.street || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">City/State/Zip:</p>
                    <p>
                      {selectedAddress.city || "N/A"},{" "}
                      {selectedAddress.state || "N/A"}{" "}
                      {selectedAddress.zipcode || ""}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Country:</p>
                    <p>{selectedAddress.country || "Not provided"}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3">
                {isEditingAddress ? (
                  <>
                    <button
                      onClick={() => setIsEditingAddress(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                      disabled={isUpdatingAddress}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={updateUserAddress}
                      className="px-4 py-2 bg-[#501608] text-white rounded-md hover:bg-[#722010]"
                      disabled={isUpdatingAddress}
                    >
                      {isUpdatingAddress ? "Saving..." : "Save Address"}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditingAddress(true)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                      Edit Address
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      className="px-4 py-2 bg-[#501608] text-white rounded-md hover:bg-[#722010]"
                    >
                      Confirm & Place Order
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Order Placed Successfully!
              </h3>
              <p className="text-gray-600">
                Your catering order has been received. Our team will contact you
                shortly to confirm the details.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setShowSuccessPopup(false);
                  navigate("/");
                }}
                className="w-full bg-[#501608] hover:bg-[#722010] text-white py-3 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <Home size={18} />
                Go to Home Page
              </button>
              <button
                onClick={() => {
                  setShowSuccessPopup(false);
                  setShowOrderHistory(true);
                }}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold transition-colors duration-300"
              >
                View Order Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CateringOrdering;

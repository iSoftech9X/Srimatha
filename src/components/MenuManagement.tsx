
import React, { useEffect, useState } from "react";
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Search,
  Loader2,
  X,
  Star,
  Flame,
  Leaf,
  Clock,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Link,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { menuAPI } from "../services/api";

type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  available: boolean;
  isVegetarian: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  image?: string | null;
  preparationTime?: number;
  spiceLevel?: string;
  isCombo: boolean;
  comboItems: {
    id: number;
    quantity: number;
    name: string;
    spiceLevel?: string;
  }[];
};

type Category = {
  id: string;
  name: string;
};

type ComboItemForm = {
  id: number;
  quantity: number;
  name: string;
  spiceLevel?: string;
};

const defaultFormData = {
  name: "",
  description: "",
  price: "",
  category: "",
  isVegetarian: true,
  isVegan: false,
  isGlutenFree: false,
  available: true,
  spiceLevel: "",
  isCombo: false,
  comboItems: [] as ComboItemForm[],
  newComboItemId: undefined as number | undefined,
  image: "" as string | null,
  preparationTime: undefined as number | undefined,
};

const MenuManagement: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<typeof defaultFormData>(defaultFormData);
  const [formLoading, setFormLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [viewComboModal, setViewComboModal] = useState(false);
  const [currentComboItems, setCurrentComboItems] = useState<MenuItem | null>(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<number, boolean>>({});

  const toggleDescription = (id: number) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const res = await menuAPI.getItems();
      if (res.data?.data?.items) {
        setMenuItems(res.data.data.items.map((item: any) => ({
          ...item,
          comboItems: item.comboItems || [],
          isCombo: item.isCombo || false
        })));
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch menu");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await menuAPI.getCategories();
      if (res.data?.data) {
        setCategories(res.data.data);
      } else {
        throw new Error("Invalid categories format");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchMenu();
    fetchCategories();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure to delete this item?")) return;
    try {
      await menuAPI.deleteItem(id);
      setMenuItems(menuItems.filter((item) => item.id !== id));
      toast.success("Item deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete item");
    }
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      const updatedItem = { ...item, available: !item.available };
      await menuAPI.updateItem(item.id, updatedItem);
      setMenuItems((prev) =>
        prev.map((i) => (i.id === item.id ? updatedItem : i))
      );
      toast.success("Availability updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update availability");
    }
  };

  const handleEdit = (item: MenuItem) => {
    setIsEditMode(true);
    setEditId(item.id);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      isVegetarian: item.isVegetarian,
      isVegan: item.isVegan || false,
      isGlutenFree: item.isGlutenFree || false,
      available: item.available,
      spiceLevel: item.spiceLevel || "",
      isCombo: item.isCombo || false,
      comboItems: item.comboItems?.map(ci => {
        const menuItem = menuItems.find(mi => mi.id === ci.id);
        return {
          id: ci.id,
          quantity: ci.quantity,
          name: menuItem?.name || ci.name || "Unknown Item",
          spiceLevel: ci.spiceLevel
        };
      }) || [],
      newComboItemId: undefined,
      image: item.image || null,
      preparationTime: item.preparationTime
    });
    setIsModalOpen(true);
  };

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    const val = type === "checkbox" ? checked : value;
    setFormData({ ...formData, [name]: val });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Please enter item name");
      return false;
    }
    if (!formData.price.trim()) {
      toast.error("Please enter price");
      return false;
    }
    if (isNaN(parseFloat(formData.price))) {
      toast.error("Price must be a number");
      return false;
    }
    if (!formData.category) {
      toast.error("Please select a category");
      return false;
    }
    if (formData.isCombo && formData.comboItems.length === 0) {
      toast.error("Please add at least one item to the combo");
      return false;
    }
    return true;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setFormLoading(true);

    try {
      const payload: any = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        category: formData.category,
        isVegetarian: formData.isVegetarian,
        isVegan: formData.isVegan,
        isGlutenFree: formData.isGlutenFree,
        available: formData.available,
        spiceLevel: formData.spiceLevel,
        isCombo: formData.isCombo,
        image: formData.image || null,
      };

      if (formData.preparationTime) {
        payload.preparationTime = formData.preparationTime;
      }

      if (formData.isCombo) {
        payload.comboItems = formData.comboItems.map(item => ({
          menu_item_id: item.id,
          quantity: item.quantity,
          name: item.name || "Unnamed Item",
          spiceLevel: item.spiceLevel
        }));
      }

      if (isEditMode && editId !== null) {
        await menuAPI.updateItem(editId, payload);
        toast.success("Menu item updated");
      } else {
        await menuAPI.createItem(payload);
        toast.success("Menu item added");
      }

      setIsModalOpen(false);
      setFormData(defaultFormData);
      setIsEditMode(false);
      setEditId(null);
      fetchMenu();
    } catch (err: any) {
      console.error("Form submit error:", err);
      toast.error(err.response?.data?.message || "Failed to save item");
    } finally {
      setFormLoading(false);
    }
  };

  const handleView = (item: MenuItem) => {
    if (!item.comboItems || item.comboItems.length === 0) {
      toast.info("No combo items found.");
      return;
    }
    setCurrentComboItems(item);
    setViewComboModal(true);
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const toggleCategory = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId);
    }
  };

  const displayedCategories = showAllCategories ? categories : categories.slice(0, 5);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="p-6 rounded-xl mb-4 text-white" style={{ backgroundColor: "#501608" }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Menu Dashboard</h1>
            <p className="opacity-100">Manage your restaurant's offerings</p>
          </div>
          <button
            onClick={() => {
              setIsModalOpen(true);
              setFormData(defaultFormData);
              setIsEditMode(false);
              setEditId(null);
            }}
            className="bg-white text-blue-600 px-4 py-2 rounded-full flex items-center gap-2 shadow-lg hover:bg-blue-50 transition-all"
          >
            <Plus size={18} /> Add Item
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="mb-6 bg-white p-4 rounded-xl shadow-sm">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search menu items..."
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          className={`px-4 py-2 rounded-full shadow-sm flex items-center gap-1 ${
            selectedCategory === null ? "bg-[#501608] text-white" : "bg-white hover:bg-[#501609]"
          }`}
          onClick={() => setSelectedCategory(null)}
        >
          All <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">{menuItems.length}</span>
        </button>

        {displayedCategories.map((cat) => (
          <button
            key={cat.id}
            className={`group px-4 py-2 rounded-full shadow-sm flex items-center gap-1 ${
              selectedCategory === cat.id ? "bg-[#501608] text-white" : "bg-white hover:bg-[#501609] hover:text-white"
            }`}
            onClick={() => toggleCategory(cat.id)}
          >
            {cat.name}
            <span className={`text-xs px-2 py-1 rounded-full ${
              selectedCategory === cat.id
                ? "bg-white bg-opacity-20 text-white"
                : "bg-gray-100 group-hover:bg-white group-hover:text-black"
            }`}>
              {menuItems.filter((i) => i.category === cat.id).length}
            </span>
          </button>
        ))}

        {categories.length > 5 && (
          <button
            className="px-4 py-2 bg-white rounded-full shadow-sm flex items-center gap-1 hover:bg-gray-100"
            onClick={() => setShowAllCategories(!showAllCategories)}
          >
            {showAllCategories ? "Show Less" : "More"}
            {showAllCategories ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-blue-500" size={40} />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
          <div className="mx-auto h-40 mb-4 flex items-center justify-center text-gray-300">
            <Search size={60} />
          </div>
          <h3 className="text-lg font-medium text-gray-700">No menu items found</h3>
          <p className="text-gray-500 mt-1">Try adjusting your search or add a new item</p>
          <button
            onClick={() => {
              setIsModalOpen(true);
              setFormData(defaultFormData);
              setIsEditMode(false);
              setEditId(null);
            }}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2"
          >
            <Plus size={16} /> Add First Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md border relative">
              {item.isCombo && (
                <button
                  onClick={() => handleView(item)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-blue-600 p-1 bg-white rounded-full shadow"
                  title="View Combo Items"
                >
                  <Eye size={18} />
                </button>
              )}

              {/* Item Image */}
              <div className="p-4 flex items-center gap-4">
                {item.image ? (
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = "https://via.placeholder.com/300x200?text=No+Image";
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border-2 border-gray-200">
                    <ImageIcon size={24} />
                  </div>
                )}

                <div className="flex-1">
                
                  <div className="flex items-center gap-2 mt-1">
                    {item.isVegetarian && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <Leaf size={12} /> Veg
                      </span>
                    )}
                    {item.spiceLevel && (
                      <span className="flex items-center gap-1 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                        <Flame size={12} /> {item.spiceLevel}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-5 pb-5">
                <div className="relative">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p 
                    className={`text-gray-600 text-sm ${expandedDescriptions[item.id] ? '' : 'line-clamp-2'}`}
                  >
                    {item.description || "No description available"}
                  </p>
                  {item.description && item.description.length > 60 && (
                    <button
                      onClick={() => toggleDescription(item.id)}
                      className="text-blue-600 text-sm mt-1 flex items-center"
                    >
                      {expandedDescriptions[item.id] ? 'Show less' : 'Show more'}
                      <ChevronRight 
                        size={16} 
                        className={`transition-transform ${expandedDescriptions[item.id] ? 'rotate-90' : ''}`}
                      />
                    </button>
                  )}
                </div>
  <div className="flex items-center justify-between">
                  
                    <span className="text-xl font-bold text-gray-800">₹{item.price}</span>
                  </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                    {categories.find((c) => c.id === item.category)?.name || item.category}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Combo Items View Modal */}
      {/* {viewComboModal && currentComboItems && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
            <div className="p-5 text-white" style={{ backgroundColor: "#501608" }}>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Combo Items: {currentComboItems.name}</h2>
                <button
                  onClick={() => {
                    setViewComboModal(false);
                    setCurrentComboItems(null);
                  }}
                  className="text-white hover:text-gray-200"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-5">
              {currentComboItems.comboItems && currentComboItems.comboItems.length > 0 ? (
                <div className="space-y-3">
                  {currentComboItems.comboItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-700">{index + 1}.</span>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          {item.spiceLevel && (
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Flame size={12} /> Spice: {item.spiceLevel}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No combo items found</div>
              )}
            </div>

            <div className="p-5 border-t">
              <button
                onClick={() => {
                  setViewComboModal(false);
                  setCurrentComboItems(null);
                }}
                className="w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )} */}
{/* Combo Items View Modal */}
{viewComboModal && currentComboItems && (
  <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="p-5 text-white" style={{ backgroundColor: "#501608" }}>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Combo Items: {currentComboItems.name}</h2>
          <button
            onClick={() => {
              setViewComboModal(false);
              setCurrentComboItems(null);
            }}
            className="text-white hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="overflow-y-auto flex-1 p-5">
        {currentComboItems.comboItems && currentComboItems.comboItems.length > 0 ? (
          <div className="space-y-3">
            {currentComboItems.comboItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-700">{index + 1}.</span>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    {item.spiceLevel && (
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Flame size={12} /> Spice: {item.spiceLevel}
                      </p>
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">No combo items found</div>
        )}
      </div>

      {/* Fixed footer */}
      <div className="p-5 border-t">
        <button
          onClick={() => {
            setViewComboModal(false);
            setCurrentComboItems(null);
          }}
          className="w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
      {/* Create/Edit Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="p-5 text-white" style={{ backgroundColor: "#501608" }}>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  {isEditMode ? "Edit Menu Item" : "Create New Item"}
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setFormData(defaultFormData);
                    setIsEditMode(false);
                    setEditId(null);
                  }}
                  className="text-white hover:text-gray-200"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1">
              <form id="menu-item-form" onSubmit={handleFormSubmit} className="p-5 space-y-4">
                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative w-16 h-16 rounded-full bg-gray-100 overflow-hidden border-2 border-gray-200">
                      {formData.image ? (
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = "https://via.placeholder.com/300x200?text=No+Image";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <ImageIcon size={24} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          name="image"
                          placeholder="https://example.com/image.jpg"
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={formData.image || ""}
                          onChange={handleFormChange}
                        />
                        <Link size={20} className="text-gray-400" />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Paste the image URL here</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isCombo"
                    name="isCombo"
                    checked={formData.isCombo}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setFormData({
                        ...formData,
                        isCombo: isChecked,
                        category: isChecked
                          ? categories.find((cat) => cat.name === "Combos")?.id || ""
                          : formData.category,
                        comboItems: isChecked ? formData.comboItems : [],
                      });
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isCombo" className="ml-2 block text-sm font-medium text-gray-700">
                    This is a Combo {formData.isCombo && <span className="text-red-500">*</span>}
                  </label>
                </div>

                {/* Item Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder={formData.isCombo ? "e.g., Family Meal Combo" : "e.g., Margherita Pizza"}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.name}
                    onChange={handleFormChange}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    placeholder="Describe the item..."
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.description}
                    onChange={handleFormChange}
                  />
                </div>

                {/* Price and Category */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="price"
                      placeholder="0.00"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.price}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.category}
                      onChange={handleFormChange}
                      disabled={formData.isCombo}
                    >
                      <option value="">Select</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Dietary Options */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <div className="flex border rounded-lg overflow-hidden">
                      <button
                        type="button"
                        className={`flex-1 py-2 text-center ${
                          formData.isVegetarian ? "bg-green-500 text-white" : "bg-gray-100"
                        }`}
                        onClick={() => setFormData({ ...formData, isVegetarian: true })}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Leaf size={16} /> Vegetarian
                        </div>
                      </button>
                      <button
                        type="button"
                        className={`flex-1 py-2 text-center ${
                          !formData.isVegetarian ? "bg-red-500 text-white" : "bg-gray-100"
                        }`}
                        onClick={() => setFormData({ ...formData, isVegetarian: false })}
                      >
                        Non-Veg
                      </button>
                    </div>
                  </div>
                
                </div>

                {/* Spice Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Spice Level
                  </label>
                  <select
                    name="spiceLevel"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.spiceLevel}
                    onChange={handleFormChange}
                  >
                    <option value="">Select Level</option>
                    <optgroup label="🌶️ Spice Levels">
                      <option value="Mild">Mild</option>
                      <option value="Medium">Medium</option>
                      <option value="Hot">Hot</option>
                    </optgroup>
                    <optgroup label="🍬 Sweetness Levels">
                      <option value="Light">Light</option>
                      <option value="Moderate">Moderate</option>
                    </optgroup>
                  </select>
                </div>

                {/* Combo Items Section */}
                {formData.isCombo && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Combo Items <span className="text-red-500">*</span>
                      </label>
                      {formData.comboItems.length === 0 && (
                        <p className="text-sm text-red-500 mb-2">Please add at least one item to the combo</p>
                      )}
                      <div className="space-y-2 max-h-[200px] overflow-y-auto">
                        {formData.comboItems.map((item, index) => {
                          const menuItem = menuItems.find(mi => mi.id === item.id);
                          
                          return (
                            <div key={index} className="flex items-center gap-2">
                              <div className="flex-1 px-3 py-2 bg-gray-50 rounded-lg">
                                {menuItem?.name || item.name || "Unknown Item"}
                              </div>  
                              <button
                                type="button"
                                onClick={() => {
                                  const newComboItems = [...formData.comboItems];
                                  newComboItems.splice(index, 1);
                                  setFormData({ ...formData, comboItems: newComboItems });
                                }}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          );
                        })}

                        <div className="border-t pt-3 mt-3">
                          <div className="flex items-center gap-2">
                            <select
                              value={formData.newComboItemId || ""}
                              onChange={(e) => {
                                const selectedId = parseInt(e.target.value);
                                setFormData({
                                  ...formData,
                                  newComboItemId: selectedId,
                                });
                              }}
                              className="flex-1 px-3 py-2 border rounded-lg"
                            >
                              <option value="">Add New Item</option>
                              {menuItems
                                .filter(i => !i.isCombo)
                                .map(menuItem => (
                                  <option key={menuItem.id} value={menuItem.id}>
                                    {menuItem.name}
                                  </option>
                                ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => {
                                if (formData.newComboItemId) {
                                  const selectedItem = menuItems.find(i => i.id === formData.newComboItemId);
                                  if (selectedItem) {
                                    setFormData({
                                      ...formData,
                                      comboItems: [
                                        ...formData.comboItems,
                                        {
                                          id: selectedItem.id,
                                          quantity: 1,
                                          name: selectedItem.name,
                                          spiceLevel: selectedItem.spiceLevel
                                        }
                                      ],
                                      newComboItemId: undefined
                                    });
                                  }
                                }
                              }}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Plus size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Fixed footer */}
            <div className="p-5 border-t">
              <button
                type="submit"
                form="menu-item-form"
                disabled={formLoading}
                className="w-full text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity" 
                style={{ backgroundColor: "#501608" }}
              >
                {formLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    {isEditMode ? "Updating..." : "Creating..."}
                  </>
                ) : isEditMode ? (
                  "Update Item"
                ) : (
                  "Add Item"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;
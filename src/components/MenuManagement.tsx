

import React, { useEffect, useState } from "react";
import {
  Plus,
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
  image?: string;
  preparationTime?: number;
  spiceLevel?: string;
};

type Category = {
  id: string;
  name: string;
};

const defaultFormData = {
  name: "",
  description: "",
  price: "",
  category: "",
  isVegetarian: true,
  available: true,
  spiceLevel: "",
};

const MenuManagement: React.FC = () => {
  // State declarations
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<any>(defaultFormData);
  const [formLoading, setFormLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const res = await menuAPI.getItems();
      const items = res.data?.data?.items;
      if (Array.isArray(items)) {
        setMenuItems(items);
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
      const cats = res.data?.data;
      if (Array.isArray(cats)) {
        setCategories(cats);
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
      available: item.available,
      spiceLevel: item.spiceLevel || "",
    });
    setIsModalOpen(true);
  };

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData({ ...formData, [name]: val });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (isEditMode && editId !== null) {
        await menuAPI.updateItem(editId, formData);
        toast.success("Menu item updated");
      } else {
        await menuAPI.createItem(formData);
        toast.success("Menu item added");
      }
      setIsModalOpen(false);
      setFormData(defaultFormData);
      setIsEditMode(false);
      setEditId(null);
      fetchMenu();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save item");
    } finally {
      setFormLoading(false);
    }
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory = selectedCategory
      ? item.category === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  const toggleCategory = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId);
    }
  };

  const displayedCategories = showAllCategories
    ? categories
    : categories.slice(0, 5);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header with gradient */}
      <div
        className="p-6 rounded-xl mb-4 text-white"
        style={{ backgroundColor: "#501608" }}
      >
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

      {/* Search bar below header */}
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

      {/* Category filter chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          className={`px-4 py-2 rounded-full shadow-sm flex items-center gap-1 ${
            selectedCategory === null
              ? "bg-[#501608] text-white"
              : "bg-white hover:bg-[#501609]"
          }`}
          onClick={() => setSelectedCategory(null)}
        >
          All{" "}
          <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
            {menuItems.length}
          </span>
        </button>

        {displayedCategories.map((cat) => (
          <button
            key={cat.id}
            className={`group px-4 py-2 rounded-full shadow-sm flex items-center gap-1 ${
              selectedCategory === cat.id
                ? "bg-[#501608] text-white"
                : "bg-white hover:bg-[#501609] hover:text-white"
            }`}
            onClick={() => toggleCategory(cat.id)}
          >
            {cat.name}
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                selectedCategory === cat.id
                  ? "bg-white bg-opacity-20 text-white"
                  : "bg-gray-100 group-hover:bg-white group-hover:text-black"
              }`}
            >
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
            {showAllCategories ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
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
          <h3 className="text-lg font-medium text-gray-700">
            No menu items found
          </h3>
          <p className="text-gray-500 mt-1">
            Try adjusting your search or add a new item
          </p>
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
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md border"
            >
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      {item.isVegetarian && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <Leaf size={12} /> Veg
                        </span>
                      )}
                    </div>
                    <span className="inline-block mt-1 bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                      {categories.find((c) => c.id === item.category)?.name ||
                        item.category}
                    </span>
                    <p className="mt-2 text-gray-600 text-sm">
                      {item.description}
                    </p>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xl font-bold text-gray-800">
                        ₹{item.price}
                      </span>
                      {item.spiceLevel && (
                        <span className="flex items-center gap-1 text-sm text-orange-600">
                          <Flame size={14} /> {item.spiceLevel}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-5 py-3 flex justify-between items-center border-t">
                <button
                  // onClick={() => handleToggleAvailability(item)}
                  // className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                  //   item.available
                  //     ? "bg-green-100 text-green-800"
                  //     : "bg-gray-200 text-gray-700"
                  // }`}
                >
                  {/* {item.available ? (
                    <>
                      <ToggleRight size={16} /> Available
                    </>
                  ) : (
                    <>
                      <ToggleLeft size={16} /> Unavailable
                    </>
                  )} */}
                </button>
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
          ))}
        </div>
      )}

      {/* Modern Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
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

            <form onSubmit={handleFormSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g., Margherita Pizza"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
              </div>

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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="text"
                    name="price"
                    placeholder="0.00"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.price}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.category}
                    onChange={handleFormChange}
                    required
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <div className="flex border rounded-lg overflow-hidden">
                    <button
                      type="button"
                      className={`flex-1 py-2 text-center ${
                        formData.isVegetarian
                          ? "bg-green-500 text-white"
                          : "bg-gray-100"
                      }`}
                      onClick={() =>
                        setFormData({ ...formData, isVegetarian: true })
                      }
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Leaf size={16} /> Vegetarian
                      </div>
                    </button>
                    <button
                      type="button"
                      className={`flex-1 py-2 text-center ${
                        !formData.isVegetarian
                          ? "bg-red-500 text-white"
                          : "bg-gray-100"
                      }`}
                      onClick={() =>
                        setFormData({ ...formData, isVegetarian: false })
                      }
                    >
                      Non-Veg
                    </button>
                  </div>
                </div>
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
                      <option value="Extreme">Extreme</option>
                    </optgroup>
                    <optgroup label="🍬 Sweetness Levels">
                      <option value="Light">Light</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Very Sweet">Very Sweet</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full  text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity" style={{ backgroundColor: "#501608" }}
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
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;

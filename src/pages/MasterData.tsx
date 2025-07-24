import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MdAdd, MdDelete, MdEdit, MdSave, MdCancel } from "react-icons/md";
import { useToast } from "@/hooks/use-toast";

// Data interfaces
interface Seller {
  id: string;
  name: string;
  address: string;
  mobile: string;
}

interface Warehouse {
  id: string;
  name: string;
  address: string;
  pincodes: string[];
}

interface Product {
  name: string;
  quantity: number;
  costPrice: number;
  taxRate: number;
}

interface Stock {
  id: string;
  sellerId: string;
  warehouseId: string;
  products: Product[];
}

interface MasterDataState {
  categories: string[];
  subcategories: Record<string, string[]>;
  sellers: Seller[];
  warehouses: Warehouse[];
  stocks: Stock[];
}

// Mock data for master data
const initialData: MasterDataState = {
  categories: ["Electronics", "Clothing", "Home & Garden", "Sports", "Books"],
  subcategories: {
    "Electronics": ["Smartphones", "Laptops", "Accessories"],
    "Clothing": ["Men's Wear", "Women's Wear", "Kids Wear"],
    "Home & Garden": ["Furniture", "Decor", "Tools"],
    "Sports": ["Fitness", "Outdoor", "Team Sports"],
    "Books": ["Fiction", "Non-Fiction", "Educational"]
  },
  sellers: [],
  warehouses: [],
  stocks: []
};

export default function MasterData() {
  const location = useLocation();
  const { toast } = useToast();
  
  // Determine active tab based on route
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/seller')) return 'seller';
    if (path.includes('/warehouse')) return 'warehouse';
    if (path.includes('/inventory')) return 'inventory';
    if (path.includes('/stock')) return 'stock';
    if (path.includes('/categories')) return 'categories';
    return 'subcategories';
  };

  const [data, setData] = useState<MasterDataState>(initialData);
  const [newItem, setNewItem] = useState("");
  const [editingItem, setEditingItem] = useState<{ type: string; index: number; value: string } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [activeTab, setActiveTab] = useState(getActiveTab());
  
  // Seller form state
  const [sellerForm, setSellerForm] = useState({ name: "", address: "", mobile: "" });
  
  // Warehouse form state
  const [warehouseForm, setWarehouseForm] = useState({ name: "", address: "", pincodes: "" });
  
  // Stock form state
  const [stockForm, setStockForm] = useState({
    sellerId: "",
    warehouseId: "",
    productName: "",
    quantity: "",
    costPrice: "",
    taxRate: ""
  });

  // Update active tab when route changes
  useEffect(() => {
    setActiveTab(getActiveTab());
  }, [location.pathname]);

  const addItem = (type: keyof MasterDataState) => {
    if (!newItem.trim()) {
      toast({
        title: "Error",
        description: "Please enter a value",
        variant: "destructive"
      });
      return;
    }

    if (type === "subcategories") {
      if (!selectedCategory) {
        toast({
          title: "Error",
          description: "Please select a category first",
          variant: "destructive"
        });
        return;
      }

      setData(prev => ({
        ...prev,
        subcategories: {
          ...prev.subcategories,
          [selectedCategory]: [...(prev.subcategories[selectedCategory] || []), newItem.trim()]
        }
      }));
    } else {
      setData(prev => ({
        ...prev,
        [type]: [...prev[type], newItem.trim()]
      }));
    }

    setNewItem("");
    toast({
      title: "Success",
      description: `${type} added successfully`
    });
  };

  const addSeller = () => {
    if (!sellerForm.name || !sellerForm.address || !sellerForm.mobile) {
      toast({
        title: "Error",
        description: "Please fill all seller fields",
        variant: "destructive"
      });
      return;
    }

    const newSeller: Seller = {
      id: Date.now().toString(),
      ...sellerForm
    };

    setData(prev => ({
      ...prev,
      sellers: [...prev.sellers, newSeller]
    }));

    setSellerForm({ name: "", address: "", mobile: "" });
    toast({
      title: "Success",
      description: "Seller added successfully"
    });
  };

  const addWarehouse = () => {
    if (!warehouseForm.name || !warehouseForm.address || !warehouseForm.pincodes) {
      toast({
        title: "Error",
        description: "Please fill all warehouse fields",
        variant: "destructive"
      });
      return;
    }

    const newWarehouse: Warehouse = {
      id: Date.now().toString(),
      name: warehouseForm.name,
      address: warehouseForm.address,
      pincodes: warehouseForm.pincodes.split(",").map(p => p.trim())
    };

    setData(prev => ({
      ...prev,
      warehouses: [...prev.warehouses, newWarehouse]
    }));

    setWarehouseForm({ name: "", address: "", pincodes: "" });
    toast({
      title: "Success",
      description: "Warehouse added successfully"
    });
  };

  const addStock = () => {
    if (!stockForm.sellerId || !stockForm.warehouseId || !stockForm.productName || 
        !stockForm.quantity || !stockForm.costPrice || !stockForm.taxRate) {
      toast({
        title: "Error",
        description: "Please fill all stock fields",
        variant: "destructive"
      });
      return;
    }

    const product: Product = {
      name: stockForm.productName,
      quantity: parseInt(stockForm.quantity),
      costPrice: parseFloat(stockForm.costPrice),
      taxRate: parseFloat(stockForm.taxRate)
    };

    // Check if stock entry exists for this seller and warehouse
    const existingStockIndex = data.stocks.findIndex(
      stock => stock.sellerId === stockForm.sellerId && stock.warehouseId === stockForm.warehouseId
    );

    if (existingStockIndex >= 0) {
      // Add product to existing stock
      setData(prev => ({
        ...prev,
        stocks: prev.stocks.map((stock, index) => 
          index === existingStockIndex 
            ? { ...stock, products: [...stock.products, product] }
            : stock
        )
      }));
    } else {
      // Create new stock entry
      const newStock: Stock = {
        id: Date.now().toString(),
        sellerId: stockForm.sellerId,
        warehouseId: stockForm.warehouseId,
        products: [product]
      };

      setData(prev => ({
        ...prev,
        stocks: [...prev.stocks, newStock]
      }));
    }

    setStockForm({
      sellerId: "",
      warehouseId: "",
      productName: "",
      quantity: "",
      costPrice: "",
      taxRate: ""
    });

    toast({
      title: "Success",
      description: "Stock added successfully"
    });
  };

  const deleteItem = (type: keyof MasterDataState, index: number, category?: string) => {
    if (type === "subcategories" && category) {
      setData(prev => ({
        ...prev,
        subcategories: {
          ...prev.subcategories,
          [category]: prev.subcategories[category].filter((_, i) => i !== index)
        }
      }));
    } else {
      setData(prev => ({
        ...prev,
        [type]: (prev[type] as any[]).filter((_, i) => i !== index)
      }));
    }

    toast({
      title: "Success",
      description: "Item deleted successfully"
    });
  };

  const startEdit = (type: string, index: number, value: string) => {
    setEditingItem({ type, index, value });
  };

  const saveEdit = () => {
    if (!editingItem) return;

    const { type, index, value } = editingItem;
    
    if (type.includes("subcategory-")) {
      const category = type.replace("subcategory-", "");
      setData(prev => ({
        ...prev,
        subcategories: {
          ...prev.subcategories,
          [category]: prev.subcategories[category].map((item, i) => i === index ? value : item)
        }
      }));
    } else {
      setData(prev => ({
        ...prev,
        [type as keyof MasterDataState]: (prev[type as keyof MasterDataState] as string[]).map((item, i) => i === index ? value : item)
      }));
    }

    setEditingItem(null);
    toast({
      title: "Success",
      description: "Item updated successfully"
    });
  };

  const cancelEdit = () => {
    setEditingItem(null);
  };

  const renderItemList = (items: string[], type: string, category?: string) => (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          {editingItem?.type === type && editingItem.index === index ? (
            <div className="flex items-center gap-2 flex-1">
              <Input
                value={editingItem.value}
                onChange={(e) => setEditingItem(prev => prev ? { ...prev, value: e.target.value } : null)}
                className="flex-1"
              />
              <Button size="sm" onClick={saveEdit} className="bg-green-600 hover:bg-green-700">
                <MdSave className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={cancelEdit}>
                <MdCancel className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <span className="font-medium">{item}</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => startEdit(category ? `subcategory-${category}` : type, index, item)}
                >
                  <MdEdit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteItem(type as keyof MasterDataState, index, category)}
                  className="hover:bg-red-50 hover:text-red-600"
                >
                  <MdDelete className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );

  const getSellerName = (sellerId: string) => {
    const seller = data.sellers.find(s => s.id === sellerId);
    return seller ? seller.name : "Unknown Seller";
  };

  const getWarehouseName = (warehouseId: string) => {
    const warehouse = data.warehouses.find(w => w.id === warehouseId);
    return warehouse ? warehouse.name : "Unknown Warehouse";
  };

  return (
    <div className="container mx-auto max-w-7xl space-y-6 animate-fade-in p-4">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Master Data Management</h2>
        <p className="text-muted-foreground mt-2">
          Manage categories, sellers, warehouses, inventory, and stock data
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        <div className="w-full border-b border-border">
          <div className="w-full overflow-x-auto">
            <TabsList className="inline-flex w-max min-w-full bg-transparent border-0 p-0 h-auto">
              <TabsTrigger 
                value="categories" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none border-b-2 border-transparent px-4 py-2 text-sm font-medium transition-colors hover:text-primary"
              >
                Categories
              </TabsTrigger>
              <TabsTrigger 
                value="subcategories" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none border-b-2 border-transparent px-4 py-2 text-sm font-medium transition-colors hover:text-primary"
              >
                Subcategories
              </TabsTrigger>
              <TabsTrigger 
                value="seller" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none border-b-2 border-transparent px-4 py-2 text-sm font-medium transition-colors hover:text-primary"
              >
                Seller
              </TabsTrigger>
              <TabsTrigger 
                value="warehouse" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none border-b-2 border-transparent px-4 py-2 text-sm font-medium transition-colors hover:text-primary"
              >
                Warehouse
              </TabsTrigger>
              <TabsTrigger 
                value="inventory" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none border-b-2 border-transparent px-4 py-2 text-sm font-medium transition-colors hover:text-primary"
              >
                Inventory
              </TabsTrigger>
              <TabsTrigger 
                value="stock" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none border-b-2 border-transparent px-4 py-2 text-sm font-medium transition-colors hover:text-primary"
              >
                Stock
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>Manage product categories</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter new category"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={() => addItem("categories")}>
                  <MdAdd className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              {renderItemList(data.categories, "categories")}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subcategories">
          <Card>
            <CardHeader>
              <CardTitle>Subcategories</CardTitle>
              <CardDescription>Manage product subcategories by category</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Category</Label>
                  <select
                    className="w-full p-2 border border-border rounded-md bg-background"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">Select a category</option>
                    {data.categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                {selectedCategory && (
                  <div className="flex gap-2">
                    <Input
                      placeholder={`Enter new subcategory for ${selectedCategory}`}
                      value={newItem}
                      onChange={(e) => setNewItem(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={() => addItem("subcategories")}>
                      <MdAdd className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                )}
              </div>

              {selectedCategory && data.subcategories[selectedCategory] && (
                <div>
                  <h4 className="font-medium mb-3">Subcategories for {selectedCategory}:</h4>
                  {renderItemList(data.subcategories[selectedCategory], "subcategories", selectedCategory)}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seller">
          <Card>
            <CardHeader>
              <CardTitle>Seller Management</CardTitle>
              <CardDescription>Add and manage sellers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Seller Name</Label>
                  <Input
                    placeholder="Enter seller name"
                    value={sellerForm.name}
                    onChange={(e) => setSellerForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input
                    placeholder="Enter address"
                    value={sellerForm.address}
                    onChange={(e) => setSellerForm(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Mobile</Label>
                  <Input
                    placeholder="Enter mobile number"
                    value={sellerForm.mobile}
                    onChange={(e) => setSellerForm(prev => ({ ...prev, mobile: e.target.value }))}
                  />
                </div>
              </div>
              <Button onClick={addSeller}>
                <MdAdd className="h-4 w-4 mr-2" />
                Add Seller
              </Button>

              <div className="space-y-2">
                <h4 className="font-medium">Added Sellers:</h4>
                {data.sellers.map((seller, index) => (
                  <div key={seller.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{seller.name}</p>
                      <p className="text-sm text-muted-foreground">{seller.address}</p>
                      <p className="text-sm text-muted-foreground">{seller.mobile}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteItem("sellers", index)}
                      className="hover:bg-red-50 hover:text-red-600"
                    >
                      <MdDelete className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="warehouse">
          <Card>
            <CardHeader>
              <CardTitle>Warehouse Management</CardTitle>
              <CardDescription>Add and manage warehouses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Warehouse Name</Label>
                  <Input
                    placeholder="Enter warehouse name"
                    value={warehouseForm.name}
                    onChange={(e) => setWarehouseForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input
                    placeholder="Enter address"
                    value={warehouseForm.address}
                    onChange={(e) => setWarehouseForm(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Pincodes (comma separated)</Label>
                  <Input
                    placeholder="Enter pincodes (e.g., 110001, 110002)"
                    value={warehouseForm.pincodes}
                    onChange={(e) => setWarehouseForm(prev => ({ ...prev, pincodes: e.target.value }))}
                  />
                </div>
              </div>
              <Button onClick={addWarehouse}>
                <MdAdd className="h-4 w-4 mr-2" />
                Add Warehouse
              </Button>

              <div className="space-y-2">
                <h4 className="font-medium">Added Warehouses:</h4>
                {data.warehouses.map((warehouse, index) => (
                  <div key={warehouse.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{warehouse.name}</p>
                      <p className="text-sm text-muted-foreground">{warehouse.address}</p>
                      <p className="text-sm text-muted-foreground">Pincodes: {warehouse.pincodes.join(", ")}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteItem("warehouses", index)}
                      className="hover:bg-red-50 hover:text-red-600"
                    >
                      <MdDelete className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Overview</CardTitle>
              <CardDescription>View warehouse, stock, and seller details for products</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.stocks.map((stock) => (
                  <div key={stock.id} className="border rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h5 className="font-medium text-sm text-muted-foreground">Seller Details</h5>
                        <p className="font-medium">{getSellerName(stock.sellerId)}</p>
                      </div>
                      <div>
                        <h5 className="font-medium text-sm text-muted-foreground">Warehouse Details</h5>
                        <p className="font-medium">{getWarehouseName(stock.warehouseId)}</p>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-sm text-muted-foreground mb-2">Products</h5>
                      <div className="space-y-2">
                        {stock.products.map((product, index) => (
                          <div key={index} className="grid grid-cols-4 gap-4 p-3 bg-muted/30 rounded">
                            <div>
                              <span className="text-sm font-medium">{product.name}</span>
                            </div>
                            <div>
                              <span className="text-sm">Qty: {product.quantity}</span>
                            </div>
                            <div>
                              <span className="text-sm">Cost: ₹{product.costPrice}</span>
                            </div>
                            <div>
                              <span className="text-sm">Tax: {product.taxRate}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                {data.stocks.length === 0 && (
                  <p className="text-muted-foreground text-center py-8">No inventory data available. Add stock entries first.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stock">
          <Card>
            <CardHeader>
              <CardTitle>Stock Management</CardTitle>
              <CardDescription>Add and manage stock entries</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Select Seller</Label>
                  <Select value={stockForm.sellerId} onValueChange={(value) => setStockForm(prev => ({ ...prev, sellerId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a seller" />
                    </SelectTrigger>
                    <SelectContent>
                      {data.sellers.map((seller) => (
                        <SelectItem key={seller.id} value={seller.id}>
                          {seller.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Select Warehouse</Label>
                  <Select value={stockForm.warehouseId} onValueChange={(value) => setStockForm(prev => ({ ...prev, warehouseId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      {data.warehouses.map((warehouse) => (
                        <SelectItem key={warehouse.id} value={warehouse.id}>
                          {warehouse.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Product Name</Label>
                  <Input
                    placeholder="Enter product name"
                    value={stockForm.productName}
                    onChange={(e) => setStockForm(prev => ({ ...prev, productName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    placeholder="Enter quantity"
                    value={stockForm.quantity}
                    onChange={(e) => setStockForm(prev => ({ ...prev, quantity: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cost Price</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Enter cost price"
                    value={stockForm.costPrice}
                    onChange={(e) => setStockForm(prev => ({ ...prev, costPrice: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tax Rate (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Enter tax rate"
                    value={stockForm.taxRate}
                    onChange={(e) => setStockForm(prev => ({ ...prev, taxRate: e.target.value }))}
                  />
                </div>
              </div>

              <Button onClick={addStock}>
                <MdAdd className="h-4 w-4 mr-2" />
                Add Stock Entry
              </Button>

              <div className="space-y-2">
                <h4 className="font-medium">Stock Entries:</h4>
                {data.stocks.map((stock, index) => (
                  <div key={stock.id} className="p-4 bg-muted/50 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="font-medium">Seller:</span> {getSellerName(stock.sellerId)} | 
                        <span className="font-medium ml-2">Warehouse:</span> {getWarehouseName(stock.warehouseId)}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteItem("stocks", index)}
                        className="hover:bg-red-50 hover:text-red-600"
                      >
                        <MdDelete className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                      {stock.products.map((product, pIndex) => (
                        <div key={pIndex} className="p-2 bg-background rounded border">
                          <p className="font-medium">{product.name}</p>
                          <p>Qty: {product.quantity}</p>
                          <p>Price: ₹{product.costPrice}</p>
                          <p>Tax: {product.taxRate}%</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MdAdd, MdDelete, MdEdit, MdSave, MdCancel } from "react-icons/md";
import { useToast } from "@/hooks/use-toast";
import Seller from "@/components/Seller";
import Warehouse from "@/components/Warehouse";
import Inventory from "@/components/Inventory";
import Stock from "@/components/Stock";

interface MasterDataState {
  categories: string[];
  subcategories: Record<string, string[]>;
}

const initialData: MasterDataState = {
  categories: ["Electronics", "Clothing", "Home & Garden", "Sports", "Books"],
  subcategories: {
    "Electronics": ["Smartphones", "Laptops", "Accessories"],
    "Clothing": ["Men's Wear", "Women's Wear", "Kids Wear"],
    "Home & Garden": ["Furniture", "Decor", "Tools"],
    "Sports": ["Fitness", "Outdoor", "Team Sports"],
    "Books": ["Fiction", "Non-Fiction", "Educational"]
  }
};

export default function MasterData() {
  const location = useLocation();
  const { toast } = useToast();
  
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
          <Seller />
        </TabsContent>

        <TabsContent value="warehouse">
          <Warehouse />
        </TabsContent>

        <TabsContent value="inventory">
          <Inventory />
        </TabsContent>

        <TabsContent value="stock">
          <Stock />
        </TabsContent>
      </Tabs>
    </div>
  );
}
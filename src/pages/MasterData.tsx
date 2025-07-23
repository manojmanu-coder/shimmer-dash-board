import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MdAdd, MdDelete, MdEdit, MdSave, MdCancel } from "react-icons/md";
import { useToast } from "@/hooks/use-toast";

// Mock data for master data
const initialData = {
  categories: ["Electronics", "Clothing", "Home & Garden", "Sports", "Books"],
  subcategories: {
    "Electronics": ["Smartphones", "Laptops", "Accessories"],
    "Clothing": ["Men's Wear", "Women's Wear", "Kids Wear"],
    "Home & Garden": ["Furniture", "Decor", "Tools"],
    "Sports": ["Fitness", "Outdoor", "Team Sports"],
    "Books": ["Fiction", "Non-Fiction", "Educational"]
  },
  brands: ["Apple", "Samsung", "Nike", "Adidas", "IKEA", "Sony"],
  unitQuantities: ["Piece", "Kg", "Liter", "Meter", "Pack"],
  gstRates: ["0%", "5%", "12%", "18%", "28%"]
};

interface MasterDataState {
  categories: string[];
  subcategories: Record<string, string[]>;
  brands: string[];
  unitQuantities: string[];
  gstRates: string[];
}

export default function MasterData() {
  const [data, setData] = useState<MasterDataState>(initialData);
  const [newItem, setNewItem] = useState("");
  const [editingItem, setEditingItem] = useState<{ type: string; index: number; value: string } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const { toast } = useToast();

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
        [type]: (prev[type] as string[]).filter((_, i) => i !== index)
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
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Master Data Management</h2>
        <p className="text-muted-foreground mt-2">
          Manage categories, brands, units, and other master data
        </p>
      </div>

      <Tabs defaultValue="categories" className="space-y-6">
        <div className="w-full overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide pb-1">
            <TabsList className="inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground w-max">
              <TabsTrigger value="categories" className="whitespace-nowrap text-xs md:text-sm px-2 md:px-3">Categories</TabsTrigger>
              <TabsTrigger value="subcategories" className="whitespace-nowrap text-xs md:text-sm px-2 md:px-3">Subcategories</TabsTrigger>
              <TabsTrigger value="brands" className="whitespace-nowrap text-xs md:text-sm px-2 md:px-3">Brands</TabsTrigger>
              <TabsTrigger value="units" className="whitespace-nowrap text-xs md:text-sm px-2 md:px-3">Unit Quantities</TabsTrigger>
              <TabsTrigger value="gst" className="whitespace-nowrap text-xs md:text-sm px-2 md:px-3">GST Rates</TabsTrigger>
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

        <TabsContent value="brands">
          <Card>
            <CardHeader>
              <CardTitle>Brands</CardTitle>
              <CardDescription>Manage product brands</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter new brand"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={() => addItem("brands")}>
                  <MdAdd className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              {renderItemList(data.brands, "brands")}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="units">
          <Card>
            <CardHeader>
              <CardTitle>Unit Quantities</CardTitle>
              <CardDescription>Manage measurement units</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter new unit (e.g., Kg, Liter)"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={() => addItem("unitQuantities")}>
                  <MdAdd className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              {renderItemList(data.unitQuantities, "unitQuantities")}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gst">
          <Card>
            <CardHeader>
              <CardTitle>GST Rates</CardTitle>
              <CardDescription>Manage GST tax rates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter new GST rate (e.g., 18%)"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={() => addItem("gstRates")}>
                  <MdAdd className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              {renderItemList(data.gstRates, "gstRates")}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
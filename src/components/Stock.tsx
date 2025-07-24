import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Trash2, Plus, X } from "lucide-react";

interface Product {
  name: string;
  quantity: number;
  costPrice: string;
  taxRate: string;
}

interface StockEntry {
  sellerId: string;
  warehouseId: string;
  products: Product[];
}

// Mock data - in a real app, this would come from props or shared state
const mockSellers = [
  { id: "0", name: "ABC Suppliers" },
  { id: "1", name: "XYZ Trading" },
  { id: "2", name: "PQR Distributors" }
];

const mockWarehouses = [
  { id: "0", name: "Central Warehouse" },
  { id: "1", name: "North Warehouse" },
  { id: "2", name: "South Warehouse" }
];

export default function Stock() {
  const [stockEntries, setStockEntries] = useState<StockEntry[]>([]);
  const [stockForm, setStockForm] = useState({
    sellerId: "",
    warehouseId: "",
    products: [{ name: "", quantity: "", costPrice: "", taxRate: "" }]
  });
  const { toast } = useToast();

  const addStockEntry = () => {
    if (!stockForm.sellerId || !stockForm.warehouseId || 
        stockForm.products.some(p => !p.name.trim() || !p.quantity || !p.costPrice || !p.taxRate)) {
      toast({
        title: "Error",
        description: "Please fill all required fields for stock entry",
        variant: "destructive",
      });
      return;
    }

    const newEntry: StockEntry = {
      sellerId: stockForm.sellerId,
      warehouseId: stockForm.warehouseId,
      products: stockForm.products.map(p => ({
        name: p.name,
        quantity: parseInt(p.quantity),
        costPrice: p.costPrice,
        taxRate: p.taxRate
      }))
    };

    setStockEntries([...stockEntries, newEntry]);
    setStockForm({
      sellerId: "",
      warehouseId: "",
      products: [{ name: "", quantity: "", costPrice: "", taxRate: "" }]
    });
    toast({
      title: "Success",
      description: "Stock entry added successfully",
    });
  };

  const deleteStockEntry = (index: number) => {
    setStockEntries(stockEntries.filter((_, i) => i !== index));
    toast({
      title: "Success",
      description: "Stock entry deleted successfully",
    });
  };

  const addProduct = () => {
    setStockForm({
      ...stockForm,
      products: [...stockForm.products, { name: "", quantity: "", costPrice: "", taxRate: "" }]
    });
  };

  const removeProduct = (index: number) => {
    if (stockForm.products.length > 1) {
      setStockForm({
        ...stockForm,
        products: stockForm.products.filter((_, i) => i !== index)
      });
    }
  };

  const updateProduct = (index: number, field: keyof Product, value: string) => {
    const updatedProducts = [...stockForm.products];
    updatedProducts[index] = { ...updatedProducts[index], [field]: value };
    setStockForm({ ...stockForm, products: updatedProducts });
  };

  const getSellerName = (sellerId: string) => {
    const seller = mockSellers.find(s => s.id === sellerId);
    return seller ? seller.name : "Unknown Seller";
  };

  const getWarehouseName = (warehouseId: string) => {
    const warehouse = mockWarehouses.find(w => w.id === warehouseId);
    return warehouse ? warehouse.name : "Unknown Warehouse";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Stock Entry</CardTitle>
          <CardDescription>Enter stock details with seller, warehouse, and product information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="seller-select">Seller</Label>
              <Select value={stockForm.sellerId} onValueChange={(value) => setStockForm({...stockForm, sellerId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a seller" />
                </SelectTrigger>
                <SelectContent>
                  {mockSellers.map((seller) => (
                    <SelectItem key={seller.id} value={seller.id}>
                      {seller.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="warehouse-select">Warehouse</Label>
              <Select value={stockForm.warehouseId} onValueChange={(value) => setStockForm({...stockForm, warehouseId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a warehouse" />
                </SelectTrigger>
                <SelectContent>
                  {mockWarehouses.map((warehouse) => (
                    <SelectItem key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <Label>Products</Label>
              <Button type="button" variant="outline" size="sm" onClick={addProduct}>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
            
            <div className="space-y-3">
              {stockForm.products.map((product, index) => (
                <div key={index} className="border rounded-lg p-3 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Product {index + 1}</h4>
                    {stockForm.products.length > 1 && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => removeProduct(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <Label>Product Name</Label>
                      <Input
                        value={product.name}
                        onChange={(e) => updateProduct(index, 'name', e.target.value)}
                        placeholder="Enter product name"
                      />
                    </div>
                    <div>
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        value={product.quantity}
                        onChange={(e) => updateProduct(index, 'quantity', e.target.value)}
                        placeholder="Enter quantity"
                      />
                    </div>
                    <div>
                      <Label>Cost Price (₹)</Label>
                      <Input
                        type="number"
                        value={product.costPrice}
                        onChange={(e) => updateProduct(index, 'costPrice', e.target.value)}
                        placeholder="Enter cost price"
                      />
                    </div>
                    <div>
                      <Label>Tax Rate (%)</Label>
                      <Select 
                        value={product.taxRate} 
                        onValueChange={(value) => updateProduct(index, 'taxRate', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select tax rate" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0%</SelectItem>
                          <SelectItem value="5">5%</SelectItem>
                          <SelectItem value="12">12%</SelectItem>
                          <SelectItem value="18">18%</SelectItem>
                          <SelectItem value="28">28%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Button onClick={addStockEntry} className="w-full">Add Stock Entry</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stock Entries</CardTitle>
          <CardDescription>Manage your stock entries</CardDescription>
        </CardHeader>
        <CardContent>
          {stockEntries.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No stock entries added yet</p>
          ) : (
            <div className="space-y-4">
              {stockEntries.map((entry, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex gap-4">
                        <span className="font-medium">Seller:</span>
                        <span>{getSellerName(entry.sellerId)}</span>
                      </div>
                      <div className="flex gap-4">
                        <span className="font-medium">Warehouse:</span>
                        <span>{getWarehouseName(entry.warehouseId)}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="destructive" onClick={() => deleteStockEntry(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Products:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {entry.products.map((product, productIndex) => (
                        <div key={productIndex} className="border rounded p-3 bg-muted/30">
                          <div className="font-medium mb-1">{product.name}</div>
                          <div className="text-sm space-y-1">
                            <div>Quantity: {product.quantity}</div>
                            <div>Cost Price: ₹{product.costPrice}</div>
                            <div>Tax Rate: {product.taxRate}%</div>
                            <div className="font-medium">
                              Total: ₹{(parseInt(product.costPrice) * product.quantity).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MdAdd, MdSave, MdImage, MdEdit, MdDelete } from "react-icons/md";
import { useToast } from "@/hooks/use-toast";

// Mock data for dropdowns
const categories = ["Electronics", "Clothing", "Home & Garden", "Sports", "Books"];
const subcategories = {
  "Electronics": ["Smartphones", "Laptops", "Accessories"],
  "Clothing": ["Men's Wear", "Women's Wear", "Kids Wear"],
  "Home & Garden": ["Furniture", "Decor", "Tools"],
  "Sports": ["Fitness", "Outdoor", "Team Sports"],
  "Books": ["Fiction", "Non-Fiction", "Educational"]
};
const brands = ["Apple", "Samsung", "Nike", "Adidas", "IKEA", "Sony"];
const unitQuantities = ["Piece", "Kg", "Liter", "Meter", "Pack"];
const gstRates = ["0%", "5%", "12%", "18%", "28%"];

interface Product {
  id: string;
  category: string;
  subcategory: string;
  brand: string;
  unitQuantity: string;
  gst: string;
  productName: string;
  productId: string;
  unit: string;
  marginPercentage: string;
  mrpMargin: string;
  mrp: string;
  sellingPrice: string;
  avgCostPrice: string;
  description: string;
  productInfo: string;
  productFeatures: string;
  hsnCode: string;
  stockUnits: string;
  images: File[];
}

const initialProduct: Omit<Product, 'id'> = {
  category: "",
  subcategory: "",
  brand: "",
  unitQuantity: "",
  gst: "",
  productName: "",
  productId: "",
  unit: "",
  marginPercentage: "",
  mrpMargin: "",
  mrp: "",
  sellingPrice: "",
  avgCostPrice: "",
  description: "",
  productInfo: "",
  productFeatures: "",
  hsnCode: "",
  stockUnits: "",
  images: []
};

export default function Products() {
  const [currentProduct, setCurrentProduct] = useState<Omit<Product, 'id'>>(initialProduct);
  const [productList, setProductList] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [activeTab, setActiveTab] = useState("add");
  const { toast } = useToast();

  const handleInputChange = (field: keyof Omit<Product, 'id'>, value: string) => {
    setCurrentProduct(prev => ({ ...prev, [field]: value }));
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentProduct(prev => ({ 
      ...prev, 
      category, 
      subcategory: "" // Reset subcategory when category changes
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setCurrentProduct(prev => ({ 
        ...prev, 
        images: [...prev.images, ...Array.from(files)]
      }));
    }
  };

  const addProduct = () => {
    if (!currentProduct.productName || !currentProduct.category) {
      toast({
        title: "Error",
        description: "Please fill in required fields (Product Name, Category)",
        variant: "destructive"
      });
      return;
    }

    const newProduct: Product = {
      ...currentProduct,
      id: Date.now().toString()
    };

    setProductList(prev => [...prev, newProduct]);
    setCurrentProduct(initialProduct);
    setSelectedCategory("");
    setActiveTab("all"); // Switch to All Products tab
    
    toast({
      title: "Success",
      description: "Product added to list"
    });
  };

  const saveAllProducts = async () => {
    if (productList.length === 0) {
      toast({
        title: "Error",
        description: "No products to save",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically send to API
    console.log("Saving products:", productList);
    
    toast({
      title: "Success",
      description: `${productList.length} products saved successfully`
    });
    
    // Clear the list after saving
    setProductList([]);
  };

  const deleteProduct = (id: string) => {
    setProductList(prev => prev.filter(product => product.id !== id));
    toast({
      title: "Success",
      description: "Product removed from list"
    });
  };

  return (
    <div className="space-y-6 animate-fade-in bg-background">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Products Management</h2>
        <p className="text-muted-foreground mt-2">
          Add and manage your product inventory
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-muted">
          <TabsTrigger value="add" className="bg-background data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Add Product
          </TabsTrigger>
          <TabsTrigger value="all" className="bg-background data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            All Products ({productList.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="add" className="mt-6">
          <Card className="bg-background border-border">
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
          <CardDescription>Fill in the product details below</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Dropdown Fields Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select onValueChange={handleCategoryChange} value={selectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-card border border-border">
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subcategory">Subcategory</Label>
              <Select 
                onValueChange={(value) => handleInputChange('subcategory', value)}
                value={currentProduct.subcategory}
                disabled={!selectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>
                <SelectContent className="bg-card border border-border">
                  {selectedCategory && subcategories[selectedCategory as keyof typeof subcategories]?.map(subcat => (
                    <SelectItem key={subcat} value={subcat}>{subcat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Select onValueChange={(value) => handleInputChange('brand', value)} value={currentProduct.brand}>
                <SelectTrigger>
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent className="bg-card border border-border">
                  {brands.map(brand => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="unitQuantity">Unit Quantity</Label>
              <Select onValueChange={(value) => handleInputChange('unitQuantity', value)} value={currentProduct.unitQuantity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent className="bg-card border border-border">
                  {unitQuantities.map(unit => (
                    <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gst">GST Rate</Label>
              <Select onValueChange={(value) => handleInputChange('gst', value)} value={currentProduct.gst}>
                <SelectTrigger>
                  <SelectValue placeholder="Select GST" />
                </SelectTrigger>
                <SelectContent className="bg-card border border-border">
                  {gstRates.map(rate => (
                    <SelectItem key={rate} value={rate}>{rate}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Input Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name *</Label>
              <Input
                id="productName"
                value={currentProduct.productName}
                onChange={(e) => handleInputChange('productName', e.target.value)}
                placeholder="Enter product name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="productId">Product ID</Label>
              <Input
                id="productId"
                value={currentProduct.productId}
                onChange={(e) => handleInputChange('productId', e.target.value)}
                placeholder="Enter product ID"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                value={currentProduct.unit}
                onChange={(e) => handleInputChange('unit', e.target.value)}
                placeholder="Enter unit"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="marginPercentage">Margin %</Label>
              <Input
                id="marginPercentage"
                type="number"
                value={currentProduct.marginPercentage}
                onChange={(e) => handleInputChange('marginPercentage', e.target.value)}
                placeholder="Enter margin %"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mrpMargin">MRP Margin</Label>
              <Input
                id="mrpMargin"
                type="number"
                value={currentProduct.mrpMargin}
                onChange={(e) => handleInputChange('mrpMargin', e.target.value)}
                placeholder="Enter MRP margin"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mrp">MRP</Label>
              <Input
                id="mrp"
                type="number"
                value={currentProduct.mrp}
                onChange={(e) => handleInputChange('mrp', e.target.value)}
                placeholder="Enter MRP"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sellingPrice">Selling Price</Label>
              <Input
                id="sellingPrice"
                type="number"
                value={currentProduct.sellingPrice}
                onChange={(e) => handleInputChange('sellingPrice', e.target.value)}
                placeholder="Enter selling price"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="avgCostPrice">Avg Cost Price</Label>
              <Input
                id="avgCostPrice"
                type="number"
                value={currentProduct.avgCostPrice}
                onChange={(e) => handleInputChange('avgCostPrice', e.target.value)}
                placeholder="Enter avg cost price"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hsnCode">HSN Code</Label>
              <Input
                id="hsnCode"
                value={currentProduct.hsnCode}
                onChange={(e) => handleInputChange('hsnCode', e.target.value)}
                placeholder="Enter HSN code"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stockUnits">Stock Units</Label>
              <Input
                id="stockUnits"
                type="number"
                value={currentProduct.stockUnits}
                onChange={(e) => handleInputChange('stockUnits', e.target.value)}
                placeholder="Enter stock units"
              />
            </div>
          </div>

          <Separator />

          {/* Text Areas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={currentProduct.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter product description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="productInfo">Product Info</Label>
              <Textarea
                id="productInfo"
                value={currentProduct.productInfo}
                onChange={(e) => handleInputChange('productInfo', e.target.value)}
                placeholder="Enter product information"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="productFeatures">Product Features</Label>
              <Textarea
                id="productFeatures"
                value={currentProduct.productFeatures}
                onChange={(e) => handleInputChange('productFeatures', e.target.value)}
                placeholder="Enter product features"
                rows={3}
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="images">Product Images</Label>
            <div className="flex items-center gap-4">
              <Input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="flex-1"
              />
              <MdImage className="h-6 w-6 text-muted-foreground" />
            </div>
            {currentProduct.images.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {currentProduct.images.length} image(s) selected
              </p>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <Button onClick={addProduct} className="bg-primary hover:bg-primary/90">
              <MdAdd className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </CardContent>
        </Card>
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          <Card className="bg-background border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>All Products ({productList.length})</CardTitle>
                <CardDescription>
                  {productList.length === 0 
                    ? "No products added yet" 
                    : "Review and manage your products"
                  }
                </CardDescription>
              </div>
              {productList.length > 0 && (
                <Button onClick={saveAllProducts} variant="default" className="bg-primary hover:bg-primary/90">
                  <MdSave className="h-4 w-4 mr-2" />
                  Save All Products
                </Button>
              )}
            </CardHeader>
            <CardContent className="bg-background">
              {productList.length === 0 ? (
                <div className="text-center py-12 bg-background">
                  <p className="text-muted-foreground text-lg">No products added yet.</p>
                  <p className="text-muted-foreground">Click on "Add Product" tab to start adding products.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {productList.map((product, index) => (
                    <div key={product.id} className="p-4 bg-card border border-border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-foreground">{product.productName}</h4>
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              #{index + 1}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                            <p><span className="font-medium">Category:</span> {product.category}</p>
                            <p><span className="font-medium">Brand:</span> {product.brand}</p>
                            <p><span className="font-medium">Selling Price:</span> ₹{product.sellingPrice}</p>
                            <p><span className="font-medium">MRP:</span> ₹{product.mrp}</p>
                            <p><span className="font-medium">Stock:</span> {product.stockUnits} units</p>
                            <p><span className="font-medium">HSN:</span> {product.hsnCode}</p>
                          </div>
                          {product.description && (
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                              {product.description}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button size="sm" variant="outline" className="bg-background border-border">
                            <MdEdit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => deleteProduct(product.id)}
                            className="bg-background border-border hover:bg-destructive hover:text-destructive-foreground"
                          >
                            <MdDelete className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
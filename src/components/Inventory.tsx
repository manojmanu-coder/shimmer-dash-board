import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// This would typically come from a shared state management solution
// For now, using mock data structure
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

interface Seller {
  name: string;
  address: string;
  mobile: string;
}

interface Warehouse {
  name: string;
  address: string;
  pincodes: string[];
}

export default function Inventory() {
  // Mock data - in a real app, this would come from props or state management
  const mockSellers: Seller[] = [
    { name: "ABC Suppliers", address: "123 Main St", mobile: "9876543210" },
    { name: "XYZ Trading", address: "456 Oak Ave", mobile: "8765432109" }
  ];

  const mockWarehouses: Warehouse[] = [
    { name: "Central Warehouse", address: "789 Industrial Area", pincodes: ["110001", "110002"] },
    { name: "North Warehouse", address: "321 North Zone", pincodes: ["110003", "110004"] }
  ];

  const mockStockEntries: StockEntry[] = [
    {
      sellerId: "0",
      warehouseId: "0",
      products: [
        { name: "Product A", quantity: 100, costPrice: "500", taxRate: "18" },
        { name: "Product B", quantity: 50, costPrice: "300", taxRate: "12" }
      ]
    },
    {
      sellerId: "1",
      warehouseId: "1",
      products: [
        { name: "Product C", quantity: 75, costPrice: "750", taxRate: "18" },
        { name: "Product D", quantity: 200, costPrice: "200", taxRate: "5" }
      ]
    }
  ];

  const getSellerName = (sellerId: string) => {
    const seller = mockSellers[parseInt(sellerId)];
    return seller ? seller.name : "Unknown Seller";
  };

  const getWarehouseName = (warehouseId: string) => {
    const warehouse = mockWarehouses[parseInt(warehouseId)];
    return warehouse ? warehouse.name : "Unknown Warehouse";
  };

  const getWarehouseDetails = (warehouseId: string) => {
    const warehouse = mockWarehouses[parseInt(warehouseId)];
    return warehouse || null;
  };

  const getSellerDetails = (sellerId: string) => {
    const seller = mockSellers[parseInt(sellerId)];
    return seller || null;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Inventory Overview</CardTitle>
          <CardDescription>View warehouse details, stock details, and seller information for all products</CardDescription>
        </CardHeader>
        <CardContent>
          {mockStockEntries.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No inventory data available</p>
          ) : (
            <div className="space-y-6">
              {mockStockEntries.map((entry, index) => {
                const warehouse = getWarehouseDetails(entry.warehouseId);
                const seller = getSellerDetails(entry.sellerId);
                
                return (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex-1 min-w-[200px]">
                        <h3 className="font-semibold text-lg mb-2">Warehouse Details</h3>
                        {warehouse ? (
                          <div className="space-y-1">
                            <p className="font-medium">{warehouse.name}</p>
                            <p className="text-sm text-muted-foreground">{warehouse.address}</p>
                            <div className="flex flex-wrap gap-1">
                              {warehouse.pincodes.map((pincode, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {pincode}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <p className="text-muted-foreground">No warehouse data</p>
                        )}
                      </div>

                      <div className="flex-1 min-w-[200px]">
                        <h3 className="font-semibold text-lg mb-2">Seller Details</h3>
                        {seller ? (
                          <div className="space-y-1">
                            <p className="font-medium">{seller.name}</p>
                            <p className="text-sm text-muted-foreground">{seller.address}</p>
                            <p className="text-sm text-muted-foreground">{seller.mobile}</p>
                          </div>
                        ) : (
                          <p className="text-muted-foreground">No seller data</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg mb-3">Stock Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {entry.products.map((product, productIndex) => (
                          <div key={productIndex} className="border rounded-md p-3 bg-muted/30">
                            <h4 className="font-medium mb-2">{product.name}</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Quantity:</span>
                                <span className="font-medium">{product.quantity}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Cost Price:</span>
                                <span className="font-medium">₹{product.costPrice}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Tax Rate:</span>
                                <span className="font-medium">{product.taxRate}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Total Value:</span>
                                <span className="font-medium">
                                  ₹{(parseInt(product.costPrice) * product.quantity).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Warehouse Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockWarehouses.map((warehouse, index) => (
                <div key={index} className="flex justify-between items-center p-2 border rounded">
                  <div>
                    <p className="font-medium">{warehouse.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {warehouse.pincodes.length} pincode(s)
                    </p>
                  </div>
                  <Badge variant="outline">
                    {mockStockEntries.filter(entry => entry.warehouseId === index.toString()).length} entries
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Seller Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockSellers.map((seller, index) => (
                <div key={index} className="flex justify-between items-center p-2 border rounded">
                  <div>
                    <p className="font-medium">{seller.name}</p>
                    <p className="text-xs text-muted-foreground">{seller.mobile}</p>
                  </div>
                  <Badge variant="outline">
                    {mockStockEntries.filter(entry => entry.sellerId === index.toString()).length} entries
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MdVisibility, MdShoppingCart, MdPerson, MdCalendarToday } from "react-icons/md";

// Mock data for orders
const mockOrders = [
  {
    id: "ORD-001",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    customerPhone: "+91 9876543210",
    orderDate: "2024-01-15",
    status: "pending",
    total: 15999,
    products: [
      { name: "iPhone 15", quantity: 1, price: 79999, category: "Electronics" },
      { name: "AirPods Pro", quantity: 1, price: 24900, category: "Electronics" }
    ]
  },
  {
    id: "ORD-002",
    customerName: "Jane Smith",
    customerEmail: "jane@example.com",
    customerPhone: "+91 9876543211",
    orderDate: "2024-01-14",
    status: "completed",
    total: 2499,
    products: [
      { name: "Nike T-Shirt", quantity: 2, price: 1299, category: "Clothing" }
    ]
  },
  {
    id: "ORD-003",
    customerName: "Mike Johnson",
    customerEmail: "mike@example.com",
    customerPhone: "+91 9876543212",
    orderDate: "2024-01-13",
    status: "shipped",
    total: 5999,
    products: [
      { name: "Bluetooth Speaker", quantity: 1, price: 5999, category: "Electronics" }
    ]
  },
  {
    id: "ORD-004",
    customerName: "Sarah Wilson",
    customerEmail: "sarah@example.com",
    customerPhone: "+91 9876543213",
    orderDate: "2024-01-12",
    status: "cancelled",
    total: 1299,
    products: [
      { name: "Book: React Guide", quantity: 1, price: 1299, category: "Books" }
    ]
  }
];

type OrderStatus = "pending" | "completed" | "shipped" | "cancelled";

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "completed": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "shipped": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "cancelled": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
};

export default function Orders() {
  const [selectedOrder, setSelectedOrder] = useState<typeof mockOrders[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openOrderDetails = (order: typeof mockOrders[0]) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Orders Management</h2>
        <p className="text-muted-foreground mt-2">
          View and manage customer orders
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>Complete list of customer orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockOrders.map((order) => (
              <div
                key={order.id}
                className="p-4 border border-border rounded-lg hover:shadow-admin transition-all duration-200"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground">{order.id}</h3>
                      <Badge className={getStatusColor(order.status as OrderStatus)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MdPerson className="h-4 w-4" />
                        <span>{order.customerName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MdCalendarToday className="h-4 w-4" />
                        <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MdShoppingCart className="h-4 w-4" />
                        <span>{order.products.length} item(s)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-foreground">₹{order.total.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Total</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openOrderDetails(order)}
                      className="hover:bg-primary hover:text-primary-foreground"
                    >
                      <MdVisibility className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Complete information about this order
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Status and Date */}
              <div className="flex items-center justify-between">
                      <Badge className={getStatusColor(selectedOrder.status as OrderStatus)}>
                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                      </Badge>
                <p className="text-sm text-muted-foreground">
                  Order Date: {new Date(selectedOrder.orderDate).toLocaleDateString()}
                </p>
              </div>

              {/* Customer Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MdPerson className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{selectedOrder.customerName}</span>
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">
                    Email: {selectedOrder.customerEmail}
                  </p>
                  <p className="text-sm text-muted-foreground pl-6">
                    Phone: {selectedOrder.customerPhone}
                  </p>
                </CardContent>
              </Card>

              {/* Ordered Products */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ordered Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedOrder.products.map((product, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium">{product.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Category: {product.category}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{product.price.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {product.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total Amount:</span>
                      <span className="text-xl font-bold text-primary">
                        ₹{selectedOrder.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
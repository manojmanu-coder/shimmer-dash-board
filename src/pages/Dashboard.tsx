import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MdInventory, MdShoppingCart, MdPeople, MdTrendingUp } from "react-icons/md";

const stats = [
  {
    title: "Total Products",
    value: "1,234",
    description: "Active products in inventory",
    icon: MdInventory,
    color: "text-blue-600"
  },
  {
    title: "Total Orders",
    value: "567",
    description: "Orders this month",
    icon: MdShoppingCart,
    color: "text-green-600"
  },
  {
    title: "Total Users",
    value: "89",
    description: "Registered users",
    icon: MdPeople,
    color: "text-purple-600"
  },
  {
    title: "Revenue",
    value: "₹45,678",
    description: "This month's revenue",
    icon: MdTrendingUp,
    color: "text-orange-600"
  }
];

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Dashboard Overview</h2>
        <p className="text-muted-foreground mt-2">
          Welcome to your admin dashboard. Here's what's happening with your business today.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-admin transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest orders from your customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Order #{1000 + i}</p>
                    <p className="text-sm text-muted-foreground">Customer {i}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{(Math.random() * 5000 + 1000).toFixed(0)}</p>
                    <p className="text-sm text-muted-foreground">Pending</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Low Stock Products</CardTitle>
            <CardDescription>Products that need restocking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Product {i}</p>
                    <p className="text-sm text-muted-foreground">Category {i}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-destructive">{Math.floor(Math.random() * 10)} units</p>
                    <p className="text-sm text-muted-foreground">Low stock</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
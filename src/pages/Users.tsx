import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MdEdit, MdPerson, MdEmail, MdCalendarToday, MdSave } from "react-icons/md";
import { useToast } from "@/hooks/use-toast";

// Mock data for users
const mockUsers = [
  {
    id: "USR-001",
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    joinDate: "2023-01-15",
    status: "active",
    lastLogin: "2024-01-15"
  },
  {
    id: "USR-002",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Manager",
    joinDate: "2023-03-20",
    status: "active",
    lastLogin: "2024-01-14"
  },
  {
    id: "USR-003",
    name: "Mike Johnson",
    email: "mike@example.com",
    role: "Viewer",
    joinDate: "2023-06-10",
    status: "active",
    lastLogin: "2024-01-13"
  },
  {
    id: "USR-004",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    role: "Manager",
    joinDate: "2023-08-05",
    status: "inactive",
    lastLogin: "2023-12-20"
  },
  {
    id: "USR-005",
    name: "David Brown",
    email: "david@example.com",
    role: "Viewer",
    joinDate: "2023-10-12",
    status: "active",
    lastLogin: "2024-01-12"
  }
];

type UserRole = "Admin" | "Manager" | "Viewer";
type UserStatus = "active" | "inactive";

const roles: UserRole[] = ["Admin", "Manager", "Viewer"];

const getRoleColor = (role: UserRole) => {
  switch (role) {
    case "Admin": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case "Manager": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "Viewer": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
};

const getStatusColor = (status: UserStatus) => {
  switch (status) {
    case "active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "inactive": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
};

export default function Users() {
  const [users, setUsers] = useState(mockUsers);
  const [editingUser, setEditingUser] = useState<typeof mockUsers[0] | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole | "">("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const openEditDialog = (user: typeof mockUsers[0]) => {
    setEditingUser(user);
    setSelectedRole(user.role as UserRole);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingUser(null);
    setSelectedRole("");
  };

  const updateUserRole = () => {
    if (!editingUser || !selectedRole) {
      toast({
        title: "Error",
        description: "Please select a role",
        variant: "destructive"
      });
      return;
    }

    setUsers(prev => 
      prev.map(user => 
        user.id === editingUser.id 
          ? { ...user, role: selectedRole }
          : user
      )
    );

    toast({
      title: "Success",
      description: `User role updated to ${selectedRole}`
    });

    closeDialog();
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, status: user.status === "active" ? "inactive" : "active" }
          : user
      )
    );

    const user = users.find(u => u.id === userId);
    const newStatus = user?.status === "active" ? "inactive" : "active";
    
    toast({
      title: "Success",
      description: `User ${newStatus === "active" ? "activated" : "deactivated"} successfully`
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Users Management</h2>
        <p className="text-muted-foreground mt-2">
          Manage user accounts and permissions
        </p>
      </div>

      {/* Users Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <MdPerson className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <MdPerson className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.status === "active").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <MdPerson className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === "Admin").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Managers</CardTitle>
            <MdPerson className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === "Manager").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Manage user roles and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="p-4 border border-border rounded-lg hover:shadow-admin transition-all duration-200"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground">{user.name}</h3>
                      <Badge className={getRoleColor(user.role as UserRole)}>
                        {user.role}
                      </Badge>
                      <Badge className={getStatusColor(user.status as UserStatus)}>
                        {user.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MdEmail className="h-4 w-4" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MdCalendarToday className="h-4 w-4" />
                        <span>Joined: {new Date(user.joinDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MdCalendarToday className="h-4 w-4" />
                        <span>Last login: {new Date(user.lastLogin).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleUserStatus(user.id)}
                      className={user.status === "active" ? "hover:bg-red-50" : "hover:bg-green-50"}
                    >
                      {user.status === "active" ? "Deactivate" : "Activate"}
                    </Button>
                    
                    <Dialog open={isDialogOpen && editingUser?.id === user.id} onOpenChange={(open) => {
                      if (!open) closeDialog();
                    }}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(user)}
                          className="hover:bg-primary hover:text-primary-foreground"
                        >
                          <MdEdit className="h-4 w-4 mr-2" />
                          Edit Role
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit User Role</DialogTitle>
                          <DialogDescription>
                            Change the role for {editingUser?.name}
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Current Role</label>
                            <p className="text-sm text-muted-foreground">
                              {editingUser?.role}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">New Role</label>
                            <Select onValueChange={(value: UserRole) => setSelectedRole(value)} value={selectedRole}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select new role" />
                              </SelectTrigger>
                              <SelectContent className="bg-card border border-border">
                                {roles.map(role => (
                                  <SelectItem key={role} value={role}>{role}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={closeDialog}>
                              Cancel
                            </Button>
                            <Button onClick={updateUserRole} className="bg-primary hover:bg-primary/90">
                              <MdSave className="h-4 w-4 mr-2" />
                              Update Role
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
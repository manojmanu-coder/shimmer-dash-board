import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Trash2, Edit2, Check, X, Plus } from "lucide-react";

interface Warehouse {
  name: string;
  address: string;
  pincodes: string[];
}

export default function Warehouse() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [warehouseForm, setWarehouseForm] = useState({ name: "", address: "", pincodes: [""] });
  const [editingWarehouse, setEditingWarehouse] = useState<{ index: number; value: Warehouse } | null>(null);
  const { toast } = useToast();

  const addWarehouse = () => {
    if (!warehouseForm.name.trim() || !warehouseForm.address.trim() || warehouseForm.pincodes.some(p => !p.trim())) {
      toast({
        title: "Error",
        description: "Please fill all warehouse fields and pincodes",
        variant: "destructive",
      });
      return;
    }

    setWarehouses([...warehouses, { 
      ...warehouseForm, 
      pincodes: warehouseForm.pincodes.filter(p => p.trim()) 
    }]);
    setWarehouseForm({ name: "", address: "", pincodes: [""] });
    toast({
      title: "Success",
      description: "Warehouse added successfully",
    });
  };

  const deleteWarehouse = (index: number) => {
    setWarehouses(warehouses.filter((_, i) => i !== index));
    toast({
      title: "Success",
      description: "Warehouse deleted successfully",
    });
  };

  const startEditingWarehouse = (index: number) => {
    setEditingWarehouse({ index, value: { ...warehouses[index] } });
  };

  const saveWarehouseEdit = () => {
    if (!editingWarehouse) return;
    
    const updatedWarehouses = [...warehouses];
    updatedWarehouses[editingWarehouse.index] = editingWarehouse.value;
    setWarehouses(updatedWarehouses);
    setEditingWarehouse(null);
    toast({
      title: "Success",
      description: "Warehouse updated successfully",
    });
  };

  const cancelWarehouseEdit = () => {
    setEditingWarehouse(null);
  };

  const addPincode = (isEditing: boolean = false) => {
    if (isEditing && editingWarehouse) {
      setEditingWarehouse({
        ...editingWarehouse,
        value: {
          ...editingWarehouse.value,
          pincodes: [...editingWarehouse.value.pincodes, ""]
        }
      });
    } else {
      setWarehouseForm({
        ...warehouseForm,
        pincodes: [...warehouseForm.pincodes, ""]
      });
    }
  };

  const removePincode = (index: number, isEditing: boolean = false) => {
    if (isEditing && editingWarehouse) {
      setEditingWarehouse({
        ...editingWarehouse,
        value: {
          ...editingWarehouse.value,
          pincodes: editingWarehouse.value.pincodes.filter((_, i) => i !== index)
        }
      });
    } else {
      setWarehouseForm({
        ...warehouseForm,
        pincodes: warehouseForm.pincodes.filter((_, i) => i !== index)
      });
    }
  };

  const updatePincode = (index: number, value: string, isEditing: boolean = false) => {
    if (isEditing && editingWarehouse) {
      const newPincodes = [...editingWarehouse.value.pincodes];
      newPincodes[index] = value;
      setEditingWarehouse({
        ...editingWarehouse,
        value: {
          ...editingWarehouse.value,
          pincodes: newPincodes
        }
      });
    } else {
      const newPincodes = [...warehouseForm.pincodes];
      newPincodes[index] = value;
      setWarehouseForm({
        ...warehouseForm,
        pincodes: newPincodes
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Warehouse</CardTitle>
          <CardDescription>Add warehouse information and service pincodes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="warehouse-name">Warehouse Name</Label>
              <Input
                id="warehouse-name"
                value={warehouseForm.name}
                onChange={(e) => setWarehouseForm({...warehouseForm, name: e.target.value})}
                placeholder="Enter warehouse name"
              />
            </div>
            <div>
              <Label htmlFor="warehouse-address">Address</Label>
              <Input
                id="warehouse-address"
                value={warehouseForm.address}
                onChange={(e) => setWarehouseForm({...warehouseForm, address: e.target.value})}
                placeholder="Enter warehouse address"
              />
            </div>
          </div>
          
          <div>
            <Label>Service Pincodes</Label>
            <div className="space-y-2">
              {warehouseForm.pincodes.map((pincode, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={pincode}
                    onChange={(e) => updatePincode(index, e.target.value)}
                    placeholder="Enter pincode"
                  />
                  {warehouseForm.pincodes.length > 1 && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => removePincode(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => addPincode()}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Pincode
              </Button>
            </div>
          </div>
          
          <Button onClick={addWarehouse} className="w-full">Add Warehouse</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Warehouses List</CardTitle>
          <CardDescription>Manage your registered warehouses</CardDescription>
        </CardHeader>
        <CardContent>
          {warehouses.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No warehouses added yet</p>
          ) : (
            <div className="space-y-2">
              {warehouses.map((warehouse, index) => (
                <div key={index} className="flex items-start justify-between p-3 border rounded-lg">
                  {editingWarehouse?.index === index ? (
                    <div className="flex-1 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={editingWarehouse.value.name}
                          onChange={(e) => setEditingWarehouse({
                            ...editingWarehouse,
                            value: { ...editingWarehouse.value, name: e.target.value }
                          })}
                          placeholder="Warehouse name"
                        />
                        <Input
                          value={editingWarehouse.value.address}
                          onChange={(e) => setEditingWarehouse({
                            ...editingWarehouse,
                            value: { ...editingWarehouse.value, address: e.target.value }
                          })}
                          placeholder="Address"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Pincodes</Label>
                        {editingWarehouse.value.pincodes.map((pincode, pIndex) => (
                          <div key={pIndex} className="flex gap-2">
                            <Input
                              value={pincode}
                              onChange={(e) => updatePincode(pIndex, e.target.value, true)}
                              placeholder="Pincode"
                            />
                            {editingWarehouse.value.pincodes.length > 1 && (
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                                onClick={() => removePincode(pIndex, true)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          onClick={() => addPincode(true)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Pincode
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1">
                      <div className="font-medium">{warehouse.name}</div>
                      <div className="text-sm text-muted-foreground">{warehouse.address}</div>
                      <div className="text-sm text-muted-foreground">
                        Pincodes: {warehouse.pincodes.join(", ")}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2">
                    {editingWarehouse?.index === index ? (
                      <>
                        <Button size="sm" onClick={saveWarehouseEdit}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelWarehouseEdit}>
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" variant="outline" onClick={() => startEditingWarehouse(index)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteWarehouse(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
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
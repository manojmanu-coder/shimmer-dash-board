import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Trash2, Edit2, Check, X } from "lucide-react";

interface Seller {
  name: string;
  address: string;
  mobile: string;
}

export default function Seller() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [sellerForm, setSellerForm] = useState({ name: "", address: "", mobile: "" });
  const [editingSeller, setEditingSeller] = useState<{ index: number; value: Seller } | null>(null);
  const { toast } = useToast();

  const addSeller = () => {
    if (!sellerForm.name.trim() || !sellerForm.address.trim() || !sellerForm.mobile.trim()) {
      toast({
        title: "Error",
        description: "Please fill all seller fields",
        variant: "destructive",
      });
      return;
    }

    setSellers([...sellers, { ...sellerForm }]);
    setSellerForm({ name: "", address: "", mobile: "" });
    toast({
      title: "Success",
      description: "Seller added successfully",
    });
  };

  const deleteSeller = (index: number) => {
    setSellers(sellers.filter((_, i) => i !== index));
    toast({
      title: "Success",
      description: "Seller deleted successfully",
    });
  };

  const startEditingSeller = (index: number) => {
    setEditingSeller({ index, value: { ...sellers[index] } });
  };

  const saveSellerEdit = () => {
    if (!editingSeller) return;
    
    const updatedSellers = [...sellers];
    updatedSellers[editingSeller.index] = editingSeller.value;
    setSellers(updatedSellers);
    setEditingSeller(null);
    toast({
      title: "Success",
      description: "Seller updated successfully",
    });
  };

  const cancelSellerEdit = () => {
    setEditingSeller(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Seller</CardTitle>
          <CardDescription>Add seller information to manage your suppliers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="seller-name">Seller Name</Label>
              <Input
                id="seller-name"
                value={sellerForm.name}
                onChange={(e) => setSellerForm({...sellerForm, name: e.target.value})}
                placeholder="Enter seller name"
              />
            </div>
            <div>
              <Label htmlFor="seller-address">Address</Label>
              <Input
                id="seller-address"
                value={sellerForm.address}
                onChange={(e) => setSellerForm({...sellerForm, address: e.target.value})}
                placeholder="Enter address"
              />
            </div>
            <div>
              <Label htmlFor="seller-mobile">Mobile</Label>
              <Input
                id="seller-mobile"
                value={sellerForm.mobile}
                onChange={(e) => setSellerForm({...sellerForm, mobile: e.target.value})}
                placeholder="Enter mobile number"
              />
            </div>
          </div>
          <Button onClick={addSeller} className="w-full">Add Seller</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sellers List</CardTitle>
          <CardDescription>Manage your registered sellers</CardDescription>
        </CardHeader>
        <CardContent>
          {sellers.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No sellers added yet</p>
          ) : (
            <div className="space-y-2">
              {sellers.map((seller, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  {editingSeller?.index === index ? (
                    <div className="flex-1 grid grid-cols-3 gap-2">
                      <Input
                        value={editingSeller.value.name}
                        onChange={(e) => setEditingSeller({
                          ...editingSeller,
                          value: { ...editingSeller.value, name: e.target.value }
                        })}
                        placeholder="Seller name"
                      />
                      <Input
                        value={editingSeller.value.address}
                        onChange={(e) => setEditingSeller({
                          ...editingSeller,
                          value: { ...editingSeller.value, address: e.target.value }
                        })}
                        placeholder="Address"
                      />
                      <Input
                        value={editingSeller.value.mobile}
                        onChange={(e) => setEditingSeller({
                          ...editingSeller,
                          value: { ...editingSeller.value, mobile: e.target.value }
                        })}
                        placeholder="Mobile"
                      />
                    </div>
                  ) : (
                    <div className="flex-1">
                      <div className="font-medium">{seller.name}</div>
                      <div className="text-sm text-muted-foreground">{seller.address}</div>
                      <div className="text-sm text-muted-foreground">{seller.mobile}</div>
                    </div>
                  )}
                  <div className="flex gap-2">
                    {editingSeller?.index === index ? (
                      <>
                        <Button size="sm" onClick={saveSellerEdit}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelSellerEdit}>
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" variant="outline" onClick={() => startEditingSeller(index)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteSeller(index)}>
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
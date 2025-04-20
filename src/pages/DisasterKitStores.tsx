import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Kit {
  id: number;
  name: string;
  description: string;
  price: number;
}

interface CartItem extends Kit {
  quantity: number;
}

const sampleKits: Kit[] = [
  { id: 1, name: 'Flood Relief Kit', description: 'Essential supplies for flood emergencies', price: 3999 },
  { id: 2, name: 'Fire Prep Kit', description: 'Tools and equipment for fire safety', price: 4799 },
  { id: 3, name: 'Oxygen Cylinder', description: 'Portable oxygen supply for emergencies', price: 7999 },
];

const DisasterKitStores = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (kit: Kit) => {
    if (!cart.find(item => item.id === kit.id)) {
      setCart([...cart, { ...kit, quantity: 1 }]);
    }
  };

  const removeFromCart = (kitId: number) => {
    setCart(cart.filter(item => item.id !== kitId));
  };

  const updateQuantity = (kitId: number, quantity: number) => {
    if (quantity < 1) return;
    setCart(cart.map(item => item.id === kitId ? { ...item, quantity } : item));
  };

  const totalPrice = cart.reduce((total, kit) => total + kit.price * kit.quantity, 0);

  const proceedToCheckout = () => {
    alert('Proceeding to checkout with ' + cart.length + ' items. Total: ₹' + totalPrice.toFixed(2));
  };

  return (
    <Layout title="Disaster Kit Stores">
      <div className="container mx-auto p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6 text-helper-red">Disaster Kit Stores</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {sampleKits.map((kit) => (
            <Card key={kit.id} className="bg-helper-darkgray border-helper-darkgray hover:border-helper-red transition-colors">
              <CardHeader>
                <CardTitle className="text-helper-red">{kit.name}</CardTitle>
                <CardDescription>{kit.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-2">Price: ₹{kit.price.toFixed(2)}</p>
                <Button
                  variant="outline"
                  onClick={() => addToCart(kit)}
                  disabled={cart.find(item => item.id === kit.id) !== undefined}
                >
                  {cart.find(item => item.id === kit.id) ? 'Added' : 'Add to Cart'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-helper-darkgray p-4 rounded-md border border-helper-darkgray">
          <h2 className="text-xl font-bold mb-4 text-helper-red">Cart</h2>
          {cart.length === 0 ? (
            <p className="text-helper-red">Your cart is empty.</p>
          ) : (
            <>
              <ul className="mb-4">
                {cart.map((kit) => (
                  <li key={kit.id} className="flex justify-between items-center mb-2">
                    <div>
                      <span>{kit.name} - ₹{kit.price.toFixed(2)}</span>
                      <div className="inline-flex items-center ml-4">
                        <Button variant="outline" size="sm" onClick={() => updateQuantity(kit.id, kit.quantity - 1)} disabled={kit.quantity <= 1}>-</Button>
                        <span className="mx-2 text-helper-red">{kit.quantity}</span>
                        <Button variant="outline" size="sm" onClick={() => updateQuantity(kit.id, kit.quantity + 1)}>+</Button>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeFromCart(kit.id)}>
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between items-center">
                <span className="font-bold text-helper-red">Total: ₹{totalPrice.toFixed(2)}</span>
                <Button onClick={proceedToCheckout} disabled={cart.length === 0}>
                  Proceed to Checkout
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DisasterKitStores;

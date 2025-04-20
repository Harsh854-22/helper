
import { Package2, ShoppingCart, Trash2, X, MinusCircle, PlusCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetFooter,
  SheetClose
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';

interface StoreItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  image?: string;
  quantity?: number;
}

const storeItems: StoreItem[] = [
  {
    id: "1",
    title: "Emergency Survival Kit",
    description: "72-hour kit with food, water, and essential supplies",
    price: 9999,
    category: "Kits",
    inStock: true,
    image: "https://images.unsplash.com/photo-1519855108091-f659c18acf56?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: "2",
    title: "First Aid Professional Kit",
    description: "Comprehensive medical supplies for emergencies",
    price: 3499,
    category: "Medical",
    inStock: true,
    image: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: "3",
    title: "Solar Power Bank",
    description: "20000mAh battery with solar charging capability",
    price: 2999,
    category: "Electronics",
    inStock: true,
    image: "https://images.unsplash.com/photo-1620827252031-146c648e5233?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: "4",
    title: "Water Filtration System",
    description: "Portable water filter, filters up to 1000L",
    price: 1999,
    category: "Water",
    inStock: true,
    image: "https://images.unsplash.com/photo-1518593929011-2a5ef6a369d7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: "5",
    title: "Emergency Food Supply",
    description: "30-day supply of long-term storage food",
    price: 14999,
    category: "Food",
    inStock: false,
    image: "https://images.unsplash.com/photo-1606914469723-89200aa76a5a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: "6",
    title: "Emergency Weather Radio",
    description: "Hand-crank radio with NOAA weather alerts",
    price: 2499,
    category: "Electronics",
    inStock: true,
    image: "https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  }
];

const Store = () => {
  const [cart, setCart] = useState<StoreItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();
  
  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('helper-cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('helper-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: StoreItem) => {
    const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
    
    if (existingItemIndex >= 0) {
      // Item already exists in cart, increment quantity
      const updatedCart = [...cart];
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        quantity: (updatedCart[existingItemIndex].quantity || 1) + 1
      };
      setCart(updatedCart);
    } else {
      // Item doesn't exist in cart, add it with quantity 1
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    
    toast({
      title: "Added to Cart",
      description: `${item.title} has been added to your cart.`,
    });
  };
  
  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId));
    toast({
      title: "Removed from Cart",
      description: "Item has been removed from your cart.",
    });
  };
  
  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cart.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    
    setCart(updatedCart);
  };
  
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  };
  
  const handleCheckout = () => {
    toast({
      title: "Checkout Initiated",
      description: "Processing your order...",
    });
    
    // Simulate a successful checkout
    setTimeout(() => {
      setCart([]);
      toast({
        title: "Order Placed Successfully!",
        description: "Thank you for your purchase.",
      });
      setIsCartOpen(false);
    }, 2000);
  };
  
  // Format price in Rupees
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-helper-black to-helper-darkgray">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Emergency Preparedness Store</h1>
            <p className="text-gray-400">Essential supplies for emergency situations</p>
          </div>
          <Button 
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 bg-helper-red hover:bg-red-700 px-4 py-2 rounded-lg"
          >
            <ShoppingCart className="text-white" />
            <span className="text-white font-semibold">{cart.length > 0 ? cart.reduce((total, item) => total + (item.quantity || 1), 0) : 0} items</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {storeItems.map((item) => (
            <Card 
              key={item.id}
              className="bg-black/20 backdrop-blur-sm border-gray-800 hover:border-helper-red transition-all duration-300"
            >
              {item.image && (
                <div className="h-48 w-full overflow-hidden rounded-t-lg">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-white">{item.title}</CardTitle>
                  <Badge variant="outline" className="bg-helper-red/10 text-helper-red border-helper-red">
                    {formatPrice(item.price)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-400">{item.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-gray-800/50">
                    {item.category}
                  </Badge>
                  <Badge variant={item.inStock ? "outline" : "destructive"} className={item.inStock ? "bg-green-500/10 text-green-500" : ""}>
                    {item.inStock ? "In Stock" : "Out of Stock"}
                  </Badge>
                </div>
                <Button 
                  className="w-full bg-helper-red hover:bg-red-700"
                  disabled={!item.inStock}
                  onClick={() => addToCart(item)}
                >
                  <Package2 className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Shopping Cart Drawer */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent className="w-full sm:max-w-md bg-helper-darkgray border-helper-red">
          <SheetHeader>
            <SheetTitle className="text-white flex items-center gap-2">
              <ShoppingCart size={20} />
              Shopping Cart
            </SheetTitle>
          </SheetHeader>
          
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[70vh] text-gray-400">
              <ShoppingCart size={64} className="mb-4 opacity-30" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div className="mt-6 flex flex-col h-[calc(100vh-200px)]">
              <div className="flex-1 overflow-auto -mr-4 pr-4">
                {cart.map((item) => (
                  <div key={item.id} className="mb-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-white">{item.title}</h3>
                        <p className="text-sm text-gray-400">{formatPrice(item.price)}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-gray-400 hover:text-helper-red"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                    
                    <div className="flex items-center mt-2 justify-between">
                      <div className="flex items-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-gray-400"
                          onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                          disabled={(item.quantity || 1) <= 1}
                        >
                          <MinusCircle size={16} />
                        </Button>
                        <span className="w-8 text-center text-white">{item.quantity || 1}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-gray-400"
                          onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                        >
                          <PlusCircle size={16} />
                        </Button>
                      </div>
                      <span className="text-white font-medium">
                        {formatPrice(item.price * (item.quantity || 1))}
                      </span>
                    </div>
                    <Separator className="my-4 bg-gray-700" />
                  </div>
                ))}
              </div>
              
              <div className="mt-auto pt-4 border-t border-gray-700">
                <div className="flex justify-between mb-4">
                  <span className="text-gray-300">Subtotal</span>
                  <span className="text-white font-medium">{formatPrice(getCartTotal())}</span>
                </div>
                
                <div className="flex justify-between mb-6">
                  <span className="text-gray-300">Shipping</span>
                  <span className="text-white font-medium">₹499</span>
                </div>
                
                <div className="flex justify-between mb-6">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-helper-red font-bold">{formatPrice(getCartTotal() + 499)}</span>
                </div>
                
                <Button 
                  className="w-full bg-helper-red hover:bg-red-700 mb-2"
                  onClick={handleCheckout}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Checkout
                </Button>
                
                <SheetClose asChild>
                  <Button 
                    variant="outline" 
                    className="w-full border-gray-600 text-gray-300"
                  >
                    Continue Shopping
                  </Button>
                </SheetClose>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Store;

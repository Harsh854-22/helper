
import { Package2, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface StoreItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
}

const storeItems: StoreItem[] = [
  {
    id: "1",
    title: "Emergency Survival Kit",
    description: "72-hour kit with food, water, and essential supplies",
    price: 129.99,
    category: "Kits",
    inStock: true
  },
  {
    id: "2",
    title: "First Aid Professional Kit",
    description: "Comprehensive medical supplies for emergencies",
    price: 49.99,
    category: "Medical",
    inStock: true
  },
  {
    id: "3",
    title: "Solar Power Bank",
    description: "20000mAh battery with solar charging capability",
    price: 39.99,
    category: "Electronics",
    inStock: true
  },
  {
    id: "4",
    title: "Water Filtration System",
    description: "Portable water filter, filters up to 1000L",
    price: 29.99,
    category: "Water",
    inStock: true
  },
  {
    id: "5",
    title: "Emergency Food Supply",
    description: "30-day supply of long-term storage food",
    price: 199.99,
    category: "Food",
    inStock: false
  },
  {
    id: "6",
    title: "Emergency Weather Radio",
    description: "Hand-crank radio with NOAA weather alerts",
    price: 34.99,
    category: "Electronics",
    inStock: true
  }
];

const Store = () => {
  const [cart, setCart] = useState<StoreItem[]>([]);
  const { toast } = useToast();

  const addToCart = (item: StoreItem) => {
    setCart([...cart, item]);
    toast({
      title: "Added to Cart",
      description: `${item.title} has been added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-helper-black to-helper-darkgray">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Emergency Preparedness Store</h1>
            <p className="text-gray-400">Essential supplies for emergency situations</p>
          </div>
          <div className="flex items-center gap-2 bg-helper-red/10 px-4 py-2 rounded-lg">
            <ShoppingCart className="text-helper-red" />
            <span className="text-white font-semibold">{cart.length} items</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {storeItems.map((item) => (
            <Card 
              key={item.id}
              className="bg-black/20 backdrop-blur-sm border-gray-800 hover:border-helper-red transition-all duration-300"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-white">{item.title}</CardTitle>
                  <Badge variant="outline" className="bg-helper-red/10 text-helper-red border-helper-red">
                    ${item.price}
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
    </div>
  );
};

export default Store;

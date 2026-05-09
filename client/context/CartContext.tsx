import { dummyCart, dummyWishlist } from "@/assets/assets";
import {
  CartContextType,
  CartItemProps,
  CartItemType,
  Product,
  WishlistContextType,
} from "@/constants/types";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);

  const fetchCart = async () => {
    setIsLoading(true);
    try {
      const servercart = dummyCart;
      const mappedItems: CartItemType[] = servercart.items.map((item: any) => ({
        id: item.product._id,
        productId: item.product._id,
        product: item.product,
        quantity: item.quantity,
        size: item?.size || "M",
        price: item.price,
      }));
      setCartItems(mappedItems);
      setCartTotal(servercart.totalAmount);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (product: Product, size: string) => {};
  const removeFromCart = async (productId: string, size: string = "M") => {};
  const updateQuantity = async (
    productId: string,
    quantity: number,
    size: string,
  ) => {};

  const clearCart = async () => {};

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        itemCount,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider ");
  }
  return context;
}

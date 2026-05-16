import api from "@/constants/api";
import { CartContextType, CartItemType, Product } from "@/constants/types";
import { useAuth } from "@clerk/expo";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Toast from "react-native-toast-message";

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { getToken, isSignedIn } = useAuth();
  const getTokenRef = useRef(getToken);

  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    getTokenRef.current = getToken;
  }, [getToken]);

  const getAuthHeaders = useCallback(async () => {
    const token = await getTokenRef.current();
    return {
      Authorization: `Bearer ${token}`,
    };
  }, []);

  const fetchCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get("/cart/", {
        headers: await getAuthHeaders(),
      });

      if (!isSignedIn) return;

      if (data.success && data.data) {
        const serverCart = data.data;
        const mappedItems: CartItemType[] = serverCart.items.map(
          (item: any) => ({
            id: item.product._id,
            productId: item.product._id,
            product: item.product,
            quantity: item.quantity,
            size: item?.size || "M",
            price: item.price,
          }),
        );

        setCartItems(mappedItems);
        setCartTotal(serverCart.totalAmount);
      }
    } catch (error) {
      console.error("Failed to Fetch Cart : ", error);
    } finally {
      setIsLoading(false);
    }
  }, [getAuthHeaders]);

  const addToCart = async (product: Product, size: string) => {
    if (!isSignedIn) {
      Toast.show({
        type: "error",
        text1: "Please Login to Add to Cart",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await api.post(
        "/cart/add",
        {
          productId: product._id,
          quantity: 1,
          size,
        },
        {
          headers: await getAuthHeaders(),
        },
      );

      if (data.success) {
        await fetchCart();
      }
    } catch (error) {
      console.error("Failed to Add to Cart : ", error);
      Toast.show({
        type: "error",
        text1: "Failed to Add to Cart",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: string, size: string = "M") => {
    if (!isSignedIn) {
      Toast.show({
        type: "error",
        text1: "Please Login to Remove from Cart",
      });
      return;
    }

    try {
      setIsLoading(true);
      const { data } = await api.delete(`/cart/item/${productId}`, {
        data: { size },
        headers: await getAuthHeaders(),
      });

      if (data.success) {
        await fetchCart();
      }
    } catch (error) {
      console.error("Failed to Remove From Cart : ", error);
      Toast.show({
        type: "error",
        text1: "Failed to Remove From Cart",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (
    productId: string,
    quantity: number,
    size: string,
  ) => {
    if (!isSignedIn) {
      Toast.show({
        type: "error",
        text1: "Please Login to Update Cart",
      });
      return;
    }

    if (quantity < 1) {
      await removeFromCart(productId, size);
      return;
    }

    try {
      setIsLoading(true);
      const { data } = await api.post(
        `/cart/item/${productId}`,
        { quantity, size },
        {
          headers: await getAuthHeaders(),
        },
      );

      if (data.success) {
        await fetchCart();
      }
    } catch (error) {
      console.error("Failed to Update Cart : ", error);
      Toast.show({
        type: "error",
        text1: "Failed to Update Cart",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    if (!isSignedIn) {
      return;
    }

    try {
      setIsLoading(true);
      const { data } = await api.delete("/cart/", {
        headers: await getAuthHeaders(),
      });

      if (data.success) {
        setCartItems([]);
        setCartTotal(0);
      }
    } catch (error) {
      console.error("Failed to Clear Cart : ", error);
      Toast.show({
        type: "error",
        text1: "Failed to Clear Cart",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (!isSignedIn) {
      setCartItems((prev) => (prev.length > 0 ? [] : prev));
      setCartTotal((prev) => (prev !== 0 ? 0 : prev));
      return;
    }

    fetchCart();
  }, [fetchCart, isSignedIn]);

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

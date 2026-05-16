import { dummyWishlist } from "@/assets/assets";
import api from "@/constants/api";
import { Product, WishlistContextType } from "@/constants/types";
import { useAuth } from "@clerk/expo";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import Toast from "react-native-toast-message";

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { getToken, isSignedIn } = useAuth();
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = async () => {
    if (!isSignedIn) {
      setWishlist([]);
      return;
    }
    setLoading(true);
    try {
      const token = await getToken();
      const { data } = await api.get(`/wishlist/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        setWishlist(data.data);
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Failed to fetch wishlist",
        text2: error.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (product: Product) => {
    try {
      const token = await getToken();
      const exists = wishlist.some((p) => p._id === product._id);

      // Remove
      if (exists) {
        setWishlist((prev) => prev.filter((p) => p._id !== product._id));

        await api.delete(`/wishlist/${product._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        Toast.show({
          type: "success",
          text1: "Removed from wishlist",
        });

        return;
      }

      // Add
      setWishlist((prev) => [...prev, product]);

      await api.post(
        "/wishlist",
        {
          productId: product._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      Toast.show({
        type: "success",
        text1: "Added to wishlist",
      });
    } catch (error: any) {
      fetchWishlist();

      Toast.show({
        type: "error",
        text1: "Wishlist update failed",
        text2: error.response?.data?.message || "Something went wrong",
      });
    }
  };
  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p._id === productId);
  };
  useEffect(() => {
    fetchWishlist();
  }, [isSignedIn]);

  return (
    <WishlistContext.Provider
      value={{ wishlist, loading, isInWishlist, toggleWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider ");
  }
  return context;
}

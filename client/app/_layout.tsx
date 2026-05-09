import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import "../global.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishListContext";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <CartProvider>
        <WishlistProvider>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </WishlistProvider>
      </CartProvider>
    </GestureHandlerRootView>
  );
}

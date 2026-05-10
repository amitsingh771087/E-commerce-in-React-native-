import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants";
import { ScrollView } from "react-native-gesture-handler";
import CartItems from "@/components/CartItems";

const Cart = () => {
  const { cartItems, cartTotal, removeFromCart, updateQuantity } = useCart();
  const router = useRouter();

  const shipping = 2;
  const total = cartTotal + shipping;
  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <Header title="My Cart" showBack />
      {cartItems.length > 0 ? (
        <>
          <ScrollView
            className="flex-1 px-4 mt-4 "
            showsVerticalScrollIndicator={false}
          >
            {cartItems.map((item, index) => (
              <CartItems
                item={item}
                key={index}
                onRemove={() => removeFromCart(item.id, item.size)}
                onUpdateQuantity={(q) => updateQuantity(item.id, q, item.size)}
              />
            ))}
          </ScrollView>
          <View className="p-4 bg-white rounded-t-3xl shadow-sm">
            {/* subTotal */}
            <View className="flex-row justify-between mb-2">
              <Text className="text-secondary">subtotal</Text>
              <Text className="text-primary font-bold">
                ${cartTotal.toFixed(2)}
              </Text>
            </View>
            {/* shipping */}
            <View className="flex-row justify-between mb-2">
              <Text className="text-secondary">shipping</Text>
              <Text className="text-primary font-bold">
                ${shipping.toFixed(2)}
              </Text>
            </View>
            {/* border */}
            <View className="h-[1px] bg-border mb-4" />
            {/* total */}
            <View className="flex-row justify-between mb-2">
              <Text className="text-primary font-bold text-lg">Total</Text>
              <Text className="text-primary font-bold text-lg">
                ${total.toFixed(2)}
              </Text>
            </View>
            {/* checkout */}
            <TouchableOpacity
              className="bg-primary py-4 rounded-full items-center"
              onPress={() => router.push("/checkout")}
            >
              <Text className="text-white font-bold text-base">Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View className="flex-1 items-center justify-center px-6">
          {/* Cart Icon */}
          <View className="w-24 h-24 rounded-full bg-primary/10 items-center justify-center mb-6">
            <Ionicons name="cart-outline" size={48} color={COLORS.primary} />
          </View>

          {/* Title */}
          <Text className="text-2xl font-bold text-primary mb-2">
            Your cart is empty
          </Text>

          {/* Subtitle */}
          <Text className="text-secondary text-center text-base leading-6 mb-8">
            Looks like you haven’t added anything to your cart yet. Start
            exploring and shop your favorite products.
          </Text>

          {/* Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            className="bg-primary w-full py-4 rounded-2xl items-center shadow-sm"
            onPress={() => router.push("/")}
          >
            <Text className="text-white text-base font-semibold">
              Start Shopping
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Cart;

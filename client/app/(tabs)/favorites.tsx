import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useWishlist } from "@/context/WishListContext";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants";
import { ScrollView } from "react-native-gesture-handler";
import CartItems from "@/components/CartItems";
import ProductCard from "@/components/ProductCard";

const Favorites = () => {
  const { wishlist } = useWishlist();
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <Header title="Wishlist" showMenu showCart />
      {wishlist.length > 0 ? (
        <>
          <ScrollView
            className="flex-1 px-4 mt-4 "
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-row flex-wrap justify-between">
              {wishlist.map((product) => (
                <ProductCard product={product} key={product._id} />
              ))}
            </View>
          </ScrollView>
        </>
      ) : (
        <View className="flex-1 items-center justify-center px-6">
          {/* Wishlist Icon */}
          <View className="w-24 h-24 rounded-full bg-primary/10 items-center justify-center mb-6">
            <Ionicons name="heart-outline" size={48} color={COLORS.primary} />
          </View>

          {/* Title */}
          <Text className="text-2xl font-bold text-primary mb-2">
            Your wishlist is empty
          </Text>

          {/* Subtitle */}
          <Text className="text-secondary text-center text-base leading-6 mb-8">
            Save your favorite products to your wishlist and shop them later
            anytime.
          </Text>

          {/* Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            className="bg-primary w-full py-4 rounded-2xl items-center shadow-sm"
            onPress={() => router.push("/")}
          >
            <Text className="text-white text-base font-semibold">
              Explore Products
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Favorites;

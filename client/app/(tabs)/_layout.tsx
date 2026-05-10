import { View, Text } from "react-native";
import React, { useState } from "react";
import { Tabs } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import { COLORS } from "@/constants";
import { useCart } from "@/context/CartContext";

const TabLayout = () => {
  const { cartItems } = useCart();
  const totalCartItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: "#CDCDE0",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 1,
          borderTopColor: "#F0F0F0",
          height: 56,
          padding: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View className="relative ">
              <Feather
                name={focused ? "shopping-cart" : "shopping-cart"}
                size={26}
                color={color}
              />
              {totalCartItems > 0 && (
                <View className="absolute -top-2 -right-2 bg-accent min-w-5 h-5 px-1 rounded-full items-center justify-center">
                  <Text className="text-[10px] text-white font-bold">
                    {totalCartItems}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;

import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { COLORS, getStatusColor } from "@/constants";
import type { Order } from "@/constants/types";
import { formatDate } from "@/assets/assets";
import { useAuth } from "@clerk/expo";
import api from "@/constants/api";

export default function Orders() {
  const { getToken } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = await getToken();
      const { data } = await api.get("/orders/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      // setOrders(dummyOrders as any[]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <Header title="My Orders" showBack />

      {loading ? (
        <View className="flex-1 items-center justify-center px-6">
          {/* Order Icon */}
          <View className="w-24 h-24 rounded-full bg-primary/10 items-center justify-center mb-6">
            <Ionicons
              name="bag-handle-outline"
              size={48}
              color={COLORS.primary}
            />
          </View>

          {/* Title */}
          <Text className="text-2xl font-bold text-primary mb-2">
            No Orders Found
          </Text>

          {/* Subtitle */}
          <Text className="text-secondary text-center text-base leading-6 mb-8">
            You haven’t placed any orders yet. Browse products and place your
            first order now.
          </Text>

          {/* Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            className="bg-primary w-full py-4 rounded-2xl items-center shadow-sm"
            onPress={() => router.push("/")}
          >
            <Text className="text-white text-base font-semibold">
              Order Now
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              className="bg-white p-4 rounded-xl mb-4 border border-gray-100 shadow-sm"
              onPress={() => router.push(`/orders/${item._id}`)}
            >
              <View className="flex-row justify-between mb-2">
                <Text className="text-primary font-bold">
                  Order #{item.orderNumber}
                </Text>
                <Text className="text-secondary text-sm">
                  {formatDate(item.createdAt)}
                </Text>
              </View>

              {/* Status Badges */}
              <View className="flex-row gap-2 mb-3">
                <View
                  className={`px-2 py-1 rounded-full ${getStatusColor(item.orderStatus)}`}
                >
                  <Text className={`text-xs font-bold capitalize`}>
                    {item.orderStatus}
                  </Text>
                </View>

                <View
                  className={`px-2 py-1 rounded-full ${
                    item.paymentStatus === "paid"
                      ? "bg-green-100"
                      : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={`text-xs font-bold capitalize ${
                      item.paymentStatus === "paid"
                        ? "text-green-700"
                        : "text-gray-700"
                    }`}
                  >
                    {item.paymentStatus}
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-secondary text-xs">
                  Payment Method:{" "}
                  <Text className="text-primary font-medium capitalize">
                    {item.paymentMethod}
                  </Text>
                </Text>
              </View>

              {/* Product Images */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mb-3"
              >
                {item.items.map((prod: any, idx) => {
                  const image = prod.product?.images?.[0];
                  return (
                    <View
                      key={idx}
                      className="mr-3 border border-gray-100 rounded-md p-1 bg-gray-50"
                    >
                      {image ? (
                        <Image
                          source={{ uri: image }}
                          className="w-12 h-12 rounded-md"
                          resizeMode="cover"
                        />
                      ) : (
                        <View className="w-12 h-12 bg-gray-200 rounded-md justify-center items-center">
                          <Ionicons
                            name="image-outline"
                            size={20}
                            color={COLORS.secondary}
                          />
                        </View>
                      )}
                    </View>
                  );
                })}
              </ScrollView>

              <View className="flex-row justify-between items-center mt-2 pt-3 border-t border-gray-100">
                <Text className="text-secondary">
                  Items: {item.items.length}
                </Text>
                <Text className="text-primary font-bold text-lg">
                  ${item.totalAmount.toFixed(2)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React from "react";
import { dummyUser } from "@/assets/assets";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, PROFILE_MENU } from "@/constants";
import { useClerk } from "@clerk/expo";

const Profile = () => {
  const { user, signOut } = useClerk();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.replace("/sign-in");
  };
  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <Header title="Profile" />
      <ScrollView
        className="flex-1 px-4 "
        contentContainerStyle={
          !user
            ? { flex: 1, justifyContent: "center", alignItems: "center" }
            : {
                paddingTop: 16,
              }
        }
      >
        {!user ? (
          // Guest User
          <View className="flex-1 items-center justify-center px-6">
            {/* Profile Icon */}
            <View className="w-28 h-28 rounded-full bg-primary/10 items-center justify-center mb-6">
              <Ionicons
                name="person-outline"
                size={56}
                color={COLORS.primary}
              />
            </View>

            {/* Heading */}
            <Text className="text-2xl font-bold text-primary mb-2">
              Guest User
            </Text>

            {/* Subtitle */}
            <Text className="text-secondary text-center text-base leading-6 mb-8">
              Login to view your profile, track orders, manage addresses, and
              enjoy a personalized shopping experience.
            </Text>

            {/* Login Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              className="bg-primary w-full py-4 px-12 rounded-full items-center shadow-sm"
              onPress={() => router.push("/sign-in")}
            >
              <Text className="text-white  text-base font-semibold">
                Login / Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Profile Info */}
            <View className="items-center mb-8">
              <View className="mb-3">
                <Image
                  source={{ uri: user.imageUrl }}
                  className="size-20 border-2 border-white shadow-sm rounded-full"
                />
              </View>
              <Text className="text-xl font-bold text-primary">
                {user.firstName + " " + user.lastName}
              </Text>
              <Text className="text-secondary text-sm">
                {user.emailAddresses[0].emailAddress}
              </Text>

              {/* Admin Panel Button if user is Admin */}
              {user.publicMetadata?.role === "admin" && (
                <TouchableOpacity
                  className="mt-4 bg-primary px-6 py-2 rounded-full"
                  onPress={() => router.push("/admin")}
                >
                  <Text className="text-white font-bold">Admin Panel</Text>
                </TouchableOpacity>
              )}
            </View>
            {/* Menu */}

            <View className="bg-white rounded-xl border border-gray-100/75 p-2 mb-4 ">
              {PROFILE_MENU.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => router.push(item.route as any)}
                  className={`flex-row items-center p-4 ${index !== PROFILE_MENU.length - 1 ? "border-b border-gray-100" : ""}`}
                >
                  <View className="w-10 h-10 bg-surface rounded-full items-center justify-center mr-4 ">
                    <Ionicons
                      name={item.icon as any}
                      size={20}
                      color={COLORS.primary}
                    />
                  </View>
                  <Text className="flex-1 text-primary font-medium">
                    {item.title}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={COLORS.secondary}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Logout Button */}
            <TouchableOpacity
              className="flex-row items-center justify-center p-4 "
              onPress={handleLogout}
            >
              <Text className="text-red-500 font-bold ml-2 ">Logout</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

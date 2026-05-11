import { COLORS } from "@/constants";
import { useSignIn } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter, Href } from "expo-router";
import * as React from "react";
import {
  Pressable,
  TextInput,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Page = () => {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");

  const loading = fetchStatus === "fetching";

  const handleSubmit = async () => {
    const { error } = await signIn.password({
      emailAddress,
      password,
    });

    if (error) {
      console.log(error);
      return;
    }

    // Login Complete
    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ decorateUrl }) => {
          const url = decorateUrl("/");

          if (url.startsWith("http")) {
            window.location.href = url;
          } else {
            router.replace(url as Href);
          }
        },
      });
    }

    // Email Verification Required
    else if (signIn.status === "needs_client_trust") {
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === "email_code",
      );

      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode();
      }
    }
  };

  const handleVerify = async () => {
    await signIn.mfa.verifyEmailCode({ code });

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ decorateUrl }) => {
          const url = decorateUrl("/");

          if (url.startsWith("http")) {
            window.location.href = url;
          } else {
            router.replace(url as Href);
          }
        },
      });
    }
  };

  const showVerification = signIn.status === "needs_client_trust";

  return (
    <SafeAreaView
      className="flex-1 bg-white justify-center"
      style={{ padding: 28 }}
    >
      {!showVerification ? (
        <>
          <TouchableOpacity
            onPress={() => router.push("/")}
            className="absolute top-12 z-10"
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>

          {/* Header */}
          <View className="items-center mb-8">
            <Text className="text-3xl font-bold text-primary mb-2">
              Welcome Back
            </Text>
            <Text className="text-secondary">Sign in to continue</Text>
          </View>

          {/* Email */}
          <View className="mb-4">
            <Text className="text-primary font-medium mb-2">Email</Text>

            <TextInput
              className="w-full bg-surface p-4 rounded-xl text-primary"
              placeholder="user@example.com"
              placeholderTextColor="#999"
              autoCapitalize="none"
              keyboardType="email-address"
              value={emailAddress}
              onChangeText={setEmailAddress}
            />

            {errors.fields.identifier && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.fields.identifier.message}
              </Text>
            )}
          </View>

          {/* Password */}
          <View className="mb-6">
            <Text className="text-primary font-medium mb-2">Password</Text>

            <TextInput
              className="w-full bg-surface p-4 rounded-xl text-primary"
              placeholder="********"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            {errors.fields.password && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.fields.password.message}
              </Text>
            )}
          </View>

          {/* Submit */}
          <Pressable
            className={`w-full py-4 rounded-full items-center mb-10 ${
              loading || !emailAddress || !password
                ? "bg-gray-300"
                : "bg-primary"
            }`}
            onPress={handleSubmit}
            disabled={loading || !emailAddress || !password}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-lg">Sign In</Text>
            )}
          </Pressable>

          {/* Footer */}
          <View className="flex-row justify-center">
            <Text className="text-secondary">Don&apos;t have an account? </Text>

            <Link href="/sign-up">
              <Text className="text-primary font-bold">Sign up</Text>
            </Link>
          </View>
        </>
      ) : (
        <>
          {/* Verification */}
          <View className="items-center mb-8">
            <Text className="text-3xl font-bold text-primary mb-2">
              Verify Email
            </Text>

            <Text className="text-secondary text-center">
              Enter the code sent to your email
            </Text>
          </View>

          <View className="mb-6">
            <TextInput
              className="w-full bg-surface p-4 rounded-xl text-primary text-center tracking-widest"
              placeholder="123456"
              placeholderTextColor="#999"
              keyboardType="number-pad"
              value={code}
              onChangeText={setCode}
            />

            {errors.fields.code && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.fields.code.message}
              </Text>
            )}
          </View>

          <Pressable
            className="w-full bg-primary py-4 rounded-full items-center"
            onPress={handleVerify}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-lg">Verify</Text>
            )}
          </Pressable>
        </>
      )}
    </SafeAreaView>
  );
};

export default Page;

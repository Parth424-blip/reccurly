import "@/global.css";
import { Link } from "expo-router";
import { styled } from "nativewind";
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);
export default function App() {
  return (
    <SafeAreaView className="flex-1  bg-background">
      <Text className="text-5xl font-bold ">Home</Text>
      <Link
        href="/onboarding"
        className="mt-4 font-sans-bold rounded bg-primary text-white p-4 font-sans-bold"
      >
        Go to onboarding
      </Link>
      <Link
        href="/(auth)/signin"
        className="mt-4 font-sans-bold rounded bg-primary text-white p-4 font-sans-bold"
      >
        Go to Sign In
      </Link>
      <Link
        href="/(auth)/signup"
        className="mt-4 font-sans-bold rounded bg-primary text-white p-4"
      >
        Go to Sign Up
      </Link>
      <Link href="/subscriptions/spotify"> Spotify Subscription </Link>
      <Link
        href={{ pathname: "/subscriptions/[id]", params: { id: "claude" } }}
      >
        Claude Max Subscription
      </Link>
    </SafeAreaView>
  );
}

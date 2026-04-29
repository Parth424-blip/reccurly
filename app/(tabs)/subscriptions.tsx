import CreateSubscriptionModal from "@/components/CreateSubscriptionModal";
import SubscriptionCard from "@/components/SubscriptionCard";
import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import "@/global.css";
import { styled } from "nativewind";
import React, { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);
const StyledView = styled(View);
const StyledTextInput = styled(TextInput);

export default function SubscriptionsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSubId, setExpandedSubId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [subscriptions, setSubscriptions] = useState(HOME_SUBSCRIPTIONS);

  const handleCreateSubscription = (newSubscription: Subscription) => {
    setSubscriptions((prev) => [...prev, newSubscription]);
  };

  const filteredSubscriptions = subscriptions.filter(
    (sub) =>
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.plan?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <StyledView className="px-5 pt-5 pb-2">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-3xl font-sans-bold text-primary">
              Subscriptions
            </Text>
            <Pressable
              className="rounded-full bg-blue-500 p-3"
              onPress={() => setModalVisible(true)}
            >
              <Text className="text-2xl font-bold text-white">+</Text>
            </Pressable>
          </View>
          <StyledTextInput
            placeholder="Search subscriptions..."
            placeholderTextColor="rgba(8, 17, 38, 0.4)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="auth-input text-primary"
          />
        </StyledView>

        <FlatList
          data={filteredSubscriptions}
          renderItem={({ item }) => (
            <SubscriptionCard
              {...item}
              expanded={expandedSubId === item.id}
              onPress={() =>
                setExpandedSubId((currentId) =>
                  currentId === item.id ? null : item.id,
                )
              }
            />
          )}
          keyExtractor={(item) => item.id}
          extraData={expandedSubId}
          contentContainerClassName="px-5 pb-30"
          ItemSeparatorComponent={() => <View className="h-4" />}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <StyledView className="items-center justify-center py-20">
              <View className="text-center">
                <Text className="text-lg font-sans-bold text-primary">
                  {searchQuery ? "No subscriptions found" : "No subscriptions"}
                </Text>
                {searchQuery && (
                  <Text className="mt-2 text-sm font-sans-medium text-primary">
                    Try searching for a different term
                  </Text>
                )}
              </View>
            </StyledView>
          }
        />
      </KeyboardAvoidingView>

      <CreateSubscriptionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleCreateSubscription}
      />
    </SafeAreaView>
  );
}

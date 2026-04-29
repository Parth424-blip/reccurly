import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import "@/global.css";
import { formatCurrency } from "@/libs/utils";
import dayjs from "dayjs";
import { styled } from "nativewind";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);
const StyledView = styled(View);
const StyledScrollView = styled(ScrollView);

const InsightsScreen = () => {
  const subscriptions = HOME_SUBSCRIPTIONS;

  const totalActiveSpend = subscriptions
    .filter((sub) => sub.status !== "cancelled")
    .reduce((sum, sub) => sum + sub.price, 0);

  const monthlyEquivalent = subscriptions.reduce((sum, sub) => {
    if (sub.billing.toLowerCase().includes("year")) {
      return sum + sub.price / 12;
    }
    return sum + sub.price;
  }, 0);

  const activeCount = subscriptions.filter((sub) => sub.status === "active").length;
  const pausedCount = subscriptions.filter((sub) => sub.status === "paused").length;
  const cancelledCount = subscriptions.filter(
    (sub) => sub.status === "cancelled",
  ).length;

  const categorySpend = subscriptions.reduce<Record<string, number>>((acc, sub) => {
    const category = sub.category ?? "Other";
    acc[category] = (acc[category] ?? 0) + sub.price;
    return acc;
  }, {});

  const categoryRows = Object.entries(categorySpend)
    .sort(([, first], [, second]) => second - first)
    .slice(0, 4);

  const upcomingRenewals = subscriptions
    .filter((sub) => sub.renewalDate)
    .map((sub) => {
      const daysLeft = dayjs(sub.renewalDate).diff(dayjs(), "day");
      return { ...sub, daysLeft };
    })
    .sort((first, second) => first.daysLeft - second.daysLeft)
    .slice(0, 3);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StyledScrollView
        className="flex-1"
        contentContainerClassName="px-5 pt-5 pb-30"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-3xl font-sans-bold text-primary">Insights</Text>
        <Text className="mt-2 text-base font-sans-medium text-muted-foreground">
          Your subscription spend at a glance.
        </Text>

        <StyledView className="mt-5 rounded-3xl border border-border bg-card p-5">
          <Text className="text-sm font-sans-semibold text-muted-foreground">
            Total Spend
          </Text>
          <Text className="mt-2 text-3xl font-sans-extrabold text-primary">
            {formatCurrency(totalActiveSpend)}
          </Text>
          <Text className="mt-1 text-sm font-sans-medium text-muted-foreground">
            Monthly equivalent: {formatCurrency(monthlyEquivalent)}
          </Text>
        </StyledView>

        <View className="mt-4 flex-row gap-3">
          <StyledView className="flex-1 rounded-2xl border border-border bg-background p-4">
            <Text className="text-xs font-sans-semibold uppercase text-muted-foreground">
              Active
            </Text>
            <Text className="mt-2 text-2xl font-sans-bold text-primary">
              {activeCount}
            </Text>
          </StyledView>
          <StyledView className="flex-1 rounded-2xl border border-border bg-background p-4">
            <Text className="text-xs font-sans-semibold uppercase text-muted-foreground">
              Paused
            </Text>
            <Text className="mt-2 text-2xl font-sans-bold text-primary">
              {pausedCount}
            </Text>
          </StyledView>
          <StyledView className="flex-1 rounded-2xl border border-border bg-background p-4">
            <Text className="text-xs font-sans-semibold uppercase text-muted-foreground">
              Cancelled
            </Text>
            <Text className="mt-2 text-2xl font-sans-bold text-primary">
              {cancelledCount}
            </Text>
          </StyledView>
        </View>

        <StyledView className="mt-6 rounded-3xl border border-border bg-card p-5">
          <Text className="text-xl font-sans-bold text-primary">
            Top Categories
          </Text>
          <View className="mt-4 gap-3">
            {categoryRows.map(([category, amount]) => {
              const percentage = totalActiveSpend
                ? Math.round((amount / totalActiveSpend) * 100)
                : 0;

              return (
                <View key={category} className="gap-2">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-base font-sans-semibold text-primary">
                      {category}
                    </Text>
                    <Text className="text-sm font-sans-semibold text-muted-foreground">
                      {formatCurrency(amount)} ({percentage}%)
                    </Text>
                  </View>
                  <View className="h-2 rounded-full bg-muted">
                    <View
                      className="h-2 rounded-full bg-accent"
                      style={{ width: `${Math.max(percentage, 6)}%` }}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </StyledView>

        <StyledView className="mt-6 rounded-3xl border border-border bg-card p-5">
          <Text className="text-xl font-sans-bold text-primary">
            Upcoming Renewals
          </Text>

          <View className="mt-4 gap-3">
            {upcomingRenewals.map((sub) => (
              <View
                key={sub.id}
                className="rounded-2xl border border-border bg-background p-4"
              >
                <View className="flex-row items-center justify-between">
                  <Text className="text-base font-sans-bold text-primary">
                    {sub.name}
                  </Text>
                  <Text className="text-base font-sans-bold text-primary">
                    {formatCurrency(sub.price, sub.currency)}
                  </Text>
                </View>
                <Text className="mt-1 text-sm font-sans-medium text-muted-foreground">
                  Renews{" "}
                  {sub.daysLeft < 0
                    ? `${Math.abs(sub.daysLeft)} days ago`
                    : `in ${sub.daysLeft} days`}{" "}
                  ({dayjs(sub.renewalDate).format("MMM D, YYYY")})
                </Text>
              </View>
            ))}
          </View>
        </StyledView>
      </StyledScrollView>
    </SafeAreaView>
  );
};

export default InsightsScreen;

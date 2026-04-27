import React from "react";
import { Text, View } from "react-native";

interface AuthBrandProps {
  title: string;
  subtitle?: string;
}

export const AuthBrand: React.FC<AuthBrandProps> = ({ title, subtitle }) => {
  return (
    <View className="auth-brand-block">
      <View className="auth-logo-wrap">
        <View className="auth-logo-mark">
          <Text className="auth-logo-mark-text">✓</Text>
        </View>
        <View>
          <Text className="auth-wordmark">Subly</Text>
          <Text className="auth-wordmark-sub">Subscription Manager</Text>
        </View>
      </View>
      <Text className="auth-title">{title}</Text>
      {subtitle && <Text className="auth-subtitle">{subtitle}</Text>}
    </View>
  );
};

import React from "react";
import { Text, TextInput, View } from "react-native";

interface AuthFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?:
    | "default"
    | "email-address"
    | "numeric"
    | "phone-pad"
    | "decimal-pad"
    | "visible-password";
  editable?: boolean;
  testID?: string;
}

export const AuthField: React.FC<AuthFieldProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
  keyboardType = "default",
  editable = true,
  testID,
}) => {
  return (
    <View className="auth-field">
      <Text className="auth-label">{label}</Text>
      <TextInput
        testID={testID}
        className={`auth-input ${error ? "auth-input-error" : ""}`}
        placeholder={placeholder}
        placeholderTextColor="rgba(8, 17, 38, 0.4)"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        editable={editable}
        autoCapitalize="none"
      />
      {error && <Text className="auth-error">{error}</Text>}
    </View>
  );
};

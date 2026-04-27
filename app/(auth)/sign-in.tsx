import { AuthBrand } from "@/components/AuthBrand";
import { AuthButton } from "@/components/AuthButton";
import { AuthField } from "@/components/AuthField";
import {
  parseClerkError,
  validateEmail,
  type ValidationErrors,
} from "@/libs/validation";
import { useSignIn } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type SignInStep = "form" | "mfa";

export default function SignInScreen() {
  const { signIn, setActive } = useSignIn();
  const router = useRouter();

  // Form state
  const [step, setStep] = useState<SignInStep>("form");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");

  // UI state
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifyingMfa, setVerifyingMfa] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    setGeneralError("");

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const result = await signIn.create({
        identifier: email.trim(),
        password,
        strategy: "password",
      });

      if (result.status === "complete") {
        // Sign in is complete, set the active session
        await setActive({
          session: result.createdSessionId,
          organization: undefined,
        });
        router.replace("/(tabs)");
      } else if (result.status === "needs_second_factor") {
        // MFA is required
        const emailCodeFactor = result.supportedSecondFactors.find(
          (factor) => factor.strategy === "email_code",
        );

        if (emailCodeFactor) {
          // Send MFA code
          await signIn.mfa.sendEmailCode();
          setStep("mfa");
        }
      } else if (result.status === "needs_client_trust") {
        // Handle client trust verification
        const emailCodeFactor = result.supportedSecondFactors.find(
          (factor) => factor.strategy === "email_code",
        );

        if (emailCodeFactor) {
          await signIn.mfa.sendEmailCode();
          setStep("mfa");
        }
      } else {
        setGeneralError("Sign in failed. Please try again.");
      }
    } catch (err: any) {
      const errorMessage = parseClerkError(err);
      setGeneralError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyMfa = async () => {
    if (!mfaCode.trim()) {
      setGeneralError("Please enter the verification code");
      return;
    }

    try {
      setVerifyingMfa(true);
      setGeneralError("");

      const result = await signIn.mfa.verifyEmailCode({
        code: mfaCode.trim(),
      });

      if (result.status === "complete") {
        await setActive({
          session: result.createdSessionId,
          organization: undefined,
        });
        router.replace("/(tabs)");
      } else {
        setGeneralError("Verification failed. Please try again.");
      }
    } catch (err: any) {
      const errorMessage = parseClerkError(err);
      setGeneralError(errorMessage);
    } finally {
      setVerifyingMfa(false);
    }
  };

  const handleResendMfa = async () => {
    try {
      setGeneralError("");
      await signIn.mfa.sendEmailCode();
    } catch (err: any) {
      const errorMessage = parseClerkError(err);
      setGeneralError(errorMessage);
    }
  };

  const handleGoBack = () => {
    setStep("form");
    setMfaCode("");
    setGeneralError("");
  };

  if (step === "mfa") {
    return (
      <SafeAreaView className="auth-safe-area">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="auth-content">
            <AuthBrand
              title="Verify Code"
              subtitle={`We sent a code to ${email}`}
            />

            <View className="auth-card">
              {generalError && (
                <View className="mb-4 rounded-2xl border border-destructive/20 bg-destructive/10 p-3">
                  <Text className="text-sm font-sans-medium text-destructive">
                    {generalError}
                  </Text>
                </View>
              )}

              <View className="auth-form">
                <View className="auth-field">
                  <Text className="auth-label">Verification Code</Text>
                  <TextInput
                    className="auth-input"
                    placeholder="Enter 6-digit code"
                    placeholderTextColor="rgba(8, 17, 38, 0.4)"
                    value={mfaCode}
                    onChangeText={setMfaCode}
                    keyboardType="numeric"
                    maxLength={6}
                    editable={!verifyingMfa}
                  />
                </View>
              </View>

              <AuthButton
                title={verifyingMfa ? "Verifying..." : "Verify Code"}
                onPress={handleVerifyMfa}
                loading={verifyingMfa}
                disabled={verifyingMfa || !mfaCode.trim()}
              />

              <View className="auth-link-row">
                <Text className="auth-link-copy">Didn't get a code?</Text>
                <Text
                  onPress={handleResendMfa}
                  className="auth-link"
                  disabled={verifyingMfa}
                >
                  Resend
                </Text>
              </View>

              <View className="auth-link-row">
                <Text
                  onPress={handleGoBack}
                  className="auth-link"
                  disabled={verifyingMfa}
                >
                  ← Back to form
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="auth-safe-area">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="auth-content">
          <AuthBrand
            title="Welcome Back"
            subtitle="Sign in to manage your subscriptions"
          />

          <View className="auth-card">
            {generalError && (
              <View className="mb-4 rounded-2xl border border-destructive/20 bg-destructive/10 p-3">
                <Text className="text-sm font-sans-medium text-destructive">
                  {generalError}
                </Text>
              </View>
            )}

            <View className="auth-form">
              <AuthField
                label="Email Address"
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                error={errors.email}
                keyboardType="email-address"
                editable={!loading}
              />

              <AuthField
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                error={errors.password}
                secureTextEntry
                editable={!loading}
              />
            </View>

            <View className="flex-row items-center gap-2 mb-2">
              <Text
                onPress={() => setRememberMe(!rememberMe)}
                className="text-sm font-sans-medium text-muted-foreground"
              >
                {rememberMe ? "☑" : "☐"} Remember me
              </Text>
            </View>

            <AuthButton
              title={loading ? "Signing in..." : "Sign In"}
              onPress={handleSignIn}
              loading={loading}
              disabled={loading}
            />

            <View className="auth-link-row">
              <Text className="auth-link-copy">Don't have an account?</Text>
              <Link href="/(auth)/sign-up" asChild>
                <Text className="auth-link">Create one</Text>
              </Link>
            </View>

            <Text className="text-center text-xs font-sans-medium text-muted-foreground mt-4">
              By signing in, you agree to our Terms of Service and Privacy
              Policy
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

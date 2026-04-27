import { AuthBrand } from "@/components/AuthBrand";
import { AuthButton } from "@/components/AuthButton";
import { AuthField } from "@/components/AuthField";
import {
  parseClerkError,
  validateConfirmPassword,
  validateEmail,
  validateFirstName,
  validateLastName,
  validatePassword,
  type ValidationErrors,
} from "@/libs/validation";
import { useSignUp } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type SignUpStep = "form" | "verification";

export default function SignUpScreen() {
  const { signUp, setActive } = useSignUp();
  const router = useRouter();

  // Form state
  const [step, setStep] = useState<SignUpStep>("form");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");

  // UI state
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    const firstNameError = validateFirstName(firstName);
    if (firstNameError) newErrors.firstName = firstNameError;

    const lastNameError = validateLastName(lastName);
    if (lastNameError) newErrors.lastName = lastNameError;

    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(password);
    if (passwordError) newErrors.password = passwordError;

    const confirmPasswordError = validateConfirmPassword(
      password,
      confirmPassword,
    );
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    setGeneralError("");

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Create the sign-up attempt with email and password
      const result = await signUp.create({
        emailAddress: email.trim(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

      // Check if email verification is needed
      if (result.status === "missing_requirements") {
        if (result.missingFields.includes("email_address")) {
          // Send verification email
          await signUp.prepareEmailAddressVerification({
            strategy: "email_code",
          });
          setStep("verification");
        }
      } else if (result.status === "complete") {
        // Sign up is complete, set the active session
        await setActive({
          session: result.createdSessionId,
          organization: undefined,
        });
        router.replace("/(tabs)");
      }
    } catch (err: any) {
      const errorMessage = parseClerkError(err);
      setGeneralError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!code.trim()) {
      setGeneralError("Please enter the verification code");
      return;
    }

    try {
      setVerifying(true);
      setGeneralError("");

      const result = await signUp.attemptEmailAddressVerification({
        code: code.trim(),
      });

      if (result.status === "complete") {
        await setActive({
          session: result.createdSessionId,
          organization: undefined,
        });
        router.replace("/(tabs)");
      } else {
        setGeneralError("Email verification failed. Please try again.");
      }
    } catch (err: any) {
      const errorMessage = parseClerkError(err);
      setGeneralError(errorMessage);
    } finally {
      setVerifying(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setGeneralError("");
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setGeneralError(""); // Clear on success
    } catch (err: any) {
      const errorMessage = parseClerkError(err);
      setGeneralError(errorMessage);
    }
  };

  const handleGoBack = () => {
    setStep("form");
    setCode("");
    setGeneralError("");
  };

  if (step === "verification") {
    return (
      <SafeAreaView className="auth-safe-area">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="auth-content">
            <AuthBrand
              title="Verify Email"
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
                    value={code}
                    onChangeText={setCode}
                    keyboardType="numeric"
                    maxLength={6}
                    editable={!verifying}
                  />
                </View>
              </View>

              <AuthButton
                title={verifying ? "Verifying..." : "Verify Email"}
                onPress={handleVerifyEmail}
                loading={verifying}
                disabled={verifying || !code.trim()}
              />

              <View className="auth-link-row">
                <Text className="auth-link-copy">Didn't get a code?</Text>
                <Text
                  onPress={handleResendCode}
                  className="auth-link"
                  disabled={verifying}
                >
                  Resend
                </Text>
              </View>

              <View className="auth-link-row">
                <Text
                  onPress={handleGoBack}
                  className="auth-link"
                  disabled={verifying}
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
            title="Create Account"
            subtitle="Join us to manage your subscriptions smartly"
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
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <AuthField
                    label="First Name"
                    placeholder="John"
                    value={firstName}
                    onChangeText={setFirstName}
                    error={errors.firstName}
                    editable={!loading}
                  />
                </View>
                <View className="flex-1">
                  <AuthField
                    label="Last Name"
                    placeholder="Doe"
                    value={lastName}
                    onChangeText={setLastName}
                    error={errors.lastName}
                    editable={!loading}
                  />
                </View>
              </View>

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
                placeholder="Min. 8 chars, 1 uppercase, 1 number"
                value={password}
                onChangeText={setPassword}
                error={errors.password}
                secureTextEntry
                editable={!loading}
              />

              <AuthField
                label="Confirm Password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                error={errors.confirmPassword}
                secureTextEntry
                editable={!loading}
              />
            </View>

            <AuthButton
              title={loading ? "Creating Account..." : "Create Account"}
              onPress={handleSignUp}
              loading={loading}
              disabled={loading}
            />

            <View className="auth-link-row">
              <Text className="auth-link-copy">Already have an account?</Text>
              <Link href="/(auth)/sign-in" asChild>
                <Text className="auth-link">Sign In</Text>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

# Clerk Authentication Setup Guide

This guide explains how to set up Clerk authentication for your Expo app.

## 1. Install Dependencies

```bash
npx expo install @clerk/expo expo-secure-store
```

## 2. Create a Clerk Account

1. Go to [clerk.com](https://clerk.com)
2. Sign up for a free account
3. Navigate to the [API Keys](https://dashboard.clerk.com/~/api-keys) page
4. Copy your **Publishable Key**

## 3. Configure Environment Variables

1. Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Add your Clerk Publishable Key to `.env`:
   ```
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
   ```

## 4. Enable Native API

In your Clerk Dashboard:

1. Go to the [Native Applications](https://dashboard.clerk.com/~/native-applications) page
2. Ensure the Native API is enabled (required for mobile apps)

## 5. Configure Email/Password Authentication

1. In the Clerk Dashboard, navigate to **User & Authentication → Email, Phone, Username**
2. Ensure **Email address** is enabled
3. Enable **Password** as an authentication strategy

## 6. Test the App

```bash
npx expo start
```

Then press `i` for iOS or `a` for Android.

## Features Implemented

### Sign Up Flow

- ✅ Email validation
- ✅ Password validation (8+ chars, uppercase, lowercase, number)
- ✅ First name and last name fields
- ✅ Email verification with code
- ✅ Real-time error handling
- ✅ Automatic session creation

### Sign In Flow

- ✅ Email/password authentication
- ✅ Email-based MFA support
- ✅ Two-factor authentication verification
- ✅ Client trust verification
- ✅ Remember me option
- ✅ Real-time error handling

### Security

- ✅ Secure token storage using `expo-secure-store`
- ✅ Password validation with strength requirements
- ✅ Email verification for new accounts
- ✅ MFA support for added security
- ✅ Automatic session management

### Design

- ✅ Matches existing NativeWind design system
- ✅ Consistent color scheme (accent #ea7a53, primary #081126)
- ✅ Custom form validation with inline errors
- ✅ Loading states and disabled states
- ✅ Brand-native UI with app branding

## Troubleshooting

### "Add your Clerk Publishable Key to the .env file"

- Make sure `.env` file exists in the root directory
- Verify the key is set as `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`
- Restart the development server after adding the key

### Sign up fails with "email_address already exists"

- The email is already registered
- Try signing in instead

### MFA verification code not received

- Check spam/promotions folder
- Use the "Resend" button to request a new code
- Verify email is correctly configured in Clerk Dashboard

### Session expires immediately

- Ensure `expo-secure-store` is properly configured
- Check that Clerk API keys are valid
- Try clearing the app cache and signing in again

## File Structure

```
app/
├── _layout.tsx              # Root layout with ClerkProvider
├── (auth)/
│   ├── _layout.tsx          # Auth layout with guards
│   ├── sign-in.tsx          # Sign in screen
│   └── sign-up.tsx          # Sign up screen
└── (tabs)/
    ├── _layout.tsx          # Tabs layout with auth guard
    └── index.tsx            # Main app

components/
├── AuthField.tsx            # Reusable form field
├── AuthButton.tsx           # Reusable button
└── AuthBrand.tsx            # App branding component

libs/
├── validation.ts            # Form validation utilities
└── utils.ts                 # Other utilities
```

## Next Steps

1. Customize the welcome message in `AuthBrand.tsx` if needed
2. Add more authentication methods (Google, Apple, etc.)
3. Set up user profile management
4. Implement password reset functionality
5. Add session timeout handling

For more information, visit the [Clerk Expo Documentation](https://clerk.com/docs/expo/overview).

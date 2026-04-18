import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from "react-native";
import { signupUser } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";

// Colors constant
const Colors = {
  light: {
    background: '#FFFFFF',
    surface: '#F8F9FA',
    primary: '#007AFF',
    text: '#000000',
    textSecondary: '#666666',
    border: '#E5E5E5',
    error: '#FF3B30',
    success: '#34C759',
    card: '#FFFFFF',
    inputBackground: '#F5F5F5',
    warning: '#FF9500',
  },
  dark: {
    background: '#000000',
    surface: '#1C1C1E',
    primary: '#0A84FF',
    text: '#FFFFFF',
    textSecondary: '#98989E',
    border: '#38383A',
    error: '#FF453A',
    success: '#32D74B',
    card: '#1C1C1E',
    inputBackground: '#2C2C2E',
    warning: '#FF9F0A',
  },
};

const { height } = Dimensions.get('window');

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await signupUser(email, password);
      // Navigate directly to home without alert
      router.replace("/home");
    } catch (err: any) {
      Alert.alert("Signup Failed", err);
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (pass: string): { strength: string; color: string } => {
    if (pass.length === 0) return { strength: '', color: colors.textSecondary };
    if (pass.length < 6) return { strength: 'Weak', color: colors.error };
    if (pass.length < 10) return { strength: 'Medium', color: colors.warning };
    return { strength: 'Strong', color: colors.success };
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={{ 
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingTop: 20,
            paddingBottom: 40,
          }}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Header with Back Button and Theme Toggle */}
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginTop: Platform.OS === 'android' ? 20 : 0,
          }}>
            <TouchableOpacity 
              onPress={() => router.back()}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: colors.surface,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Ionicons name="arrow-back" size={22} color={colors.text} />
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={toggleTheme}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: colors.surface,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Ionicons 
                name={isDark ? "sunny" : "moon"} 
                size={22} 
                color={colors.primary} 
              />
            </TouchableOpacity>
          </View>

          {/* Title */}
          <View style={{ marginTop: height * 0.03, marginBottom: height * 0.04 }}>
            <Text style={{ 
              fontSize: 36, 
              fontWeight: '800', 
              color: colors.text,
              marginBottom: 8,
              letterSpacing: -0.5,
            }}>
              Create account
            </Text>
            <Text style={{ 
              fontSize: 16, 
              color: colors.textSecondary,
              lineHeight: 22,
            }}>
              Sign up to start shopping
            </Text>
          </View>

          {/* Form */}
          <View style={{ gap: 20, marginBottom: 20 }}>
            
            {/* Email Input */}
            <View>
              <Text style={{ 
                fontSize: 14, 
                fontWeight: '600', 
                color: colors.text,
                marginBottom: 8,
                marginLeft: 4,
              }}>
                Email
              </Text>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.inputBackground,
                borderRadius: 16,
                paddingHorizontal: 16,
                borderWidth: 2,
                borderColor: focusedInput === 'email' ? colors.primary : 'transparent',
              }}>
                <Ionicons 
                  name="mail-outline" 
                  size={20} 
                  color={focusedInput === 'email' ? colors.primary : colors.textSecondary} 
                />
                <TextInput
                  placeholder="Enter your email"
                  placeholderTextColor={colors.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={{
                    flex: 1,
                    paddingVertical: 16,
                    paddingHorizontal: 12,
                    fontSize: 16,
                    color: colors.text,
                  }}
                />
                {email.length > 0 && (
                  <Ionicons 
                    name={/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "checkmark-circle" : "close-circle"} 
                    size={20} 
                    color={/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? colors.success : colors.error} 
                  />
                )}
              </View>
            </View>

            {/* Password Input */}
            <View>
              <Text style={{ 
                fontSize: 14, 
                fontWeight: '600', 
                color: colors.text,
                marginBottom: 8,
                marginLeft: 4,
              }}>
                Password
              </Text>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.inputBackground,
                borderRadius: 16,
                paddingHorizontal: 16,
                borderWidth: 2,
                borderColor: focusedInput === 'password' ? colors.primary : 'transparent',
              }}>
                <Ionicons 
                  name="lock-closed-outline" 
                  size={20} 
                  color={focusedInput === 'password' ? colors.primary : colors.textSecondary} 
                />
                <TextInput
                  placeholder="Create a password"
                  placeholderTextColor={colors.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                  secureTextEntry={!showPassword}
                  style={{
                    flex: 1,
                    paddingVertical: 16,
                    paddingHorizontal: 12,
                    fontSize: 16,
                    color: colors.text,
                  }}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color={colors.textSecondary} 
                  />
                </TouchableOpacity>
              </View>
              
              {/* Password Strength Indicator */}
              {password.length > 0 && (
                <View style={{ marginTop: 8, marginLeft: 4 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View style={{
                      flex: 1,
                      height: 4,
                      backgroundColor: colors.border,
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}>
                      <View style={{
                        width: password.length < 6 ? '33%' : password.length < 10 ? '66%' : '100%',
                        height: '100%',
                        backgroundColor: passwordStrength.color,
                        borderRadius: 2,
                      }} />
                    </View>
                    <Text style={{ 
                      fontSize: 12, 
                      color: passwordStrength.color,
                      fontWeight: '600',
                    }}>
                      {passwordStrength.strength}
                    </Text>
                  </View>
                  {password.length < 6 && (
                    <Text style={{ fontSize: 12, color: colors.error, marginTop: 4 }}>
                      Password must be at least 6 characters
                    </Text>
                  )}
                </View>
              )}
            </View>

            {/* Confirm Password Input */}
            <View>
              <Text style={{ 
                fontSize: 14, 
                fontWeight: '600', 
                color: colors.text,
                marginBottom: 8,
                marginLeft: 4,
              }}>
                Confirm Password
              </Text>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.inputBackground,
                borderRadius: 16,
                paddingHorizontal: 16,
                borderWidth: 2,
                borderColor: focusedInput === 'confirm' ? colors.primary : 'transparent',
              }}>
                <Ionicons 
                  name="lock-closed-outline" 
                  size={20} 
                  color={focusedInput === 'confirm' ? colors.primary : colors.textSecondary} 
                />
                <TextInput
                  placeholder="Confirm your password"
                  placeholderTextColor={colors.textSecondary}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  onFocus={() => setFocusedInput('confirm')}
                  onBlur={() => setFocusedInput(null)}
                  secureTextEntry={!showConfirmPassword}
                  style={{
                    flex: 1,
                    paddingVertical: 16,
                    paddingHorizontal: 12,
                    fontSize: 16,
                    color: colors.text,
                  }}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons 
                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color={colors.textSecondary} 
                  />
                </TouchableOpacity>
              </View>
              
              {/* Password Match Indicator */}
              {confirmPassword.length > 0 && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, marginLeft: 4 }}>
                  <Ionicons 
                    name={password === confirmPassword ? "checkmark-circle" : "close-circle"} 
                    size={16} 
                    color={password === confirmPassword ? colors.success : colors.error} 
                  />
                  <Text style={{ 
                    marginLeft: 6, 
                    fontSize: 12, 
                    color: password === confirmPassword ? colors.success : colors.error 
                  }}>
                    {password === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Sign Up Button */}
                      {/* Sign Up Button */}
            <TouchableOpacity
              onPress={handleSignup}
              disabled={loading}
              activeOpacity={0.8}
              style={{
                backgroundColor: colors.primary,
                paddingVertical: 18,
                borderRadius: 16,
                alignItems: 'center',
                marginTop: 32,
                // Keep shadow only in light mode for depth
                ...(Platform.OS === 'ios' && !isDark ? {
                  shadowColor: colors.primary,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                } : {}),
                ...(Platform.OS === 'android' && !isDark ? {
                  elevation: 5,
                } : {}),
              }}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={{ 
                  color: '#FFFFFF',        // Always white for better contrast
                  fontWeight: '700', 
                  fontSize: 16 
                }}>
                  Create Account
                </Text>
              )}
            </TouchableOpacity>

          {/* Login Link */}
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'center', 
            marginTop: 24,
          }}>
            <Text style={{ color: colors.textSecondary, fontSize: 15 }}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={{ 
                color: colors.primary, 
                fontWeight: '700',
                fontSize: 15,
              }}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
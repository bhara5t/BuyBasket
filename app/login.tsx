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
import { loginUser } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";

// Colors constant (embedded directly to avoid import issues)
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
  },
};

const { height } = Dimensions.get('window');

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      await loginUser(email, password);
      router.replace("/home");
    } catch (err: any) {
      Alert.alert("Login Failed", err);
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail("test@example.com");
    setPassword("123456");
  };

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
          {/* Theme Toggle & Logo */}
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginTop: Platform.OS === 'android' ? 20 : 0,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ 
                fontSize: 30, 
                fontWeight: '700', 
                color: colors.text,
                letterSpacing: -0.5,
              }}>
              </Text>
            </View>
            
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

          {/* Welcome Text */}
          <View style={{ marginTop: height * 0.05, marginBottom: height * 0.04 }}>
            <Text style={{ 
              fontSize: 36, 
              fontWeight: '800', 
              color: colors.text,
              marginBottom: 8,
              letterSpacing: -0.5,
            }}>
              Welcome back
            </Text>
            <Text style={{ 
              fontSize: 16, 
              color: colors.textSecondary,
              lineHeight: 22,
            }}>
              Sign in to continue shopping
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
                  placeholder="Enter your password"
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
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            style={{
              backgroundColor: colors.primary,
              paddingVertical: 18,
              borderRadius: 16,
              alignItems: 'center',
              marginTop: 12,
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            {loading ? (
              <ActivityIndicator color={isDark ? '#000' : '#FFF'} />
            ) : (
              <Text style={{ 
                color: isDark ? '#000' : '#FFF', 
                fontWeight: '700', 
                fontSize: 16 
              }}>
                Sign In
              </Text>
            )}
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'center', 
            marginTop: 24,
          }}>
            <Text style={{ color: colors.textSecondary, fontSize: 15 }}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push("/signup")}>
              <Text style={{ 
                color: colors.primary, 
                fontWeight: '700',
                fontSize: 15,
              }}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

         
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
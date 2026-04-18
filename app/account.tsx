import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import {
  Alert,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Platform,
} from "react-native";
import Constants from 'expo-constants';
import { auth } from "../firebaseConfig";
import { useTheme } from "../hooks/useTheme";

const statusBarHeight = Constants.statusBarHeight;

const Colors = {
  light: {
    background: '#FFFFFF',
    headerBg: '#FFFFFF',
    primary: '#007AFF',
    text: '#000000',
    textSecondary: '#666666',
    card: '#FFFFFF',
    border: '#E5E5E5',
    error: '#FF3B30',
    surface: '#F8F9FA',
  },
  dark: {
    background: '#000000',
    headerBg: '#1C1C1E',
    primary: '#0A84FF',
    text: '#FFFFFF',
    textSecondary: '#98989E',
    card: '#1C1C1E',
    border: '#38383A',
    error: '#FF453A',
    surface: '#1C1C1E',
  },
};

export default function Account() {
  const router = useRouter();
  const user = auth.currentUser;
  const { isDark, toggleTheme } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut(auth);
              router.replace("/login");
            } catch (error: any) {
              Alert.alert("Error", error.message);
            }
          },
        },
      ]
    );
  };

  const getInitials = (email: string) => {
    return email?.substring(0, 2).toUpperCase() || 'U';
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar 
        barStyle={isDark ? "light-content" : "dark-content"} 
        backgroundColor={colors.headerBg}
        translucent={Platform.OS === 'android'}
      />
      
      {/* Header with proper spacing and theme toggle */}
      <View style={{ 
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? statusBarHeight + 12 : 12,
        paddingBottom: 12,
        flexDirection: "row", 
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: colors.headerBg,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        elevation: 3,
      }}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={{ padding: 4 }}
        >
          <Ionicons name="arrow-back" size={26} color={colors.primary} />
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: "700", color: colors.text }}>
          Account
        </Text>
        <TouchableOpacity 
          onPress={toggleTheme}
          style={{ padding: 4 }}
        >
          <Ionicons 
            name={isDark ? "sunny" : "moon"} 
            size={24} 
            color={colors.primary} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ padding: 20 }}>
          {/* User Profile Card */}
          <View
            style={{
              backgroundColor: colors.card,
              padding: 24,
              borderRadius: 20,
              borderWidth: isDark ? 1 : 0,
              borderColor: colors.border,
              shadowColor: isDark ? '#000' : '#999',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 10,
              elevation: 3,
              alignItems: "center",
            }}
          >
            <View style={{
              width: 90,
              height: 90,
              borderRadius: 45,
              backgroundColor: colors.primary,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 16,
            }}>
              <Text style={{ fontSize: 32, fontWeight: "700", color: "#fff" }}>
                {getInitials(user?.email || 'User')}
              </Text>
            </View>
            
            <Text style={{ fontSize: 15, color: colors.textSecondary, marginBottom: 4 }}>
              Logged in as
            </Text>
            <Text style={{ fontSize: 18, fontWeight: "700", color: colors.text }}>
              {user?.email}
            </Text>
          </View>

          {/* Quick Links */}
          <View style={{ marginTop: 24 }}>
            <Text style={{ 
              fontSize: 14, 
              fontWeight: "600", 
              color: colors.textSecondary,
              marginLeft: 4,
              marginBottom: 12,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}>
              Quick Links
            </Text>
            
            {/* Home */}
            <TouchableOpacity
              onPress={() => router.push("/home")}
              style={{
                backgroundColor: colors.card,
                padding: 18,
                borderRadius: 14,
                marginBottom: 10,
                flexDirection: "row",
                alignItems: "center",
                borderWidth: isDark ? 1 : 0,
                borderColor: colors.border,
              }}
            >
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: colors.surface,
                justifyContent: "center",
                alignItems: "center",
              }}>
                <Ionicons name="home-outline" size={22} color={colors.primary} />
              </View>
              <Text style={{ marginLeft: 16, fontSize: 16, fontWeight: "500", color: colors.text, flex: 1 }}>
                Home
              </Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            {/* My Orders */}
            <TouchableOpacity
              onPress={() => router.push("/orders")}
              style={{
                backgroundColor: colors.card,
                padding: 18,
                borderRadius: 14,
                marginBottom: 10,
                flexDirection: "row",
                alignItems: "center",
                borderWidth: isDark ? 1 : 0,
                borderColor: colors.border,
              }}
            >
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: colors.surface,
                justifyContent: "center",
                alignItems: "center",
              }}>
                <Ionicons name="cube-outline" size={22} color={colors.primary} />
              </View>
              <Text style={{ marginLeft: 16, fontSize: 16, fontWeight: "500", color: colors.text, flex: 1 }}>
                My Orders
              </Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            {/* My Cart */}
            <TouchableOpacity
              onPress={() => router.push("/cart")}
              style={{
                backgroundColor: colors.card,
                padding: 18,
                borderRadius: 14,
                marginBottom: 10,
                flexDirection: "row",
                alignItems: "center",
                borderWidth: isDark ? 1 : 0,
                borderColor: colors.border,
              }}
            >
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: colors.surface,
                justifyContent: "center",
                alignItems: "center",
              }}>
                <Ionicons name="cart-outline" size={22} color={colors.primary} />
              </View>
              <Text style={{ marginLeft: 16, fontSize: 16, fontWeight: "500", color: colors.text, flex: 1 }}>
                My Cart
              </Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogout}
            style={{
              backgroundColor: colors.card,
              padding: 18,
              borderRadius: 14,
              marginTop: 24,
              marginBottom: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: colors.error,
            }}
          >
            <Ionicons name="log-out-outline" size={22} color={colors.error} />
            <Text style={{ color: colors.error, fontWeight: "600", fontSize: 16, marginLeft: 10 }}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
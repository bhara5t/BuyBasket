import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, onSnapshot, query, where, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import Constants from 'expo-constants';
import { auth, db } from "../firebaseConfig";
import { useTheme } from "../hooks/useTheme";

const statusBarHeight = Constants.statusBarHeight;

interface OrderItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  createdAt: Timestamp | Date | number;
}

const Colors = {
  light: {
    background: '#FFFFFF',
    headerBg: '#FFFFFF',
    primary: '#007AFF',
    text: '#000000',
    textSecondary: '#666666',
    card: '#FFFFFF',
    border: '#E5E5E5',
    success: '#34C759',
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
    success: '#32D74B',
    error: '#FF453A',
    surface: '#1C1C1E',
  },
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "orders"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const docData = doc.data();
        return {
          id: doc.id,
          userId: docData.userId,
          items: docData.items || [],
          total: docData.total || 0,
          createdAt: docData.createdAt || new Date(),
        } as Order;
      });
      
      setOrders(data.sort((a, b) => {
        const getTime = (timestamp: any): number => {
          if (timestamp?.seconds) return timestamp.seconds * 1000;
          if (timestamp instanceof Date) return timestamp.getTime();
          if (typeof timestamp === 'number') return timestamp;
          return 0;
        };
        return getTime(b.createdAt) - getTime(a.createdAt);
      }));
    });

    return unsubscribe;
  }, []);

  const formatDate = (timestamp: any): string => {
    if (!timestamp) return "No date";
    try {
      if (timestamp.seconds) {
        return new Date(timestamp.seconds * 1000).toLocaleString();
      }
      return new Date(timestamp).toLocaleString();
    } catch {
      return "Invalid date";
    }
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
        
        <Text style={{ fontSize: 24, fontWeight: "700", color: colors.text, marginLeft: 12 }}>
          Your Orders
        </Text>
        
        {/* Theme Toggle */}
        <TouchableOpacity
          onPress={toggleTheme}
          style={{
            marginLeft: 'auto',
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.surface,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Ionicons 
            name={isDark ? "sunny" : "moon"} 
            size={20} 
            color={colors.primary} 
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={{ alignItems: "center", marginTop: 80 }}>
            <View style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: colors.surface,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 20,
            }}>
              <Ionicons name="cube-outline" size={50} color={colors.textSecondary} />
            </View>
            <Text style={{ fontSize: 20, fontWeight: "700", color: colors.text, marginBottom: 8 }}>
              No orders yet
            </Text>
            <Text style={{ fontSize: 15, color: colors.textSecondary, textAlign: "center", marginBottom: 24 }}>
              Your order history will appear here
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/home")}
              style={{
                backgroundColor: colors.primary,
                paddingHorizontal: 28,
                paddingVertical: 14,
                borderRadius: 12,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
                Start Shopping
              </Text>
            </TouchableOpacity>
          </View>
        )}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: 16,
              padding: 16,
              marginBottom: 16,
              borderWidth: isDark ? 1 : 0,
              borderColor: colors.border,
              shadowColor: isDark ? '#000' : '#999',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 6,
              elevation: 2,
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="receipt-outline" size={16} color={colors.primary} />
                <Text style={{ fontWeight: "600", fontSize: 13, color: colors.textSecondary, marginLeft: 6 }}>
                  Order #{item.id.slice(-6).toUpperCase()}
                </Text>
              </View>
              <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                {formatDate(item.createdAt)}
              </Text>
            </View>

            {item.items?.map((product: OrderItem) => (
              <View
                key={product.id}
                style={{
                  flexDirection: "row",
                  marginTop: 12,
                  alignItems: "center",
                }}
              >
                <Image
                  source={{ uri: product.image }}
                  style={{ 
                    width: 60, 
                    height: 60, 
                    borderRadius: 10,
                    backgroundColor: colors.border,
                  }}
                  resizeMode="cover"
                />
                <View style={{ marginLeft: 14, flex: 1 }}>
                  <Text style={{ fontWeight: "600", fontSize: 15, color: colors.text }}>
                    {product.name}
                  </Text>
                  <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 2 }}>
                    Qty: {product.quantity} × ₹ {product.price?.toLocaleString()}
                  </Text>
                </View>
                <Text style={{ fontWeight: "700", fontSize: 15, color: colors.success }}>
                  ₹ {(product.price * product.quantity).toLocaleString()}
                </Text>
              </View>
            ))}

            <View
              style={{
                marginTop: 16,
                borderTopWidth: 1,
                borderColor: colors.border,
                paddingTop: 14,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ fontWeight: "600", fontSize: 16, color: colors.text }}>
                Total Amount
              </Text>
              <Text style={{ fontWeight: "800", fontSize: 18, color: colors.success }}>
                ₹ {item.total?.toLocaleString()}
              </Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
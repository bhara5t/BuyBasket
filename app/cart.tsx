import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { addDoc, collection, doc, onSnapshot, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Alert,
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
    warning: '#FF9500',
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
    warning: '#FF9F0A',
    surface: '#1C1C1E',
  },
};

export default function Cart() {
  const [items, setItems] = useState<any[]>([]);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const user = auth.currentUser;
  const { isDark, toggleTheme } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;

  useEffect(() => {
    if (!user) return;

    const cartRef = doc(db, "carts", user.uid);
    const unsubscribe = onSnapshot(cartRef, (snap) => {
      if (snap.exists()) {
        setItems(snap.data().items || []);
      } else {
        setItems([]);
      }
    });

    return unsubscribe;
  }, []);

  const increaseQty = async (id: string) => {
    if (!user) return;
    const updated = items.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    await setDoc(doc(db, "carts", user.uid), { items: updated });
  };

  const decreaseQty = async (id: string) => {
    if (!user) return;
    const updated = items
      .map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0);
    await setDoc(doc(db, "carts", user.uid), { items: updated });
  };

  const removeItem = async (id: string) => {
    if (!user) return;
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            const updated = items.filter((item) => item.id !== id);
            await setDoc(doc(db, "carts", user.uid), { items: updated });
          },
        },
      ]
    );
  };

  const clearCart = async () => {
    if (!user) return;
    Alert.alert(
      "Clear Cart",
      "Are you sure you want to remove all items?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            await setDoc(doc(db, "carts", user.uid), { items: [] });
          },
        },
      ]
    );
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleBuy = async () => {
    if (!user || items.length === 0) return;

    Alert.alert(
      "Confirm Purchase",
      `Total amount: ₹ ${total.toLocaleString()}`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              await addDoc(collection(db, "orders"), {
                userId: user.uid,
                items: items,
                total: total,
                createdAt: new Date(),
              });

              await setDoc(doc(db, "carts", user.uid), { items: [] });
              setSuccess(true);

              setTimeout(() => {
                setSuccess(false);
                router.push("/home");
              }, 2000);
            } catch (error) {
              Alert.alert("Error", "Failed to place order. Please try again.");
            }
          },
        },
      ]
    );
  };

  if (success) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
          <View style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: colors.success,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20,
          }}>
            <Ionicons name="checkmark" size={60} color="#fff" />
          </View>
          <Text style={{ fontSize: 28, fontWeight: "800", color: colors.success, marginBottom: 8 }}>
            Order Placed!
          </Text>
          <Text style={{ fontSize: 16, color: colors.textSecondary, textAlign: "center" }}>
            Thank you for your purchase.{"\n"}Taking you to home...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

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
          Your Cart
        </Text>
        
        <View style={{ marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          {items.length > 0 && (
            <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </Text>
          )}
          
          {/* Theme Toggle - same position as Home page */}
          <TouchableOpacity
            onPress={toggleTheme}
            style={{
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
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={{ alignItems: "center", marginTop: 100 }}>
            <View style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: colors.surface,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 20,
            }}>
              <Ionicons name="cart-outline" size={60} color={colors.textSecondary} />
            </View>
            <Text style={{ fontSize: 22, fontWeight: "700", color: colors.text, marginBottom: 8 }}>
              Your cart is empty
            </Text>
            <Text style={{ fontSize: 15, color: colors.textSecondary, textAlign: "center", marginBottom: 24 }}>
              Add items to get started
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/home")}
              style={{
                backgroundColor: colors.primary,
                paddingHorizontal: 32,
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
              flexDirection: "row",
              backgroundColor: colors.card,
              padding: 12,
              borderRadius: 16,
              marginBottom: 12,
              borderWidth: isDark ? 1 : 0,
              borderColor: colors.border,
              shadowColor: isDark ? '#000' : '#999',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.08,
              shadowRadius: 6,
              elevation: 2,
            }}
          >
            <Image
              source={{ uri: item.image }}
              style={{ 
                width: 90, 
                height: 90, 
                borderRadius: 12,
                backgroundColor: colors.border,
              }}
              resizeMode="cover"
            />
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={{ fontWeight: "700", fontSize: 16, color: colors.text }}>
                {item.name}
              </Text>
              <Text style={{ color: colors.success, fontSize: 16, fontWeight: "700", marginTop: 4 }}>
                ₹ {item.price?.toLocaleString()}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                <TouchableOpacity
                  onPress={() => decreaseQty(item.id)}
                  style={{
                    backgroundColor: colors.surface,
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons name="remove" size={18} color={colors.primary} />
                </TouchableOpacity>
                <Text style={{ marginHorizontal: 16, fontSize: 16, fontWeight: "700", color: colors.text }}>
                  {item.quantity}
                </Text>
                <TouchableOpacity
                  onPress={() => increaseQty(item.id)}
                  style={{
                    backgroundColor: colors.surface,
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons name="add" size={18} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ justifyContent: "space-between", alignItems: "flex-end" }}>
              <TouchableOpacity 
                onPress={() => removeItem(item.id)}
                style={{ padding: 4 }}
              >
                <Ionicons name="trash-outline" size={22} color={colors.error} />
              </TouchableOpacity>
              <Text style={{ color: colors.text, fontWeight: "700", fontSize: 15 }}>
                ₹ {(item.price * item.quantity).toLocaleString()}
              </Text>
            </View>
          </View>
        )}
      />

      {items.length > 0 && (
        <View style={{ 
          backgroundColor: colors.card,
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: "600", color: colors.text }}>
              Total
            </Text>
            <Text style={{ fontSize: 22, fontWeight: "800", color: colors.success }}>
              ₹ {total.toLocaleString()}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              onPress={clearCart}
              style={{
                flex: 1,
                backgroundColor: colors.surface,
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: "center",
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Text style={{ color: colors.textSecondary, fontWeight: "600", fontSize: 15 }}>
                Clear
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleBuy}
              style={{
                flex: 2,
                backgroundColor: colors.success,
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
                Buy Now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
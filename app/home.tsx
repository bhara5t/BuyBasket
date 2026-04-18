import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  Dimensions,
  Platform,
  BackHandler,
  ToastAndroid,
  Alert,
} from "react-native";
import { doc, onSnapshot } from "firebase/firestore";
import Constants from 'expo-constants';
import { auth, db } from "../firebaseConfig";
import { addToCart } from "../hooks/useCart";
import { getProducts } from "../hooks/useProducts";
import { useTheme } from "../hooks/useTheme";

const { width } = Dimensions.get('window');
const cardWidth = (width - 45) / 2;
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
    surface: '#F8F9FA',
    inputBackground: '#F5F5F5',
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
    inputBackground: '#2C2C2E',
  },
};

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [backPressedOnce, setBackPressedOnce] = useState(false);
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;

  // --- Back Handler (Exit confirmation) ---
  useEffect(() => {
    const backAction = () => {
      // If we're not on the home screen (somehow), let default handle it
      // But we are on home, so we handle it.
      if (backPressedOnce) {
        BackHandler.exitApp();
        return true;
      }
      setBackPressedOnce(true);
      
      if (Platform.OS === 'android') {
        ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
      } else {
        Alert.alert('Exit App', 'Press back again to exit');
      }
      
      // Reset the flag after 2 seconds
      setTimeout(() => setBackPressedOnce(false), 2000);
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [backPressedOnce]);
  // ----------------------------------------

  useEffect(() => {
    loadProducts();
    
    const user = auth.currentUser;
    if (!user) return;

    const cartRef = doc(db, "carts", user.uid);
    const unsubscribe = onSnapshot(cartRef, (snap) => {
      if (snap.exists()) {
        const items = snap.data().items || [];
        const total = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
        setCartCount(total);
      } else {
        setCartCount(0);
      }
    });

    return unsubscribe;
  }, []);

  const loadProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  const filteredProducts = products.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddToCart = async (product: any) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please login first");
      router.push("/login");
      return;
    }
    await addToCart(user.uid, product);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar 
        barStyle={isDark ? "light-content" : "dark-content"} 
        backgroundColor={colors.headerBg}
        translucent={Platform.OS === 'android'}
      />
      
      {/* Header */}
      <View style={{ 
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? statusBarHeight + 12 : 12,
        paddingBottom: 12,
        flexDirection: "row", 
        justifyContent: "space-between", 
        alignItems: "center",
        backgroundColor: colors.headerBg,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        elevation: 3,
      }}>
        <Text style={{ 
          fontSize: 28, 
          fontWeight: '800', 
          color: colors.text,
          letterSpacing: -0.5,
        }}>
          BuyBasket
        </Text>
        
        <View style={{ flexDirection: "row", gap: 20, alignItems: 'center' }}>
          <TouchableOpacity onPress={() => router.push("/cart")} style={{ position: "relative" }}>
            <Ionicons name="cart-outline" size={26} color={colors.primary} />
            {cartCount > 0 && (
              <View style={{
                position: "absolute",
                right: -8,
                top: -8,
                backgroundColor: colors.error,
                borderRadius: 10,
                minWidth: 20,
                height: 20,
                justifyContent: "center",
                alignItems: "center"
              }}>
                <Text style={{ color: "#fff", fontSize: 12, fontWeight: "bold" }}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => router.push("/orders")}>
            <Ionicons name="cube-outline" size={26} color={colors.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => router.push("/account")}>
            <Ionicons name="person-outline" size={26} color={colors.primary} />
          </TouchableOpacity>
          
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
              marginLeft: 4,
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

      {/* Search Bar */}
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.inputBackground,
          borderRadius: 16,
          paddingHorizontal: 16,
          paddingVertical: Platform.OS === 'ios' ? 4 : 2,
          borderWidth: 1.5,
          borderColor: search ? colors.primary : colors.border,
          shadowColor: isDark ? '#000' : '#999',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2,
        }}>
          <Ionicons name="search-outline" size={20} color={search ? colors.primary : colors.textSecondary} />
          <TextInput
            placeholder="Search products..."
            placeholderTextColor={colors.textSecondary}
            value={search}
            onChangeText={setSearch}
            style={{
              flex: 1,
              paddingVertical: 14,
              paddingHorizontal: 12,
              fontSize: 16,
              color: colors.text,
            }}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Product Grid */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 20 }}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={() => (
          <View style={{ alignItems: "center", marginTop: 50 }}>
            <Ionicons name="cube-outline" size={60} color={colors.textSecondary} />
            <Text style={{ fontSize: 16, color: colors.textSecondary, marginTop: 12 }}>
              No products available
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: colors.card,
              width: "48%",
              borderRadius: 15,
              padding: 10,
              marginBottom: 15,
              shadowColor: isDark ? '#000' : '#999',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 6,
              elevation: 3,
              borderWidth: isDark ? 1 : 0,
              borderColor: colors.border,
            }}
          >
            <Image
              source={{ uri: item.image }}
              style={{ 
                width: "100%", 
                height: 120, 
                borderRadius: 10,
                backgroundColor: colors.border,
              }}
              resizeMode="cover"
            />
            <Text style={{ 
              fontWeight: "bold", 
              marginTop: 8, 
              fontSize: 14,
              color: colors.text,
            }}>
              {item.name}
            </Text>
            <Text style={{ 
              color: colors.success, 
              fontSize: 16, 
              fontWeight: "bold",
              marginTop: 4,
            }}>
              ₹ {item.price?.toLocaleString()}
            </Text>
            <Text numberOfLines={2} style={{ 
              fontSize: 12, 
              color: colors.textSecondary,
              marginTop: 4,
              lineHeight: 16,
            }}>
              {item.description}
            </Text>
            <TouchableOpacity
              onPress={() => handleAddToCart(item)}
              style={{
                backgroundColor: colors.primary,
                padding: 10,
                borderRadius: 8,
                marginTop: 10,
                alignItems: "center",
              }}
              activeOpacity={0.8}
            >
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 14 }}>
                Add to Cart
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
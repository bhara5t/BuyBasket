import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export const addToCart = async (userId: string, product: any) => {
  try {
    const cartRef = doc(db, "carts", userId);
    const snap = await getDoc(cartRef);
    
    let items: any[] = [];
    if (snap.exists()) {
      items = snap.data().items || [];
    }
    
    const existing = items.find((item) => item.id === product.id);
    
    if (existing) {
      items = items.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
    }
    
    await setDoc(cartRef, { items });
    console.log("Added to cart ✅");
  } catch (error) {
    console.log("Cart error:", error);
  }
};

export const getCartItems = async (userId: string) => {
  try {
    const cartRef = doc(db, "carts", userId);
    const snap = await getDoc(cartRef);
    
    if (snap.exists()) {
      return snap.data().items || [];
    }
    return [];
  } catch (error) {
    console.log("Error getting cart:", error);
    return [];
  }
};
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

export const getProducts = async () => {
  try {
    const snapshot = await getDocs(collection(db, "products"));
    
    let products: any[] = [];
    snapshot.forEach(doc => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return products;
  } catch (error) {
    console.log("Error fetching products:", error);
    return [];
  }
};
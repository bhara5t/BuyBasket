const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc, getDocs, query, where } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_AUTH_DOMAIN_HERE",
  projectId: "YOUR_PROJECT_ID_HERE",
  storageBucket: "YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID_HERE",
  appId: "YOUR_APP_ID_HERE"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const products = [
  {
    name: "iPhone 15 Pro",
    price: 129900,
    description: "Latest iPhone with A17 Pro chip and titanium design",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500"
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    price: 129999,
    description: "200MP camera with AI features and S Pen",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500"
  },
  {
    name: "MacBook Air M2",
    price: 114900,
    description: "Thin and light laptop with M2 chip, 18hr battery",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500"
  },
  {
    name: "Sony WH-1000XM5",
    price: 29990,
    description: "Industry leading noise cancellation headphones",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500"
  },
  {
    name: "iPad Pro 12.9",
    price: 112900,
    description: "M2 chip, mini-LED display, Apple Pencil support",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500"
  },
  {
    name: "Apple Watch Ultra 2",
    price: 89900,
    description: "49mm titanium case, 100m water resistance",
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500"
  },
  {
    name: "Nintendo Switch OLED",
    price: 34990,
    description: "7-inch OLED screen, enhanced audio, 64GB storage",
    image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=500"
  },
  {
    name: "DJI Mini 4 Pro",
    price: 75900,
    description: "4K HDR video, omnidirectional obstacle sensing",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500"
  }
];

// NEW PRODUCTS TO ADD - Just add them here and run script again
const newProducts = [
  // Example of adding new products - uncomment to add
  // {
  //   name: "PlayStation 5",
  //   price: 54990,
  //   description: "Next-gen gaming console with 4K graphics",
  //   image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500"
  // },
  // {
  //   name: "Xbox Series X",
  //   price: 49990,
  //   description: "Most powerful Xbox with 12 teraflops GPU",
  //   image: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=500"
  // }
];

async function getExistingProducts() {
  const productsRef = collection(db, "products");
  const snapshot = await getDocs(productsRef);
  const existingProducts = [];
  
  snapshot.forEach(doc => {
    existingProducts.push({
      id: doc.id,
      ...doc.data()
    });
  });
  
  return existingProducts;
}

async function addProducts() {
  console.log("🔍 Checking existing products...\n");
  
  // Get all existing products
  const existingProducts = await getExistingProducts();
  console.log(`📦 Found ${existingProducts.length} existing products\n`);
  
  // Combine base products and new products
  const allProductsToAdd = [...products, ...newProducts];
  
  let added = 0;
  let skipped = 0;
  
  console.log("🚀 Starting to add products...\n");
  
  for (let i = 0; i < allProductsToAdd.length; i++) {
    const product = allProductsToAdd[i];
    
    // Check if product already exists (by name)
    const exists = existingProducts.some(
      existing => existing.name.toLowerCase() === product.name.toLowerCase()
    );
    
    if (exists) {
      console.log(`⏭️  Skipped (already exists): ${product.name}`);
      skipped++;
      continue;
    }
    
    try {
      const docRef = await addDoc(collection(db, "products"), {
        ...product,
        createdAt: new Date(), // Add timestamp for ordering
      });
      
      console.log(`✅ Added: ${product.name}`);
      added++;
      
      // Add to existing products array to prevent duplicates in same run
      existingProducts.push({
        id: docRef.id,
        ...product
      });
      
    } catch (error) {
      console.error(`❌ Error adding ${product.name}:`, error.message);
    }
  }
  
  console.log("\n" + "=".repeat(50));
  console.log("📊 SUMMARY:");
  console.log(`✅ Added: ${added} products`);
  console.log(`⏭️  Skipped: ${skipped} products`);
  console.log(`📦 Total in database: ${existingProducts.length}`);
  console.log("=".repeat(50));
  console.log("\n✨ Script completed!");
  
  process.exit(0);
}

// Run the script
addProducts().catch(error => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
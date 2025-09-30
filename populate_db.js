const https = require('https');
const mongodb = require('mongodb');

// MongoDB connection string
const MONGODB_URI = 'mongodb+srv://riiihaaaan_db_user:qQRULxx8xNlhFfhE@cluster0bonty.ozwymmd.mongodb.net/swiggy-clone?retryWrites=true&w=majority';
const DB_NAME = 'swiggy-clone';

// Sample Indian restaurant data with various cuisines
const indianRestaurants = [
  {
    id: 1,
    name: "Domino's Pizza",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=250&fit=crop",
    rating: 4.2,
    deliveryTime: "25-30 mins",
    price: "₹200 for two",
    cuisines: ["Pizza", "Italian"],
    description: "World's favorite pizza delivery restaurant"
  },
  {
    id: 2,
    name: "Burger King",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=250&fit=crop",
    rating: 4.1,
    deliveryTime: "20-25 mins",
    price: "₹250 for two",
    cuisines: ["Burger", "American"],
    description: "Home of the Whopper"
  },
  {
    id: 3,
    name: "Pizza Hut",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=250&fit=crop",
    rating: 4.3,
    deliveryTime: "30-35 mins",
    price: "₹300 for two",
    cuisines: ["Pizza", "Italian"],
    description: "America's #1 pizza delivery"
  },
  {
    id: 4,
    name: "Starbucks",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=250&fit=crop",
    rating: 4.4,
    deliveryTime: "15-20 mins",
    price: "₹150 for two",
    cuisines: ["Desserts", "Beverages"],
    description: "Premium coffee and beverages"
  },
  {
    id: 5,
    name: "Subway",
    image: "https://images.unsplash.com/photo-1508034680118-4e4ced6bcb7d?w=400&h=250&fit=crop",
    rating: 4.0,
    deliveryTime: "20-25 mins",
    price: "₹200 for two",
    cuisines: ["Sandwich", "Healthy"],
    description: "Fresh, customizable sandwiches"
  },
  {
    id: 6,
    name: "Taco Bell",
    image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=250&fit=crop",
    rating: 4.1,
    deliveryTime: "25-30 mins",
    price: "₹200 for two",
    cuisines: ["Mexican", "Fast Food"],
    description: "Authentic Mexican cuisine"
  },
  {
    id: 7,
    name: "KFC",
    image: "https://images.unsplash.com/photo-1511689660979-10d936610ee3?w=400&h=250&fit=crop",
    rating: 4.2,
    deliveryTime: "20-25 mins",
    price: "₹250 for two",
    cuisines: ["Fried Chicken", "American"],
    description: "Finger lickin' good chicken"
  },
  {
    id: 8,
    name: "Dunkin' Donuts",
    image: "https://images.unsplash.com/photo-1551106652-a4d061gba61e?w=400&h=250&fit=crop",
    rating: 4.0,
    deliveryTime: "15-20 mins",
    price: "₹100 for two",
    cuisines: ["Desserts", "Beverages"],
    description: "Fresh donuts and coffee"
  },
  {
    id: 9,
    name: "McDonald's",
    image: "https://images.unsplash.com/photo-1551833726-02eb8c5a0923?w=400&h=250&fit=crop",
    rating: 4.1,
    deliveryTime: "20-25 mins",
    price: "₹200 for two",
    cuisines: ["Burger", "Fast Food"],
    description: "I'm lovin' it - Worldwide favorite"
  },
  {
    id: 10,
    name: "Panda Express",
    image: "https://images.unsplash.com/photo-1532635225990-1af40d3d5e7b?w=400&h=250&fit=crop",
    rating: 4.2,
    deliveryTime: "25-30 mins",
    price: "₹250 for two",
    cuisines: ["Chinese", "Asian"],
    description: "Authentic Asian cuisine"
  },
  {
    id: 11,
    name: "Chipotle Mexican Grill",
    image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=250&fit=crop",
    rating: 4.3,
    deliveryTime: "25-30 mins",
    price: "₹300 for two",
    cuisines: ["Mexican", "Healthy"],
    description: "Fresh, customizable Mexican bowls"
  },
  {
    id: 12,
    name: "Olive Garden",
    image: "https://images.unsplash.com/photo-1532634726-6628e4e4e3f0?w=400&h=250&fit=crop",
    rating: 4.1,
    deliveryTime: "30-35 mins",
    price: "₹400 for two",
    cuisines: ["Italian", "Pasta"],
    description: "Italian dining experience"
  },
  {
    id: 13,
    name: "Panera Bread",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=250&fit=crop",
    rating: 4.0,
    deliveryTime: "20-25 mins",
    price: "₹250 for two",
    cuisines: ["Sandwich", "Bakery"],
    description: "Artisanal bakery and café"
  },
  {
    id: 14,
    name: "Chick-fil-A",
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=250&fit=crop",
    rating: 4.4,
    deliveryTime: "20-25 mins",
    price: "₹200 for two",
    cuisines: ["Fried Chicken", "American"],
    description: "Delicious chicken sandwiches"
  },
  {
    id: 15,
    name: "Cold Stone Creamery",
    image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&h=250&fit=crop",
    rating: 4.5,
    deliveryTime: "15-20 mins",
    price: "₹150 for two",
    cuisines: ["Desserts", "Ice Cream"],
    description: "Customizable ice cream treats"
  }
];

// Function to populate restaurants collection
async function populateRestaurants() {
  try {
    const client = await mongodb.MongoClient.connect(MONGODB_URI);
    const db = client.db(DB_NAME);
    const restaurantsCollection = db.collection('restaurants');

    // Clear existing data
    await restaurantsCollection.deleteMany({});

    // Insert new restaurant data
    const result = await restaurantsCollection.insertMany(indianRestaurants);
    console.log(`✅ Successfully populated ${result.insertedCount} restaurants`);

    // Create indexes for better performance
    await restaurantsCollection.createIndex({ cuisines: 1 });
    await restaurantsCollection.createIndex({ rating: -1 });
    await restaurantsCollection.createIndex({ name: 1 });

    console.log('✅ Created indexes for faster queries');
    client.close();
  } catch (error) {
    console.error('❌ Error populating restaurants:', error);
  }
}

// Function to fetch additional data from public APIs
async function fetchFromPublicAPIs() {
  const client = await mongodb.MongoClient.connect(MONGODB_URI);
  const db = client.db(DB_NAME);
  const restaurantsCollection = db.collection('restaurants');

  try {
    console.log('🔄 Fetching additional food data from TheMealDB API...');

    // Fetch categories from TheMealDB
    const categoriesResponse = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
    const categoriesData = await categoriesResponse.json();

    if (categoriesData.categories) {
      const foodCategories = categoriesData.categories.slice(0, 8); // Limit to 8 categories

      // Update restaurant cuisines with real categories
      for (let i = 0; i < foodCategories.length; i++) {
        const category = foodCategories[i];
        await restaurantsCollection.updateOne(
          { id: (i % 15) + 1 }, // Cycle through our restaurants
          { $addToSet: { cuisines: category.strCategory } }
        );
      }
      console.log('✅ Updated restaurant cuisines with real data');
    }

    // Fetch some popular meals for menu items
    const mealsResponse = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
    const mealsData = await mealsResponse.json();

    if (mealsData.meals) {
      console.log('✅ Found additional food data from TheMealDB');

      // We can store this for future use (menu items, etc.)
      const mealsCollection = db.collection('meals');
      await mealsCollection.deleteMany({});
      await mealsCollection.insertMany(mealsData.meals.slice(0, 50));
      console.log('✅ Stored meal data for future menu integration');
    }

  } catch (error) {
    console.error('❌ Error fetching from public APIs:', error);
  } finally {
    client.close();
  }
}

// Main function to run data population
async function populateDatabase() {
  console.log('🚀 Starting database population...');

  console.log('📝 Step 1: Populating restaurants...');
  await populateRestaurants();

  console.log('🌐 Step 2: Enriching with public API data...');
  await fetchFromPublicAPIs();

  console.log('🎉 Database population completed successfully!');
  console.log('📊 Check your MongoDB collection - it should now have 15+ restaurants with rich data!');
}

// Run the population script
populateDatabase();

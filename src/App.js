import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import RestaurantDetail from './RestaurantDetail';
import Profile from './Profile';
import './App.css';

// Fast cached restaurant data (no API calls needed)
const INITIAL_RESTAURANTS = [
  {
    id: 1,
    name: "Domino's Pizza",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=250&fit=crop&auto=format",
    rating: 4.2,
    deliveryTime: "25-30 mins",
    price: "₹200 for two",
    cuisines: ["Pizza"],
    description: "World's favorite pizza delivery restaurant"
  },
  {
    id: 2,
    name: "Burger King",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=250&fit=crop&auto=format",
    rating: 4.1,
    deliveryTime: "20-25 mins",
    price: "₹250 for two",
    cuisines: ["Burger"],
    description: "Home of the Whopper"
  },
  {
    id: 3,
    name: "Pizza Hut",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=250&fit=crop&auto=format",
    rating: 4.3,
    deliveryTime: "30-35 mins",
    price: "₹300 for two",
    cuisines: ["Pizza"],
    description: "America's #1 pizza delivery"
  },
  {
    id: 4,
    name: "Starbucks",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&h=250&fit=crop&auto=format",
    rating: 4.4,
    deliveryTime: "15-20 mins",
    price: "₹150 for two",
    cuisines: ["Beverages"],
    description: "Premium coffee and beverages"
  },
  {
    id: 5,
    name: "McDonald's",
    image: "https://images.unsplash.com/photo-1551833726-02eb8c5a0923?w=300&h=250&fit=crop&auto=format",
    rating: 4.1,
    deliveryTime: "20-25 mins",
    price: "₹200 for two",
    cuisines: ["Burger"],
    description: "I'm lovin' it - Worldwide favorite"
  },
  {
    id: 6,
    name: "KFC",
    image: "https://images.unsplash.com/photo-1511689660979-10d936610ee3?w=300&h=250&fit=crop&auto=format",
    rating: 4.2,
    deliveryTime: "20-25 mins",
    price: "₹250 for two",
    cuisines: ["Fried Chicken"],
    description: "Finger lickin' good chicken"
  }
];

function HomePage() {
  const navigate = useNavigate();
  const [restaurants] = useState(INITIAL_RESTAURANTS);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Use useMemo for instant filtering - no re-renders
  const filteredRestaurants = useMemo(() => {
    let filtered = restaurants;

    if (activeCategory !== 'All') {
      filtered = filtered.filter(r => r.cuisines.includes(activeCategory));
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(term) ||
        r.cuisines.some(c => c.toLowerCase().includes(term))
      );
    }

    return filtered;
  }, [restaurants, activeCategory, searchTerm]);

  const categories = ['All', 'Pizza', 'Burger', 'Beverages', 'Fried Chicken'];

  return (
    <div className="swiggy-app">
      <header className="header">
        <div className="header-content">
          <h1 className="logo" onClick={() => navigate('/')}>swiggy</h1>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search for restaurants and food"
              value={searchTerm}
              onChange={({target}) => setSearchTerm(target.value)}
              className="search-input"
            />
          </div>
          <div className="header-actions">
            <div className="location">📍 Delhi</div>
            <button
              className="btn-primary"
              onClick={() => navigate('/profile')}
            >
              👤 Profile
            </button>
          </div>
        </div>
      </header>

      <section className="categories">
        <h2>What's on your mind?</h2>
        <div className="category-list">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="restaurants-section">
        <h2>Top restaurants to explore</h2>
        <div className="restaurants-grid">
          {filteredRestaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="restaurant-card"
              onClick={() => navigate(`/restaurant/${restaurant.id}`)}
            >
              <div className="restaurant-image">
                <img src={restaurant.image} alt={restaurant.name} />
                <div className="restaurant-rating">
                  <span className="rating-star">⭐</span>
                  {restaurant.rating}
                </div>
              </div>
              <div className="restaurant-info">
                <h3 className="restaurant-name">{restaurant.name}</h3>
                <div className="restaurant-meta">
                  <span>{restaurant.deliveryTime}</span>
                  <span>{restaurant.price}</span>
                </div>
                <div className="restaurant-cuisines">
                  {restaurant.cuisines.join(" • ")}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/restaurant/:id" element={<RestaurantDetail />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;

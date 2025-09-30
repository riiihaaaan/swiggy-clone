import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import RestaurantDetail from './RestaurantDetail';
import Profile from './Profile';
import './App.css';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  in: {
    opacity: 1,
    y: 0
  },
  out: {
    opacity: 0,
    y: -20
  }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5
};

function HomePage() {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', 'Pizza', 'Burger', 'Chinese', 'Italian', 'Desserts'];

  useEffect(() => {
    // Fetch restaurants from MongoDB API
    fetch('http://localhost:3001/api/restaurants')
      .then(response => response.json())
      .then(data => {
        setRestaurants(data);
        setFilteredRestaurants(data);
      })
      .catch(error => {
        console.error('Error fetching restaurants:', error);
        // Fallback to mock data if API fails
        const mockRestaurants = [];
        setRestaurants(mockRestaurants);
        setFilteredRestaurants(mockRestaurants);
      });
  }, []);

  useEffect(() => {
    let filtered = restaurants;

    // Filter by category
    if (activeCategory !== 'All') {
      filtered = filtered.filter(restaurant =>
        restaurant.cuisines.includes(activeCategory)
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.cuisines.some(cuisine =>
          cuisine.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    setFilteredRestaurants(filtered);
  }, [activeCategory, searchTerm, restaurants]);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const handleRestaurantClick = (restaurantId) => {
    navigate(`/restaurant/${restaurantId}`);
  };

  return (
    <motion.div
      className="swiggy-app"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="logo" onClick={() => navigate('/')}>swiggy</h1>
          <div className="search-bar">
            <motion.input
              type="text"
              placeholder="Search for restaurants and food"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            />
          </div>
          <div className="header-actions">
            <div className="location">Location: Delhi</div>
            <motion.button
              className="profile-btn"
              onClick={() => navigate('/profile')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              👤 Profile
            </motion.button>
          </div>
        </div>
      </header>

      {/* Categories */}
      <section className="categories">
        <h2>What are you in the mood for?</h2>
        <div className="category-list">
          {categories.map((category, index) => (
            <motion.button
              key={category}
              className={`category-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </section>

      {/* Restaurants Grid */}
      <section className="restaurants-section">
        <h2>Top restaurants in your area</h2>
        <motion.div
          className="restaurants-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {filteredRestaurants.map((restaurant, index) => (
            <motion.div
              key={restaurant.id}
              className="restaurant-card"
              onClick={() => handleRestaurantClick(restaurant.id)}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 15px 35px rgba(102, 126, 234, 0.4)"
              }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
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
                  <span className="delivery-time">{restaurant.deliveryTime}</span>
                  <span className="price">{restaurant.price}</span>
                </div>
                <div className="restaurant-cuisines">
                  {restaurant.cuisines.join(", ")}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </motion.div>
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

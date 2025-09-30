import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import RestaurantDetail from './RestaurantDetail';
import Profile from './Profile';
import './App.css';

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
    <div className="swiggy-app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="logo" onClick={() => navigate('/')}>swiggy</h1>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search for restaurants and food"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="header-actions">
            <div className="location">Location: Delhi</div>
            <button
              className="profile-btn"
              onClick={() => navigate('/profile')}
            >
              👤 Profile
            </button>
          </div>
        </div>
      </header>

      {/* Categories */}
      <section className="categories">
        <h2>What are you in the mood for?</h2>
        <div className="category-list">
          {categories.map((category, index) => (
            <button
              key={category}
              className={`category-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Restaurants Grid */}
      <section className="restaurants-section">
        <h2>Top restaurants in your area</h2>
        <div className="restaurants-grid">
          {filteredRestaurants.map((restaurant, index) => (
            <div
              key={restaurant.id}
              className="restaurant-card"
              onClick={() => handleRestaurantClick(restaurant.id)}
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

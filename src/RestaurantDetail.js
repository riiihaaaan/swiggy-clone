import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './App.css';

function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/api/restaurants/${id}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setRestaurant(data);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching restaurant:', error);
        setError('Restaurant not found');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <motion.div
        className="restaurant-detail"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="container">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 18
            }}
          >
            🔄
          </motion.div>
        </div>
      </motion.div>
    );
  }

  if (error || !restaurant) {
    return (
      <motion.div
        className="restaurant-detail"
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="container">
          <p>{error || 'Restaurant not found'}</p>
          <motion.button
            onClick={() => navigate('/')}
            className="back-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Back to Home
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="restaurant-detail"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="detail-header"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <div className="detail-image">
          <img src={restaurant.image} alt={restaurant.name} />
          <motion.button
            onClick={() => navigate('/')}
            className="back-btn"
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
          >
            ← Back
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        className="detail-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <motion.div
          className="detail-main"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <h1>{restaurant.name}</h1>
          <div className="detail-meta">
            <div className="rating">⭐ {restaurant.rating}</div>
            <div className="delivery-time">{restaurant.deliveryTime}</div>
            <div className="price">{restaurant.price}</div>
          </div>
          <div className="cuisines">
            {restaurant.cuisines.join(" • ")}
          </div>
          <p className="description">{restaurant.description}</p>
        </motion.div>

        <motion.div
          className="detail-sidebar"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <motion.div
            className="menu-preview"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3>Popular Items</h3>
            <motion.div
              className="menu-item"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0, duration: 0.4 }}
            >
              <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=100&h=100&fit=crop" alt="Main Course" />
              <div className="item-info">
                <h4>Signature Dish</h4>
                <p>{restaurant.cuisines[0]} specialty</p>
                <span className="item-price">₹250</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default RestaurantDetail;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './App.css';

function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  const handleEdit = () => {
    setEditing(true);
    setEditForm({ ...userData });
  };

  const handleCancel = () => {
    setEditing(false);
    setEditForm({});
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        setUserData(editForm);
        setEditing(false);
        setEditForm({});
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  const handleInputChange = (field, value) => {
    setEditForm({ ...editForm, [field]: value });
  };

  const handleAddressChange = (index, field, value) => {
    const updatedAddresses = [...editForm.addresses];
    updatedAddresses[index] = { ...updatedAddresses[index], [field]: value };
    setEditForm({ ...editForm, addresses: updatedAddresses });
  };

  const addNewAddress = () => {
    const newAddress = { id: Date.now(), type: 'Home', address: '' };
    setEditForm({
      ...editForm,
      addresses: [...editForm.addresses, newAddress]
    });
  };

  const removeAddress = (index) => {
    const updatedAddresses = editForm.addresses.filter((_, i) => i !== index);
    setEditForm({ ...editForm, addresses: updatedAddresses });
  };

  useEffect(() => {
    // Fetch user data
    fetch('http://localhost:3001/api/users')
      .then(response => response.json())
      .then(data => {
        setUserData(data);
      })
      .catch(error => console.error('Error fetching user:', error));

    // Fetch orders
    fetch('http://localhost:3001/api/orders')
      .then(response => response.json())
      .then(data => {
        setOrders(data);
      })
      .catch(error => console.error('Error fetching orders:', error));

    // For now, use static favorites
    setFavorites([
      { id: 1, name: "Pizza Hut", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&h=100&fit=crop" },
      { id: 3, name: "Burger King", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop" },
      { id: 15, name: "Starbucks", image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=100&h=100&fit=crop" }
    ]);

    setLoading(false);
  }, []);

  if (loading || !userData) {
    return (
      <motion.div
        className="profile-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="container">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            style={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              margin: "0 auto"
            }}
          />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="profile-page"
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="profile-header"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="profile-header-content">
          <motion.button
            onClick={() => navigate('/')}
            className="back-btn"
            whileHover={{ scale: 1.1, rotate: -10 }}
            whileTap={{ scale: 0.9 }}
          >
            ← Back
          </motion.button>
          <div className="profile-user">
            <motion.div
              className="profile-avatar"
              whileHover={{ scale: 1.1 }}
            >
              <span>{userData.name.charAt(0)}</span>
            </motion.div>
            <div className="profile-info">
              <h1>{userData.name}</h1>
              <p>{userData.email}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="profile-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div className="profile-tabs">
          {['profile', 'orders', 'favorites'].map((tab, index) => (
            <motion.button
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </motion.button>
          ))}
        </div>

        <motion.div
          className="tab-content"
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          {activeTab === 'profile' && (
            <div className="profile-info-tab">
              <motion.div
                className="profile-header-actions"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <h2>Personal Information</h2>
                {!editing ? (
                  <motion.button
                    className="edit-btn"
                    onClick={handleEdit}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ✏️ Edit Profile
                  </motion.button>
                ) : (
                  <motion.div
                    className="edit-actions"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.button
                      className="cancel-btn"
                      onClick={handleCancel}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      className="save-btn"
                      onClick={handleSave}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      ✅ Save Changes
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>

              {editing ? (
                <motion.div
                  className="edit-form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                >
                  <div className="info-grid">
                    {['name', 'email', 'phone'].map((field) => (
                      <motion.div
                        key={field}
                        className="info-item"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                        <motion.input
                          type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                          value={editForm[field] || ''}
                          onChange={(e) => handleInputChange(field, e.target.value)}
                          placeholder={`Enter your ${field}`}
                          whileFocus={{ scale: 1.02 }}
                        />
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    className="addresses-section"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    <div className="addresses-header">
                      <h2>Saved Addresses</h2>
                      <motion.button
                        className="add-address-btn"
                        onClick={addNewAddress}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        + Add Address
                      </motion.button>
                    </div>
                    <div className="addresses-list">
                      {editForm.addresses?.map((address, index) => (
                        <motion.div
                          key={address.id}
                          className="address-card edit-mode"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1, duration: 0.3 }}
                        >
                          <div className="address-inputs">
                            <select
                              value={address.type}
                              onChange={(e) => handleAddressChange(index, 'type', e.target.value)}
                            >
                              <option value="Home">Home</option>
                              <option value="Office">Office</option>
                              <option value="Other">Other</option>
                            </select>
                            <input
                              type="text"
                              value={address.address}
                              onChange={(e) => handleAddressChange(index, 'address', e.target.value)}
                              placeholder="Enter address"
                            />
                          </div>
                          {editForm.addresses.length > 1 && (
                            <motion.button
                              className="remove-address-btn"
                              onClick={() => removeAddress(index)}
                              whileHover={{ scale: 1.1, rotate: 10 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              🗑️
                            </motion.button>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  className="view-mode"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <div className="info-grid">
                    {['name', 'email', 'phone'].map((field) => (
                      <motion.div
                        key={field}
                        className="info-item"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                        <span>{userData[field]}</span>
                      </motion.div>
                    ))}
                  </div>

                  <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                  >
                    Saved Addresses
                  </motion.h2>
                  <motion.div
                    className="addresses-list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    {userData.addresses.map((address, index) => (
                      <motion.div
                        key={address.id}
                        className="address-card"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <h3>{address.type}</h3>
                        <p>{address.address}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <motion.div
              className="orders-tab"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2>Order History</h2>
              <motion.div
                className="orders-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                {orders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    className="order-card"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="order-header">
                      <div className="order-info">
                        <h3>{order.restaurant}</h3>
                        <p className="order-id">{order.id}</p>
                      </div>
                      <div className="order-meta">
                        <span className={`status ${order.status.toLowerCase()}`}>{order.status}</span>
                        <span className="order-date">{order.date}</span>
                      </div>
                    </div>
                    <div className="order-items">
                      <p>{order.items.join(", ")}</p>
                      <strong>{order.total}</strong>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'favorites' && (
            <motion.div
              className="favorites-tab"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2>Favorite Restaurants</h2>
              <motion.div
                className="favorites-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                {favorites.map((fav, index) => (
                  <motion.div
                    key={fav.id}
                    className="favorite-card"
                    onClick={() => navigate(`/restaurant/${fav.id}`)}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img src={fav.image} alt={fav.name} />
                    <h3>{fav.name}</h3>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default Profile;

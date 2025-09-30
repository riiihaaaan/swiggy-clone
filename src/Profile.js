import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

// Fast cached data - no API calls needed
const INITIAL_USER_DATA = {
  name: "Rihan Shaikh",
  email: "riiihaaaan@gmail.com",
  phone: "+91 98765 43210",
  avatar: null,
  addresses: [
    { id: 1, type: "Home", address: "Latur, Maharashtra, India" },
    { id: 2, type: "Office", address: "P-14, Rajiv Gandhi Infotech Park, MIDC Phase – 1, Hinjawadi, Pune" }
  ],
  favorites: [1, 3, 4]
};

const INITIAL_ORDERS = [
  {
    id: "#ORD001",
    restaurant: "Pizza Hut",
    items: ["Margherita Pizza", "Garlic Bread"],
    date: "2025-09-28",
    total: "₹550",
    status: "Delivered"
  },
  {
    id: "#ORD002",
    restaurant: "Burger King",
    items: ["Whopper", "Fries"],
    date: "2025-09-25",
    total: "₹350",
    status: "Delivered"
  },
  {
    id: "#ORD003",
    restaurant: "Starbucks",
    items: ["Frappuccino", "Sandwich"],
    date: "2025-09-22",
    total: "₹320",
    status: "Delivered"
  }
];

const INITIAL_FAVORITES = [
  {
    id: 1,
    name: "Domino's Pizza",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=100&h=100&fit=crop&auto=format"
  },
  {
    id: 3,
    name: "Pizza Hut",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&h=100&fit=crop&auto=format"
  },
  {
    id: 4,
    name: "Starbucks",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=100&h=100&fit=crop&auto=format"
  }
];

function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState(INITIAL_USER_DATA); // Instant load
  const [orders] = useState(INITIAL_ORDERS); // No state changes needed
  const [favorites] = useState(INITIAL_FAVORITES); // No state changes needed
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

  // No loading state needed - instant render with cached data

  return (
    <div style={{ background: "linear-gradient(135deg, rgba(255, 247, 255, 0.95), rgba(254, 229, 236, 0.95))", minHeight: "100vh", color: "#424242" }}>
      <div style={{ background: "rgba(255, 255, 255, 0.9)", padding: "30px 0", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", gap: "30px" }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: "linear-gradient(135deg, #e8b5ce, #d6a9e8)",
              color: "#4a148c",
              border: "2px solid #e8b5ce",
              borderRadius: "50%",
              width: 50,
              height: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
            onMouseOver={(e) => e.target.style.transform = "scale(1.1) rotate(-10deg)"}
            onMouseOut={(e) => e.target.style.transform = "scale(1)"}
          >
            ←
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{
              width: 80,
              height: 80,
              background: "linear-gradient(135deg, #e8b5ce, #d6a9e8)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: "bold",
              color: "#4a148c"
            }}>
              {userData.name.charAt(0)}
            </div>
            <div>
              <h1 style={{ fontSize: "32px", marginBottom: "5px", color: "#7b1fa2" }}>{userData.name}</h1>
              <p style={{ fontSize: "16px", color: "#666" }}>{userData.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ display: "flex", gap: "40px", marginBottom: "30px", paddingBottom: "20px", borderBottom: "2px solid rgba(219, 193, 235, 0.3)" }}>
          {['profile', 'orders', 'favorites'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "15px 0",
                border: "none",
                background: "none",
                color: activeTab === tab ? "#7b1fa2" : "rgba(66, 66, 66, 0.7)",
                fontSize: 18,
                fontWeight: 500,
                cursor: "pointer",
                borderBottom: `3px solid ${activeTab === tab ? "#e8b5ce" : "transparent"}`,
                transition: "all 0.3s ease"
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div>
          {activeTab === 'profile' && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                <h2 style={{ color: "#7b1fa2", fontSize: "28px", margin: 0 }}>Personal Information</h2>
                {!editing ? (
                  <button
                    onClick={handleEdit}
                    style={{
                      background: "linear-gradient(135deg, #e8b5ce, #d6a9e8)",
                      color: "#4a148c",
                      border: "none",
                      padding: "12px 24px",
                      borderRadius: "25px",
                      fontSize: 16,
                      fontWeight: 600,
                      cursor: "pointer",
                      boxShadow: "0 4px 15px rgba(214, 169, 232, 0.3)"
                    }}
                  >
                    ✏️ Edit Profile
                  </button>
                ) : (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={handleCancel}
                      style={{
                        background: "rgba(108, 117, 125, 0.2)",
                        color: "#424242",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "25px",
                        fontSize: 16,
                        cursor: "pointer"
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      style={{
                        background: "linear-gradient(135deg, #00ff7f, #00bfff)",
                        color: "white",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "25px",
                        fontSize: 16,
                        cursor: "pointer",
                        fontWeight: 600
                      }}
                    >
                      ✅ Save Changes
                    </button>
                  </div>
                )}
              </div>

              {editing ? (
                <div style={{ marginTop: "30px" }}>
                  <div style={{ display: "grid", gap: "20px", marginBottom: "30px" }}>
                    {['name', 'email', 'phone'].map((field) => (
                      <div key={field} style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                        <label style={{ fontWeight: 600, color: "rgba(66, 66, 66, 0.9)", fontSize: 14, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          {field.charAt(0).toUpperCase() + field.slice(1)}
                        </label>
                        <input
                          type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                          value={editForm[field] || ''}
                          onChange={(e) => handleInputChange(field, e.target.value)}
                          placeholder={`Enter your ${field}`}
                          style={{
                            width: "100%",
                            padding: "10px 15px",
                            border: "2px solid #e1bee7",
                            borderRadius: "25px",
                            fontSize: 16,
                            background: "rgba(255, 255, 255, 0.9)",
                            color: "#424242",
                            outline: "none",
                            transition: "all 0.3s ease"
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: "40px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                      <h2 style={{ color: "#7b1fa2", fontSize: "24px", margin: 0 }}>Saved Addresses</h2>
                      <button
                        onClick={addNewAddress}
                        style={{
                          background: "linear-gradient(135deg, #e8b5ce, #d6a9e8)",
                          color: "#4a148c",
                          border: "none",
                          padding: "10px 20px",
                          borderRadius: "25px",
                          cursor: "pointer",
                          fontWeight: 600
                        }}
                      >
                        + Add Address
                      </button>
                    </div>
                    <div style={{ display: "grid", gap: "15px" }}>
                      {editForm.addresses?.map((address, index) => (
                        <div key={address.id} style={{
                          background: "rgba(255, 255, 255, 0.9)",
                          border: "2px solid #e1bee7",
                          borderRadius: "15px",
                          padding: "20px"
                        }}>
                          <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                            <select
                              value={address.type}
                              onChange={(e) => handleAddressChange(index, 'type', e.target.value)}
                              style={{
                                flex: 1,
                                padding: "8px 12px",
                                border: "2px solid #e1bee7",
                                borderRadius: "15px",
                                background: "rgba(255, 255, 255, 0.9)",
                                color: "#424242",
                                fontSize: 14
                              }}
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
                              style={{
                                flex: 1,
                                padding: "8px 12px",
                                border: "2px solid #e1bee7",
                                borderRadius: "15px",
                                background: "rgba(255, 255, 255, 0.9)",
                                color: "#424242",
                                fontSize: 14
                              }}
                            />
                          </div>
                          {editForm.addresses.length > 1 && (
                            <button
                              onClick={() => removeAddress(index)}
                              style={{
                                background: "rgba(220, 53, 69, 0.2)",
                                color: "#c62828",
                                border: "none",
                                borderRadius: "50%",
                                width: "30px",
                                height: "30px",
                                cursor: "pointer",
                                fontSize: "16px"
                              }}
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ marginTop: "30px" }}>
                  <div style={{ display: "grid", gap: "20px", marginBottom: "40px" }}>
                    {['name', 'email', 'phone'].map((field) => (
                      <div key={field} style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                        <label style={{ fontWeight: 600, color: "rgba(66, 66, 66, 0.9)", fontSize: 14, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          {field.charAt(0).toUpperCase() + field.slice(1)}
                        </label>
                        <span style={{ fontSize: 16, color: "#424242" }}>{userData[field]}</span>
                      </div>
                    ))}
                  </div>

                  <h2 style={{ color: "#7b1fa2", fontSize: "24px", marginBottom: "20px" }}>Saved Addresses</h2>
                  <div style={{ display: "grid", gap: "15px" }}>
                    {userData.addresses.map((address) => (
                      <div key={address.id} style={{
                        background: "rgba(255, 255, 255, 0.9)",
                        border: "2px solid #e1bee7",
                        borderRadius: "15px",
                        padding: "20px",
                        transition: "all 0.3s ease"
                      }}
                      onMouseOver={(e) => e.target.style.borderColor = "#ba68c8"}
                      onMouseOut={(e) => e.target.style.borderColor = "#e1bee7"}
                      >
                        <h3 style={{ color: "#7b1fa2", marginBottom: "8px", fontSize: 18 }}>{address.type}</h3>
                        <p style={{ color: "rgba(66, 66, 66, 0.8)", lineHeight: 1.5 }}>{address.address}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div style={{ color: "#424242" }}>
              <h2 style={{ color: "#7b1fa2", fontSize: "28px", marginBottom: "30px" }}>Order History</h2>
              <div style={{ display: "grid", gap: "20px" }}>
                {orders.map((order) => (
                  <div key={order.id} style={{
                    background: "rgba(255, 255, 255, 0.9)",
                    border: "1px solid rgba(232, 181, 199, 0.3)",
                    borderRadius: "15px",
                    padding: "20px",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
                      <div>
                        <h3 style={{ color: "#424242", marginBottom: "5px", fontSize: 18 }}>{order.restaurant}</h3>
                        <p style={{ color: "rgba(66, 66, 66, 0.7)", fontSize: 14 }}>{order.id}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span style={{
                          padding: "4px 12px",
                          borderRadius: "20px",
                          fontSize: 12,
                          fontWeight: 600,
                          textTransform: "uppercase",
                          background: order.status === "Delivered" ? "rgba(0, 255, 127, 0.2)" : "rgba(255, 255, 0, 0.2)",
                          color: order.status === "Delivered" ? "#00ff7f" : "#ffff00"
                        }}>
                          {order.status}
                        </span>
                        <p style={{ color: "rgba(66, 66, 66, 0.7)", fontSize: 14, marginTop: "5px" }}>{order.date}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "15px", borderTop: "1px solid rgba(232, 181, 199, 0.2)" }}>
                      <p style={{ color: "rgba(66, 66, 66, 0.7)", fontSize: 14 }}>{order.items.join(", ")}</p>
                      <strong style={{ color: "#ba68c8", fontSize: 16 }}>{order.total}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'favorites' && (
            <div style={{ color: "#424242" }}>
              <h2 style={{ color: "#7b1fa2", fontSize: "28px", marginBottom: "30px" }}>Favorite Restaurants</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }}>
                {favorites.map((fav) => (
                  <div
                    key={fav.id}
                    onClick={() => navigate(`/restaurant/${fav.id}`)}
                    style={{
                      background: "rgba(255, 255, 255, 0.9)",
                      borderRadius: "15px",
                      overflow: "hidden",
                      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)",
                      cursor: "pointer",
                      border: "1px solid rgba(232, 181, 199, 0.2)",
                      transition: "all 0.3s ease"
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = "translateY(-5px)";
                      e.target.style.boxShadow = "0 8px 25px rgba(214, 169, 232, 0.3)";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.05)";
                    }}
                  >
                    <img src={fav.image} alt={fav.name} style={{
                      width: "100%",
                      height: "120px",
                      objectFit: "cover",
                      transition: "all 0.3s ease"
                    }} />
                    <h3 style={{ padding: "15px", textAlign: "center", color: "#7b1fa2", fontSize: 16, fontWeight: 600, margin: 0 }}>
                      {fav.name}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;

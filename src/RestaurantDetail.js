import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
      <div className="restaurant-detail">
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #e8b5ce, #d6a9e8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#4a148c",
              fontSize: 18,
              animation: "subtlePulse 2s infinite"
            }}
          >
            🔄
          </div>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="restaurant-detail" style={{ textAlign: "center", padding: "50px" }}>
        <p style={{ fontSize: 18, color: "#666", marginBottom: 20 }}>{error || 'Restaurant not found'}</p>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: "12px 24px",
            background: "linear-gradient(135deg, #e8b5ce, #d6a9e8)",
            color: "#4a148c",
            border: "none",
            borderRadius: "25px",
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(214, 169, 232, 0.3)"
          }}
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="restaurant-detail" style={{ background: "linear-gradient(135deg, rgba(255, 247, 255, 0.95), rgba(254, 229, 236, 0.95))", minHeight: "100vh", color: "#424242" }}>
      <div style={{ position: "relative" }}>
        <div style={{ height: "400px", overflow: "hidden", position: "relative" }}>
          <img src={restaurant.image} alt={restaurant.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <button
            onClick={() => navigate('/')}
            style={{
              position: "absolute",
              top: 20,
              left: 20,
              background: "rgba(255, 255, 255, 0.9)",
              color: "#7b1fa2",
              border: "2px solid #e8b5ce",
              borderRadius: "50%",
              width: 50,
              height: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s ease"
            }}
            onMouseOver={(e) => e.target.style.transform = "scale(1.1)"}
            onMouseOut={(e) => e.target.style.transform = "scale(1)"}
          >
            ←
          </button>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "40px", alignItems: "start" }}>
          <div>
            <h1 style={{ fontSize: "3rem", fontWeight: 700, color: "#7b1fa2", marginBottom: "20px" }}>{restaurant.name}</h1>
            <div style={{ display: "flex", gap: "20px", marginBottom: "20px", flexWrap: "wrap" }}>
              <div style={{
                padding: "8px 16px",
                background: "linear-gradient(135deg, #e8b5ce, #d6a9e8)",
                color: "#4a148c",
                borderRadius: "20px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "5px"
              }}>
                ⭐ {restaurant.rating}
              </div>
              <div style={{ color: "#666", fontWeight: 500, fontSize: "16px" }}>{restaurant.deliveryTime}</div>
              <div style={{ color: "#ba68c8", fontWeight: 600, fontSize: "16px" }}>{restaurant.price}</div>
            </div>
            <div style={{ color: "#777", fontSize: "18px", marginBottom: "30px" }}>
              {restaurant.cuisines.join(" • ")}
            </div>
            <p style={{ fontSize: "18px", lineHeight: 1.6, color: "#555" }}>{restaurant.description}</p>
          </div>

          <div style={{
            background: "rgba(255, 255, 255, 0.9)",
            borderRadius: "20px",
            padding: "30px",
            boxShadow: "0 8px 32px rgba(181, 132, 193, 0.2)",
            border: "1px solid rgba(232, 181, 199, 0.2)"
          }}>
            <h3 style={{ fontSize: "24px", color: "#7b1fa2", marginBottom: "20px", textAlign: "center" }}>Popular Items</h3>
            <div style={{ display: "flex", gap: "15px", alignItems: "center", padding: "20px 0", borderBottom: "1px solid rgba(232, 181, 199, 0.2)" }}>
              <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=80&h=80&fit=crop"
                   alt="Main Course"
                   style={{ borderRadius: "12px", width: "60px", height: "60px", objectFit: "cover" }} />
              <div>
                <h4 style={{ fontSize: "16px", color: "#424242", marginBottom: "5px" }}>Signature Dish</h4>
                <p style={{ color: "#777", fontSize: "14px", marginBottom: "5px" }}>{restaurant.cuisines[0]} specialty</p>
                <span style={{ color: "#ba68c8", fontWeight: 600, fontSize: "16px" }}>₹250</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestaurantDetail;

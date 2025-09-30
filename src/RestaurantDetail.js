import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './App.css';

// Fast cached restaurant data
const RESTAURANT_DATA = {
  1: {
    id: 1,
    name: "Domino's Pizza",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=400&fit=crop&auto=format",
    rating: 4.2,
    deliveryTime: "25-30 mins",
    price: "₹200 for two",
    cuisines: ["Pizza"],
    description: "World's favorite pizza delivery restaurant"
  },
  2: {
    id: 2,
    name: "Burger King",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=400&fit=crop&auto=format",
    rating: 4.1,
    deliveryTime: "20-25 mins",
    price: "₹250 for two",
    cuisines: ["Burger"],
    description: "Home of the Whopper - flame-grilled beef and smoky bacon"
  },
  3: {
    id: 3,
    name: "Pizza Hut",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=400&fit=crop&auto=format",
    rating: 4.3,
    deliveryTime: "30-35 mins",
    price: "₹300 for two",
    cuisines: ["Pizza"],
    description: "America's #1 pizza delivery with pan-style and thin crust options"
  },
  4: {
    id: 4,
    name: "Starbucks",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=400&fit=crop&auto=format",
    rating: 4.4,
    deliveryTime: "15-20 mins",
    price: "₹150 for two",
    cuisines: ["Beverages"],
    description: "Premium coffee, espresso drinks and fresh pastries"
  },
  5: {
    id: 5,
    name: "McDonald's",
    image: "https://images.unsplash.com/photo-1551833726-02eb8c5a0923?w=800&h=400&fit=crop&auto=format",
    rating: 4.1,
    deliveryTime: "20-25 mins",
    price: "₹200 for two",
    cuisines: ["Burger"],
    description: "I'm lovin' it - Big Mac, French Fries and McFlurry"
  },
  6: {
    id: 6,
    name: "KFC",
    image: "https://images.unsplash.com/photo-1511689660979-10d936610ee3?w=800&h=400&fit=crop&auto=format",
    rating: 4.2,
    deliveryTime: "20-25 mins",
    price: "₹250 for two",
    cuisines: ["Fried Chicken"],
    description: "Finger lickin' good chicken - Original Recipe and Zinger"
  }
};

function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const restaurantId = parseInt(id);

  // Instant lookup - no API call
  const restaurant = RESTAURANT_DATA[restaurantId];

  if (!restaurant) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        padding: "20px",
        background: "linear-gradient(135deg, rgba(255, 247, 255, 0.95), rgba(254, 229, 236, 0.95))"
      }}>
        <h2 style={{ color: "#7b1fa2", marginBottom: "20px" }}>Restaurant Not Found</h2>
        <button className="btn-primary" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: "linear-gradient(135deg, rgba(255, 247, 255, 0.95), rgba(254, 229, 236, 0.95))", minHeight: "100vh", color: "#424242" }}>
      {/* Hero Image */}
      <div style={{ position: "relative", marginBottom: "40px" }}>
        <div style={{ height: "400px", overflow: "hidden", borderRadius: "0 0 30px 30px" }}>
          <img
            src={restaurant.image}
            alt={restaurant.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.9)"
            }}
          />
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(135deg, rgba(123, 31, 162, 0.1), rgba(143, 84, 191, 0.2))"
          }}></div>
        </div>

        <button
          onClick={() => navigate('/')}
          style={{
            position: "absolute",
            top: 30,
            left: 30,
            background: "rgba(255, 255, 255, 0.95)",
            color: "#7b1fa2",
            border: "3px solid #e8b5ce",
            borderRadius: "50%",
            width: 60,
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            cursor: "pointer",
            boxShadow: "0 6px 20px rgba(214, 169, 232, 0.3)",
            transition: "all 0.3s ease",
            fontWeight: "bold"
          }}
          onMouseOver={(e) => e.target.style.transform = "scale(1.1) rotate(-10deg)"}
          onMouseOut={(e) => e.target.style.transform = "scale(1)"}
        >
          ←
        </button>
      </div>

      {/* Restaurant Info */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 30px 60px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "50px", alignItems: "start" }}>
          {/* Main Content */}
          <div>
            <h1 style={{
              fontSize: "3.5rem",
              fontWeight: 700,
              color: "#7b1fa2",
              marginBottom: "25px",
              lineHeight: 1.2,
              textShadow: "0 2px 8px rgba(123, 31, 162, 0.2)"
            }}>
              {restaurant.name}
            </h1>

            <div style={{
              display: "flex",
              gap: "25px",
              marginBottom: "30px",
              flexWrap: "wrap",
              alignItems: "center"
            }}>
              <div style={{
                background: "linear-gradient(135deg, #e8b5ce, #d6a9e8)",
                color: "#4a148c",
                padding: "12px 20px",
                borderRadius: "25px",
                fontWeight: 700,
                fontSize: "18px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 4px 15px rgba(214, 169, 232, 0.3)"
              }}>
                ⭐ {restaurant.rating}
                <span style={{ fontSize: "14px", opacity: 0.8 }}>stars</span>
              </div>

              <div style={{
                color: "#666",
                fontWeight: 600,
                fontSize: "18px",
                display: "flex",
                alignItems: "center",
                gap: "5px"
              }}>
                🕐 {restaurant.deliveryTime}
              </div>

              <div style={{
                color: "#ba68c8",
                fontWeight: 700,
                fontSize: "18px"
              }}>
                {restaurant.price}
              </div>
            </div>

            <div style={{
              background: "white",
              padding: "20px",
              borderRadius: "15px",
              boxShadow: "0 6px 20px rgba(181, 132, 193, 0.1)",
              border: "2px solid #f8b5ce",
              marginBottom: "30px"
            }}>
              <h3 style={{
                color: "#7b1fa2",
                fontSize: "20px",
                marginBottom: "10px"
              }}>
                Cuisine
              </h3>
              <div style={{
                color: "#777",
                fontSize: "16px",
                fontWeight: 500
              }}>
                {restaurant.cuisines.join(" • ")}
              </div>
            </div>

            <div style={{
              background: "white",
              padding: "25px",
              borderRadius: "20px",
              boxShadow: "0 6px 20px rgba(181, 132, 193, 0.1)",
              border: "2px solid #e8b5ce"
            }}>
              <h2 style={{
                color: "#7b1fa2",
                fontSize: "24px",
                marginBottom: "15px"
              }}>
                About
              </h2>
              <p style={{
                fontSize: "18px",
                lineHeight: 1.6,
                color: "#555",
                margin: 0
              }}>
                {restaurant.description}
              </p>
            </div>
          </div>

          {/* Sidebar Menu */}
          <div style={{
            background: "white",
            borderRadius: "20px",
            padding: "30px",
            boxShadow: "0 10px 35px rgba(181, 132, 193, 0.2)",
            border: "3px solid #f0b5cb",
            position: "sticky",
            top: "20px"
          }}>
            <h3 style={{
              fontSize: "28px",
              color: "#7b1fa2",
              marginBottom: "25px",
              textAlign: "center",
              fontWeight: 700
            }}>
              Popular Items
            </h3>

            <div style={{
              spaceY: "1",
              borderRadius: "15px",
              padding: 0
            }}>
              {["Margherita Pizza ₹199", "Cheesy Chicken Pizza ₹249", "Veggie Supreme Pizza ₹229", "Chicken Burger ₹159"].map((item, index) => {
                const [name, price] = item.split(' ₹');
                return (
                  <div key={index} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    padding: "20px",
                    borderBottom: index < 3 ? "1px solid rgba(232, 181, 199, 0.3)" : "none"
                  }}>
                    <img
                      src={`https://images.unsplash.com/photo-${['156529962', '156890134', '151310489', '158731416'][index % 4]}?w=60&h=60&fit=crop&auto=format`}
                      alt={name}
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "12px",
                        objectFit: "cover",
                        border: "2px solid #e8b5ce"
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <h4 style={{
                        fontSize: "16px",
                        color: "#424242",
                        marginBottom: "3px",
                        fontWeight: 600
                      }}>
                        {name}
                      </h4>
                      <div style={{
                        color: "#ba68c8",
                        fontWeight: 700,
                        fontSize: "18px"
                      }}>
                        ₹{price}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              style={{
                width: "100%",
                marginTop: "30px",
                padding: "16px",
                background: "linear-gradient(135deg, #e8b5ce, #d6a9e8)",
                color: "#4a148c",
                border: "none",
                borderRadius: "15px",
                fontSize: "18px",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 6px 20px rgba(214, 169, 232, 0.3)",
                transition: "all 0.3s ease"
              }}
              onMouseOver={(e) => e.target.style.transform = "translateY(-2px)"}
              onMouseOut={(e) => e.target.style.transform = "translateY(0)"}
            >
              Order Now 🛒
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestaurantDetail;

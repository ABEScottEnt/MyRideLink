import React from "react";
import "./home.css";
import Navbar from "../components/Navbar.jsx";
import carRidesImg from "../assets/imgs/car_rides.jpg";
import carRentalsImg from "../assets/imgs/car_rentals.jpg";
import publicTransportImg from "../assets/imgs/public_transport.jpg";
import foodDeliveryImg from "../assets/imgs/food_delivery.jpg";
import productDeliveryImg from "../assets/imgs/product_deilvery.jpg";
import Footer from "../components/Footer.jsx";

function Home() {
  return (
    <div className="home-container">
      <main className="app-main-container">
        <h1 className="main-heading">
          Where car services click with convenience!
        </h1>
        <div className="home-cards-row">
          <ServiceCard title="Car Rides" img={carRidesImg} />
          <ServiceCard title="Car Rentals" img={carRentalsImg} />
          <ServiceCard title="Public Transportation" img={publicTransportImg} />
        </div>
        <div className="home-cards-row">
          <ServiceCard title="Food Delivery" img={foodDeliveryImg} />
          <ServiceCard title="Product Delivery" img={productDeliveryImg} />
        </div>
      </main>
    </div>
  );
}

function ServiceCard({ title, img }) {
  return (
    <div className="service-card">
      <img src={img} alt={title} className="service-card-img" />
      <div className="service-card-title">{title}</div>
      <div className="service-card-desc">
        Body text for whatever you'd like to say. Add main takeaway points,
        quotes, anecdotes, or even a very very short story.
      </div>
    </div>
  );
}

export default Home;

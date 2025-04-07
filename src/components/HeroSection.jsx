import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Button, Card } from "react-bootstrap";

const HeroSection = () => {
  const featuredGames = [
    {
      id: 1,
      title: "Stellar Odyssey",
      category: "Action RPG",
      rating: 4.8,
      image: "/api/placeholder/300/400",
    },
    {
      id: 2,
      title: "Neon Dynasty",
      category: "Open World",
      rating: 4.7,
      image: "/api/placeholder/300/400",
    },
    {
      id: 3,
      title: "Dark Realms",
      category: "Strategy",
      rating: 4.6,
      image: "/api/placeholder/300/400",
    },
  ];

  return (
    <div className="hero-section">
      <div
        className="bg-dark text-white py-5 position-relative"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9)), url("/images/hero-background.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "600px",
        }}
      >
        <Container className="py-5">
          <Row className="align-items-center">
            <Col lg={6} className="mb-5 mb-lg-0">
              <h1 className="display-3 fw-bold mb-3">
                Discover Your Next Gaming Adventure
              </h1>
              <p className="lead mb-4">
                Stay up-to-date with the latest releases, reviews, news, and
                exclusive content from the gaming universe.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Button variant="primary" size="lg">
                  Explore Games
                </Button>
                <Button variant="outline-light" size="lg">
                  Latest Reviews
                </Button>
              </div>
            </Col>
            <Col lg={6} className="d-flex justify-content-center">
              <div
                className="game-preview rounded shadow-lg position-relative"
                style={{
                  width: "100%",
                  height: "400px",
                  backgroundImage: 'url("/images/game-preview.jpg")',
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: "10px",
                }}
              >
                <div
                  className="play-overlay d-flex flex-column align-items-center justify-content-center text-white"
                  style={{
                    background: "rgba(0, 0, 0, 0.5)",
                    height: "100%",
                    borderRadius: "10px",
                  }}
                >
                  <iframe
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/rFJOBl0MHts?si=92IOiZrCjF1rSL50&autoplay=1&mute=1&controls=0&showinfo=0&modestbranding=1&rel=0"
                    frameBorder="0"
                    allow="autoplay"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>

                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      
    </div>
  );
};

export default HeroSection;
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

function PropertyCard({ property }) {
  const navigate = useNavigate();

  const [currentImage, setCurrentImage] = useState(0);
  const [favorite, setFavorite] = useState(false);

  const nextImage = () => {
    setCurrentImage(
      (prev) => (prev + 1) % property.images.length
    );
  };

  const previousImage = () => {
    setCurrentImage(
      (prev) =>
        (prev - 1 + property.images.length) %
        property.images.length
    );
  };

  return (
    <div className="card">

      <div className="image-container">

        <img
          src={`${API_URL}${property.images[currentImage]}`}
          alt={property.title}
          className="house-image"
        />

        {property.images.length > 1 && (
          <>
            <button
              className="arrow left"
              onClick={previousImage}
            >
              ❮
            </button>

            <button
              className="arrow right"
              onClick={nextImage}
            >
              ❯
            </button>
          </>
        )}

        <button
          className="favorite"
          onClick={() => setFavorite(!favorite)}
        >
          {favorite ? "❤️" : "🤍"}
        </button>

      </div>

      <div className="card-body">

        <span className="badge">
          {property.category}
        </span>

        <h3>{property.title}</h3>

        <p>📍 {property.location}</p>

        <h4>
          MWK {property.price.toLocaleString()}
        </h4>

        <div className="card-buttons">

          <button
            className="details"
            onClick={() =>
              navigate(`/property/${property._id}`)
            }
          >
            View Details
          </button>

        </div>

      </div>

    </div>
  );
}

export default PropertyCard;
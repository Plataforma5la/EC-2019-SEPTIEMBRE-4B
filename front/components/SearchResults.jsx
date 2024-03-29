import React from "react";
import StarRatings from "react-star-ratings";
import { CardDeck, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { TiPlus } from "react-icons/ti";

export default function SearchResults({ catFilter, products, searchQuery }) {
  let filteredProducts = products;
  catFilter
    ? (filteredProducts = products.filter(product =>
        product.category.includes(catFilter)
      ))
    : null;

    console.log("products", products)

  return (
    <div id="randomViewContainer">
      {products.length != 0 ? (
        <div>
          <CardDeck>
            {filteredProducts.map(product => (
              <Card
                className="card text-center"
                id="productCard"
                key={product.id}
              >
                <Link to={`/product/${product.id}`}>
                  <Card.Img variant="top" src={
                    product.image[0] === '.' ?
                    product.image.slice(1) : product.image
                    } />

                </Link>
                <Card.Body id="prodBody">
                  <Card.Title id="productName">{product.name}</Card.Title>
                  <Card.Title id="productPrice">{product.price}</Card.Title>
                  <small className="text-muted">
                    <StarRatings
                      rating={product.rating}
                      starDimension="11px"
                      starSpacing="4px"
                      starRatedColor="rgb(188, 100, 100)"
                    />
                  </small>
                  <hr />
                  <Link to={`/product/${product.id}`}>
                    <button id="plusBtn" className="btn btn-light">
                      <TiPlus /> info
                    </button>
                  </Link>
                </Card.Body>
              </Card>
            ))}
          </CardDeck>
        </div>
      ) : (
        <div>
          <h1>
            UNFORTUNATELY WE DON'T GET RESULTS FOR YOUR SEARCH: {searchQuery}{" "}
          </h1>
          <h1>Please try again!</h1>
          <p> Tips for your search: </p>
          <ul>
            <li>
              Check your spelling in case you had typing errors, for example
              "Palangana" instead of "Pants."
            </li>
            <li>Try again, looking for only one word.</li>
            <li>
              Try again, looking for more generic terms - you can filter the
              results later.
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

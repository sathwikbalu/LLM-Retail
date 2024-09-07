import { useState } from "react";
import axios from "axios";
import Product from "../../pages/Products/Product";
import "./Search.css";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setProducts([]);

    try {
      const response = await axios.post(`http://localhost:4000/prosearch`, {
        text: searchTerm,
      });
      const similarProducts = response.data.similar_products;
      console.log(similarProducts);

      const productResponses = await Promise.all(
        similarProducts.map(async (product) => {
          try {
            console.log("Searching for:", product["Product Title"]);
            const productResponse = await axios.get(
              "http://localhost:5000/api/products/search",
              {
                params: { query: encodeURIComponent(product["Product Title"]) },
              }
            );
            return productResponse.data;
          } catch (err) {
            console.error(
              `Error fetching product: ${product["Product Title"]}`,
              err
            );
            if (err.response) {
              console.error("Response data:", err.response.data);
            }
            return null;
          }
        })
      );

      setProducts(productResponses.flat().filter((p) => p)); // Filter out null values
    } catch (err) {
      setError(err.message || "Something went wrong...");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {isLoading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!isLoading && !error && products.length === 0 && (
        <p>No products found.</p>
      )}
      <div className="search-results">
        {products.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Search;
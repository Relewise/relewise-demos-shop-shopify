import { useState, useEffect } from "react";
import {
  PriceRangeFacetResult,
  ProductDataStringValueFacetResult,
  ProductResult,
  ProductSearchBuilder,
  ProductSearchResponse,
  Searcher,
  UserFactory
} from "@relewise/client";
import Pagination from "./Pagination";
import ProductDataStringValueFacet from "./ProductDataStringValueFacet";
import PriceRangeSlider from "./PriceRangeSlider";
import { config } from "../src/config/relewiseConfig";

// Category component: renders the product grid, facets, and pagination
function Category({
  collectionId,
  currency,
  language,
}: {
  collectionId: string;
  currency: string;
  language: string;
}) {
  // State to store the product search response
  const [response, setResponse] = useState<ProductSearchResponse>();

  // State to store the selected vendor facet values
  const [selectedFacets, setSelectedFacets] = useState<string[]>([]);

  // States for the available price range bounds from the facet
  const [lowerInbound, setLowerInbound] = useState<number | undefined>();
  const [higherInbound, setHigherInbound] = useState<number | undefined>();

  // States for the currently selected minimum and maximum price values
  const [selectedMin, setSelectedMin] = useState<number | undefined>();
  const [selectedMax, setSelectedMax] = useState<number | undefined>();

  // Pagination state: current page and fixed page size
  const [page, setPage] = useState(1);
  const pageSize = 24; // Fixed page size

  // useEffect hook fetches products whenever any dependency changes
  useEffect(() => {
    const fetchProducts = async () => {
      // Create settings object for the search query
      const settings = {
        language: language,
        currency: currency,
        displayedAtLocation: "Category Page",
        user: UserFactory.anonymous(), // Using an anonymous user
      };

      // Build the product search query with selected properties, filters, pagination, and facets
      const builder = new ProductSearchBuilder(settings)
        .setSelectedProductProperties({
          displayName: true,
          pricing: true,
          dataKeys: [
            "relewise-demo-store.myshopify.com_ImageUrls",
            "relewise-demo-store.myshopify.com_ShopifyHandle",
          ],
        })
        // Filter products by the category (collectionId)
        .filters((f) => f.addProductCategoryIdFilter("ImmediateParent", collectionId))
        // Set the pagination details
        .pagination((p) => p.setPageSize(pageSize).setPage(page))
        // Add facets for vendor (string value) and price range filtering
        .facets((f) => {
          f.addProductDataStringValueFacet("Vendor", "Product", selectedFacets);
          f.addSalesPriceRangeFacet("Product", selectedMin, selectedMax);
        });

      // Initialize the searcher with API credentials and server URL
      const searcher = new Searcher(config.datasetId, config.apiKey, {
        serverUrl: config.serverUrl,
      });

      try {
        // Execute the search query
        const results = await searcher.searchProducts(builder.build());
        if (results?.results) {
          // Update the response state with the search results
          setResponse(results);

          // Process facets if they exist in the response
          if (results.facets?.items && results.facets.items.length > 0) {
            const items = results.facets.items;

            items.forEach((item) => {
              switch (item.$type) {
                // Vendor facet (string value) - no additional processing needed here for this example
                case "Relewise.Client.DataTypes.Search.Facets.Result.ProductDataStringValueFacetResult, Relewise.Client":
                  break;
                // Price range facet - extract and set inbound bounds and default selected values
                case "Relewise.Client.DataTypes.Search.Facets.Result.PriceRangeFacetResult, Relewise.Client":
                  const facet = item as PriceRangeFacetResult;
                  if (facet.available != null) {
                    const lower = facet.available.value?.lowerBoundInclusive;
                    const upper = facet.available.value?.upperBoundInclusive;
                    if (typeof lower === "number") setLowerInbound(lower);
                    if (typeof upper === "number") setHigherInbound(upper);
                    // Initialize selected price range if not already set
                    if (selectedMin === undefined) setSelectedMin(lower);
                    if (selectedMax === undefined) setSelectedMax(upper);
                  }
                  break;
              }
            });
          }
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    // Call the async function to fetch products 
    fetchProducts();
    // Dependencies: fetch products when these values change
  }, [collectionId, currency, language, page, selectedFacets, selectedMin, selectedMax]);

  // Function to handle selection and deselection of vendor facets
  function setFacet(value: string) {
    if (selectedFacets.includes(value)) {
      // Remove the facet if already selected
      setSelectedFacets(selectedFacets.filter((facet) => facet !== value));
    } else {
      // Add the new facet value to the selection
      setSelectedFacets([...selectedFacets, value]);
    }
    // Reset to the first page when facet filters change
    setPage(1);
  }

  // Helper function to extract product data using a specified key
  function getProductData(product: ProductResult, key: string) {
    if (!product.data) {
      return "";
    }

    const value = product.data[key];

    // If the data type is a single string, return it
    if (value.type === "String") {
      return value.value;
    } else if (value.type === "StringList") {
      // If the data type is a list, return the first string
      return value.value.$values[0];
    }
  }

  return (
    <div className="page-width">
      <div className="relewise-category-container">
        {/* Facet container */}
        <div className="relewise-facet-container">
          {/* Render the vendor facet if available */}
          {response?.facets?.items && response.facets.items[0] && (
            <ProductDataStringValueFacet
              name="Vendor"
              facet={response.facets.items[0] as ProductDataStringValueFacetResult}
              setFacet={setFacet}
            />
          )}

          {/* Render the price range slider if both bounds are defined */}
          {lowerInbound !== undefined && higherInbound !== undefined && (
            <PriceRangeSlider
              min={lowerInbound}
              max={higherInbound}
              onChange={(newValues) => {
                // Update the selected price range when the slider changes
                setSelectedMin(newValues[0]);
                setSelectedMax(newValues[1]);
              }}
            />
          )}
        </div>

        {/* Product grid container */}
        <div className="relewise-product-grid">
          {response?.results?.map((item) => (
            <a
              key={item.productId}
              href={`/${language}/products/${getProductData(
                item,
                "relewise-demo-store.myshopify.com_ShopifyHandle"
              )}`}
              className="relewise-product-tile"
            >
              <img
                className="relewise-product-image"
                src={getProductData(
                  item,
                  "relewise-demo-store.myshopify.com_ImageUrls"
                )}
              />
              <h3 className="relewise-product-title">{item.displayName}</h3>
              <span>
                {item.salesPrice} {currency}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Pagination container */}
      <div className="relewise-pagination-container">
        {response?.hits && (
          <Pagination
            currentPage={page}
            goToPage={(page) => setPage(page)}
            pageSize={pageSize}
            total={response.hits}
          />
        )}
      </div>
    </div>
  );
}

export default Category;

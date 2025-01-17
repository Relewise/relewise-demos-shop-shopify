import { useState, useEffect } from "react";
import { ProductResult, ProductSearchBuilder, Searcher, UserFactory } from "@relewise/client";

function App({ collectionId, currency, language }: { collectionId: string; currency: string, language: string }) {
  const [products, setProducts] = useState<ProductResult[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const settings = {
        language: language,
        currency: currency,
        displayedAtLocation: "Plp",
        user: UserFactory.anonymous(),
      };

      const builder = new ProductSearchBuilder(settings)
        .setSelectedProductProperties({
          displayName: true,
          allData: true,

        })
        .pagination((p) =>
          p.setPageSize(30).setPage(1)
        )
        .filters((f) => f.addProductCategoryIdFilter('ImmediateParent', collectionId));

      const searcher = new Searcher("213664f9-4d5c-413b-a523-7a9c79c30080", "n_RA9uC6Ar3TQt_", {
        serverUrl: "https://sandbox-api.relewise.com/",
      });

      try {
        const results = await searcher.searchProducts(builder.build());
        if (results?.results) {
          setProducts(results.results);
          console.log(results.results);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array ensures this runs only once on mount.

  return (
    <>
      <div className="relewise-products">
        {products.map((item) => (
          <div className="relewise-card" key={item.productId}>
            <img src={item.data?.['relewise-demo-store.myshopify.com_ImageUrls']?.value.$values} alt="" />
            <h4>Item ID:{item.productId}</h4>
            <h5>{item.data?.Vendor.value}</h5>
            <h5>{item.data?.['relewise-demo-store.myshopify.com_ShopifyHandle'].value}</h5>
            
          
          </div>

        ))}
      </div>
    </>
  );
}

export default App;

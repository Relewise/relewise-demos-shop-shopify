import { useState, useEffect } from "react";
import { ProductSearchBuilder, ProductSearchResponse, Searcher, UserFactory } from "@relewise/client";
import Pagination from "./Pagination";

function App({ collectionId, currency, language }: { collectionId: string; currency: string, language: string }) {
  const [response, setResponse] = useState<ProductSearchResponse>();
  
  const [page, setPage] = useState(1);
  const pageSize = 1;

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
          pricing: true,
        })
        .pagination((p) =>
          p.setPageSize(pageSize).setPage(page)
        )
        .filters((f) => f.addProductCategoryIdFilter('ImmediateParent', collectionId));

      const searcher = new Searcher("213664f9-4d5c-413b-a523-7a9c79c30080", "n_RA9uC6Ar3TQt_", {
        serverUrl: "https://sandbox-api.relewise.com/",
      });

      try {
        const results = await searcher.searchProducts(builder.build());
        if (results?.results) {
          setResponse(results);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [collectionId, currency, language, page]); // Empty dependency array ensures this runs only once on mount.

  return (
    <>
      <div className="relewise-products">
        {response?.results?.map((item) => (
          <div className="relewise-card" key={item.productId}>
            <img src={item.data?.['relewise-demo-store.myshopify.com_ImageUrls']?.value.$values} alt="" />
            <h5>{item.salesPrice}</h5>
            <h5>{item.data?.['relewise-demo-store.myshopify.com_ShopifyHandle'].value}</h5>
          </div>
        ))}
      </div>
      <Pagination currentPage={page} goToPage={(page) => setPage(page)} pageSize={pageSize} total={response?.hits ?? 0}/>
    </>
  );
}

export default App;

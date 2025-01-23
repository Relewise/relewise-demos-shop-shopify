import { useState, useEffect } from "react";
import { ProductDataStringValueFacetResult, ProductResult, ProductSearchBuilder, ProductSearchResponse, Searcher, UserFactory } from "@relewise/client";
import Pagination from "./Pagination";
import ProductDataStringValueFacet from "./ProductDataStringValueFacet";

function Category({ collectionId, currency, language }: { collectionId: string; currency: string, language: string }) {
  const [response, setResponse] = useState<ProductSearchResponse>();
  const [selectedFacets, setSelectedFacets] = useState<string[]>([]);

  const [page, setPage] = useState(1);
  const pageSize = 24;

  useEffect(() => {
    const fetchProducts = async () => {
      const settings = {
        language: language,
        currency: currency,
        displayedAtLocation: "Category Page",
        user: UserFactory.anonymous(),
      };

      const builder = new ProductSearchBuilder(settings)
        .setSelectedProductProperties({
          displayName: true,
          pricing: true,
          dataKeys: ["relewise-demo-store.myshopify.com_ImageUrls", "relewise-demo-store.myshopify.com_ShopifyHandle"],
        })
        .filters((f) => f.addProductCategoryIdFilter('ImmediateParent', collectionId))
        .pagination((p) => p.setPageSize(pageSize).setPage(page))
        .facets((f) => f.addProductDataStringValueFacet("Vendor", "Product", selectedFacets));

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
  }, [collectionId, currency, language, page, selectedFacets]);

  function setFacet(value: string) {
    if (selectedFacets.includes(value)) {
      setSelectedFacets(selectedFacets.filter((facet) => facet !== value));
    } else {
      setSelectedFacets([...selectedFacets, value]);
    }
  }

  function getProductData(product: ProductResult, key: string) {
    if (!product.data) {
      return "";
    }

    const value = product.data[key];

    if (value.type === 'String') {
        return value.value;
    } else if (value.type === 'StringList') {
        return value.value.$values[0];
    }
  }

  return (
    <div className="page-width">
      <div className="relewise-category-container">
        <div className="relewise-facet-container">
          { response?.facets?.items && response.facets.items[0] &&
            <ProductDataStringValueFacet 
              name="Vendor"
              facet={response.facets.items[0] as ProductDataStringValueFacetResult}
              setFacet={setFacet} />
          }
        </div>
        <div className="relewise-product-grid">  
          {response?.results?.map((item) => (
            <a key={item.productId} href={`/${language}/products/${getProductData(item, "relewise-demo-store.myshopify.com_ShopifyHandle")}`} className="relewise-product-tile">
              <img className="relewise-product-image" src={getProductData(item, "relewise-demo-store.myshopify.com_ImageUrls")} />
              <h3 className="relewise-product-title">{item.displayName}</h3>
              <span>{item.salesPrice} {currency}</span>
            </a>
          ))}
        </div>
      </div>
      <div className="relewise-pagination-container">
        {response?.hits &&
          <Pagination currentPage={page} goToPage={(page) => setPage(page)} pageSize={pageSize} total={response.hits}/>
        }
      </div>
    </div>
  );
}

export default Category;

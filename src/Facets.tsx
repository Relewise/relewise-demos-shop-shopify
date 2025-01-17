import { ProductFacetResult } from "@relewise/client";
import CheckListFacet from "./ChackListFacet";
import getFacetsByType from "./assets/getFacetsByType";

interface FacetsProps {
    selectedFacets: Record<string, string[]>;
    facets: ProductFacetResult;
    setSelectedFacets(selectedFacets: Record<string, string[]>): void;
}

function Facets(props: FacetsProps) {
    function setFacet(type: string, value: string) {
        const currentSelectFacetValues = getFacetsByType(
          props.selectedFacets,
          type
        );
        const valueAlreadySelected =
          (currentSelectFacetValues?.find((v) => v === value)?.length ?? 0) > 0;
    
        if (valueAlreadySelected) {
          const newSelectFacets = { ...props.selectedFacets };
          const indexToRemove = newSelectFacets[type].indexOf(value);
          newSelectFacets[type].splice(indexToRemove, 1);
          props.setSelectedFacets(newSelectFacets);
          return;
        }
    
        const newSelectFacets = { ...props.selectedFacets };
        newSelectFacets[type].push(value);
        props.setSelectedFacets(newSelectFacets);
      }

    return (
      <>
        {props.facets.items?.map((facet, index) => (
                <div key={index}>
                {(facet.field == "Category" || "Brand") && (
                    <CheckListFacet facet={facet} setFacet={setFacet} />
                )}
                </div>
            ))}
      </>
    );
  }
  
  export default Facets;
  
import { ProductDataStringValueFacetResult } from "@relewise/client";

interface ProductDataStringValueFacetProps {
  facet: ProductDataStringValueFacetResult;
  setFacet(value: string): void;
  name: string;
}

function CheckListFacet(props: ProductDataStringValueFacetProps) {
  return (
    <>
      {props.facet.available && props.facet.available.length > 0 && (
        <div className="relewise-checklist-facet-container">
          <h3 className="relewise-checklist-facet-title">{props.name} </h3>
          <ul className="relewise-list-item-container">
            {props.facet.available.map((option, index) => (
              <li key={index}>
                {option.value && (
                  <label className="relewise-checklist-item">
                    <input type="checkbox" value={option.value} checked={option.selected} onChange={() => props.setFacet(option.value!)} style={{ marginRight: "8px", accentColor: "#007BFF", cursor: "pointer" }}/>
                    <span>
                      {option.value} {" "}
                      <span className="relewise-facet-options-hits">
                        ({option.hits})
                      </span>
                    </span>
                  </label>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default CheckListFacet;
import { FacetResult } from "@relewise/client";
import { useState } from "react";

interface CheckListFacetsProps {
  facet: FacetResult;
  setFacet(type: string, value: string): void;
}

function CheckListFacet(props: CheckListFacetsProps) {
  const [elementsToShow, setElementsToShow] = useState(10);

  const options = () => {
    if (!("available" in props.facet)) return [];

    // TODO handle the error
    const sorted = [...(props.facet as any).available].sort(
      (a, b) =>
        a.value?.displayName?.localeCompare(b.value?.displayName ?? "") ?? 0
    );
    return sorted;
  };
  
  return (
    <>
    {(props.facet.field == "Category" || props.facet.field == "Brand") &&
      options().length > 0 && (
        <div key="index">
          <div>
            {props.facet.field}
          </div>
          <ul>
            {options()
              .slice(0, elementsToShow)
              .map((option, index) => (
                <li key={index}>
                  {option.value &&
                    typeof option.value === "object" &&
                    "id" in option.value && (
                      <label >
                        <input
                          type="checkbox"
                          value={option.value.id}
                          checked={option.selected}
                          onChange={() =>
                            props.setFacet(props.facet.field, option.value.id)
                          }
                        />
                        {option.value?.displayName ?? option.value.id}{" "}
                        <span>
                          ({option.hits})
                        </span>
                      </label>
                    )}
                </li>
              ))}

            {elementsToShow < options().length && (
              <button
                onClick={() => setElementsToShow(options().length)}
              >
                Show all
              </button>
            )}
          </ul>
        </div>
      )}
  </>
  );
}

export default CheckListFacet;

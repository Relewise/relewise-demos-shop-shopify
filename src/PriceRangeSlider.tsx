import { useState } from "react";
import ReactSlider from "react-slider";

// Define the props for the PriceRangeSlider component
interface PriceRangeSliderProps {
  min: number; // Minimum possible price value
  max: number; // Maximum possible price value
  onChange: (values: [number, number]) => void; // Callback function when the price range changes
}

const PriceRangeSlider = ({ min, max, onChange }: PriceRangeSliderProps) => {
  // Initialize the state with the initial price range values (min and max)
  const [values, setValues] = useState<[number, number]>([min, max]);

  // Handler for slider changes: updates state and calls the onChange callback
  const handleSliderChange = (newValues: [number, number]) => {
    setValues(newValues);
    onChange(newValues);
  };

  return (
    <div className="price-range-slider">
      <h3>Price Facet:</h3>

      {/* Input fields for manually adjusting the price range */}
      <div className="input-container">
        {/* Input for the minimum price */}
        <input
          type="number"
          value={values[0]}
          onChange={(e) => {
            const newMin = parseInt(e.target.value, 10); // Parse the new minimum value
            handleSliderChange([newMin, values[1]]); // Update slider with new minimum
          }}
          min={min} // Set lower bound for the input
          max={values[1]} // Maximum allowed value is the current maximum value
        />
        <span className="separator">-</span>
        {/* Input for the maximum price */}
        <input
          type="number"
          value={values[1]}
          onChange={(e) => {
            const newMax = parseInt(e.target.value, 10); // Parse the new maximum value
            handleSliderChange([values[0], newMax]); // Update slider with new maximum
          }}
          min={values[0]} // Minimum allowed value is the current minimum value
          max={max} // Set upper bound for the input
        />
      </div>

      {/* ReactSlider component for a graphical price range slider */}
      <ReactSlider
        className="horizontal-slider" 
        thumbClassName="example-thumb" 
        trackClassName="example-track" 
        value={values} // Current values of the slider
        onAfterChange={handleSliderChange} // Update state after slider change
        min={min} // Minimum slider value
        max={max} // Maximum slider value
        renderThumb={(props) => <div {...props}>&nbsp;</div>} // Render each thumb as a div
        pearling={false}
      />
    </div>
  );
};

export default PriceRangeSlider;

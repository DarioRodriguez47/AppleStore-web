import React from "react";
import "./QuantityStepper.css";

const QuantityStepper = ({ value, onChange, min = 1 }) => (
  <div className="quantity-stepper">
    <button
      type="button"
      onClick={() => onChange(value - 1)}
      disabled={value <= min}
      aria-label="Disminuir cantidad"
    >
      −
    </button>
    <span>{value}</span>
    <button
      type="button"
      onClick={() => onChange(value + 1)}
      aria-label="Aumentar cantidad"
    >
      +
    </button>
  </div>
);

export default QuantityStepper;

import React from "react";

function FormRadioGroup({ label, options, selectedValue, onChange, name }) {
  return (
    <div>
      {label && <label>{label}</label>}
      <br />
      {options.map((option) => (
        <label key={option} style={{ display: "block" }}>
          <input
            type="radio"
            name={name}
            value={option}
            checked={selectedValue === option}
            onChange={onChange}
          />
          {option}
        </label>
      ))}
    </div>
  );
}

export default FormRadioGroup;
// This component renders a group of radio buttons based on the provided options.

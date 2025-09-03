import React from "react";

function FormCheckboxGroup({ label, options, selectedValues, onChange }) {
  return (
    <div>
      {label && <label>{label}</label>}
      <br />
      {options.map((option) => (
        <label key={option} style={{ display: "block" }}>
          <input
            type="checkbox"
            value={option}
            checked={selectedValues.includes(option)}
            onChange={onChange}
          />
          {option}
        </label>
      ))}
    </div>
  );
}

export default FormCheckboxGroup;
// This component renders a group of checkboxes based on the provided options.
import React from "react";

/**
* Simple text field component
 */
function FormStringInput({ label, type = "text", value, onChange, required = true, placeholder = "" }) {
  return (
    <div>
      <label>{label}</label>
      <br />
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
      />
    </div>
  );
}

export default FormStringInput;

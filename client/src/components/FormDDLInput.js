import React from "react";
import { Autocomplete, TextField } from "@mui/material";

// A reusable input component that supports both standard <select> and MUI <Autocomplete>
function FormDDLInput({
  label,             // The label displayed above the input
  value,             // The current selected value
  onChange,          // Handler for when the value changes
  options,           // List of available options
  required = false,  // Whether the input is required
  disabled = false,  // Whether the input is disabled
  autocomplete = false, // Whether to use Autocomplete or standard <select>
  placeholder = "בחר", // Placeholder shown when value is empty
  direction = "ltr",    // Text direction inside the Autocomplete options
}) {
  return (
    <div className="form-group">
      {/* Display the label above the input */}
      <label>{label}</label>

      {/* Autocomplete version */}
      {autocomplete ? (
        <Autocomplete
          freeSolo             // Allows free text input (not limited to options)
          clearOnEscape        // Allows user to clear input by pressing Esc
          disableClearable     // Removes the default clear (X) button
          options={options}    // Options for the dropdown
          value={value}        // Current value
          onInputChange={(event, newValue) => onChange(newValue)} // Update value when user types
          disabled={disabled}  // Disable input if needed
          renderOption={(props, option) => (
            // Render each option with custom direction
            <li {...props}>
              <div dir={direction}>{option}</div>
            </li>
          )}
          renderInput={(params) => (
            // Customize the input field
            <TextField
              {...params}
              placeholder={placeholder}
              required={required}
              disabled={disabled}
            />
          )}
        />
      ) : (
        <>
          {/* This <br /> adds spacing between label and <select>. 
              You can remove it if you use CSS for spacing (recommended). */}
          <br />
          <select
            value={value}           // Current value
            onChange={onChange}     // Update value on change
            required={required}     // HTML required validation
            disabled={disabled}     // Disable the dropdown
          >
            {/* Placeholder option shown when no value is selected */}
            <option value="">{placeholder}</option>

            {/* Map each option string to an <option> element */}
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </>
      )}
    </div>
  );
}

export default FormDDLInput;

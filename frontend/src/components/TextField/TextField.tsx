import type { ComponentProps } from "react";
import './TextField.css';

type TextFieldProps = {
  label?: string;
  error?: string;
} & ComponentProps<"input">;

function TextField({ 
  placeholder,
  label,
  error, 
  ...props 
}: TextFieldProps) {
  return (
    <div className="text-field">
      {label && <label className="text-field-label">{label}</label>}
      <input 
        placeholder={placeholder}
        className="text-field-input"
        {...props} 
      />
      <span className={`text-field-error ${!error ? "placeholder" : ""}`}>
        {error || "."}
      </span>
    </div>
  );
}

export default TextField;
import type { SubmitEventHandler, ComponentProps } from "react";
import Button from "../Button/Button.tsx";
import TextField from "../TextField/TextField.tsx";
import "./SingleFieldForm.css";

type SingleFieldFormProps = {
  onSubmit: SubmitEventHandler<HTMLFormElement>;
  buttonText: string;
  buttonDisabled?: boolean;
  className?: string;
} & Pick<ComponentProps<typeof TextField>, "label" | "error"> &
  ComponentProps<"input">;

function SingleFieldForm({
  onSubmit,
  buttonText,
  buttonDisabled = false,
  className = "",
  label,
  error,
  ...inputProps
}: SingleFieldFormProps) {
  return (
    <form className={`single-field-form ${className}`} onSubmit={onSubmit}>
      <TextField
        label={label}
        error={error}
        {...inputProps}
      />
      <div className="button-container">
        {label && (
          <label
            className="text-field-label button-container-label-spacer"
            aria-hidden="true"
          >
            {label}
          </label>
        )}
        <Button
          disabled={buttonDisabled}
          className="single-field-form-button"
        >
          {buttonText}
        </Button>
      </div>
    </form>
  );
}

export default SingleFieldForm;
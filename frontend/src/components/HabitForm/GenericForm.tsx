import type { SubmitEventHandler, ReactNode } from "react";
import Button from "../Button/Button.tsx";
import "./GenericForm.css";

type GenericFormProps = {
  children: ReactNode;
  onSubmit: SubmitEventHandler<HTMLFormElement>;
  buttonText: string;
  buttonDisabled?: boolean;
  className?: string;
};

function GenericForm({
  children,
  onSubmit,
  buttonText,
  buttonDisabled = false,
  className = "",
}: GenericFormProps) {
  return (
    <form className={`generic-form ${className}`} onSubmit={onSubmit}>
      {children}

      <Button disabled={buttonDisabled} className="generic-form-button">
        {buttonText}
      </Button>
    </form>
  );
}

export default GenericForm;
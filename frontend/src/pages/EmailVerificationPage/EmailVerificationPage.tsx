import { type SubmitEvent } from 'react';
import SingleFieldForm from '../../components/HabitForm/SingleFieldForm';
import './EmailVerificationPage.css';

function EmailVerificationPage() {
  const email = 'example@email.com';

  const handleSubmit = (
    e: SubmitEvent<HTMLFormElement | HTMLInputElement>,
  ) => {
    e.preventDefault();
    
    // TODO: Verify the code
  };

  return (
    <div className="email-verification-page">
      <SingleFieldForm
        label={`6 digit code sent to ${email}`}
        placeholder="Enter the code"
        type="text"
        inputMode="numeric"
        maxLength={6}
        required
        buttonText="Verify"
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default EmailVerificationPage;
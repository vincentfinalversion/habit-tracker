import { useEffect, useState, type SubmitEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SingleFieldForm from '../../components/SingleFieldForm/SingleFieldForm';
import { verifyEmail } from '../../api/registerApi';
import './EmailVerificationPage.css';

type LocationState = {
  email?: string;
};

function EmailVerificationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = (location.state as LocationState | null)?.email;

  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate('/auth', { replace: true });
    }
  }, [email, navigate]);

  const handleSubmit = async (
    e: SubmitEvent<HTMLFormElement | HTMLInputElement>,
  ) => {
    e.preventDefault();

    if (!email || otpCode.trim().length !== 6) return;

    setError('');
    setIsSubmitting(true);

    try {
      await verifyEmail(email, otpCode.trim());
      navigate('/auth', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <div className="email-verification-page">
      <SingleFieldForm
        label={`6 digit code sent to ${email}`}
        placeholder="Enter the code"
        type="text"
        inputMode="numeric"
        maxLength={6}
        required
        value={otpCode}
        onChange={(e) => setOtpCode(e.target.value)}
        error={error}
        buttonText={isSubmitting ? 'Verifying...' : 'Verify'}
        buttonDisabled={isSubmitting}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default EmailVerificationPage;
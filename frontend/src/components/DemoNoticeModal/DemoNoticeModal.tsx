import Button from '../Button/Button.tsx';
import './DemoNoticeModal.css';

type DemoNoticeModalProps = {
  onClose: () => void;
};

function DemoNoticeModal({ onClose }: DemoNoticeModalProps) {
  return (
    <div className="demo-notice-overlay" role="presentation" onClick={onClose}>
      <div
        className="demo-notice-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="demo-notice-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="demo-notice-title" className="demo-notice-title">
          Heads up before you log in
        </h2>
        <ul className="demo-notice-list">
          <li>
            This is hosted on Render's free tier, which blocks outgoing SMTP
            connections, so new registrations can't send the verification
            email right now.
          </li>
          <li>
            You can still log in with a demo account using username{' '}
            <code>testuser</code>, password <code>SuperSecret123</code>.
          </li>
          <li>
            The free tier also spins down when idle, so the first request
            can take a while to wake up.
          </li>
          <li>
            There's a video demo on the{' '}
            <a
              href="https://github.com/vincentfinalversion/habit-tracker"
              target="_blank"
              rel="noreferrer"
            >
              GitHub repo
            </a>{' '}
            if you'd rather just watch it in action.
          </li>
        </ul>
        <Button className="demo-notice-close" onClick={onClose}>
          Got it
        </Button>
      </div>
    </div>
  );
}

export default DemoNoticeModal;
import { useLocation, useNavigate } from 'react-router-dom';
import AuthForm, { type AuthMode } from './components/AuthForm';
import AuthHero from './components/AuthHero';
import styles from './AuthPage.module.scss';

/** Split-screen login/register page. Mode is derived from the route so /login and /register are shareable URLs. */
export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const mode: AuthMode = location.pathname === '/register' ? 'register' : 'login';

  const handleModeChange = (next: AuthMode) => {
    navigate(next === 'login' ? '/login' : '/register');
  };

  return (
    <div className={styles.page}>
      <AuthHero />
      <AuthForm mode={mode} onModeChange={handleModeChange} />
    </div>
  );
}

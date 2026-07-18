import { useState } from 'react';
import { AppButton, AppCheckbox, AppInput } from '@/widgets';
import styles from './AuthForm.module.scss';

export type AuthMode = 'login' | 'register';

interface AuthFormProps {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
}

const COPY = {
  login: {
    title: 'Welcome back',
    subtitle: 'Sign in to track cars, save searches, and message sellers.',
    submitLabel: 'Sign in',
    switchPrompt: "Don't have an account?",
    switchAction: 'Register',
  },
  register: {
    title: 'Create your account',
    subtitle: 'Join to save cars, get price alerts, and message verified sellers.',
    submitLabel: 'Create account',
    switchPrompt: 'Already have an account?',
    switchAction: 'Sign in',
  },
};

/** Right-hand form panel: segmented login/register toggle, fields, and CTA. UI only — no submission wiring yet. */
export default function AuthForm({ mode, onModeChange }: AuthFormProps) {
  const [remember, setRemember] = useState(true);
  const [agree, setAgree] = useState(false);
  const isLogin = mode === 'login';
  const copy = COPY[mode];

  return (
    <div className={styles.panel}>
      <div className={styles.inner}>

        <h2 className={styles.title}>{copy.title}</h2>
        <p className={styles.subtitle}>{copy.subtitle}</p>

        <div className={styles.segmented}>
          <button
            type="button"
            className={styles.segmentButton}
            aria-selected={isLogin}
            onClick={() => onModeChange('login')}
          >
            Sign in
          </button>
          <button
            type="button"
            className={styles.segmentButton}
            aria-selected={!isLogin}
            onClick={() => onModeChange('register')}
          >
            Register
          </button>
        </div>

        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          {!isLogin && <AppInput label="Full name" placeholder="Alex Morgan" />}

          <AppInput label="Email" type="email" placeholder="you@email.com" />

          <AppInput label="Password" type="password" placeholder="••••••••" />

          {isLogin && (
            <div className={styles.inlineRow}>
              <AppCheckbox
                label="Remember me"
                checked={remember}
                onChange={(_, checked) => setRemember(checked)}
              />
              <a className={styles.forgotLink} href="#" onClick={(e) => e.preventDefault()}>
                Forgot password?
              </a>
            </div>
          )}

          {!isLogin && (
            <AppCheckbox
              label="I agree to the Terms & Privacy Policy"
              checked={agree}
              onChange={(_, checked) => setAgree(checked)}
            />
          )}

          <AppButton type="submit" size="large" fullWidth>
            {copy.submitLabel}
          </AppButton>
        </form>

        <div className={styles.divider}>
          <div className={styles.dividerLine} />
          <span className={styles.dividerLabel}>OR</span>
          <div className={styles.dividerLine} />
        </div>
        <AppButton variant="outlined" size="large" fullWidth onClick={(e) => e.preventDefault()}>
          Continue with Google
        </AppButton>

        <p className={styles.switchPrompt}>
          {copy.switchPrompt}{' '}
          <a
            className={styles.switchAction}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onModeChange(isLogin ? 'register' : 'login');
            }}
          >
            {copy.switchAction}
          </a>
        </p>
      </div>
    </div>
  );
}

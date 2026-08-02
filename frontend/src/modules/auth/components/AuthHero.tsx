import { AppLogo } from '@/widgets';
import styles from './AuthHero.module.scss';

/** Left-hand branded hero panel shown alongside the login/register form. Hidden on small screens. */
export default function AuthHero() {
  return (
    <div className={styles.hero}>
      <img
        className={styles.photo}
        src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1400&q=80&auto=format&fit=crop"
        alt=""
      />
      <div className={styles.wash} />
      <div className={styles.glow} />

      <div className={styles.logo}>
        <AppLogo variant="white" height={56} />
      </div>

      <div className={styles.message}>
        <div className={styles.eyebrow}>The premium used-car marketplace</div>
        <h1 className={styles.headline}>
          Find the one
          <br />
          you&rsquo;ll keep.
        </h1>
        <p className={styles.subcopy}>
          Every car inspected across 200 points, price-checked against the market, and backed by verified sellers.
        </p>

        <div className={styles.stats}>
          <div>
            <div className={styles.statValue}>12,400+</div>
            <div className={styles.statLabel}>Verified cars</div>
          </div>
          <div className={styles.statDivider} />
          <div>
            <div className={styles.statValue}>
              4.9<span className={styles.statStar}> ★</span>
            </div>
            <div className={styles.statLabel}>Buyer rating</div>
          </div>
        </div>
      </div>
    </div>
  );
}

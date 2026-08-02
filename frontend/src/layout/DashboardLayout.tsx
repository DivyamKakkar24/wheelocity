import { Outlet } from 'react-router-dom';
import styles from './DashboardLayout.module.scss';

export default function DashboardLayout() {
  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>{/* sidebar nav */}</aside>
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}

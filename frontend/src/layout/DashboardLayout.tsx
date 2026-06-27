import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <aside
        style={{
          width: 240,
          flexShrink: 0,
          borderRight: '1px solid #e0e0e0',
          padding: '1.5rem 1rem',
        }}
      >
        {/* sidebar nav */}
      </aside>
      <main style={{ flex: 1, padding: '1.5rem', overflow: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}

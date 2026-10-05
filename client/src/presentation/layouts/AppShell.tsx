import { Outlet } from 'react-router-dom';
import { TopBar } from '@presentation/components/layout/TopBar';
import { Sidebar } from '@presentation/components/layout/Sidebar';
import { PreviewBar } from '@presentation/components/layout/PreviewBar';
import { useGlobalSearchShortcut } from '@application/hooks/useGlobalSearchShortcut';

export function AppShell() {
  useGlobalSearchShortcut();

  return (
    <div className="flex h-screen flex-col bg-bg-chassis text-text-primary">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto" id="main-content">
          <Outlet />
        </main>
      </div>
      <PreviewBar />
    </div>
  );
}

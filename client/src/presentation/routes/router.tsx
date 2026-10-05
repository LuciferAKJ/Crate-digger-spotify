import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '@presentation/layouts/AppShell';
import { RouteErrorPage } from '@presentation/pages/RouteErrorPage';
import { HomePage } from '@presentation/pages/HomePage';
import { SearchPage } from '@presentation/pages/SearchPage';
import { ArtistPage } from '@presentation/pages/ArtistPage';
import { AlbumPage } from '@presentation/pages/AlbumPage';
import { TrackPage } from '@presentation/pages/TrackPage';
import { FavoritesPage } from '@presentation/pages/FavoritesPage';
import { HistoryPage } from '@presentation/pages/HistoryPage';
import { SettingsPage } from '@presentation/pages/SettingsPage';
import { NotFoundPage } from '@presentation/pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'artist/:artistId', element: <ArtistPage /> },
      { path: 'album/:albumId', element: <AlbumPage /> },
      { path: 'track/:trackId', element: <TrackPage /> },
      { path: 'favorites', element: <FavoritesPage /> },
      { path: 'history', element: <HistoryPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

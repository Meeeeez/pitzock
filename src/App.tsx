import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { Route, Routes } from "react-router";
import { Dashboard } from "./pages/dashboard";
import { RootLayout } from "./layouts/RootLayout";
import Login from './pages/login';
import { ProtectedRoutes } from './lib/protected-routes';

export default function App() {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path='/login' element={<Login />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoutes />}>
          <Route element={<RootLayout />}>
            <Route index element={<Dashboard />} />
          </Route>
        </Route>
      </Routes>
    </QueryClientProvider>
  );
}
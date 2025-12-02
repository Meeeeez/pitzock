import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { Route, Routes } from "react-router";
import Login from './pages/login';
import { ProtectedRoutes } from './lib/protected-routes';
import { Dashboard } from './pages/dashboard';

export default function App() {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path='/login' element={<Login />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoutes />}>
          <Route index element={<Dashboard />} />
        </Route>
      </Routes>
    </QueryClientProvider>
  );
}
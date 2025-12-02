import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { Route, Routes } from "react-router";
import { Dashboard } from "./pages/Dashboard";
import { RootLayout } from "./layouts/RootLayout";

export default function App() {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<Dashboard />} />
        </Route>
      </Routes>
    </QueryClientProvider>
  );
}
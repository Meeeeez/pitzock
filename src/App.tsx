import { Route, Routes } from "react-router";
import { Dashboard } from "./pages/Dashboard";
import { RootLayout } from "./layouts/RootLayout";

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<Dashboard />} />
      </Route>
    </Routes>
  );
}
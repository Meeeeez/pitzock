import { Navigate, Outlet } from "react-router"
import pb from "./pocketbase";

export function ProtectedRoutes() {
  return pb.authStore.isValid ? <Outlet /> : <Navigate to="/login" />;
}

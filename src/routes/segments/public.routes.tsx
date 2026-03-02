import { Route } from "react-router-dom";
import Cadastro from "@/pages/RegisterUserPage";
import CompleteProfilePage from "@/pages/complete-profile";
import Login from "@/pages/login-page";

export function PublicRoutes() {
  return (
    <>
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/insertEmailAndPhoneNumber"
        element={<CompleteProfilePage />}
      />
    </>
  );
}

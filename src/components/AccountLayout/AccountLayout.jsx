import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Outlet } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const AccountLayout = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) return null; // Prevent rendering if not logged in

  return (
    <div>
      {/* Add layout elements if needed */}
      <Header />
      <Outlet /> {/* This ensures child routes are rendered */}
      <Footer />
    </div>
  );
};

export default AccountLayout;

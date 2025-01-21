import { Route, Routes } from "react-router-dom";
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import AdminLayout from "./components/admin-view/layout";
import AdminDashboard from "./pages/admin-view/dashboard";
import AdminProducts from "./pages/admin-view/products";
import AdminOrders from "./pages/admin-view/orders";
import AdminFeatures from "./pages/admin-view/features";
import ShoppingLayout from "./components/shopping-view/layout";
import NotFound from "./pages/not-found";
import ShoppingHome from "./pages/shopping-view/home";
import ShoppingListing from "./pages/shopping-view/listing";
import ShoppingCheckout from "./pages/shopping-view/checkout";
import ShoppingAccount from "./pages/shopping-view/account";
import CheckAuth from "./components/common/check-auth";
import UnauthPage from "./pages/unauth-page";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/auth-slice";
import { Skeleton } from "@/components/ui/skeleton";
import PaypalReturnPage from "./pages/shopping-view/paypal-return";
import PaymentSuccessPage from "./pages/shopping-view/payment-success";
import SearchProducts from "./pages/shopping-view/search";
import ProductDetails from "./pages/shopping-view/ProductDetails";
import SuccessPage from "./pages/shopping-view/SuccessPage";
function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading)
    return (
      <div className="w-full flex justify-center items-center h-full">
        {" "}
        <img src="/Loading.svg" />
      </div>
    );

  console.log(isLoading, user, "ssssssssss");

  return (
    <div className="flex flex-col overflow-hidden ">
      <Routes>
        {/* <Route path="/" element={<ShoppingHome />} /> */}

        {/* Auth Routes - Optional, remove if not needed
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route> */}

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="features" element={<AdminFeatures />} />
        </Route>

        {/* main Routes */}
        <Route path="/" element={<ShoppingLayout />}>
          <Route path="/product/:productId" element={<ProductDetails />} />

          <Route path="/" element={<ShoppingHome />} />
          <Route path="/listing" element={<ShoppingListing />} />
          <Route path="account" element={<ShoppingAccount />} />
          <Route path="paypal-return" element={<PaypalReturnPage />} />
          <Route path="payment-success" element={<PaymentSuccessPage />} />
          <Route path="/search" element={<SearchProducts />} />
        </Route>
        <Route path="/Success" element={<SuccessPage />} />

        <Route path="/checkout" element={<ShoppingCheckout />} />
        {/* Other Routes */}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;

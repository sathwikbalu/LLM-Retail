import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import {
  Route,
  RouterProvider,
  createRoutesFromElements,
} from "react-router-dom";
import "./index.css";
import { createBrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store.js";
//Privateroute
import PrivateRoute from "./components/PrivateRoute.jsx";
//Auth
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import Profile from "./pages/User/Profile.jsx";
import Search from "./pages/Auth/Search.jsx";
//admin

import AdminRoute from "./pages/Admin/AdminRoute.jsx";
import UserList from "./pages/Admin/UserList.jsx";
import CategoryList from "./pages/Admin/CategoryList.jsx";
import ProductList from "./pages/Admin/ProductList.jsx";
import ProductUpdate from "./pages/Admin/ProductUpdate.jsx";
import AllProducts from "./pages/Admin/AllProducts.jsx";
import Home from "./pages/Home.jsx";
import Favorites from "./pages/Products/Favorites.jsx";
import ProductDetails from "./pages/Products/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import Shop from "./pages/Shop.jsx";
import Shipping from "./pages/Orders/Shipping.jsx";
import PlaceOrder from "./pages/Orders/PlaceOrder.jsx";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import Order from "./pages/Orders/Order.jsx";
import UserOrder from "./pages/User/UserOrder.jsx";
import OrderList from "./pages/Admin/OrderList.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import BranchList from "./pages/Owner/BranchList.jsx";
import OwnerRoute from "./pages/Owner/OwnerRoute.jsx";
import Dashboard from "./pages/Owner/Dashboard.jsx";
import OwnerRegister from "./pages/Auth/OwnerRegister.jsx";
import AllOwnerProducts from "./pages/Owner/AllOwnerProducts.jsx";
import AdminList from "./pages/Owner/AdminList.jsx";
import Request from "./pages/Admin/Request.jsx";
import BranchProductDetails from "./pages/Owner/Reports.jsx";


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/OwnerRegister" element={<OwnerRegister />} />
      <Route path="/home" element={<Home />} />
      <Route path="/favorite" element={<Favorites />} />
      <Route path="/product/:id" element={<ProductDetails />} />

      <Route path="" element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/placeorder" element={<PlaceOrder />} />
        <Route path="/order/:id" element={<Order />} />

        <Route path="/cart" element={<Cart />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/user-orders" element={<UserOrder />} />
        <Route path="/search" element={<Search />} />
      </Route>
      {/* admin routes */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route path="userlist" element={<UserList />} />
        <Route path="categorylist" element={<CategoryList />} />
        <Route path="productlist" element={<ProductList />} />
        <Route path="allproductslist" element={<AllProducts />} />
        <Route path="orderlist" element={<OrderList />} />
        <Route path="product/update/:_id" element={<ProductUpdate />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="request" element={<Request />} />
      </Route>

      {/* Owner Routes */}
      <Route path="/owner" element={<OwnerRoute />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<AllOwnerProducts />} />
        <Route path="branchlist" element={<BranchList />} />
        <Route path="categorylist" element={<CategoryList />} />
        <Route path="allAdmin" element={<AdminList />} />
        <Route path="reports" element={<BranchProductDetails/>} />
      </Route>
    </Route>
  )
);
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PayPalScriptProvider>
      <RouterProvider router={router} />
    </PayPalScriptProvider>
  </Provider>
);
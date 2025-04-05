import React, { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { shoppingViewHeaderMenuItems } from "@/config";
import { fetchCartItems } from "@/store/shop/cart-slice";

import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

import {
  HousePlug,
  LogOut,
  Menu,
  Search,
  ShoppingBasket,
  X,
} from "lucide-react";

import logo from "../../assets/logo.svg";
import instagram from "../../assets/icons/instagram.svg";
import facebook from "../../assets/icons/facebook.svg";
import tiktok from "../../assets/icons/tiktok.svg";

import UserCartWrapper from "./cart-wrapper";

function ShoppingHeader() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const dispatch = useDispatch();

  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredMenuItem, setHoveredMenuItem] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

  const handleNavigate = (item) => {
    sessionStorage.removeItem("filters");

    const currentFilter = !["about", "home", "products", "search"].includes(
      item.id
    )
      ? { category: [item.id] }
      : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    if (location.pathname === "/" && item.id === "home") {
      navigate("/");
    } else if (location.pathname.includes("listing") && currentFilter) {
      setSearchParams(new URLSearchParams(`?category=${item.id}`));
    } else {
      navigate(item.path);
    }

    setMenuOpen(false); // close on navigate
  };

  return (
    <header className="sticky top-0 z-50 w-full b bg-background">
      <div className="flex h-20 items-center justify-between px-4 md:px-20">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="h-20 w-20" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-4">
          {shoppingViewHeaderMenuItems
            .slice()
            .reverse()
            .map((item) => (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredMenuItem(item.id)}
                onMouseLeave={() => setHoveredMenuItem(null)}
                className="relative"
              >
                <Label
                  onClick={() => handleNavigate(item)}
                  className="text-lg font-medium text-primary cursor-pointer hover:bg-[#F0EBF1] py-2 px-2 rounded-sm"
                >
                  {item.label}
                </Label>

                {item.submenu && hoveredMenuItem === item.id && (
                  <div className="absolute top-full right-0 bg-white shadow-lg rounded-md mt-1 z-50 animate-fade-in">
                    {item.submenu.map((sub) => (
                      <div
                        key={sub.id}
                        onClick={() => handleNavigate(sub)}
                        className="text-primary text-md pl-20 pr-5 py-2 m-2  hover:bg-accent rounded-sm cursor-pointer"
                      >
                        {sub.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

          {/* Search & Cart */}
          <div className="flex items-center gap-1">
            <Link to="/search">
              <Search className="w-10 h-10 hover:text-primary p-2 hover:bg-accent rounded-xl" />
            </Link>
            <button onClick={() => setCartOpen(true)} className="relative">
              <ShoppingBasket className="w-10 h-10 hover:text-primary p-2 hover:bg-accent rounded-xl" />
              <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full">
                {cartItems?.length || 0}
              </span>
            </button>
          </div>
        </nav>

        {/* Mobile Controls */}
        <div className="flex lg:hidden items-center gap-2">
          <button onClick={() => setCartOpen(true)} className="relative">
            <ShoppingBasket className="w-10 h-10 hover:text-primary p-2 hover:bg-accent rounded-xl" />
            <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full">
              {cartItems?.length || 0}
            </span>
          </button>
          <Link to="/search">
            <Search className="w-10 h-10 hover:text-primary p-2 hover:bg-accent rounded-xl" />
          </Link>
          <button onClick={() => setMenuOpen(true)}>
            <Menu className="w-10 h-10 hover:text-primary p-2 hover:bg-accent rounded-xl" />
          </button>
        </div>
      </div>

      {/* Cart Drawer */}
      <div
        className={`fixed inset-0 z-50 backdrop-blur-sm bg-black bg-opacity-20 transition-opacity duration-300 ease-in-out ${
          cartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setCartOpen(false)}
      >
        <UserCartWrapper
          setOpenCartSheet={setCartOpen}
          cartItems={cartItems || []}
          cartIsOpen={cartOpen}
        />
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed inset-0 z-50 backdrop-blur-sm bg-black bg-opacity-20 transition-opacity duration-300 ease-in-out ${
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
        style={{ direction: "rtl" }}
      >
        <div
          className={`absolute top-0 right-0 h-full w-80 md:w-1/3 bg-white shadow-lg p-4 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4 ">
            <h2 className="text-xl font-bold"></h2>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 hover:bg-accent rounded-xl"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {shoppingViewHeaderMenuItems.map((item) => (
              <div key={item.id}>
                <div
                  onClick={() => handleNavigate(item)}
                  className="text-primary text-md px-4 py-2 rounded-md hover:bg-accent cursor-pointer"
                >
                  {item.label}
                </div>
                {item.submenu &&
                  item.submenu.map((sub) => (
                    <div
                      key={sub.id}
                      onClick={() => handleNavigate(sub)}
                      className="ml-4 text-sm text-gray-700 px-4 py-1 hover:bg-gray-100 rounded cursor-pointer"
                    >
                      {sub.label}
                    </div>
                  ))}
              </div>
            ))}
            <div className="flex gap-2 mt-4 justify-center">
              <a
                href="https://www.instagram.com/picky_qatar/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-accent rounded-xl "
              >
                <img src={instagram} alt="Instagram" className="w-6 h-6" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61564280737976"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-accent rounded-xl "
              >
                <img src={facebook} alt="Facebook" className="w-6 h-6" />
              </a>
              <a
                href="https://www.tiktok.com/@picky_qa"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-accent rounded-xl "
              >
                <img src={tiktok} alt="TikTok" className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;

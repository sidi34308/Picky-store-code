import {
  HousePlug,
  LogOut,
  Menu,
  Search,
  ShoppingBag,
  ShoppingBasket,
  ShoppingCart,
  UserCog,
} from "lucide-react";
import logo from "../../assets/logo.svg";
import cart from "../../assets/cart.svg";
import search from "../../assets/search.svg";

import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";

function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [hoveredMenuItem, setHoveredMenuItem] = useState(null);
  const handleMouseEnter = (id) => setHoveredMenuItem(id);
  const handleMouseLeave = () => setHoveredMenuItem(null);

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");

    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? { category: [getCurrentMenuItem.id] }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(
          new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
        )
      : navigate(getCurrentMenuItem.path);
  }

  return (
    <nav
      className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-1 lg:flex-row"
      style={{ direction: "rtl" }}
    >
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <div
          key={menuItem.id}
          onMouseEnter={() => handleMouseEnter(menuItem.id)}
          onMouseLeave={handleMouseLeave}
          className="relative"
        >
          <Label
            onClick={() => handleNavigate(menuItem)}
            className="text-lg font-medium text-primary cursor-pointer  hover:bg-[#F0EBF1] py-2 px-2 rounded-sm transition-all duration-600 ease-in-out"
          >
            {menuItem.label}
          </Label>

          {/* Dropdown Menu */}
          {menuItem.submenu && hoveredMenuItem === menuItem.id && (
            <div className="absolute top-full right-0 bg-white nav-shadow rounded-sm mt-1 z-10">
              {menuItem.submenu.map((subItem) => (
                <div
                  key={subItem.id}
                  onClick={() => handleNavigate(subItem)}
                  className="text-primary text-md pl-16 pr-2 py-2 m-1 rounded-sm hover:bg-accent text-right cursor-pointer transition-all duration-600 ease-in-out"
                >
                  {subItem.label}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}

function HeaderRightContent() {
  // const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

  console.log(cartItems, "sangam");

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-1">
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          size="icon"
          className="relative ring-0"
        >
          <ShoppingBasket className="w-10 h-10 p-2 hover:bg-accent rounded-md " />
          <span className="absolute top-[0px] right-[-8px] font-bold text-sm bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
            {cartItems?.length || 0}
          </span>

          <span className="sr-only">User cart</span>
        </button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={cartItems && cartItems.length > 0 ? cartItems : []}
        />
        <Link to="/search" className="flex items-center gap-2">
          <Search className="w-10 h-10 p-2 hover:bg-accent rounded-md" />
        </Link>
      </Sheet>
    </div>
  );
}

function ShoppingHeader() {
  // const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <header className="sticky border-none  top-0 z-40 w-full border-b bg-background">
      {/* <div className="bg-primary w-full h-4"></div> */}
      <div className="flex h-20 items-center justify-between px-4 md:px-20">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="picky Ecommerce Logo" className="h-18 w-18" />
        </Link>

        <Sheet>
          <Link to="/search" className="block lg:hidden  items-center gap-2">
            <Search className="w-10 h-10 p-2 hover:bg-accent rounded-md" />
          </Link>

          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs">
            <MenuItems />
          </SheetContent>
        </Sheet>
        <div className="hidden lg:block">
          <MenuItems />
        </div>

        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import UserCartItemsContent from "./cart-items-content";
import axios from "axios";
import { X } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function UserCartWrapper({ cartItems, setOpenCartSheet, cartIsOpen }) {
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/shop/products/get`
        );
        setAllProducts(response.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchAllProducts();
  }, []);

  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce((sum, currentItem) => {
          const product = allProducts.find(
            (product) => product._id === currentItem.productId
          );
          const price =
            product?.salePrice > 0 ? product.salePrice : product?.price;
          return sum + price * currentItem.quantity;
        }, 0)
      : 0;

  const handleCheckout = () => {
    window.location.href = "/checkout";
  };

  return (
    <div
      className={`absolute top-0 right-0 h-full w-80 md:w-1/3 bg-white shadow-lg p-4 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
        cartIsOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div
        className="w-full bg-white h-full p-4 max-h-full overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()} // Prevent click from closing the drawer
      >
        {/* Cart Header */}
        <div className="flex justify-between items-center mb-10">
          <button onClick={() => setOpenCartSheet(false)}>
            <X className="w-10 h-10 hover:text-primary p-2 hover:bg-accent rounded-xl" />
          </button>
          <h2 className="text-xl font-bold text-primary">سلة مشترياتي</h2>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {cartItems && cartItems.length > 0 ? (
            cartItems.map((item) => (
              <UserCartItemsContent
                key={item.productId}
                cartItem={item}
                allProducts={allProducts}
              />
            ))
          ) : (
            <p className="text-right text-black/50">سلة المشتريات فارغة</p>
          )}
        </div>

        {/* Total and Checkout Button */}
        {cartItems && cartItems.length > 0 && (
          <div className="mt-4">
            <div className="flex justify-between">
              <span>المجموع الكلي</span>
              <span
                className="font-bold text-primary text-xl"
                style={{ direction: "rtl" }}
              >
                {totalCartAmount} {" ر.ق "}
              </span>
            </div>
            <Button onClick={handleCheckout} className="w-full mt-4">
              إتمام الشراء
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserCartWrapper;

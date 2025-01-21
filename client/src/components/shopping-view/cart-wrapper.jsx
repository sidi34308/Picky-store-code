import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";
import axios from "axios";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/shop/products/get"
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

  return (
    <SheetContent className="sm:max-w-md">
      <SheetHeader>
        <SheetTitle>سلة مشترياتي</SheetTitle>
      </SheetHeader>
      <div className="mt-8 space-y-4">
        {cartItems && cartItems.length > 0 ? (
          cartItems.map((item) => (
            <UserCartItemsContent
              key={item.productId}
              cartItem={item}
              allProducts={allProducts}
            />
          ))
        ) : (
          <p>سلة المشتريات فارغة</p>
        )}
      </div>
      <div className="mt-8 space-y-4">
        <div className="flex justify-between">
          <span>المجموع الكلي</span>
          <span>{totalCartAmount} ريال</span>
        </div>
        <Button onClick={() => navigate("/checkout")} className="w-full">
          إتمام الشراء
        </Button>
      </div>
    </SheetContent>
  );
}

export default UserCartWrapper;

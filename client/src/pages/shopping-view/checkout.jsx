import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { fetchCartItems, clearCart } from "@/store/shop/cart-slice";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import { sendOrderEmail } from "@/lib/emailService";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import SuccessMessage from "./SuccessMessage";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, ShoppingCart, Plus, Minus } from "lucide-react";
import { createNewOrder } from "@/store/shop/order-slice";
import usePhoneValidation from "@/hooks/usePhoneValidation"; // Import the hook

function ShoppingCheckout() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    age: "",
    phone: "",
    address: "",
    region: "",
    notes: "",
  });
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const phoneValidation = usePhoneValidation(phone); // Use the hook

  const handlePhoneChange = (value) => {
    setPhone(value);
  };

  const [deliveryFee] = useState(25); // Fixed delivery fee
  const [totalAmount, setTotalAmount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch cart items and products
  useEffect(() => {
    dispatch(fetchCartItems());
    dispatch(
      fetchAllFilteredProducts({ filterParams: {}, sortParams: "defaultSort" })
    );
  }, [dispatch]);

  // Calculate total amount based on cart and product data
  useEffect(() => {
    if (cartItems.length > 0 && productList.length > 0) {
      const cartDetails = cartItems.map((cartItem) => {
        const product = productList.find((p) => p._id === cartItem.productId);
        return {
          ...cartItem,
          ...product,
        };
      });

      const calculatedTotal = cartDetails.reduce(
        (sum, item) =>
          sum + (item.salePrice ? item.salePrice : item.price) * item.quantity,
        0
      );

      setTotalAmount(calculatedTotal + deliveryFee);
    }
  }, [cartItems, productList, deliveryFee]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const countryCodeLength = 4;
  // Submit order
  const handleSubmitOrder = async () => {
    if (
      !formData.fullName ||
      !phone ||
      !formData.region ||
      phone.length <= countryCodeLength
    ) {
      toast({
        title: "يرجى ملء جميع الحقول المطلوبة.",
        variant: "destructive",
      });
      return;
    }
    // Validate phone number
    if (!phoneValidation.isValid) {
      toast({
        title: "رقم الهاتف غير صالح.",
        description: phoneValidation.errorMessage,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const orderData = {
      ...formData,
      phone,
      cartItems: cartItems.map((cartItem) => {
        const product = productList.find((p) => p._id === cartItem.productId);
        return {
          productId: cartItem.productId,
          image: cartItem.image,
          title: product.title,
          quantity: cartItem.quantity,
          name: product.name,
          price:
            product.salePrice && product.salePrice > 1
              ? product.salePrice
              : product.price,
        };
      }),
      totalAmount,
      orderDate: new Date().toISOString(),
    };

    try {
      await sendOrderEmail(orderData);
      await dispatch(createNewOrder(orderData)).unwrap();
      dispatch(clearCart()); // Clear the cart
      setShowSuccess(true);
      navigate("/Success"); // Navigate to success page
    } catch (error) {
      console.error("Error submitting order:", error);
      toast({
        title: "خطأ في إرسال الطلب.",
        description: "يرجى المحاولة مرة أخرى لاحقًا.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-w-full flex flex-col gap-6 px-20 py-10"
      style={{ direction: "rtl" }}
    >
      <div className="flex items-center gap-2 justify-end">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-md hover:bg-accent transition duration-300 z-10"
        >
          <ArrowLeft className="w-6 h-6 text-primary" />
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-5 text-black">
        املأ البيانات أدناه وسنقوم بالتواصل معك في أقرب وقت لتأكيد الطلب وتوصيله
        إلى بابك.
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block mb-2 font-bold">
              الاسم الكامل <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full p-2 rounded-sm"
              placeholder="يرجى إدخال الاسم الكامل"
            />
          </div>
          <div>
            <label className="block mb-2 font-bold">البريد الإلكتروني</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 rounded-sm"
              placeholder="يرجى إدخال البريد الإلكتروني"
            />
          </div>
          <div>
            <label className="block mb-2 font-bold">العمر</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className="w-full p-2 rounded-sm"
              placeholder="يرجى إدخال العمر"
            />
          </div>
          <div>
            <label className="block mb-2 font-bold">
              رقم الهاتف <span className="text-red-600">*</span>
            </label>
            <div className="" style={{ direction: "ltr" }}>
              <PhoneInput
                defaultCountry="qa"
                value={phone}
                onChange={handlePhoneChange}
                className="custom-phone-input"
                buttonClassName="custom-phone-input-button"
                inputStyle={{
                  border: "none",
                  borderRadius: "10px",
                  padding: "1rem",
                  fontSize: "16px",
                  width: "100%",
                }}
                buttonStyle={{
                  border: "none",
                  backgroundColor: "#f0f0f0",
                  borderRadius: "8px 0 0 8px",
                  padding: "10px",
                }}
              />
              {!phoneValidation.isValid && (
                <p className="text-red-600 mt-2">
                  {phoneValidation.errorMessage}
                </p>
              )}
            </div>
          </div>
          <div>
            <label className="block mb-2 font-bold">العنوان</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full p-2 rounded-sm"
              placeholder="يرجى إدخال العنوان"
            />
          </div>
          <div>
            <label className="block mb-2 font-bold">
              اسم المنطقة <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="region"
              value={formData.region}
              onChange={handleInputChange}
              className="w-full p-2 rounded-sm"
              placeholder="يرجى إدخال اسم المنطقة"
            />
          </div>
          <div>
            <label className="block mb-2 font-bold">ملاحظات إضافية</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full p-2 rounded-sm"
              placeholder="إذا كانت لديكم أي تعليمات خاصة، يرجى كتابتها هنا."
            />
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-bold mb-4">ملخص الطلب</h3>
          <div className="mb-4">
            {cartItems && cartItems.length > 0 ? (
              <div className="space-y-4" style={{ direction: "ltr" }}>
                {cartItems.map((item) => (
                  <UserCartItemsContent
                    key={item.productId}
                    cartItem={item}
                    allProducts={productList}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-600">عربة التسوق فارغة.</p>
            )}
          </div>
          <div className="flex justify-between mb-4 mt-10">
            <span>رسوم التوصيل</span>
            <span>{deliveryFee} ريال</span>
          </div>
          <div className="flex justify-between font-bold text-black">
            <span>المجموع</span>
            <span>{totalAmount} ريال</span>
          </div>
          <div className="flex justify-between gap-4">
            <a
              href="/"
              className="mt-6 flex-2 bg-white text-primary hover:bg-accent rounded-md py-2 px-3"
            >
              تسوق المزيد
            </a>
            <Button
              onClick={handleSubmitOrder}
              className="mt-6 flex-1 bg-pink-500 text-white hover:bg-pink-600"
              disabled={isSubmitting || cartItems.length === 0}
            >
              {isSubmitting ? "جاري الإرسال..." : "إرسال الطلب"}
            </Button>
          </div>

          <SuccessMessage
            isVisible={showSuccess}
            onClose={() => setShowSuccess(false)}
          />
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;

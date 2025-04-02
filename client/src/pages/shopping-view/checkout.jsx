import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { fetchCartItems, clearCart } from "@/store/shop/cart-slice";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import { sendOrderEmail } from "@/lib/emailService";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import SuccessMessage from "./SuccessMessage";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { createNewOrder } from "@/store/shop/order-slice";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./ShoppingCheckout.css"; // Import the CSS file
import { withTranslation } from "react-google-multi-lang";

// Define validation schema
const schema = yup.object().shape({
  fullName: yup.string().required("الاسم الكامل مطلوب"),
  email: yup.string().email("البريد الإلكتروني غير صالح").optional(),
  birthDate: yup.date().nullable(),
  phone: yup.string().required("رقم الهاتف مطلوب"),
  address: yup.string().optional(),
  region: yup.string().required("اسم المنطقة مطلوب"),
  notes: yup.string().optional(),
});

function ShoppingCheckout() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);
  const navigate = useNavigate();
  const [totalAmount, setTotalAmount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      birthDate: null,
      phone: "",
      address: "",
      region: "",
      notes: "",
    },
  });

  const phone = watch("phone");

  useEffect(() => {
    dispatch(fetchCartItems());
    dispatch(
      fetchAllFilteredProducts({ filterParams: {}, sortParams: "defaultSort" })
    );
  }, [dispatch]);

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

      setTotalAmount(calculatedTotal);
    }
  }, [cartItems, productList]);

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDifference = today.getMonth() - birthDateObj.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDateObj.getDate())
    ) {
      age--;
    }
    return age;
  };

  const onSubmit = async (data) => {
    const age = calculateAge(data.birthDate);
    if (age < 0) {
      toast({
        title: "تاريخ الميلاد غير صالح.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const orderData = {
      ...data,
      age,
      birthDate: data.birthDate, // Ensure birth date is included in the order data
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
      orderId: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`, // Generate a simple, unique order ID
    };

    try {
      await sendOrderEmail(orderData);
      // await dispatch(createNewOrder(orderData)).unwrap();
      dispatch(clearCart());
      setShowSuccess(true);
      navigate("/Success");
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
      className="min-w-full flex flex-col gap-6 px-10 sm:px-20 py-10 font-alexandria"
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
      <h2 className="text-xl font-bold mb-5 text-black">
        املأ البيانات أدناه وسنقوم بالتواصل معك في أقرب وقت لتأكيد الطلب وتوصيله
        إلى بابك.
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="space-y-4">
          {/* Full Name Field */}
          <div>
            <label className="block mb-2 font-bold">
              الاسم الكامل <span className="text-red-600">*</span>
            </label>
            <Controller
              name="fullName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  variant="outlined"
                  fullWidth
                  placeholder="يرجى إدخال الاسم الكامل"
                  error={!!errors.fullName}
                  helperText={errors.fullName?.message}
                  className="bg-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              )}
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block mb-2 font-bold">البريد الإلكتروني</label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="email"
                  variant="outlined"
                  fullWidth
                  placeholder="يرجى إدخال البريد الإلكتروني"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  className="bg-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              )}
            />
          </div>

          {/* Birth Date Field */}
          <div>
            <label className="block mb-2 font-bold">تاريخ الميلاد</label>
            <Controller
              name="birthDate"
              control={control}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    {...field}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        fullWidth
                        placeholder="يرجى اختيار تاريخ الميلاد"
                        error={!!errors.birthDate}
                        helperText={errors.birthDate?.message}
                        className="bg-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    )}
                  />
                </LocalizationProvider>
              )}
            />
          </div>

          {/* Phone Field */}
          <div>
            <label className="block mb-2 font-bold">
              رقم الهاتف <span className="text-red-600">*</span>
            </label>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <PhoneInput
                    {...field}
                    international
                    defaultCountry="QA"
                    placeholder="يرجى إدخال رقم الهاتف"
                    className="PhoneInput"
                    inputClassName="PhoneInputInput"
                  />
                  {errors.phone && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          {/* Address Field */}
          <div>
            <label className="block mb-2 font-bold">العنوان</label>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  variant="outlined"
                  fullWidth
                  placeholder="يرجى إدخال العنوان"
                  error={!!errors.address}
                  helperText={errors.address?.message}
                  className="bg-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              )}
            />
          </div>

          {/* Region Field */}
          <div>
            <label className="block mb-2 font-bold">
              اسم المنطقة <span className="text-red-600">*</span>
            </label>
            <Controller
              name="region"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  variant="outlined"
                  fullWidth
                  placeholder="يرجى إدخال اسم المنطقة"
                  error={!!errors.region}
                  helperText={errors.region?.message}
                  className="bg-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              )}
            />
          </div>

          {/* Notes Field */}
          <div>
            <label className="block mb-2 font-bold">ملاحظات إضافية</label>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="إذا كانت لديكم أي تعليمات خاصة، يرجى كتابتها هنا."
                  error={!!errors.notes}
                  helperText={errors.notes?.message}
                  className="bg-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              )}
            />
          </div>
        </div>

        {/* Order Summary Section */}
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
          <div className="text-gray-600">
            قد تنطبق رسوم توصيل إضافية حسب المنطقة
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
              type="submit"
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
      </form>
    </div>
  );
}

export default ShoppingCheckout;

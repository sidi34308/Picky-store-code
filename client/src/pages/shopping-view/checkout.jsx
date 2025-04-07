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
import { TextField } from "@mui/material";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./ShoppingCheckout.css";
import { withTranslation } from "react-google-multi-lang";
import logo from "../../assets/logo.svg";

const schema = yup.object().shape({
  fullName: yup.string().required("الاسم الكامل مطلوب"),
  email: yup.string().email("البريد الإلكتروني غير صالح").optional(),
  birthYear: yup.string().required("تاريخ الميلاد مطلوب"),
  birthMonth: yup.string().required("تاريخ الميلاد مطلوب"),
  birthDay: yup.string().required("تاريخ الميلاد مطلوب"),
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
      birthYear: "",
      birthMonth: "",
      birthDay: "",
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

  const calculateAge = (year, month, day) => {
    const today = new Date();
    const birthDateObj = new Date(`${year}-${month}-${day}`);
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
    const age = calculateAge(data.birthYear, data.birthMonth, data.birthDay);
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
      birthDate: `${data.birthYear}-${data.birthMonth}-${data.birthDay}`,
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
      orderId: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    };

    try {
      await sendOrderEmail(orderData);
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

  const generateOptions = (start, end) => {
    return Array.from({ length: end - start + 1 }, (_, i) => {
      const value = (start + i).toString().padStart(2, "0");
      return (
        <option key={value} value={value}>
          {value}
        </option>
      );
    });
  };

  return (
    <div
      className="min-w-full flex flex-col gap-6 px-10 sm:px-20 py-10 font-alexandria"
      style={{ direction: "rtl" }}
    >
      <div className="flex items-center gap-2 justify-between">
        <a to="/" className="flex  justify-center items-center ">
          <img src={logo} alt="Logo" className="h-26 w-26" />
        </a>
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-md hover:bg-accent transition duration-300 z-10"
        >
          <ArrowLeft className="w-6 h-6 text-primary" />
        </button>
      </div>

      <h2 className="text-md font-bold mb-5 text-primary">
        املأ البيانات أدناه وسنقوم بالتواصل معك في أقرب وقت لتأكيد الطلب وتوصيله
        إلى بابك.
      </h2>

      <div className="flex flex-col md:flex-row gap-8 w-full">
        <div className="md:w-1/2 w-full space-y-4">
          <h3 className="text-lg font-bold mb-4">ملخص الطلب</h3>
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
          <div className="text-primary">
            قد تنطبق رسوم توصيل إضافية حسب المنطقة
          </div>
          <div className="text-xl flex justify-between font-semibold text-black">
            <span>المجموع</span>
            <span>
              {totalAmount} {" ر.ق "}
            </span>
          </div>

          <form
            className="flex justify-between gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <a
              href="/"
              className="mt-6 flex-2 bg-white text-primary hover:bg-accent rounded-md py-3 px-3"
            >
              تسوق المزيد
            </a>
            <Button
              type="submit"
              className="mt-6 flex-1 bg-primary text-white hover:bg-accent hover:text-primary rounded-md py-6 px-3"
              disabled={isSubmitting || cartItems.length === 0}
            >
              {isSubmitting ? "جاري الإرسال..." : "إرسال الطلب"}
            </Button>
          </form>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="md:w-1/2 w-full space-y-6 bg-[#f5f5f5] p-3 rounded-xl"
        >
          <div>
            <label className="block mb-2 font-bold">
              الاسم الكامل <span className="text-red-600">*</span>
            </label>
            <Controller
              name="fullName"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <TextField
                    {...field}
                    variant="outlined"
                    fullWidth
                    placeholder="يرجى إدخال الاسم الكامل"
                    className="bg-white rounded-xl"
                  />
                  {errors.fullName && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

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
                  className="bg-primary rounded-xl border-none"
                />
              )}
            />
          </div>

          <div>
            <label className="block mb-2 font-bold">
              تاريخ الميلاد <span className="text-red-600">*</span>
            </label>
            <div className="flex gap-2">
              <Controller
                name="birthYear"
                control={control}
                render={({ field }) => (
                  <select {...field} className="w-1/3  rounded-xl p-2">
                    <option value="">السنة</option>
                    {generateOptions(1940, new Date().getFullYear())}
                  </select>
                )}
              />
              <Controller
                name="birthMonth"
                control={control}
                render={({ field }) => (
                  <select {...field} className="w-1/3  rounded-xl p-2">
                    <option value="">الشهر</option>
                    {generateOptions(1, 12)}
                  </select>
                )}
              />
              <Controller
                name="birthDay"
                control={control}
                render={({ field }) => (
                  <select {...field} className="w-1/3  rounded-xl p-2">
                    <option value="">اليوم</option>
                    {generateOptions(1, 31)}
                  </select>
                )}
              />
            </div>
            {(errors.birthYear || errors.birthMonth || errors.birthDay) && (
              <p className="mt-2 text-sm text-red-600">تاريخ الميلاد مطلوب</p>
            )}
          </div>

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

          <div>
            <label className="block mb-2 font-bold">
              اسم المنطقة <span className="text-red-600">*</span>
            </label>
            <Controller
              name="region"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <TextField
                    {...field}
                    variant="outlined"
                    fullWidth
                    placeholder="يرجى إدخال اسم المنطقة"
                    className="bg-white rounded-xl"
                  />
                  {errors.region && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.region.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

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
                  className="bg-white rounded-xl"
                />
              )}
            />
          </div>
        </form>
      </div>

      <SuccessMessage
        isVisible={showSuccess}
        onClose={() => setShowSuccess(false)}
      />

      <div className="text-center mt-1 notranslate">
        <p className="text-gray-500 text-sm"> 2025© Picky</p>
      </div>
    </div>
  );
}

export default ShoppingCheckout;

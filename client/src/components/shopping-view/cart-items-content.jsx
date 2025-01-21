import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";

function UserCartItemsContent({ cartItem, allProducts }) {
  const dispatch = useDispatch();
  const { toast } = useToast();

  // Find product details based on productId
  const product = allProducts.find(
    (product) => product._id === cartItem?.productId
  );

  // If product not found
  if (!product) {
    return (
      <div className="flex items-center justify-between bg-red-50 p-4 rounded-md">
        <p className="text-red-600 font-semibold">المنتج غير موجود</p>
        <Trash
          onClick={() => handleCartItemDelete(cartItem)}
          className="cursor-pointer"
          size={24}
          color="red"
        />
      </div>
    );
  }

  // Update quantity handler
  const handleUpdateQuantity = (getCartItem, typeOfAction) => {
    if (
      typeOfAction === "plus" &&
      getCartItem?.quantity + 1 > product?.totalStock
    ) {
      toast({
        title: `فقط ${product?.totalStock} عناصر متاحة في المخزون`,
        variant: "destructive",
      });
      return;
    }

    dispatch(
      updateCartQuantity({
        productId: getCartItem?.productId,
        quantity:
          typeOfAction === "plus"
            ? getCartItem?.quantity + 1
            : getCartItem?.quantity - 1,
      })
    ).then(() => {
      toast({
        title: "تم تحديث عنصر السلة بنجاح",
      });
    });
  };

  // Delete cart item handler
  const handleCartItemDelete = (getCartItem) => {
    dispatch(deleteCartItem({ productId: getCartItem?.productId })).then(() => {
      toast({
        title: "تم حذف عنصر السلة بنجاح",
        variant: "success",
      });
    });
  };

  return (
    <div className="flex items-center gap-4 p-4 border-b last:border-none">
      <img
        src={product?.images[0]}
        alt={product?.title}
        className="w-20 h-20 rounded-md object-cover"
      />
      <div className="flex-1">
        <h3 className="font-bold text-lg mb-1">{product?.title}</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0 rounded-full"
            size="icon"
            disabled={cartItem?.quantity === 1}
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
          >
            <Minus className="w-4 h-4" />
            <span className="sr-only">تقليل</span>
          </Button>
          <span className="font-semibold text-center text-gray-800">
            {cartItem?.quantity}
          </span>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 rounded-full"
            size="icon"
            onClick={() => handleUpdateQuantity(cartItem, "plus")}
          >
            <Plus className="w-4 h-4" />
            <span className="sr-only">زيادة</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="text-lg font-bold text-gray-900">
          {" ر.ق "}
          {(
            (product?.salePrice > 0 ? product?.salePrice : product?.price) *
            cartItem?.quantity
          ).toFixed(2)}
        </p>
        <Trash
          onClick={() => handleCartItemDelete(cartItem)}
          className="cursor-pointer mt-2"
          size={20}
          color="red"
        />
      </div>
    </div>
  );
}

export default UserCartItemsContent;

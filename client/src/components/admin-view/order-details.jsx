import { useState } from "react";
import CommonForm from "../common/form";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
  updateProductQuantities,
} from "@/store/admin/order-slice";
import { useToast } from "../ui/use-toast";

const initialFormData = {
  status: "pending",
};

function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const dispatch = useDispatch();
  const { toast } = useToast();

  console.log(orderDetails, "orderDetailsorderDetails");

  function handleUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;

    dispatch(
      updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        toast({
          title: data?.payload?.message,
        });

        if (status === "confirmed") {
          dispatch(updateProductQuantities(orderDetails.cartItems)).then(
            (updateData) => {
              if (updateData?.payload?.success) {
                toast({
                  title: "Product quantities updated successfully",
                });
              } else {
                toast({
                  title: "Error updating product quantities",
                  variant: "destructive",
                });
              }
            }
          );
        }
      }
    });
  }

  return (
    <DialogContent className="sm:max-w-[600px] bg-white rounded-lg shadow-lg p-6">
      <div className="grid gap-6">
        {/* Order Summary */}
        <div className="grid gap-2">
          <div className="text-primary text-xl font-bold">Order Summary</div>
          <div className="flex mt-4 items-center justify-between">
            <p className="font-medium text-gray-700">Order ID</p>
            <Label className="text-gray-900 font-medium">
              {orderDetails?._id}
            </Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium text-gray-700">Order Date</p>
            <Label className="text-gray-900 font-medium">
              {orderDetails?.orderDate.split("T")[0]}
            </Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium text-gray-700">Order Price</p>
            <Label className="text-gray-900 font-medium">
              {orderDetails?.totalAmount} QR
            </Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium text-gray-700">Payment Method</p>
            <Label className="text-gray-900 font-medium">
              {orderDetails?.paymentMethod}
            </Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium text-gray-700">Payment Status</p>
            <Label className="text-gray-900 font-medium">
              {orderDetails?.paymentStatus}
            </Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium text-gray-700">Order Status</p>
            <Label>
              <Badge
                className={`py-1 px-3 rounded-full text-white ${
                  orderDetails?.orderStatus === "confirmed"
                    ? "bg-green-500"
                    : orderDetails?.orderStatus === "rejected"
                    ? "bg-red-600"
                    : "bg-primary"
                }`}
              >
                {orderDetails?.orderStatus}
              </Badge>
            </Label>
          </div>
        </div>

        <Separator className="border-gray-300" />

        {/* Order Details */}
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="text-primary font-medium">Order Details</div>
            <ul className="grid gap-3 text-gray-700">
              {orderDetails?.cartItems?.length > 0 ? (
                orderDetails?.cartItems.map((item) => (
                  <li
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                    key={item.productId}
                  >
                    <span>Title: {item.title}</span>
                    <span>Quantity: {item.quantity}</span>
                    <span>Price: {item.price} QR</span>
                  </li>
                ))
              ) : (
                <p>No items in the order.</p>
              )}
            </ul>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="text-primary font-medium">Shipping Info</div>
            <div className="grid gap-0.5 text-gray-700">
              <span>{orderDetails?.fullName}</span>
              <span>{orderDetails?.address}</span>
              <span>{orderDetails?.region}</span>
              <span>{orderDetails?.phone}</span>
              <span>{orderDetails?.notes}</span>
            </div>
          </div>
        </div>

        {/* Update Order Status */}
        <div className="mt-4">
          <CommonForm
            formControls={[
              {
                label: "Order Status",
                name: "status",
                componentType: "select",
                options: [
                  { id: "pending", label: "Pending" },
                  { id: "confirmed", label: "confirmed" },
                  { id: "rejected", label: "Rejected" },
                ],
              },
            ]}
            formData={formData}
            setFormData={setFormData}
            buttonText={"Update Order Status"}
            onSubmit={handleUpdateStatus}
          />
        </div>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;

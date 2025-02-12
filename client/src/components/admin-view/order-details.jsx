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
    <DialogContent className="sm:max-w-[700px] bg-white rounded-lg shadow-lg p-6">
      <div className="grid gap-6">
        {/* Order Summary */}
        <div className="grid gap-4">
          <h2 className="text-2xl font-bold text-primary">Order Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-gray-600">Order ID</Label>
              <p className="text-gray-900 font-medium">
                {orderDetails?.orderId}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-gray-600">Order Date</Label>
              <p className="text-gray-900 font-medium">
                {orderDetails?.orderDate.split("T")[0]}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-gray-600">Order Price</Label>
              <p className="text-gray-900 font-medium">
                {orderDetails?.totalAmount} QR
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-gray-600">Payment Method</Label>
              <p className="text-gray-900 font-medium">
                {orderDetails?.paymentMethod}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-gray-600">Payment Status</Label>
              <p className="text-gray-900 font-medium">
                {orderDetails?.paymentStatus}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-gray-600">Order Status</Label>
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
            </div>
          </div>
        </div>

        <Separator className="border-gray-300" />

        {/* Order Details */}
        <div className="grid gap-4">
          <h3 className="text-xl font-bold text-primary">Order Details</h3>
          <ul className="grid gap-3">
            {orderDetails?.cartItems?.length > 0 ? (
              orderDetails?.cartItems.map((item) => (
                <li
                  className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-gray-50 rounded-lg"
                  key={item.productId}
                >
                  <span className="text-gray-700">Title: {item.title}</span>
                  <span className="text-gray-700">
                    Quantity: {item.quantity}
                  </span>
                  <span className="text-gray-700">Price: {item.price} QR</span>
                </li>
              ))
            ) : (
              <p className="text-gray-700">No items in the order.</p>
            )}
          </ul>
        </div>

        <Separator className="border-gray-300" />

        {/* Shipping Info */}
        <div className="grid gap-4">
          <h3 className="text-xl font-bold text-primary">Shipping Info</h3>
          <div className="grid gap-2 text-gray-700">
            <p>{orderDetails?.fullName}</p>
            <p>{orderDetails?.address}</p>
            <p>{orderDetails?.region}</p>
            <p>{orderDetails?.phone}</p>
            <p>{orderDetails?.notes}</p>
          </div>
        </div>

        <Separator className="border-gray-300" />

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
                  { id: "confirmed", label: "Confirmed" },
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

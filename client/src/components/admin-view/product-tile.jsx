import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Edit2, Trash2 } from "lucide-react";
import { Switch } from "@headlessui/react"; // Import the Switch component

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
  handleToggleVisibility, // Ensure this prop is received
}) {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <div>
        <div className="relative">
          <img
            loading="lazy"
            src={product?.images?.[0]}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
        </div>
        <CardContent>
          <h2 className="text-xl font-bold mb-2 mt-2">{product?.title}</h2>
          <div className="flex justify-between items-center mb-2">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through" : ""
              } text-lg font-semibold text-primary`}
            >
              QR {product?.price}
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-lg font-bold text-green-600">
                QR {product?.salePrice}
              </span>
            ) : null}
          </div>
          <div className="text-sm text-gray-600">
            Quantity: {product?.totalStock}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center px-4 py-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setOpenCreateProductsDialog(true);
              setCurrentEditedId(product?._id);
              setFormData(product);
            }}
            className="flex items-center space-x-2"
          >
            <Edit2 size={16} />
            <span>Edit</span>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(product?._id)}
            className="flex items-center space-x-2"
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </Button>
          <Switch
            checked={!product?.hidden}
            onChange={() => {
              console.log(
                `Toggling visibility for product ID: ${product?._id}, hidden: ${product?.hidden}`
              );
              handleToggleVisibility(product?._id, product?.hidden);
            }}
            className={`${
              product?.hidden ? "bg-red-500" : "bg-green-500"
            } relative inline-flex items-center h-6 rounded-full w-11`}
          >
            <span
              className={`${
                product?.hidden ? "translate-x-1" : "translate-x-6"
              } inline-block w-4 h-4 transform bg-white rounded-full`}
            />
          </Switch>
        </CardFooter>
      </div>
    </Card>
  );
}

export default AdminProductTile;

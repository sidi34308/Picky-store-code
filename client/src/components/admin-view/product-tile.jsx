import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Edit2, Trash2 } from "lucide-react";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
}) {
  return (
    <Card className="w-full max-w-sm mx-auto  ">
      <div>
        <div className="relative">
          <img
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
              ${product?.price}
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-lg font-bold text-green-600">
                ${product?.salePrice}
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
        </CardFooter>
      </div>
    </Card>
  );
}

export default AdminProductTile;

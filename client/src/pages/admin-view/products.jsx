import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // Replace Sheet with Dialog
import { useToast } from "@/components/ui/use-toast";
import { addProductFormElements } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
  toggleProductVisibility,
} from "@/store/admin/products-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const initialFormData = {
  images: [],
  title: "",
  description: "",
  category: [],
  labels: "",
  group: false,
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
  hidden: false,
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFiles, setImageFiles] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();

    currentEditedId !== null
      ? dispatch(
          editProduct({
            id: currentEditedId,
            formData: {
              ...formData,
              images: uploadedImageUrls.length
                ? uploadedImageUrls // Use updated image URLs
                : formData.images, // Fallback to existing images
            },
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setFormData(initialFormData);
            setOpenCreateProductsDialog(false);
            setCurrentEditedId(null);
            setUploadedImageUrls([]); // Reset uploaded image URLs
          }
        })
      : dispatch(
          addNewProduct({
            ...formData,
            images: uploadedImageUrls,
            labels: formData.labels,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setOpenCreateProductsDialog(false);
            setImageFiles([]);
            setFormData(initialFormData);
            setUploadedImageUrls([]); // Reset uploaded image URLs
            toast({
              title: "Product added successfully",
            });
          }
        });
  }

  function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
      }
    });
  }

  function handleToggleVisibility(productId, currentVisibility) {
    dispatch(
      toggleProductVisibility({ id: productId, hidden: !currentVisibility })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
      }
    });
  }

  function isFormValid() {
    const requiredFields = [
      "title",
      "description",
      "category",
      "price",
      "totalStock",
    ];
    const validationResults = requiredFields.map((field) => !!formData[field]);
    return validationResults.every((item) => item);
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenCreateProductsDialog(true)}>
          Add New Product
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0
          ? productList.map((productItem) => (
              <AdminProductTile
                key={productItem.id}
                setFormData={setFormData}
                setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                setCurrentEditedId={setCurrentEditedId}
                product={productItem}
                handleDelete={handleDelete}
                handleToggleVisibility={handleToggleVisibility}
              />
            ))
          : null}
      </div>

      {/* Middle Popup Modal */}
      <Dialog
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
          setImageFiles([]);
          setUploadedImageUrls([]);
        }}
      >
        <DialogContent className="sm:max-w-[700px]">
          {" "}
          {/* Adjust width as needed */}
          <DialogHeader>
            <DialogTitle>
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>
          <ProductImageUpload
            imageFiles={imageFiles}
            setImageFiles={setImageFiles}
            uploadedImageUrls={uploadedImageUrls}
            setUploadedImageUrls={setUploadedImageUrls}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
            existingImages={formData.images}
          />
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              formControls={addProductFormElements.map((element) =>
                element.name === "category"
                  ? { ...element, componentType: "multiselect" }
                  : element
              )}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}

export default AdminProducts;

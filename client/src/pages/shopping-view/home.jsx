import { Button } from "@/components/ui/button";

import {
  Airplay,
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  Heater,
  Images,
  Shirt,
  ShirtIcon,
  ShoppingBasket,
  UmbrellaIcon,
  WashingMachine,
  WatchIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice/index";
import WhatsAppPopup_ar from "@/components/shopping-view/WhatsAppPopup_ar";

import men from "../../assets/men.png";
import woman from "../../assets/woman.png";
import kids from "../../assets/kids.png";

const categoriesWithIcon = [
  { id: "men", label: "رجال", image: men, link: "/listing?category=men" },
  { id: "women", label: "نساء", image: woman, link: "/listing?category=women" },
  { id: "kids", label: "أطفال", image: kids, link: "/listing?category=kids" },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featureImageList, setFeatureImageList] = useState([]); // State for dynamic images
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");

    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    // Scroll to the top before navigating
    window.scrollTo(0, 0);

    // Navigate to the listing page
    navigate(`/listing`);
  }
  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    dispatch(getFeatureImages()).then((response) => {
      console.log(response.payload, "ss");

      if (Array.isArray(response.payload)) {
        setFeatureImageList(response.payload); // Set images from API response
        console.log(response.payload, "sa");
        // Set images from API response
      }
    });
  }, [dispatch]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 15000);

    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  return (
    <div
      className="flex flex-col min-h-screen items-center"
      style={{ direction: "rtl" }}
    >
      <WhatsAppPopup_ar />

      <div className="relative w-[90vw] h-[20vh] md:h-[600px] md:w-[95vw] overflow-hidden m-8 p-1 rounded-lg nav-shadow">
        {featureImageList && featureImageList.length > 0 ? (
          featureImageList.map((slide, index) => (
            <img
              loading="lazy"
              src={slide.image}
              key={index}
              alt={`Feature slide ${index + 1}`}
              className={`${
                index === currentSlide
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95"
              } absolute top-0 left-0 w-full h-full object-cover transition-all duration-1000 ease-in-out`}
              aria-hidden={index !== currentSlide}
              onError={(e) => {
                console.error(`Failed to load image: ${slide?.image}`);
                e.target.style.display = "none";
              }}
            />
          ))
        ) : (
          <div className="flex items-center justify-center w-full h-full ">
            <p className="text-gray-500"></p>
          </div>
        )}
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) =>
                (prevSlide - 1 + featureImageList.length) %
                featureImageList.length
            )
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-md p-2  transition-all duration-300 md:w-12 md:h-12"
        >
          <ChevronLeftIcon className="w-4 h-4 text-gray-700" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide + 1) % featureImageList.length
            )
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-md p-2 transition-all duration-300 md:w-12 md:h-12"
        >
          <ChevronRightIcon className="w-4 h-4 text-gray-700" />
        </Button>
      </div>
      <h2 className="text-2xl sm:text-3xl font-semibold text-[#E73983] mt-8 w-full pr-10 sm:pr-20">
        منتجات اخترناها لك
      </h2>
      <section className="py-4">
        <div className="mx-auto  ">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 sm:gap-4 p-4">
            {productList && productList.length > 0
              ? productList
                  .filter(
                    (productItem) =>
                      // productItem.salePrice &&
                      !productItem.hidden
                  )
                  .slice(0, 4)
                  .map((productItem) => (
                    <div
                      key={productItem.id}
                      className="flex-shrink-0 w-full snap-start md:w-auto"
                    >
                      <ShoppingProductTile
                        handleGetProductDetails={handleGetProductDetails}
                        product={productItem}
                        handleAddtoCart={handleAddtoCart}
                      />
                    </div>
                  ))
              : null}
          </div>
        </div>
      </section>

      <h2 className="text-2xl sm:text-3xl font-semibold text-[#E73983] mb-8 w-full pr-10 sm:pr-20">
        الأقسام
      </h2>
      <section className="w-full">
        <div className="container mx-auto px-4 w-full ">
          <div className="flex flex-col sm:flex-row w-full gap-5 cursor-pointer">
            {categoriesWithIcon.map((category) => (
              <div
                key={category.id}
                className="relative flex flex-col w-full sm:w-1/2 h-[200px] rounded-3xl items-center justify-center transition-transform duration-300 ease-in-out transform hover:scale-105"
                onClick={() =>
                  handleNavigateToListingPage(category, "category")
                }
              >
                <img
                  loading="lazy"
                  src={category.image}
                  alt={category.label}
                  className="w-full h-full object-cover rounded-3xl"
                />
                <div className="absolute inset-0 bg-black opacity-20 rounded-md"></div>
                <CardContent className="absolute text-center text-white text-3xl font-bold mt-4">
                  {category.label}
                </CardContent>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;

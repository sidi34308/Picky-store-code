import { Search } from "lucide-react"; // Import the Lucide search icon
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";
import {
  getSearchResults,
  resetSearchResults,
} from "@/store/shop/search-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

function SearchProducts() {
  const { productList } = useSelector((state) => state.shopProducts);
  const [keyword, setKeyword] = useState("");
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSearching, setIsSearching] = useState(false); // New state for search tracking
  const dispatch = useDispatch();
  const { searchResults } = useSelector((state) => state.shopSearch);
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { toast } = useToast();

  useEffect(() => {
    if (keyword && keyword.trim() !== "" && keyword.trim().length > 3) {
      setIsSearching(true); // Set searching state
      const searchTimeout = setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(getSearchResults(keyword)).finally(() =>
          setIsSearching(false)
        ); // Stop searching after results are fetched
      }, 1000);
      return () => clearTimeout(searchTimeout);
    } else {
      setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
      dispatch(resetSearchResults());
    }
  }, [keyword]);

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];
    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });
          return;
        }
      }
    }

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

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  return (
    <div
      className="container h-screen mx-auto md:px-6 px-4 py-8"
      style={{ direction: "rtl" }}
    >
      <div className="flex justify-center mb-10 ">
        <div className="relative w-full flex items-center ">
          <input
            value={keyword}
            name="keyword"
            onChange={(event) => setKeyword(event.target.value)}
            className="py-8 pr-20 nav-shadow w-full rounded-md transition duration-1000"
            placeholder="ابحث عن منتج..."
          />
          <Search className="absolute right-4 text-gray-400" size={30} />{" "}
          {/* Search Icon */}
        </div>
      </div>

      {/* Display Skeleton when searching */}
      {isSearching && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array(3)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className="w-full h-28 bg-gray-100 rounded-md animate-pulse py-10"
              />
            ))}
        </div>
      )}

      {/* Show results or message after searching */}
      {!isSearching && keyword && keyword.trim().length > 3 && (
        <>
          {!searchResults.length ? (
            <h1 className="text-2xl font-bold opacity-90">
              لم يتم العثور على نتائج مطابقة لبحثك!
            </h1>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {searchResults.map((item) => (
                <ShoppingProductTile
                  key={item.id}
                  handleAddtoCart={handleAddtoCart}
                  product={item}
                  handleGetProductDetails={handleGetProductDetails}
                />
              ))}
            </div>
          )}
        </>
      )}
      <h3 className="text-lg font-medium">تسوق ايضاً</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {productList && productList.length > 0
          ? productList.map((productItem) => (
              <ShoppingProductTile
                key={productItem.id}
                handleGetProductDetails={handleGetProductDetails}
                product={productItem}
                handleAddtoCart={handleAddtoCart}
              />
            ))
          : null}
      </div>
    </div>
  );
}

export default SearchProducts;

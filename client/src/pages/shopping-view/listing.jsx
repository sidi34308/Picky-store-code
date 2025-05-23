import ProductFilter from "@/components/shopping-view/filter";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { sortOptions } from "@/config";
import { addToCart } from "@/store/shop/cart-slice";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import { ArrowUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import WhatsAppPopup_ar from "@/components/shopping-view/WhatsAppPopup_ar";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }

  return queryParams.join("&");
}

function ShoppingListing() {
  const dispatch = useDispatch();
  const { productList, productDetails, loading } = useSelector(
    (state) => state.shopProducts
  );

  const { cartItems } = useSelector((state) => state.shopCart);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { toast } = useToast();

  const categorySearchParam = searchParams.get("category");

  function handleSort(value) {
    setSort(value);
  }

  function handleFilter(getSectionId, getCurrentOption) {
    const cpyFilters = { ...filters };

    if (cpyFilters[getSectionId] === getCurrentOption) {
      delete cpyFilters[getSectionId]; // Deselect the filter if already selected
    } else {
      cpyFilters[getSectionId] = getCurrentOption; // Select the new filter
    }

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    const getCartItems = cartItems || [];

    const indexOfCurrentItem = getCartItems.findIndex(
      (item) => item.productId === getCurrentProductId
    );

    if (indexOfCurrentItem > -1) {
      const getQuantity = getCartItems[indexOfCurrentItem].quantity;
      if (getQuantity + 1 > getTotalStock) {
        toast({
          title: `فقط ${getTotalStock} عناصر متاحة في المخزون`,
          variant: "destructive",
        });
        return;
      }
    }

    dispatch(
      addToCart({
        productId: getCurrentProductId,
        quantity: 1,
      })
    );

    toast({
      title: "تمت إضافة المنتج إلى السلة",
    });
  }

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, [categorySearchParam]);

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(createQueryString));
    }
  }, [filters]);

  useEffect(() => {
    if (filters !== null && sort !== null)
      dispatch(
        fetchAllFilteredProducts({ filterParams: filters, sortParams: sort })
      );
  }, [dispatch, sort, filters]);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  return (
    <div
      className=" bg-[#f5f5f5] min-h-screen grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6"
      style={{ direction: "rtl" }}
    >
      <WhatsAppPopup_ar />
      <ProductFilter filters={filters} handleFilter={handleFilter} />
      <div className=" w-full rounded-lg ">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">جميع المنتجات</h2>
          <div className="flex items-center gap-3">
            <span className="text-primary/40">{productList?.length} نتائج</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  variant="outline"
                  size="sm"
                  className="flex py-2 px-3 rounded-md hover:bg-accent  items-center gap-2 bg-white "
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>ترتيب</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-[240px] border-none"
                style={{ direction: "rtl" }}
              >
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 sm:gap-4 p-4">
          {loading
            ? Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} className="h-64 w-full" />
              ))
            : productList && productList.length > 0
            ? productList
                .filter((productItem) => !productItem.hidden)
                .map((productItem) => (
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
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingListing;

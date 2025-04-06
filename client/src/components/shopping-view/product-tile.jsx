import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { lableOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { Minus, Plus } from "lucide-react";

function ShoppingProductTile({ product, handleAddtoCart }) {
  const [quantity, setQuantity] = useState(0);

  const calculateDiscountPercentage = (originalPrice, salePrice) => {
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
  };

  const handleAddToCartClick = () => {
    handleAddtoCart(product?._id, product?.totalStock);
    setQuantity(1);
  };

  const handleUpdateQuantity = (typeOfAction) => {
    if (typeOfAction === "plus" && quantity + 1 > product?.totalStock) {
      return;
    }
    setQuantity(typeOfAction === "plus" ? quantity + 1 : quantity - 1);
    handleAddtoCart(
      product?._id,
      typeOfAction === "plus" ? quantity + 1 : quantity - 1
    );
  };

  return (
    <Card className="h-full w-full max-w-sm mx-auto p-2 sm:p-4 rounded-3xl hover:bg-accent hover:scale-105 transition-all duration-300 ease-in-out flex flex-col justify-between">
      <Link
        to={`/product/${product?._id}`}
        onClick={() => window.scrollTo(0, 0)}
      >
        <div className="relative">
          <img
            loading="lazy"
            src={product?.images?.[0]}
            alt={product?.title}
            className={`w-full h-[140px] sm:h-[250px] object-cover rounded-3xl ${
              product?.totalStock === 0 ? "grayscale" : ""
            }`}
          />
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              غير متوفر
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              {`تبقى ${product?.totalStock} قطع فقط`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              {` خصم ${calculateDiscountPercentage(
                product?.price,
                product?.salePrice
              )}% `}
            </Badge>
          ) : null}
        </div>
        <CardContent className="p-4">
          <h2 className="text-sm sm:text-xl font-semibold text-primary mb-2">
            {product?.title}
          </h2>

          <div className="flex gap-3  items-center mb-2">
            {product?.salePrice > 0 ? (
              <span className="text-sm sm:text-xl font-semibold text-red-600">
                {product?.salePrice} ر.ق
              </span>
            ) : null}
            <span
              className={`${
                product?.salePrice > 0
                  ? "line-through text-[#757575] opacity-50"
                  : "text-black"
              }  text-sm sm:text-xl font-semibold `}
            >
              {product?.price} ر.ق
            </span>
          </div>
        </CardContent>
      </Link>
      <CardFooter>
        {product?.totalStock === 0 ? (
          <Button className="w-full opacity-60 cursor-not-allowed">
            غير متوفر
          </Button>
        ) : quantity > 0 ? (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0 rounded-full"
              size="icon"
              onClick={() => handleUpdateQuantity("minus")}
            >
              <Minus className="w-4 h-4" />
              <span className="sr-only">تقليل</span>
            </Button>
            <span className="font-semibold text-center text-sm sm:text-lg text-gray-800">
              {quantity}
            </span>
            <Button
              variant="outline"
              className="h-8 w-8 p-0 rounded-full"
              size="icon"
              onClick={() => handleUpdateQuantity("plus")}
            >
              <Plus className="w-4 h-4" />
              <span className="sr-only">زيادة</span>
            </Button>
          </div>
        ) : (
          <button
            onClick={handleAddToCartClick}
            className="w-full bg-primary  text-sm sm:text-xl text-white py-3 rounded-2xl hover:opacity-90"
          >
            إضافة للسلة
          </button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;

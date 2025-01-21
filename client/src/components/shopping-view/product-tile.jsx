import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { lableOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";

function ShoppingProductTile({ product, handleAddtoCart }) {
  const calculateDiscountPercentage = (originalPrice, salePrice) => {
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
  };

  return (
    <Card className="w-full max-w-sm mx-auto p-4 rounded-3xl hover:bg-accent hover:scale-105 hover:rotate-[2deg] transition-all duration-300 ease-in-out">
      <Link to={`/product/${product._id}`}>
        <div className="relative">
          <img
            src={product?.images?.[0]}
            alt={product?.title}
            className="w-full h-[250px] object-cover rounded-3xl"
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
              {`${calculateDiscountPercentage(
                product?.price,
                product?.salePrice
              )}% خصم`}
            </Badge>
          ) : null}
        </div>
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2">{product?.title}</h2>

          <div className="flex gap-3 items-center mb-2">
            {product?.salePrice > 0 ? (
              <span className="text-lg font-semibold text-red-600">
                {product?.salePrice} ر.ق
              </span>
            ) : null}
            <span
              className={`${
                product?.salePrice > 0
                  ? "line-through text-[#757575] opacity-50"
                  : "text-red-600"
              } text-lg font-semibold `}
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
        ) : (
          <button
            onClick={() => handleAddtoCart(product?._id, product?.totalStock)}
            className="w-full bg-primary text-white py-3 rounded-2xl hover:opacity-90"
          >
            إضافة للسلة
          </button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;

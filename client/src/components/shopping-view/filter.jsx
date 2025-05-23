import { filterOptions } from "@/config";
import { Fragment } from "react";
import { Label } from "../ui/label";
import { SquareOption } from "../ui/square-option";

function ProductFilter({ filters, handleFilter }) {
  return (
    <div className="bg- rounded-lg">
      <div className="p-4 border-b">
        <h2 className="text-lg font-bold">الفلاتر</h2>
      </div>
      <div className="p-4 space-y-4">
        {Object.keys(filterOptions).map((keyItem) => (
          <Fragment key={keyItem}>
            <div>
              <h3 className="text-base font-semibold pb-4">
                {keyItem == "category" ? "الاقسام" : "الاصناف"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {filterOptions[keyItem].map((option) => (
                  <SquareOption
                    key={option.id}
                    label={option.label}
                    selected={filters && filters[keyItem] === option.id}
                    onClick={() => handleFilter(keyItem, option.id)}
                  />
                ))}
              </div>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default ProductFilter;

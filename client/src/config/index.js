export const registerFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your user name",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "men", label: "Men" },
      { id: "women", label: "Women" },
      { id: "kids", label: "Kids" },
      { id: "groups", label: "Groups" },
      { id: "offers", label: "Offers" },
    ],
  },
  {
    label: "Labels",
    name: "Labels",
    componentType: "select",
    options: [
      { id: "weight ", label: "Weight Management" },
      { id: "skincare", label: "Skincare" },
      { id: "height", label: " Height Growth" },
    ],
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price (optional)",
  },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock",
  },
];

export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "الرئيسية",
    path: "/",
  },
  {
    id: "products",
    label: "جميع الأقسام",
    path: "/listing",
    submenu: [
      { id: "men", label: "رجال", path: "/shop/listing" },
      { id: "women", label: "نساء", path: "/shop/listing" },
      { id: "kids", label: "أطفال", path: "/shop/listing" },
    ],
  },

  {
    id: "groups",
    label: "المجموعات",
    path: "/shop/listing",
  },
  {
    id: "offers",
    label: "العروض",
    path: "/shop/listing",
  },
  {
    id: "about",
    label: "من نحن",
    path: "/about",
  },
  // {
  //   id: "men",
  //   label: "Men",
  //   path: "/shop/listing",
  // },
  // {
  //   id: "women",
  //   label: "Women",
  //   path: "/shop/listing",
  // },
  // {
  //   id: "kids",
  //   label: "Kids",
  //   path: "/shop/listing",
  // },
  // {
  //   id: "footwear",
  //   label: "Footwear",
  //   path: "/shop/listing",
  // },
  // {
  //   id: "accessories",
  //   label: "Accessories",
  //   path: "/shop/listing",
  // },
  // {
  //   id: "search",
  //   label: "Search",
  //   path: "/shop/search",
  // },
];

export const categoryOptionsMap = {
  men: "رجال",
  women: "نساء",
  kids: "أطفال",
  groups: "المجموعات",
  footwear: "Footwear",
};

export const lableOptionsMap = {
  weight: "Weight",
  skincare: "Skincare",
  height: "Height",
};

export const filterOptions = {
  category: [
    { id: "men", label: "رجال" },
    { id: "women", label: "نساء" },
    { id: "kids", label: "أطفال" },
    { id: "groups", label: "مجموعات" },
    { id: "offers", label: "عروض" },
  ],
  labels: [
    { id: "weight ", label: "الاهتمام بالوزن" },
    { id: "skincare", label: "العناية بالشعر" },
    { id: "height", label: "زيادة الطول" },
  ],
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "السعر - من الأقل إلى الأعلى" },
  { id: "price-hightolow", label: "السعر - من الأعلى إلى الأقل" },
  { id: "title-atoz", label: "العنوان: من أ إلى ي" },
  { id: "title-ztoa", label: "العنوان: من ي إلى أ" },
];

export const addressFormControls = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
  },
  {
    label: "Pincode",
    name: "pincode",
    componentType: "input",
    type: "text",
    placeholder: "Enter your pincode",
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter any additional notes",
  },
];

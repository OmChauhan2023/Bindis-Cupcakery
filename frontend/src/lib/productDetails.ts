import { categoryFor } from "./categories";

export type CustomizationOption = {
  key: string;
  label: string;
  type: "select" | "checkbox-group" | "text" | "number";
  options?: string[];
  helper?: string;
  required?: boolean;
  default?: string | string[] | number;
};

export type ProductDetails = {
  ingredients: string[];
  allergens: string[];
  shelfLife: string;
  servings: string;
  story: string;
  customizations: CustomizationOption[];
};

const COMMON_CUSTOM: CustomizationOption[] = [
  {
    key: "message",
    label: "Special Message",
    type: "text",
    helper: "We'll add a handwritten note (optional, max 60 chars)",
  },
];

const PER_CATEGORY: Record<string, ProductDetails> = {
  Cupcake: {
    ingredients: ["Refined wheat flour", "Unsalted butter", "Caster sugar", "Milk", "Vanilla extract", "Baking powder"],
    allergens: ["Gluten", "Dairy"],
    shelfLife: "Best within 48 hours, refrigerated",
    servings: "1 cupcake (approx. 80g)",
    story:
      "Hand-piped soft-crumb cupcakes finished with a velvety frosting. Eggless and made fresh to order from our home kitchen.",
    customizations: [
      {
        key: "frosting",
        label: "Frosting Flavour",
        type: "select",
        options: ["Vanilla Buttercream", "Chocolate Ganache", "Strawberry Cream", "Cream Cheese"],
        default: "Vanilla Buttercream",
        required: true,
      },
      {
        key: "toppings",
        label: "Add Toppings",
        type: "checkbox-group",
        options: ["Sprinkles", "Chocolate Chips", "Nuts", "Fresh Fruit", "Edible Gold"],
        default: [],
      },
      ...COMMON_CUSTOM,
    ],
  },
  Brownie: {
    ingredients: ["Dark chocolate (55%)", "Unsalted butter", "Caster sugar", "Refined flour", "Cocoa powder"],
    allergens: ["Gluten", "Dairy", "May contain nuts"],
    shelfLife: "Best within 4 days, room temperature",
    servings: "1 piece (approx. 90g)",
    story:
      "Fudgy in the centre, crackle-topped on the outside. Slow-baked with imported dark chocolate for a rich, intense bite.",
    customizations: [
      {
        key: "topping",
        label: "Brownie Topping",
        type: "select",
        options: ["Classic", "Walnut", "Hazelnut", "Extra Choc Chips", "Sea Salt Flakes"],
        default: "Classic",
        required: true,
      },
      {
        key: "warmed",
        label: "Pre-warm Before Pickup?",
        type: "select",
        options: ["No, room temperature", "Yes, slightly warmed"],
        default: "No, room temperature",
      },
      ...COMMON_CUSTOM,
    ],
  },
  Cookie: {
    ingredients: ["Refined flour", "Brown sugar", "Unsalted butter", "Vanilla extract", "Baking soda", "Pinch of sea salt"],
    allergens: ["Gluten", "Dairy"],
    shelfLife: "Stays fresh for 7 days in airtight container",
    servings: "1 cookie (approx. 35g)",
    story:
      "Buttery dough rested overnight for that perfect chew. Each cookie is hand-rolled and baked golden.",
    customizations: [
      {
        key: "packSize",
        label: "Pack Size",
        type: "select",
        options: ["Pack of 3", "Pack of 6", "Pack of 12"],
        default: "Pack of 6",
        required: true,
      },
      {
        key: "texture",
        label: "Texture Preference",
        type: "select",
        options: ["Soft & Chewy", "Crispy"],
        default: "Soft & Chewy",
      },
      ...COMMON_CUSTOM,
    ],
  },
  Truffle: {
    ingredients: ["Belgian chocolate", "Fresh cream", "Butter", "Natural flavour essence"],
    allergens: ["Dairy", "May contain nuts & traces of soy"],
    shelfLife: "Best within 5 days, refrigerated",
    servings: "1 truffle (approx. 18g)",
    story:
      "Tiny jewels of ganache rolled by hand and dipped in tempered chocolate. Each box is sealed with care.",
    customizations: [
      {
        key: "boxSize",
        label: "Box Size",
        type: "select",
        options: ["Box of 4", "Box of 8", "Box of 12", "Box of 24"],
        default: "Box of 8",
        required: true,
      },
      {
        key: "giftWrap",
        label: "Gift Wrap",
        type: "select",
        options: ["No wrap", "Pastel ribbon", "Premium gift box (+₹50)"],
        default: "No wrap",
      },
      ...COMMON_CUSTOM,
    ],
  },
  Donut: {
    ingredients: ["Refined flour", "Active dry yeast", "Sugar", "Milk", "Butter", "Glaze of choice"],
    allergens: ["Gluten", "Dairy"],
    shelfLife: "Best on the day of pickup",
    servings: "1 donut (approx. 60g)",
    story:
      "Pillowy yeast donuts, fried to a golden brown and finished with a glossy glaze.",
    customizations: [
      {
        key: "glaze",
        label: "Glaze",
        type: "select",
        options: ["Classic Sugar", "Chocolate", "Strawberry", "Maple", "Mixed Assortment"],
        default: "Mixed Assortment",
        required: true,
      },
      {
        key: "packSize",
        label: "Quantity",
        type: "select",
        options: ["Single", "Pack of 3", "Pack of 6"],
        default: "Pack of 3",
        required: true,
      },
      ...COMMON_CUSTOM,
    ],
  },
  Other: {
    ingredients: ["Premium ingredients, sourced fresh"],
    allergens: ["May contain gluten, dairy, nuts"],
    shelfLife: "Best enjoyed within 3 days",
    servings: "Standard portion",
    story: "Made with care in our home kitchen.",
    customizations: [...COMMON_CUSTOM],
  },
};

export function getProductDetails(name: string, category?: string): ProductDetails {
  const cat = category || categoryFor(name);
  return PER_CATEGORY[cat] || PER_CATEGORY.Other;
}

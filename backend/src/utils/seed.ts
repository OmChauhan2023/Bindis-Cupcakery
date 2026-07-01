import prisma from "../config/db";

const SEED_PRODUCTS = [
  { name: "Blueberry Truffle", description: "Luscious blueberry filling encased in a smooth white chocolate shell.", price: 150, image: "/Blueberry_Truffle.jpg" },
  { name: "Brownie Tub", description: "A decadent tub filled with gooey brownie chunks and chocolate sauce.", price: 250, image: "/Brownie_tub.jpg" },
  { name: "Chocolate Chip Cookies", description: "Classic crunchy cookies loaded with premium chocolate chips.", price: 120, image: "/Chocolate_Chips_Cookie.jpg" },
  { name: "Coconut Truffle", description: "Exotic coconut centers dipped in rich milk chocolate.", price: 140, image: "/Coconut_Truffle.jpg" },
  { name: "Cookie Dough Brownie", description: "The best of both worlds: fudgy brownie topped with edible cookie dough.", price: 180, image: "/Cookie_Dough_Brownie.jpg" },
  { name: "Cookie Dough Brownie Cup", description: "Individual portions of our famous cookie dough brownie.", price: 120, image: "/Cookie_Dough_Brownie_Cup.jpg" },
  { name: "Cranberry Pistachio Blondie", description: "Sweet and salty blondie with tart cranberries and roasted pistachios.", price: 160, image: "/Cranberry_pistachio_blondie.jpg" },
  { name: "Dark Chocolate Hazelnut Brownie", description: "Rich dark chocolate brownie with toasted hazelnuts.", price: 190, image: "/Dark_Chocolate_hazelnut_Brownie.jpg" },
  { name: "Dark Chocolate Walnut Brownie", description: "Intense dark chocolate brownie with crunchy walnut pieces.", price: 190, image: "/Dark_Chocolate_walnut_brownie.jpg" },
  { name: "Assorted Donuts", description: "A variety of fresh, fluffy donuts with different glazes and toppings.", price: 200, image: "/Donuts.jpg" },
  { name: "Jim Jam Cookies", description: "Nostalgic jam-filled sandwich cookies.", price: 100, image: "/Jim_Jam_Cookies.jpg" },
  { name: "Mint Chocolate Chip Truffle", description: "Refreshing mint cream and chocolate chips in a dark shell.", price: 150, image: "/Mint_chocolate_Chips_Truffle.jpg" },
  { name: "Nutella Sandwich Cookies", description: "Buttery cookies sandwiched with a generous layer of Nutella.", price: 160, image: "/Nutella_Sandwich_Cookies.jpg" },
  { name: "Rasmalai Truffle", description: "Fusion delight: White chocolate truffle with authentic Rasmalai flavor.", price: 180, image: "/Rasmalai_Truffle.jpg" },
  { name: "Rose Pistachio Cranberry Truffle", description: "Elegant truffle with rose notes, pistachios, and cranberries.", price: 180, image: "/Rose-pistacho_cranberry_truffle.jpg" },
  { name: "Chilli Cheese Cookies", description: "Savoury cookies with a spicy kick of chilli and cheese.", price: 130, image: "/chilli_cheese_cookies.jpg" },
  { name: "Choco Day Cookies", description: "Rich chocolate cookies for everyday indulgence.", price: 110, image: "/choco_day_cookies.jpg" },
  { name: "Signature Cupcake", description: "Our famous handcrafted cupcake with velvet smooth frosting.", price: 95, image: "/cupcake.jpg" },
];

export async function ensureSeeded() {
  try {
    const count = await prisma.product.count();
    if (count > 0) return;
    await prisma.product.createMany({
      data: SEED_PRODUCTS.map((p) => ({
        name: p.name,
        description: p.description,
        price: p.price,
        image: p.image,
      })),
    });
  } catch (error) {
    console.error("Seed error:", error);
  }
}

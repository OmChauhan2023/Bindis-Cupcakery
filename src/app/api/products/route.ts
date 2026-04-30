import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Check if the request contains an array (bulk insert) or a single object
    if (Array.isArray(data)) {
      if (data.length === 0) {
        return NextResponse.json({ message: "No products to add" }, { status: 400 });
      }

      const savedProducts = await prisma.product.createMany({
        data: data.map((item: any) => ({
          name: item.name,
          description: item.description,
          price: parseFloat(item.price),
          image: item.image,
        })),
      });
      return NextResponse.json({ message: "Products added successfully", count: savedProducts.count }, { status: 201 });
    }

    // Single product insert
    const { name, description, price, image } = data;

    if (!name || !description || !price || !image) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        image,
      },
    });

    return NextResponse.json({ message: "Product added successfully", product: newProduct }, { status: 201 });
  } catch (error: any) {
    console.error("Error adding product:", error);
    return NextResponse.json({ message: "Error adding product", error: error.message }, { status: 500 });
  }
}

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'Blueberry Truffle',
    description: 'Luscious blueberry filling encased in a smooth white chocolate shell.',
    price: 150,
    image: '/Blueberry_Truffle.jpg'
  },
  {
    id: 2,
    name: 'Brownie Tub',
    description: 'A decadent tub filled with gooey brownie chunks and chocolate sauce.',
    price: 250,
    image: '/Brownie_tub.jpg'
  },
  {
    id: 3,
    name: 'Chocolate Chip Cookies',
    description: 'Classic crunchy cookies loaded with premium chocolate chips.',
    price: 120,
    image: '/Chocolate_Chips_Cookie.jpg'
  },
  {
    id: 4,
    name: 'Coconut Truffle',
    description: 'Exotic coconut centers dipped in rich milk chocolate.',
    price: 140,
    image: '/Coconut_Truffle.jpg'
  },
  {
    id: 5,
    name: 'Cookie Dough Brownie',
    description: 'The best of both worlds: fudgy brownie topped with edible cookie dough.',
    price: 180,
    image: '/Cookie_Dough_Brownie.jpg'
  },
  {
    id: 6,
    name: 'Cookie Dough Brownie Cup',
    description: 'Individual portions of our famous cookie dough brownie.',
    price: 120,
    image: '/Cookie_Dough_Brownie_Cup.jpg'
  },
  {
    id: 7,
    name: 'Cranberry Pistachio Blondie',
    description: 'Sweet and salty blondie with tart cranberries and roasted pistachios.',
    price: 160,
    image: '/Cranberry_pistachio_blondie.jpg'
  },
  {
    id: 8,
    name: 'Dark Chocolate Hazelnut Brownie',
    description: 'Rich dark chocolate brownie with toasted hazelnuts.',
    price: 190,
    image: '/Dark_Chocolate_hazelnut_Brownie.jpg'
  },
  {
    id: 9,
    name: 'Dark Chocolate Walnut Brownie',
    description: 'Intense dark chocolate brownie with crunchy walnut pieces.',
    price: 190,
    image: '/Dark_Chocolate_walnut_brownie.jpg'
  },
  {
    id: 10,
    name: 'Assorted Donuts',
    description: 'A variety of fresh, fluffy donuts with different glazes and toppings.',
    price: 200,
    image: '/Donuts.jpg'
  },
  {
    id: 11,
    name: 'Jim Jam Cookies',
    description: 'Nostalgic jam-filled sandwich cookies.',
    price: 100,
    image: '/Jim_Jam_Cookies.jpg'
  },
  {
    id: 12,
    name: 'Mint Chocolate Chip Truffle',
    description: 'Refreshing mint cream and chocolate chips in a dark shell.',
    price: 150,
    image: '/Mint_chocolate_Chips_Truffle.jpg'
  },
  {
    id: 13,
    name: 'Nutella Sandwich Cookies',
    description: 'Buttery cookies sandwiched with a generous layer of Nutella.',
    price: 160,
    image: '/Nutella_Sandwich_Cookies.jpg'
  },
  {
    id: 14,
    name: 'Rasmalai Truffle',
    description: 'Fusion delight: White chocolate truffle with authentic Rasmalai flavor.',
    price: 180,
    image: '/Rasmalai_Truffle.jpg'
  },
  {
    id: 15,
    name: 'Rose Pistachio Cranberry Truffle',
    description: 'Elegant truffle with rose notes, pistachios, and cranberries.',
    price: 180,
    image: '/Rose-pistacho_cranberry_truffle.jpg'
  },
  {
    id: 16,
    name: 'Chilli Cheese Cookies',
    description: 'Savoury cookies with a spicy kick of chilli and cheese.',
    price: 130,
    image: '/chilli_cheese_cookies.jpg'
  },
  {
    id: 17,
    name: 'Choco Day Cookies',
    description: 'Rich chocolate cookies for everyday indulgence.',
    price: 110,
    image: '/choco_day_cookies.jpg'
  },
  {
    id: 18,
    name: 'Signature Cupcake',
    description: 'Our famous handcrafted cupcake with velvet smooth frosting.',
    price: 95,
    image: '/cupcake.jpg'
  }
];

export async function GET() {
  return NextResponse.json({ products: MOCK_PRODUCTS }, { status: 200 });
}

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({});

async function main() {
  await prisma.product.createMany({
    data: [
      {
        name: 'Classic Vanilla Cupcake',
        description: 'A timeless classic. Soft vanilla sponge topped with creamy vanilla buttercream.',
        price: 80,
        image: '/images/vanilla-cupcake.jpg'
      },
      {
        name: 'Double Chocolate Fudge',
        description: 'For the chocolate lovers. Rich chocolate cake with a decadent fudge core and chocolate frosting.',
        price: 120,
        image: '/images/chocolate-cupcake.jpg'
      },
      {
        name: 'Strawberry Dream',
        description: 'Fresh strawberry cake topped with light strawberry whipped cream.',
        price: 90,
        image: '/images/strawberry-cupcake.jpg'
      },
      {
        name: 'Red Velvet Royale',
        description: 'Classic red velvet cake with a smooth cream cheese frosting.',
        price: 110,
        image: '/images/red-velvet.jpg'
      },
      {
        name: 'Lemon Meringue',
        description: 'Zesty lemon cupcake filled with lemon curd and topped with toasted meringue.',
        price: 100,
        image: '/images/lemon-meringue.jpg'
      },
      {
        name: 'Salted Caramel Crunch',
        description: 'Vanilla bean cake with a caramel center, caramel frosting, and sea salt sprinkle.',
        price: 130,
        image: '/images/salted-caramel.jpg'
      }
    ]
  });
  console.log('Products seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

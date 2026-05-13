import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");

  // Cleanup in dependency order
  await db.review.deleteMany();
  await db.address.deleteMany();
  await db.orderItem.deleteMany();
  await db.order.deleteMany();
  await db.product.deleteMany();
  await db.category.deleteMany();
  await db.account.deleteMany();
  await db.session.deleteMany();
  await db.user.deleteMany();

  // ── Categories ────────────────────────────────────────────────────────────
  const [roupas, eletronicos, acessorios] = await Promise.all([
    db.category.create({
      data: {
        name: "Roupas",
        slug: "roupas",
        image:
          "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&auto=format&fit=crop",
      },
    }),
    db.category.create({
      data: {
        name: "Eletrônicos",
        slug: "eletronicos",
        image:
          "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop",
      },
    }),
    db.category.create({
      data: {
        name: "Acessórios",
        slug: "acessorios",
        image:
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop",
      },
    }),
  ]);

  // ── Users ─────────────────────────────────────────────────────────────────
  const [adminUser, normalUser] = await Promise.all([
    db.user.create({
      data: {
        name: "Admin ShopForge",
        email: "admin@shopforge.com",
        password: await bcrypt.hash("Admin@123", 12),
        role: "ADMIN",
      },
    }),
    db.user.create({
      data: {
        name: "João Silva",
        email: "user@shopforge.com",
        password: await bcrypt.hash("User@123", 12),
        role: "USER",
      },
    }),
  ]);

  // ── Products ──────────────────────────────────────────────────────────────
  // 4 Roupas, 4 Eletrônicos, 4 Acessórios
  const products = await Promise.all([
    // Roupas ─────────────────────────────────────────────────────────────────
    db.product.create({
      data: {
        name: "Camiseta Premium Algodão",
        slug: "camiseta-premium-algodao",
        description:
          "Camiseta de algodão 100% premium com corte moderno e confortável. Tecido antialérgico, lavagem à máquina segura e cores que não desbotam. Perfeita para o dia a dia ou momentos de lazer com muito estilo.",
        price: 89.9,
        comparePrice: 119.9,
        stock: 85,
        images: [
          "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop",
        ],
        isFeatured: true,
        categoryId: roupas.id,
      },
    }),
    db.product.create({
      data: {
        name: "Calça Jeans Slim Fit",
        slug: "calca-jeans-slim-fit",
        description:
          "Calça jeans slim fit com lavagem especial que garante maciez e durabilidade. Design versátil para qualquer ocasião, do casual ao semiformal. Composição: 98% algodão e 2% elastano para melhor mobilidade.",
        price: 189.9,
        comparePrice: 249.9,
        stock: 42,
        images: [
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=800&auto=format&fit=crop",
        ],
        isFeatured: false,
        categoryId: roupas.id,
      },
    }),
    db.product.create({
      data: {
        name: "Jaqueta Bomber Masculina",
        slug: "jaqueta-bomber-masculina",
        description:
          "Jaqueta bomber estilo clássico com forro interno quente e bolsos laterais com zíper. Material resistente ao vento e à chuva leve. Ribana nos punhos, barra e gola para melhor vedação e caimento impecável.",
        price: 319.9,
        stock: 28,
        images: [
          "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=800&auto=format&fit=crop",
        ],
        isFeatured: true,
        categoryId: roupas.id,
      },
    }),
    db.product.create({
      data: {
        name: "Vestido Floral Verão",
        slug: "vestido-floral-verao",
        description:
          "Vestido midi floral em viscose leve, ideal para os dias quentes. Alças finas ajustáveis, saia com franzido e forro interno. Exclusividade da coleção verão que une conforto, elegância e personalidade.",
        price: 149.9,
        comparePrice: 199.9,
        stock: 37,
        images: [
          "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&auto=format&fit=crop",
        ],
        isFeatured: false,
        categoryId: roupas.id,
      },
    }),

    // Eletrônicos ─────────────────────────────────────────────────────────────
    db.product.create({
      data: {
        name: 'Notebook Ultrabook 14"',
        slug: "notebook-ultrabook-14",
        description:
          'Notebook ultrafino com processador de última geração, 16 GB de RAM e SSD de 512 GB. Tela Full HD de 14" com alta luminosidade, bateria de 12 horas e peso de apenas 1,2 kg. Ideal para trabalho, estudo e criatividade.',
        price: 4299.9,
        comparePrice: 5499.9,
        stock: 15,
        images: [
          "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop",
        ],
        isFeatured: true,
        categoryId: eletronicos.id,
      },
    }),
    db.product.create({
      data: {
        name: "Smartphone Pro Max 256 GB",
        slug: "smartphone-pro-max-256gb",
        description:
          "Smartphone top de linha com câmera tripla de 108 MP, tela AMOLED de 6,7\" com 120 Hz, bateria de 5000 mAh e carregamento de 65 W. Processador Snapdragon 8 Gen 3 e 12 GB de RAM para desempenho sem limites.",
        price: 3799.9,
        stock: 23,
        images: [
          "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&auto=format&fit=crop",
        ],
        isFeatured: false,
        categoryId: eletronicos.id,
      },
    }),
    db.product.create({
      data: {
        name: "Fone Bluetooth ANC Premium",
        slug: "fone-bluetooth-anc-premium",
        description:
          "Headphone premium com cancelamento ativo de ruído (ANC), Bluetooth 5.3 e autonomia de 35 horas. Driver de 40 mm para som cristalino. Almofadas de memória viscoelástica e hastes dobráveis para transporte fácil.",
        price: 699.9,
        comparePrice: 899.9,
        stock: 56,
        images: [
          "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop",
        ],
        isFeatured: true,
        categoryId: eletronicos.id,
      },
    }),
    db.product.create({
      data: {
        name: "Smartwatch Fitness Pro",
        slug: "smartwatch-fitness-pro",
        description:
          "Smartwatch completo com monitor cardíaco 24 h, SpO2, GPS integrado e mais de 100 modos de treino. Resistente à água até 50 m. Tela AMOLED sempre ligada com autonomia de 7 dias e recarga rápida de 1 hora.",
        price: 899.9,
        comparePrice: 1199.9,
        stock: 34,
        images: [
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1546868871-0f936769675e?w=800&auto=format&fit=crop",
        ],
        isFeatured: false,
        categoryId: eletronicos.id,
      },
    }),

    // Acessórios ──────────────────────────────────────────────────────────────
    db.product.create({
      data: {
        name: "Relógio de Couro Clássico",
        slug: "relogio-couro-classico",
        description:
          "Relógio de quartzo com pulseira de couro legítimo italiano e caixa em aço inoxidável escovado. Mostrador minimalista com índices aplicados e movimento japonês de alta precisão. Resistente à água até 30 m.",
        price: 449.9,
        comparePrice: 599.9,
        stock: 19,
        images: [
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=800&auto=format&fit=crop",
        ],
        isFeatured: false,
        categoryId: acessorios.id,
      },
    }),
    db.product.create({
      data: {
        name: "Mochila Urbana Impermeável 30 L",
        slug: "mochila-urbana-impermeavel-30l",
        description:
          "Mochila de 30 litros com tecido impermeável e compartimento acolchoado para notebook de até 16\". Múltiplos bolsos organizadores, alças ergonômicas com espuma respirável e saída USB lateral embutida.",
        price: 259.9,
        comparePrice: 329.9,
        stock: 67,
        images: [
          "https://images.unsplash.com/photo-1548036161-24a3fcc8e8f6?w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a63?w=800&auto=format&fit=crop",
        ],
        isFeatured: false,
        categoryId: acessorios.id,
      },
    }),
    db.product.create({
      data: {
        name: "Óculos de Sol Polarizado UV400",
        slug: "oculos-sol-polarizado-uv400",
        description:
          "Óculos de sol com lentes polarizadas UV400 que bloqueiam 100% dos raios ultravioleta. Armação em acetato flexível e leve. Protege contra reflexos e ofuscamento. Inclui estojo rígido e flanela de limpeza.",
        price: 189.9,
        stock: 48,
        images: [
          "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop",
        ],
        isFeatured: false,
        categoryId: acessorios.id,
      },
    }),
    db.product.create({
      data: {
        name: "Carteira Slim de Couro",
        slug: "carteira-slim-couro",
        description:
          "Carteira minimalista em couro genuíno com capacidade para 8 cartões, 2 compartimentos para notas e bolso para moedas. Design ultrafino de apenas 8 mm de espessura. Disponível em preto e marrom caramelado.",
        price: 129.9,
        comparePrice: 169.9,
        stock: 92,
        images: [
          "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1548036161-24a3fcc8e8f5?w=800&auto=format&fit=crop",
        ],
        isFeatured: false,
        categoryId: acessorios.id,
      },
    }),
  ]);

  // ── Orders ────────────────────────────────────────────────────────────────
  const ago = (days: number) => new Date(Date.now() - days * 86_400_000);

  await Promise.all([
    db.order.create({
      data: {
        userId: normalUser.id,
        status: "DELIVERED",
        isPaid: true,
        paidAt: ago(30),
        total: products[0].price.toNumber() + products[1].price.toNumber(),
        stripeSessionId: "cs_test_seed_001",
        paymentIntentId: "pi_test_seed_001",
        items: {
          create: [
            { productId: products[0].id, quantity: 1, price: products[0].price },
            { productId: products[1].id, quantity: 1, price: products[1].price },
          ],
        },
      },
    }),
    db.order.create({
      data: {
        userId: normalUser.id,
        status: "DELIVERED",
        isPaid: true,
        paidAt: ago(15),
        total: products[6].price.toNumber(),
        stripeSessionId: "cs_test_seed_002",
        paymentIntentId: "pi_test_seed_002",
        items: {
          create: [{ productId: products[6].id, quantity: 1, price: products[6].price }],
        },
      },
    }),
  ]);

  // ── Reviews ───────────────────────────────────────────────────────────────
  await Promise.all([
    db.review.create({
      data: {
        userId: normalUser.id,
        productId: products[0].id,
        rating: 5,
        comment:
          "Qualidade excelente! O tecido é super macio e o caimento é perfeito. Recomendo muito a quem busca uma camiseta durável e confortável.",
      },
    }),
    db.review.create({
      data: {
        userId: normalUser.id,
        productId: products[1].id,
        rating: 4,
        comment:
          "Calça muito bem acabada e com ótimo caimento. Ficou levemente larga na cintura, mas o comprimento e o corte slim são perfeitos.",
      },
    }),
    db.review.create({
      data: {
        userId: normalUser.id,
        productId: products[6].id,
        rating: 5,
        comment:
          "O cancelamento de ruído é simplesmente incrível! Uso no home office todos os dias e a produtividade aumentou muito. Vale cada centavo.",
      },
    }),
  ]);

  console.log("✅ Seed concluído com sucesso!");
  console.log("   → 3 categorias: Roupas, Eletrônicos, Acessórios");
  console.log("   → 12 produtos (4 em destaque: camiseta, jaqueta, notebook, fone)");
  console.log("   → admin@shopforge.com / Admin@123");
  console.log("   → user@shopforge.com  / User@123");
  console.log("   → 2 pedidos DELIVERED + 3 reviews");
  console.log(`   Seed ignorado: ${adminUser.email}`); // avoid unused var warning
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());

import type {
  User,
  Product,
  Category,
  Order,
  OrderItem,
  Address,
  Review,
  Role,
  OrderStatus,
} from "@prisma/client";

export type { Role, OrderStatus };

export type SafeUser = Omit<User, "password"> & {
  emailVerified: string | null;
};

export type ProductWithCategory = Product & {
  category: Category;
};

export type ProductWithDetails = Product & {
  category: Category;
  reviews: (Review & {
    user: Pick<User, "id" | "name" | "image">;
  })[];
  _count: { reviews: number };
};

export type OrderWithItems = Order & {
  items: (OrderItem & { product: Pick<Product, "id" | "name" | "images" | "slug"> })[];
  address: Address | null;
};

export type OrderWithUser = Order & {
  user: Pick<User, "id" | "name" | "email">;
  items: (OrderItem & { product: Pick<Product, "id" | "name"> })[];
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
  slug: string;
};

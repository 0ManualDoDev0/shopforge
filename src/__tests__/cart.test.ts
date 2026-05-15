import { useCartStore } from "@/store/cartStore";

function makeItem(
  id: string,
  price: number,
  quantity = 1,
  stock = 10
) {
  return {
    id,
    name: `Produto ${id}`,
    price,
    quantity,
    image: "/placeholder.png",
    slug: `produto-${id}`,
    stock,
  };
}

beforeEach(() => {
  useCartStore.setState({ items: [] });
});

describe("addItem", () => {
  test("adiciona um novo item ao carrinho", () => {
    useCartStore.getState().addItem(makeItem("a", 50));
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].id).toBe("a");
  });

  test("adicionar o mesmo produto incrementa a quantity", () => {
    useCartStore.getState().addItem(makeItem("a", 50, 1));
    useCartStore.getState().addItem(makeItem("a", 50, 1));
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].quantity).toBe(2);
  });

  test("quantity não ultrapassa o estoque disponível", () => {
    useCartStore.getState().addItem(makeItem("a", 50, 1, 1));
    useCartStore.getState().addItem(makeItem("a", 50, 1, 1));
    expect(useCartStore.getState().items[0].quantity).toBe(1);
  });

  test("adicionar produtos diferentes resulta em itens separados", () => {
    useCartStore.getState().addItem(makeItem("a", 50));
    useCartStore.getState().addItem(makeItem("b", 80));
    expect(useCartStore.getState().items).toHaveLength(2);
  });
});

describe("removeItem", () => {
  test("remove o item pelo id", () => {
    useCartStore.getState().addItem(makeItem("a", 50));
    useCartStore.getState().addItem(makeItem("b", 80));
    useCartStore.getState().removeItem("a");
    const items = useCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe("b");
  });

  test("remover item inexistente não altera o carrinho", () => {
    useCartStore.getState().addItem(makeItem("a", 50));
    useCartStore.getState().removeItem("z");
    expect(useCartStore.getState().items).toHaveLength(1);
  });
});

describe("updateQuantity", () => {
  test("atualiza a quantidade do item", () => {
    useCartStore.getState().addItem(makeItem("a", 50));
    useCartStore.getState().updateQuantity("a", 3);
    expect(useCartStore.getState().items[0].quantity).toBe(3);
  });

  test("quantidade zero remove o item", () => {
    useCartStore.getState().addItem(makeItem("a", 50));
    useCartStore.getState().updateQuantity("a", 0);
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  test("quantidade negativa remove o item", () => {
    useCartStore.getState().addItem(makeItem("a", 50));
    useCartStore.getState().updateQuantity("a", -1);
    expect(useCartStore.getState().items).toHaveLength(0);
  });
});

describe("clearCart", () => {
  test("esvazia completamente o carrinho", () => {
    useCartStore.getState().addItem(makeItem("a", 50));
    useCartStore.getState().addItem(makeItem("b", 80));
    useCartStore.getState().addItem(makeItem("c", 30));
    useCartStore.getState().clearCart();
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  test("clearCart em carrinho vazio não lança erro", () => {
    expect(() => useCartStore.getState().clearCart()).not.toThrow();
  });
});

describe("cálculo de total", () => {
  test("total é a soma de price * quantity de todos os itens", () => {
    useCartStore.getState().addItem(makeItem("a", 100, 2));
    useCartStore.getState().addItem(makeItem("b", 50, 3));
    useCartStore.getState().addItem(makeItem("c", 25, 1));
    const total = useCartStore
      .getState()
      .items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    expect(total).toBe(100 * 2 + 50 * 3 + 25 * 1); // 375
  });

  test("carrinho vazio tem total zero", () => {
    const total = useCartStore
      .getState()
      .items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    expect(total).toBe(0);
  });

  test("total com preços decimais é preciso", () => {
    useCartStore.getState().addItem(makeItem("a", 19.99, 3));
    const total = useCartStore
      .getState()
      .items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    expect(total).toBeCloseTo(59.97, 2);
  });
});

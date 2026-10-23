/** Fotos do café da manhã, nomeadas pelo slug do produto no cardápio. */
const PRODUCT_IMAGES: Record<string, string> = {
  "cafe-preto": "/cardapio/cafe-preto.jpg",
  "cafe-com-leite": "/cardapio/cafe-com-leite.jpg",
  "chocolate-quente": "/cardapio/chocolate-quente.jpg",
  "suco-natural": "/cardapio/suco-natural.jpg",
  "cuscuz-simples": "/cardapio/cuscuz-simples.jpg",
  "cuscuz-com-talhada": "/cardapio/cuscuz-com-talhada.jpg",
  "cuscuz-com-carne-de-sol-e-queijo": "/cardapio/cuscuz-com-carne-de-sol-e-queijo.jpg",
  "cuscuz-com-carne-de-frango-e-reiqueijao": "/cardapio/cuscuz-com-carne-de-frango-e-reiqueijao.jpg",
  "cuscuz-com-queijo": "/cardapio/cuscuz-com-queijo.jpg",
  queijo: "/cardapio/queijo.jpg",
  "tapioca-simples": "/cardapio/tapioca-simples.jpg",
  "tapioca-com-queijo-presunto-e-ovo": "/cardapio/tapioca-com-queijo-presunto-e-ovo.jpg",
  "tapioca-com-carne-de-sol-e-queijo": "/cardapio/tapioca-com-carne-de-sol-e-queijo.jpg",
  "tapioca-de-frango-com-requeijao": "/cardapio/tapioca-de-frango-com-requeijao.jpg",
  "tapioca-carne-de-sol-banana-da-terra":
    "/cardapio/tapioca-carne-de-sol-banana-da-terra.jpg",
  "tapioca-carne-de-sol-banana-da-terra-alface-tomate":
    "/cardapio/tapioca-carne-de-sol-banana-da-terra-alface-tomate.jpg",
  "pao-de-queijo": "/cardapio/pao-de-queijo.jpg",
  "pao-de-queijo-pequeno": "/cardapio/pao-de-queijo-pequeno.jpg",
  "pao-de-queijo-com-carne-de-sol": "/cardapio/pao-de-queijo-com-carne-de-sol.jpg",
  "pao-de-queijo-com-frango": "/cardapio/pao-de-queijo-com-frango.jpg",
  "bolo-frito": "/cardapio/bolo-frito.jpg",
  "bolo-de-milho": "/cardapio/bolo-de-milho.jpg",
  orelha: "/cardapio/orelha.jpg",
  "ovo-cozido": "/cardapio/ovo-cozido.jpg",
  "pao-recheado-com-carne-moida": "/cardapio/pao-recheado-com-carne-moida.jpg",
  "pao-com-ovo": "/cardapio/pao-com-ovo.jpg",
  "pao-com-queijo-e-presunto": "/cardapio/pao-com-queijo-e-presunto.jpg",
  "pao-completo": "/cardapio/pao-completo.jpg",
  panelado: "/cardapio/panelado.jpg",
  "panelada-individual": "/cardapio/panelada-individual.jpg",
  "panelada-compartilhada": "/cardapio/panelada-compartilhada.jpg",
};

export function productImageUrl(slug: string): string | null {
  return PRODUCT_IMAGES[slug] ?? null;
}

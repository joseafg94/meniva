export type Language = 'es' | 'en' | 'pt';

export const uiTranslations = {
  es: {
    soldOut: "Agotado",
    popular: "Popular",
    new: "Nuevo",
    recommended: "Recomendado",
    others: "Otros",
    emptyMenu: "El menú aún no tiene productos disponibles.",
    createdWith: "Menú digital creado con",
    searchPlaceholder: "Buscar plato o bebida...",
    // Landing
    slogan: "La revolución del menú digital en Panamá",
    title1: "Tu menú digital,",
    title2: "siempre actualizado.",
    subtitle: "Crea un menú QR moderno en minutos. Cambia precios, platos y disponibilidad desde tu celular, sin imprimir nada.",
    registerBtn: "Registrar mi restaurante",
    loginBtn: "Entrar al Panel",
    feature1Title: "Cero impresión",
    feature1Desc: "Ahorra costos y ayuda al planeta con un menú 100% digital.",
    feature2Title: "Control total",
    feature2Desc: "Actualiza tu menú al instante desde cualquier lugar.",
    feature3Title: "Experiencia premium",
    feature3Desc: "Tus clientes amarán la interfaz rápida y moderna.",
    footerText: "Hecho con ❤️ en Panamá.",
  },
  en: {
    soldOut: "Sold Out",
    popular: "Popular",
    new: "New",
    recommended: "Recommended",
    others: "Others",
    emptyMenu: "The menu doesn't have available products yet.",
    createdWith: "Digital menu created with",
    searchPlaceholder: "Search dish or drink...",
    // Landing
    slogan: "The digital menu revolution in Panama",
    title1: "Your digital menu,",
    title2: "always updated.",
    subtitle: "Create a modern QR menu in minutes. Change prices, dishes and availability from your cell phone, without printing anything.",
    registerBtn: "Register my restaurant",
    loginBtn: "Enter Dashboard",
    feature1Title: "Zero printing",
    feature1Desc: "Save costs and help the planet with a 100% digital menu.",
    feature2Title: "Total control",
    feature2Desc: "Update your menu instantly from anywhere.",
    feature3Title: "Premium experience",
    feature3Desc: "Your customers will love the fast and modern interface.",
    footerText: "Made with ❤️ in Panama.",
  },
  pt: {
    soldOut: "Esgotado",
    popular: "Popular",
    new: "Novo",
    recommended: "Recomendado",
    others: "Outros",
    emptyMenu: "O menu ainda não possui produtos disponíveis.",
    createdWith: "Menu digital criado com",
    searchPlaceholder: "Buscar prato ou bebida...",
    // Landing
    slogan: "A revolução do menu digital no Panamá",
    title1: "Seu menu digital,",
    title2: "sempre atualizado.",
    subtitle: "Crie um menu QR moderno em minutos. Altere preços, pratos e disponibilidade pelo seu celular, sem imprimir nada.",
    registerBtn: "Registrar meu restaurante",
    loginBtn: "Entrar no Painel",
    feature1Title: "Zero impressão",
    feature1Desc: "Economize custos e ajude o planeta con um menú 100% digital.",
    feature2Title: "Controle total",
    feature2Desc: "Atualize seu menu instantaneamente de qualquer lugar.",
    feature3Title: "Experiência premium",
    feature3Desc: "Seus clientes vão amar a interface rápida e moderna.",
    footerText: "Feito com ❤️ no Panamá.",
  }
} as const;

export async function translateText(text: string, toLang: Language): Promise<string> {
  if (!text.trim() || toLang === 'es') return text;
  
  const cacheKey = `tr_${toLang}_${text}`;
  try {
    if (typeof window !== 'undefined') {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) return cached;
    }
  } catch (e) {
    // Ignore session storage errors
  }

  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=es|${toLang}`
    );
    const data = await res.json();
    if (data?.responseData?.translatedText) {
      const translated = data.responseData.translatedText;
      try {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(cacheKey, translated);
        }
      } catch (e) {}
      return translated;
    }
  } catch (e) {
    console.error('Translation error:', e);
  }
  return text;
}

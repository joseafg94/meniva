'use client';

import React from 'react';
import { uiTranslations } from '@/lib/translate';
import { CategoryNav } from '@/components/menu/CategoryNav';
import { MenuProductCard } from '@/components/menu/MenuProductCard';
import { PromoBanner } from '@/components/menu/PromoBanner';

interface Category {
  id: string;
  name: string;
  position: number;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category_id: string | null;
  is_available: boolean;
  is_featured: boolean;
  badge_type: string | null;
}

interface Restaurant {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  cover_url: string | null;
  banner_active: boolean;
  banner_text: string | null;
  banner_color: string | null;
  banner_emoji: string | null;
  banner_expires_at: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  menu_font: string | null;
}

interface MenuClientProps {
  restaurant: Restaurant;
  categories: Category[];
  products: Product[];
  isBannerVisible: boolean;
}

export function MenuClient({ restaurant, categories, products, isBannerVisible }: MenuClientProps) {
  // Group products by category using original products
  const productsByCategory = (categories ?? []).map((cat) => ({
    ...cat,
    products: (products ?? []).filter((p) => p.category_id === cat.id),
  })).filter((cat) => cat.products.length > 0);

  // Products without category
  const uncategorized = (products ?? []).filter((p) => !p.category_id);

  const primaryColor = restaurant.primary_color ?? '#059669';
  const secondaryColor = restaurant.secondary_color ?? '#fafafa';

  const fontMap: Record<string, string> = {
    inter: 'Inter',
    playfair: 'Playfair Display',
    poppins: 'Poppins',
    lato: 'Lato',
    merriweather: 'Merriweather',
    montserrat: 'Montserrat',
    raleway: 'Raleway',
    nunito: 'Nunito',
  };
  const fontFamily = fontMap[restaurant.menu_font ?? 'inter'];

  return (
    <div 
      className="min-h-screen pb-20"
      style={{ fontFamily, backgroundColor: secondaryColor }}
    >
      <link
        rel="stylesheet"
        href={`https://fonts.googleapis.com/css2?family=${fontFamily.replace(' ', '+')}:wght@400;500;600;700&display=swap`}
      />
      {/* Promo Banner */}
      {isBannerVisible && (
        <PromoBanner 
          banner_text={restaurant.banner_text}
          banner_color={restaurant.banner_color}
          banner_emoji={restaurant.banner_emoji}
        />
      )}

      {/* Hero header */}
      <div className="bg-white border-b border-zinc-100">
        {restaurant.cover_url && (
          <div
            className="h-36 w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${restaurant.cover_url})` }}
          />
        )}
        <div className="px-5 py-6 flex items-center gap-4">
          {restaurant.logo_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={restaurant.logo_url}
              alt={restaurant.name}
              className="w-24 h-24 rounded-2xl object-cover border border-zinc-100 shrink-0 shadow-md"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold text-zinc-900">{restaurant.name}</h1>
            {restaurant.description && (
              <p className="text-sm text-zinc-400 mt-0.5 leading-relaxed">
                {restaurant.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Category nav */}
      {categories && categories.length > 0 && (
        <CategoryNav categories={categories} primaryColor={primaryColor} />
      )}

      {/* Menu sections */}
      <div className="px-4 py-6 space-y-10 max-w-2xl mx-auto">
        {productsByCategory.map((cat) => (
          <section key={cat.id} id={cat.id}>
            <h2 className="text-base font-semibold text-zinc-900 mb-4 pb-2 border-b border-zinc-100">
              {cat.name}
            </h2>
            <div className="space-y-3">
              {cat.products.map((product) => (
                <MenuProductCard 
                  key={product.id} 
                  product={product} 
                  primaryColor={primaryColor} 
                />
              ))}
            </div>
          </section>
        ))}

        {/* Uncategorized products */}
        {uncategorized.length > 0 && (
          <section id="sin-categoria">
            <h2 className="text-base font-semibold text-zinc-900 mb-4 pb-2 border-b border-zinc-100">
              {uiTranslations.others}
            </h2>
            <div className="space-y-3">
              {uncategorized.map((product) => (
                <MenuProductCard 
                  key={product.id} 
                  product={product} 
                  primaryColor={primaryColor} 
                />
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {productsByCategory.length === 0 && uncategorized.length === 0 && (
          <div className="text-center py-16">
            <p className="text-zinc-400 text-sm">{uiTranslations.emptyMenu}</p>
          </div>
        )}
      </div>


      {/* Footer */}
      <div className="text-center py-6 pb-safe">
        <p className="text-[10px] text-zinc-300">
          {uiTranslations.createdWith} <span className="text-emerald-500 font-medium">Meniva</span>
        </p>
      </div>
    </div>
  );
}

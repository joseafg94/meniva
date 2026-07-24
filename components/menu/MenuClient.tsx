'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Wallet } from 'lucide-react';
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
  whatsapp_number: string | null;
  whatsapp_button_type: string | null;
  whatsapp_message: string | null;
  yappy_qr_url: string | null;
  yappy_active: boolean;
}

interface MenuClientProps {
  restaurant: Restaurant;
  categories: Category[];
  products: Product[];
  isBannerVisible: boolean;
}

export function MenuClient({ restaurant, categories, products, isBannerVisible }: MenuClientProps) {
  const [yappyModalOpen, setYappyModalOpen] = useState(false);
  const showYappy = !!(restaurant.yappy_active && restaurant.yappy_qr_url);
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

      {/* Yappy Floating Button */}
      {showYappy && (
        <button
          onClick={() => setYappyModalOpen(true)}
          className={`fixed z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-110 ${restaurant.whatsapp_number ? 'bottom-24 right-6' : 'bottom-6 right-6'}`}
          style={{ backgroundColor: '#6D28D9' }}
          aria-label="Pagar con Yappy"
        >
          <Wallet size={26} color="white" strokeWidth={1.8} />
        </button>
      )}

      {/* Yappy Modal */}
      {showYappy && yappyModalOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4"
          onClick={() => setYappyModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-xs shadow-2xl flex flex-col items-center gap-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setYappyModalOpen(false)}
              className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-zinc-100 transition-colors text-zinc-500"
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>
            <h2 className="text-lg font-bold text-zinc-900">Pagar con Yappy</h2>
            <p className="text-sm text-zinc-500 text-center">Escanea el código QR con tu app de Yappy para realizar tu pago.</p>
            <div className="w-56 h-56 relative rounded-xl overflow-hidden border border-zinc-100 bg-zinc-50">
              <Image
                src={restaurant.yappy_qr_url!}
                alt="QR de Yappy"
                fill
                className="object-contain p-2"
                sizes="224px"
              />
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Floating Button */}
      {restaurant.whatsapp_number && (
        <a
          href={`https://wa.me/${restaurant.whatsapp_number}?text=${encodeURIComponent(restaurant.whatsapp_message ?? 'Hola, estoy revisando el menú y me gustaría hacer una consulta.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-110"
          style={{ backgroundColor: '#25D366' }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
      )}
    </div>
  );
}

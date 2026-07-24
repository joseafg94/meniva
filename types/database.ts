export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      restaurants: {
        Row: {
          id: string
          user_id: string
          name: string
          slug: string
          description: string | null
          logo_url: string | null
          cover_url: string | null
          phone: string | null
          address: string | null
          created_at: string
          whatsapp_number: string | null
          whatsapp_button_type: 'Hacer Pedido' | 'Reservar Mesa' | 'Consultar' | null
          whatsapp_message: string | null
          yappy_qr_url: string | null
          yappy_active: boolean
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          slug: string
          description?: string | null
          logo_url?: string | null
          cover_url?: string | null
          phone?: string | null
          address?: string | null
          created_at?: string
          whatsapp_number?: string | null
          whatsapp_button_type?: 'Hacer Pedido' | 'Reservar Mesa' | 'Consultar' | null
          whatsapp_message?: string | null
          yappy_qr_url?: string | null
          yappy_active?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          slug?: string
          description?: string | null
          logo_url?: string | null
          cover_url?: string | null
          phone?: string | null
          address?: string | null
          created_at?: string
          whatsapp_number?: string | null
          whatsapp_button_type?: 'Hacer Pedido' | 'Reservar Mesa' | 'Consultar' | null
          whatsapp_message?: string | null
          yappy_qr_url?: string | null
          yappy_active?: boolean
        }
      }
      categories: {
        Row: {
          id: string
          restaurant_id: string
          name: string
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          name: string
          position?: number
          created_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          name?: string
          position?: number
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          restaurant_id: string
          category_id: string | null
          name: string
          description: string | null
          price: number
          image_url: string | null
          is_available: boolean
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          category_id?: string | null
          name: string
          description?: string | null
          price: number
          image_url?: string | null
          is_available?: boolean
          position?: number
          created_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          category_id?: string | null
          name?: string
          description?: string | null
          price?: number
          image_url?: string | null
          is_available?: boolean
          position?: number
          created_at?: string
        }
      }
    }
  }
}

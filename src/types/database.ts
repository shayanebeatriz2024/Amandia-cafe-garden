/**
 * Tipos do banco (formato do `supabase gen types typescript`).
 * Versão manual espelhando docs/05-backend-schema.sql — substituir pela gerada:
 *   npx supabase gen types typescript --project-id <id> > src/types/database.ts
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type MenuSection = 'cardapio' | 'vitrine' | 'presentes' | 'mesa_posta';
export type DietaryTag = 'vegano' | 'vegetariano' | 'sem_gluten' | 'sem_lactose' | 'contem_nozes';
export type EventStatus = 'rascunho' | 'publicado' | 'cancelado';

type Timestamps = { created_at: string; updated_at: string };

export type MenuCategoryRow = Timestamps & {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  section: MenuSection;
  icon: string | null;
  sort_order: number;
  is_published: boolean;
}

export type MenuItemRow = Timestamps & {
  id: string;
  category_id: string;
  slug: string;
  name: string;
  description: string | null;
  price_cents: number | null;
  price_label: string | null;
  image_path: string | null;
  image_alt: string | null;
  dietary_tags: DietaryTag[];
  is_featured: boolean;
  is_available: boolean;
  lead_time_hours: number | null;
  includes: string[];
  sort_order: number;
  is_published: boolean;
}

export type EventRow = Timestamps & {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  description: string | null;
  starts_at: string;
  ends_at: string | null;
  location_label: string | null;
  image_path: string | null;
  image_alt: string | null;
  price_cents: number | null;
  capacity: number | null;
  is_sold_out: boolean;
  booking_url: string | null;
  status: EventStatus;
}

export type OpeningHoursRow = Timestamps & {
  id: string;
  /** ISO-8601: 1 = segunda … 7 = domingo */
  weekday: number;
  /** HH:MM:SS */
  opens_at: string;
  closes_at: string;
  valid_from: string | null;
  valid_until: string | null;
}

export type SpecialHoursRow = Timestamps & {
  id: string;
  /** YYYY-MM-DD */
  date: string;
  is_closed: boolean;
  opens_at: string | null;
  closes_at: string | null;
  note: string | null;
}

export type MenuPublicRow = {
  category_id: string;
  category_slug: string;
  category_name: string;
  category_description: string | null;
  section: MenuSection;
  category_icon: string | null;
  category_order: number;
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price_cents: number | null;
  price_label: string | null;
  image_path: string | null;
  image_alt: string | null;
  dietary_tags: DietaryTag[];
  is_featured: boolean;
  is_available: boolean;
  lead_time_hours: number | null;
  includes: string[];
  sort_order: number;
}

export type JobApplicationRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  about: string;
  strengths: string[];
  resume_path: string | null;
  consent_at: string;
  created_at: string;
}

type Table<Row> = {
  Row: Row;
  Insert: Partial<Row>;
  Update: Partial<Row>;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      menu_categories: Table<MenuCategoryRow>;
      menu_items: Table<MenuItemRow>;
      events: Table<EventRow>;
      opening_hours: Table<OpeningHoursRow>;
      special_hours: Table<SpecialHoursRow>;
      job_applications: Table<JobApplicationRow>;
    };
    Views: {
      menu_public: { Row: MenuPublicRow; Relationships: [] };
    };
    Functions: Record<string, never>;
    Enums: {
      menu_section: MenuSection;
      dietary_tag: DietaryTag;
      event_status: EventStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};

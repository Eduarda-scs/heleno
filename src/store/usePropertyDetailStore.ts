import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Category {
  id: number;
  category_name: string;
  category_description: string | null;
  category_color: string | null;
  category_emoji: string | null;
}

interface PropertyType {
  id: number;
  property_type_name: string;
  property_type_description: string | null;
  property_type_color: string | null;
  property_type_emoji: string | null;
}

interface Image {
  url: string;
  is_cover: string;
  position: string;
}

interface Video {
  url: string;
  is_cover: string | null;
  position: string | null;
}

interface PropertyDetail {
  id: string;
  property_title: string;
  property_detail: string;
  property_street: string;
  property_street_number: string;
  property_neighborhood: string;
  property_city: string;
  property_postal_code: string;
  property_area_sqm: string;
  property_bedrooms: string;
  property_bathrooms: string;
  property_garage_spaces: string;
  property_price: string;
  property_negociation_price: string;
  property_rental_price: string;
  property_condo_price: string | null;
  announcer_name: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  categories: Category[];
  property_types: PropertyType[];
  images: Image[];
  videos: Video[];
  amenities: any[];
}

interface PropertyDetailStore {
  currentProperty: PropertyDetail | null;
  setCurrentProperty: (property: PropertyDetail | null) => void;
  clearCurrentProperty: () => void;
}

export const usePropertyDetailStore = create<PropertyDetailStore>()(
  persist(
    (set) => ({
      currentProperty: null,
      setCurrentProperty: (property) => set({ currentProperty: property }),
      clearCurrentProperty: () => set({ currentProperty: null }),
    }),
    {
      name: 'property-detail-storage',
    }
  )
);
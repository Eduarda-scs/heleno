import { create } from 'zustand';

interface PropertyStore {
  propertyData: any;
  setPropertyData: (data: any) => void;
  clearPropertyData: () => void;
}

export const usePropertyStore = create<PropertyStore>((set) => ({
  propertyData: null,
  
  setPropertyData: (data: any) => {
    
    if (Array.isArray(data)) {
      console.log("[usePropertyService] 🎯 Quantidade de itens:", data.length);
      if (data.length > 0) {
        console.log("[usePropertyService] 🏠 Estrutura do primeiro item:", Object.keys(data[0]));
      }
    }
    set({ propertyData: data });
  },
  
  clearPropertyData: () => set({ propertyData: null })
}));
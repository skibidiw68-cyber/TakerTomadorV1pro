import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

export const REGIONS = {
  MX: { name: 'México', domain: 'TakerTomador.com.mx', colors: ['#006847', '#FFFFFF', '#CE1126'], lang: 'es', soldText: 'VENDIDO' },
  US: { name: 'Estados Unidos', domain: 'TakerTomador.com', colors: ['#0A3161', '#FFFFFF', '#B31942'], lang: 'en', soldText: 'SOLD' },
  CA: { name: 'Canadá', domain: 'TakerTomador.ca', colors: ['#FF0000', '#FFFFFF', '#FF0000'], lang: 'en', soldText: 'SOLD' },
  GLOBAL: { name: 'Global', domain: 'TakerTomadorGlobal.com', colors: ['#0A3161', '#006847', '#FFFFFF', '#CE1126'], lang: 'es', soldText: 'VENDIDO' }
};

const initialState = {
  currentRegion: REGIONS.GLOBAL,
  activeTab: 'marketplace',
  products: [], 
  reports: [],
  verifiedSellers: [],
  warnedSellers: {} 
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_REGION': return { ...state, currentRegion: action.payload };
    case 'SET_TAB': return { ...state, activeTab: action.payload };
    case 'ADD_PRODUCT': return { ...state, products: [action.payload, ...state.products] };
    case 'REMOVE_PRODUCT': return { ...state, products: state.products.filter(p => p.id !== action.payload) };
    case 'VERIFY_SELLER': return { ...state, verifiedSellers: [...state.verifiedSellers, action.payload] };
    case 'ADD_REPORT': return { ...state, reports: [...state.reports, action.payload] };
    case 'RESOLVE_REPORT': return { ...state, reports: state.reports.filter(r => r.id !== action.payload) };
    case 'WARN_SELLER': 
      const currentWarns = state.warnedSellers[action.payload.seller] || [];
      return {
        ...state,
        warnedSellers: { ...state.warnedSellers, [action.payload.seller]: [...currentWarns, action.payload.reason] }
      };
    case 'BAN_SELLER': return {
      ...state,
      products: state.products.filter(p => p.sellerName !== action.payload)
    };
    default: return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      if (lat > 14 && lat < 33) dispatch({ type: 'SET_REGION', payload: REGIONS.MX });
      else if (lat >= 33 && lat < 49) {
        if (lat < 37) alert("Sugerencia de Región: ¿Prefieres México o USA?");
        else alert("Sugerencia de Región: ¿Prefieres Canadá o USA?");
        dispatch({ type: 'SET_REGION', payload: REGIONS.US });
      }
      else if (lat >= 49) dispatch({ type: 'SET_REGION', payload: REGIONS.CA });
    });
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);

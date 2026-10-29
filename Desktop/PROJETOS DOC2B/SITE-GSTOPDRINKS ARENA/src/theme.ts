import { createContext, useContext } from "react";
import { BRAND_THEME, type Theme } from "./data/catalog";

export const ThemeCtx = createContext<Theme>(BRAND_THEME);
export const useTheme = () => useContext(ThemeCtx);

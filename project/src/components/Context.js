import { useContext, createContext } from "react";
//this is the context for the toggle theme button
export const ThemeContext= createContext({
    lightTheme : ()=>{},
    darkTheme : ()=>{},
    themeMode : "light"
})
export const ThemeProvider = ThemeContext.Provider
export default function useTheme(){
    return useContext(ThemeContext)
}
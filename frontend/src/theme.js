 
import { createTheme } from "@mui/material/styles";

 
const PRIMARY_BLUE = "#0D6EFD";  
const ACCENT_ORANGE = "#F79B25";  
const LIGHT_GREY_BG = "#F8F9FA";  
const DARK_BG = "#121212"; 
const DARK_PAPER = "#1E1E1E"; 
 
export const getTheme = (mode = "light") => {
  const BODY_TEXT = mode === "light" ? "#212529" : "#EAEAEA";

  return createTheme({
    palette: {
      mode,
      primary: {
        main: PRIMARY_BLUE,
        contrastText: "#ffffff",
      },
      secondary: {
        main: ACCENT_ORANGE,
        contrastText: "#ffffff",
      },
      background: {
        default: mode === "light" ? "#FFFFFF" : DARK_BG,
        paper: mode === "light" ? LIGHT_GREY_BG : DARK_PAPER,
      },
      text: {
        primary: BODY_TEXT,
        secondary: mode === "light" ? "#6c757d" : "#b0b0b0",
      },
      divider: mode === "light" ? "#EAEAEA" : "#2C2C2C",
    },
    typography: {
      fontFamily: "Poppins, sans-serif",
      h1: {
        fontWeight: 700,
        fontSize: "3.5rem",
        lineHeight: 1.2,
        color: BODY_TEXT,
      },
      h2: {
        fontWeight: 600,
        fontSize: "2.5rem",
        color: BODY_TEXT,
      },
      h4: {
        fontWeight: 600,
      },
      button: {
        textTransform: "none",
        fontWeight: 600,
        borderRadius: "8px",
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition: "background-color 0.4s ease, color 0.4s ease",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "8px",
            padding: "10px 24px",
            boxShadow: "none",
            transition: "all 0.3s ease",
          },
          containedPrimary: {
            "&:hover": {
              boxShadow: "0 4px 14px rgba(13, 110, 253, 0.3)",
            },
          },
          containedSecondary: {
            "&:hover": {
              boxShadow: "0 4px 14px rgba(247, 155, 37, 0.4)",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: "12px",
            boxShadow:
              mode === "light"
                ? "0 4px 12px rgba(0,0,0,0.05)"
                : "0 4px 12px rgba(0,0,0,0.3)",
            border:
              mode === "light"
                ? "1px solid #EAEAEA"
                : "1px solid #2C2C2C",
            backgroundColor: mode === "light" ? "#FFFFFF" : DARK_PAPER,
            transition: "all 0.3s ease",
          },
        },
      },
      MuiCssBaseline: {
  styleOverrides: {
    body: {
      transition: "background-color 0.4s ease, color 0.4s ease",
 
      "&::-webkit-scrollbar": {
        width: "8px",              
        height: "8px",           
      },
      "&::-webkit-scrollbar-track": {
        background: mode === "light" ? "#f0f0f0" : "#1E1E1E",  
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: mode === "light" ? "#0D6EFD" : "#0D6EFD", 
        borderRadius: "8px",
      },
      "&::-webkit-scrollbar-thumb:hover": {
        backgroundColor: mode === "light" ? "#0B5ED7" : "#0B5ED7",  
      },
   
      scrollbarWidth: "thin",
      scrollbarColor: `${mode === "light" ? "#0D6EFD" : "#0D6EFD"} ${mode === "light" ? "#f0f0f0" : "#1E1E1E"}`,
    },
  },
},

      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "light" ? "#FFFFFF" : DARK_PAPER,
            color: BODY_TEXT,
            boxShadow: "none",
            borderBottom:
              mode === "light"
                ? "1px solid #EAEAEA"
                : "1px solid #2C2C2C",
            transition:
              "background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease",
          },
        },
      },
    },
  });
};

 
const theme = getTheme("light");

export default theme;

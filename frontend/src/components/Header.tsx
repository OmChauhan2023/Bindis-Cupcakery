import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  InputBase,
  Badge,
  Box,
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
  Fade,
  useTheme,
  alpha
} from "@mui/material";
import {
  Search as SearchIcon,
  ShoppingCart as ShoppingCartIcon,
  Close as CloseIcon
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import api from "@/services/api";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const SearchOverlay = styled("div")(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: alpha(theme.palette.background.paper, 0.95),
  display: "flex",
  alignItems: "center",
  zIndex: 100,
}));

const SearchInput = styled(InputBase)(({ theme }) => ({
  width: "100%",
  fontSize: "1.5rem",
  padding: theme.spacing(2),
  borderBottom: `2px solid ${theme.palette.divider}`,
  "&:focus-within": {
    borderBottomColor: theme.palette.primary.main,
  },
}));

interface Product {
  id?: number | string;
  _id?: string;
  name: string;
  [key: string]: unknown;
}

export default function Header() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { cart } = useCart();
  const { user, isAdmin } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setAllProducts(response.data.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts([]);
      return;
    }

    const results = allProducts.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredProducts(results);
  }, [searchQuery, allProducts]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setSearchQuery("");
      setFilteredProducts([]);
    }
  };

  const navLinks = [
    { title: "Home", path: "/" },
    { title: "Products", path: "/products" },
    { title: "Gallery", path: "/gallery" },
    { title: "Contact", path: "/contact" },
    { title: "Review", path: "/review" },
    { title: isAdmin ? "Admin Dashboard" : user ? "My Account" : "Login", path: isAdmin ? "/admin" : user ? "/profile" : "/login", bold: true },
  ];

  return (
    <AppBar position="sticky" color="inherit" elevation={1} sx={{ bgcolor: "background.paper" }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: "space-between", height: 80 }}>
          {/* Logo */}
          <Link to="/" style={{ display: "flex", alignItems: "center" }}>
            <img src="/bindis_logo.jpg" alt="Bindi's Cupcakery Logo" style={{ height: 50, width: "auto" }} />
          </Link>

          {/* Navigation Links */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
            {navLinks.map((link) => (
              <Button
                key={link.title}
                component={Link}
                to={link.path}
                color="inherit"
                sx={{
                  fontWeight: link.bold ? 700 : 400,
                  "&:hover": { color: "primary.main" },
                }}
              >
                {link.title}
              </Button>
            ))}
          </Box>
          {/* Icons */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              onClick={toggleSearch}
              color="inherit"
              sx={{
                bgcolor: alpha(theme.palette.text.primary, 0.05),
                "&:hover": { bgcolor: alpha(theme.palette.text.primary, 0.1) },
              }}
            >
              <SearchIcon />
            </IconButton>

            <IconButton
              component={Link}
              to="/cart"
              color="inherit"
              sx={{
                bgcolor: alpha(theme.palette.text.primary, 0.05),
                "&:hover": { bgcolor: alpha(theme.palette.text.primary, 0.1) },
              }}
            >
              <Badge badgeContent={cartCount} color="primary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      {/* Search Overlay */}
      <Fade in={isSearchOpen} unmountOnExit>
        <SearchOverlay>
          <Container maxWidth="md">
            <Box sx={{ position: "relative" }}>
              <SearchInput
                inputRef={searchInputRef}
                placeholder="Search for delicious treats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <IconButton
                onClick={toggleSearch}
                sx={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Results */}
            {filteredProducts.length > 0 && (
              <Paper elevation={4} sx={{ mt: 2, maxHeight: 400, overflow: "auto", borderRadius: 2 }}>
                <List>
                  {filteredProducts.map((product) => (
                    <ListItem
                      key={product.id || product._id}
                      onClick={() => {
                        toggleSearch();
                        navigate(`/products/${product.id || product._id}`);
                      }}
                      disablePadding
                      sx={{ cursor: "pointer" }}
                    >
                      <ListItemText
                        primary={product.name}
                        sx={{
                          px: 2,
                          py: 1,
                          "&:hover": { bgcolor: "primary.light", color: "primary.dark" },
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </Container>
        </SearchOverlay>
      </Fade>
    </AppBar>
  );
}

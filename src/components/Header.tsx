"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
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
} from "@mui/material"
import {
  Search as SearchIcon,
  ShoppingCart as ShoppingCartIcon,
  Close as CloseIcon
} from "@mui/icons-material"
import { styled } from "@mui/material/styles"

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
}))

const SearchInput = styled(InputBase)(({ theme }) => ({
  width: "100%",
  fontSize: "1.5rem",
  padding: theme.spacing(2),
  borderBottom: `2px solid ${theme.palette.divider}`,
  "&:focus-within": {
    borderBottomColor: theme.palette.primary.main,
  },
}))

interface Product {
  id?: number | string
  _id?: string
  name: string
  [key: string]: unknown
}

export default function Header() {
  const theme = useTheme()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products")
        const data = await response.json()
        setAllProducts(data.products || [])
      } catch (error) {
        console.error("Error fetching products:", error)
      }
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts([])
      return
    }

    const results = allProducts.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    setFilteredProducts(results)
  }, [searchQuery, allProducts])

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
    if (!isSearchOpen) {
      setSearchQuery("")
      setFilteredProducts([])
    }
  }

  const navLinks = [
    { title: "Home", path: "/" },
    { title: "Products", path: "/products" },
    { title: "Gallery", path: "/gallery" },
    { title: "Contact", path: "/contact" },
    { title: "Review", path: "/review" },
    { title: "Admin", path: "/admin/login", bold: true },
  ]

  return (
    <AppBar position="sticky" color="inherit" elevation={1} sx={{ bgcolor: "background.paper" }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: "space-between", height: 80 }}>
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center" }}>
            <Image src="/bindis_logo.jpg" alt="Bindi's Cupcakery Logo" width={140} height={50} priority />
          </Link>

          {/* Navigation Links */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
            {navLinks.map((link) => (
              <Button
                key={link.title}
                component={Link}
                href={link.path}
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
              href="/cart"
              color="inherit"
              sx={{
                bgcolor: alpha(theme.palette.text.primary, 0.05),
                "&:hover": { bgcolor: alpha(theme.palette.text.primary, 0.1) },
              }}
            >
              <Badge badgeContent={0} color="primary">
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
                      component={Link}
                      href={`/products/${product.id || product._id}`}
                      onClick={toggleSearch}
                      disablePadding
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
  )
}
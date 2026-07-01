import { useMemo, useState } from "react";
import {
  Box, Dialog, IconButton, Typography, Button, Chip, TextField, Select,
  MenuItem, FormControl, InputLabel, FormControlLabel, Checkbox, Divider,
  Stack, alpha, Snackbar, Alert,
} from "@mui/material";
import {
  Close as CloseIcon,
  ShoppingCart as CartIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Favorite as HeartIcon,
  FavoriteBorder as HeartBorderIcon,
  Restaurant as ServingIcon,
  Schedule as ShelfIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { useCart, CartCustomization } from "@/context/CartContext";
import { getProductDetails, CustomizationOption } from "@/lib/productDetails";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
}

interface Props {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
}

function defaultValues(opts: CustomizationOption[]): Record<string, string | string[]> {
  const out: Record<string, string | string[]> = {};
  opts.forEach((o) => {
    if (o.default !== undefined) out[o.key] = o.default as string | string[];
    else if (o.type === "checkbox-group") out[o.key] = [];
    else out[o.key] = "";
  });
  return out;
}

export default function QuickViewModal({ product, open, onClose, isFavorite, onToggleFavorite }: Props) {
  const { addToCart } = useCart();
  const details = useMemo(
    () => (product ? getProductDetails(product.name, product.category) : null),
    [product]
  );

  const [qty, setQty] = useState(1);
  const [values, setValues] = useState<Record<string, string | string[]>>({});
  const [snack, setSnack] = useState(false);

  // re-init when product changes
  useMemo(() => {
    if (details) {
      setValues(defaultValues(details.customizations));
      setQty(1);
    }
  }, [details]);

  if (!product || !details) return null;

  const giftWrapAddon =
    values.giftWrap === "Premium gift box (+₹50)" ? 50 : 0;
  const unit = product.price + giftWrapAddon;
  const lineTotal = unit * qty;

  const handleAdd = () => {
    const customizations: CartCustomization[] = details.customizations
      .map((opt) => {
        const v = values[opt.key];
        if (!v || (Array.isArray(v) && v.length === 0)) return null;
        return { label: opt.label, value: Array.isArray(v) ? v.join(", ") : v };
      })
      .filter((x): x is CartCustomization => x !== null);

    addToCart({
      id: String(product.id),
      name: product.name,
      image: product.image,
      price: unit,
      qty,
      customizations,
    });
    setSnack(true);
    setTimeout(() => onClose(), 700);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, overflow: "hidden" } }}
      >
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>
          {/* Left: Image */}
          <Box sx={{ position: "relative", minHeight: { xs: 280, md: 520 }, bgcolor: "#fdfaf7" }}>
            <img
              src={product.image}
              alt={product.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", top: 0, left: 0 }}
            />
            <Chip
              label={product.category || "Bakery"}
              size="small"
              sx={{
                position: "absolute",
                top: 16,
                left: 16,
                bgcolor: alpha("#fff", 0.92),
                color: "#9d4870",
                fontWeight: 700,
                backdropFilter: "blur(6px)",
              }}
            />
            <IconButton
              onClick={() => onToggleFavorite(product.id)}
              sx={{
                position: "absolute",
                top: 12,
                right: 12,
                bgcolor: alpha("#fff", 0.95),
                "&:hover": { bgcolor: "white" },
              }}
            >
              {isFavorite ? (
                <HeartIcon sx={{ color: "#d97a9c" }} />
              ) : (
                <HeartBorderIcon sx={{ color: "text.secondary" }} />
              )}
            </IconButton>
          </Box>

          {/* Right: Details */}
          <Box sx={{ position: "relative", maxHeight: { md: 520 }, overflowY: "auto", p: { xs: 3, md: 4 } }}>
            <IconButton
              onClick={onClose}
              sx={{ position: "absolute", top: 8, right: 8, color: "text.secondary" }}
            >
              <CloseIcon />
            </IconButton>

            <Typography variant="h5" fontWeight={800} sx={{ pr: 5, mb: 0.5 }}>
              {product.name}
            </Typography>
            <Typography
              variant="h5"
              fontWeight={800}
              sx={{
                background: "linear-gradient(135deg, #be185d, #7c3aed)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 2,
              }}
            >
              ₹{product.price}
            </Typography>

            <Typography variant="body2" color="text.secondary" mb={2.5}>
              {product.description}
            </Typography>

            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                bgcolor: alpha("#f9c2d6", 0.15),
                border: "1px solid",
                borderColor: alpha("#d97a9c", 0.2),
                mb: 2.5,
              }}
            >
              <Typography variant="caption" fontWeight={700} sx={{ color: "#9d4870", letterSpacing: 1 }}>
                FROM OUR KITCHEN
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5, lineHeight: 1.7 }}>
                {details.story}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.5} sx={{ mb: 2.5, flexWrap: "wrap", gap: 1 }}>
              <Chip
                icon={<ServingIcon sx={{ fontSize: 16 }} />}
                label={details.servings}
                size="small"
                sx={{ fontWeight: 600 }}
              />
              <Chip
                icon={<ShelfIcon sx={{ fontSize: 16 }} />}
                label={details.shelfLife}
                size="small"
                sx={{ fontWeight: 600 }}
              />
            </Stack>

            <Typography variant="subtitle2" fontWeight={700} mt={1} mb={0.5}>
              Ingredients
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={1.5}>
              {details.ingredients.join(" · ")}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 2.5 }}>
              <InfoIcon sx={{ fontSize: 14, color: "warning.main" }} />
              <Typography variant="caption" color="text.secondary">
                <strong>Allergens:</strong> {details.allergens.join(", ")}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" fontWeight={700} mb={1.5}>
              Customize Your Order
            </Typography>

            <Stack spacing={2}>
              {details.customizations.map((opt) => {
                if (opt.type === "select") {
                  return (
                    <FormControl key={opt.key} size="small" fullWidth>
                      <InputLabel>{opt.label}</InputLabel>
                      <Select
                        label={opt.label}
                        value={(values[opt.key] as string) || ""}
                        onChange={(e) =>
                          setValues((p) => ({ ...p, [opt.key]: e.target.value }))
                        }
                        sx={{ borderRadius: 2 }}
                      >
                        {opt.options?.map((o) => (
                          <MenuItem key={o} value={o}>{o}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  );
                }
                if (opt.type === "checkbox-group") {
                  const selected = (values[opt.key] as string[]) || [];
                  return (
                    <Box key={opt.key}>
                      <Typography variant="caption" fontWeight={600} color="text.secondary" mb={0.5} display="block">
                        {opt.label}
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {opt.options?.map((o) => {
                          const checked = selected.includes(o);
                          return (
                            <FormControlLabel
                              key={o}
                              control={
                                <Checkbox
                                  size="small"
                                  checked={checked}
                                  onChange={(e) => {
                                    setValues((p) => {
                                      const cur = (p[opt.key] as string[]) || [];
                                      return {
                                        ...p,
                                        [opt.key]: e.target.checked
                                          ? [...cur, o]
                                          : cur.filter((x) => x !== o),
                                      };
                                    });
                                  }}
                                />
                              }
                              label={<Typography variant="body2">{o}</Typography>}
                              sx={{
                                m: 0,
                                px: 1,
                                borderRadius: 2,
                                border: "1px solid",
                                borderColor: checked ? "#d97a9c" : "divider",
                                bgcolor: checked ? alpha("#f9c2d6", 0.18) : "transparent",
                                transition: "all 0.2s",
                              }}
                            />
                          );
                        })}
                      </Box>
                    </Box>
                  );
                }
                if (opt.type === "text") {
                  return (
                    <TextField
                      key={opt.key}
                      size="small"
                      fullWidth
                      label={opt.label}
                      helperText={opt.helper}
                      inputProps={{ maxLength: 60 }}
                      value={(values[opt.key] as string) || ""}
                      onChange={(e) =>
                        setValues((p) => ({ ...p, [opt.key]: e.target.value }))
                      }
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                  );
                }
                return null;
              })}
            </Stack>

            <Divider sx={{ my: 2.5 }} />

            {/* Footer: qty + add to cart */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  border: "1.5px solid",
                  borderColor: "divider",
                  borderRadius: 50,
                  px: 1,
                  py: 0.3,
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  sx={{ color: "#9d4870" }}
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <Typography fontWeight={700} sx={{ minWidth: 28, textAlign: "center" }}>
                  {qty}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setQty((q) => q + 1)}
                  sx={{ color: "#9d4870" }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>
              <Button
                onClick={handleAdd}
                variant="contained"
                size="large"
                startIcon={<CartIcon />}
                sx={{
                  flex: 1,
                  minWidth: 200,
                  borderRadius: 50,
                  py: 1.4,
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #d97a9c, #9b7bd0)",
                  boxShadow: "0 8px 24px rgba(217,122,156,0.28)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #c2628a, #8568b8)",
                    boxShadow: "0 12px 32px rgba(217,122,156,0.35)",
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.25s",
                }}
              >
                Add to Cart · ₹{lineTotal.toFixed(0)}
              </Button>
            </Box>
          </Box>
        </Box>
      </Dialog>

      <Snackbar
        open={snack}
        autoHideDuration={1500}
        onClose={() => setSnack(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ borderRadius: 3, fontWeight: 600 }}>
          Added {qty} × {product.name} to your cart 🛒
        </Alert>
      </Snackbar>
    </>
  );
}

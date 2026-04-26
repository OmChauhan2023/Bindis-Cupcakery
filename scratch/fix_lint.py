import os
import re

base_dir = "c:\\Users\\mohin\\OneDrive\\Desktop\\Bindis Cupcakery"

def process_file(filepath, replacements, regex_replacements=None):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    orig = content
    for old, new in replacements:
        content = content.replace(old, new)
        
    if regex_replacements:
        for pattern, new in regex_replacements:
            content = re.sub(pattern, new, content)
            
    if orig != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed {filepath}")

# 1. Unused catch errors
process_file(f"{base_dir}\\src\\app\\admin\\components\\AdminDashboard.tsx", [("catch (error) {", "catch {")])
process_file(f"{base_dir}\\src\\app\\auth\\login\\page.tsx", [("catch (error) {", "catch {"), ("catch (error: any) {", "catch {")])
process_file(f"{base_dir}\\src\\app\\auth\\signup\\page.tsx", [("catch (error) {", "catch {"), ("catch (error: any) {", "catch {")])
process_file(f"{base_dir}\\src\\app\\products\\page.tsx", [("catch (error) {", "catch {")])

# 2. Unused imports
process_file(f"{base_dir}\\src\\app\\admin\\dashboard\\page.tsx", [
    ("Divider,", ""), (", Divider", ""), ("Divider", ""),
    ("IconButton,", ""), (", IconButton", ""), ("IconButton", ""),
    ("TrendingUp as TrendingIcon,", ""), (", TrendingUp as TrendingIcon", "")
])

# 3. Unescaped quotes in TSX
process_file(f"{base_dir}\\src\\app\\admin\\dashboard\\page.tsx", [("Bindi's", "Bindi&apos;s")])
process_file(f"{base_dir}\\src\\app\\admin\\login\\page.tsx", [("Bindi's", "Bindi&apos;s"), ("Container,", "")])
process_file(f"{base_dir}\\src\\app\\cart\\components\\CartPage.tsx", [("Bindi's", "Bindi&apos;s"), ("CartIcon,", "")])
process_file(f"{base_dir}\\src\\app\\cart\\confirmation\\page.tsx", [("Bindi's", "Bindi&apos;s")])
process_file(f"{base_dir}\\src\\app\\contact\\page.tsx", [("Bindi's", "Bindi&apos;s"), ("TextField,", ""), ("alpha,", "")])
process_file(f"{base_dir}\\src\\app\\page.tsx", [("Bindi's", "Bindi&apos;s"), ("CardMedia,", "")])
process_file(f"{base_dir}\\src\\app\\page.tsx", [('href="#"', 'href="/"')], [('href="\\s*"', 'href="/"')]) # Unescaped quotes or invalid hrefs
process_file(f"{base_dir}\\src\\app\\review\\page.tsx", [('"', '&quot;')], [('(")([A-Za-z\\s]+)(")', r'&quot;\2&quot;')]) # quotes in text
process_file(f"{base_dir}\\src\\components\\Footer.tsx", [("Bindi's", "Bindi&apos;s"), ("Link,", "")])

# 4. Any types
any_replacements = [(": any", ": unknown"), ("error: any", "error: unknown"), ("(error: any)", "(error: unknown)")]
process_file(f"{base_dir}\\src\\app\\admin\\register\\page.tsx", any_replacements)
process_file(f"{base_dir}\\src\\app\\api\\admin\\login\\route.ts", any_replacements)
process_file(f"{base_dir}\\src\\app\\api\\products\\[id]\\route.ts", any_replacements)
process_file(f"{base_dir}\\src\\app\\api\\products\\route.ts", any_replacements)
process_file(f"{base_dir}\\src\\app\\api\\users\\route.ts", any_replacements)
process_file(f"{base_dir}\\src\\app\\cart\\components\\CheckOut.tsx", any_replacements)

# 5. Other unused
process_file(f"{base_dir}\\src\\app\\cart\\components\\CheckOut.tsx", [
    ("Stepper,", ""), ("Step,", ""), ("StepLabel,", ""), ("Alert,", ""), ("Chip,", "")
])
process_file(f"{base_dir}\\src\\app\\cart\\confirmation\\page.tsx", [("<a href=", "<Link href="), ("</a>", "</Link>")])
process_file(f"{base_dir}\\src\\app\\products\\page.tsx", [
    ("AnimatePresence,", ""), ("CardMedia,", ""), ("Chip,", ""), ("Badge,", ""), ("Divider,", ""), ("LocalOffer as TagIcon,", ""),
    ("const { cart, addToCart } = useCart()", "const { addToCart } = useCart()")
])
process_file(f"{base_dir}\\src\\app\\products\\[id]\\page.tsx", [("Alert,", "")])

print("Lint fix script completed.")

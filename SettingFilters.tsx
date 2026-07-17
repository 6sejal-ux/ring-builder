import { Link } from "react-router-dom";
import { Search, User, Menu, X } from "lucide-react";
import { CartDrawer } from "./CartDrawer";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Ring Builder", href: "/ring-builder" },
  { label: "Collections", href: "/collections" },
  { label: "Earrings", href: "/collections?category=earrings" },
  { label: "Bracelets", href: "/collections?category=bracelets" },
  { label: "Pendants", href: "/collections?category=pendants" },
  { label: "Wedding Bands", href: "/collections?category=wedding+bands" },
];

export const StoreHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-primary text-primary-foreground overflow-hidden">
        <div className="animate-marquee whitespace-nowrap py-2 text-xs tracking-[0.2em] uppercase font-body">
          <span className="mx-8">✦ Free Shipping on Prepaid Orders</span>
          <span className="mx-8">✦ 925 Sterling Silver Jewelry</span>
          <span className="mx-8">✦ Skin Friendly & Anti-Tarnish</span>
          <span className="mx-8">✦ Free Shipping on Prepaid Orders</span>
          <span className="mx-8">✦ 925 Sterling Silver Jewelry</span>
          <span className="mx-8">✦ Skin Friendly & Anti-Tarnish</span>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container flex items-center justify-between h-16 md:h-20">
          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 -ml-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <h1 className="font-heading text-2xl md:text-3xl font-semibold tracking-wide">
              Saffron
            </h1>
            <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground -mt-1 text-center font-body">
              Jewellery
            </p>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm tracking-wide uppercase text-foreground/80 hover:text-foreground transition-colors font-body"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button className="p-2 hover:text-accent transition-colors" aria-label="Search">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 hover:text-accent transition-colors hidden md:block" aria-label="Account">
              <User className="w-5 h-5" />
            </button>
            <CartDrawer />
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav className="md:hidden border-t border-border bg-background pb-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="block px-6 py-3 text-sm tracking-wide uppercase text-foreground/80 hover:text-foreground hover:bg-muted transition-colors font-body"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
    </>
  );
};

import { Link } from "react-router-dom";
import { Instagram, Facebook, Mail } from "lucide-react";

export const StoreFooter = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="font-heading text-2xl font-semibold mb-1">Saffron</h3>
            <p className="text-[10px] tracking-[0.3em] uppercase text-primary-foreground/60 mb-4 font-body">
              Jewellery
            </p>
            <p className="text-sm text-primary-foreground/70 font-body leading-relaxed">
              Handcrafted 925 Sterling Silver jewelry. Skin friendly, anti-tarnish, and made with love in India.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase mb-4 font-body">Quick Links</h4>
            <ul className="space-y-2">
              {["Rings", "Earrings", "Bracelets", "Pendants"].map((item) => (
                <li key={item}>
                  <Link to="/collections" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors font-body">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase mb-4 font-body">Help</h4>
            <ul className="space-y-2">
              {["Contact Us", "Shipping & Returns", "FAQ", "Track Order"].map((item) => (
                <li key={item}>
                  <Link to="/" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors font-body">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase mb-4 font-body">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors" aria-label="Email">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center">
          <p className="text-xs text-primary-foreground/50 font-body">
            © {new Date().getFullYear()} Saffron Jewellery. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

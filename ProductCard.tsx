import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-jewelry.jpg";

export const HeroSection = () => {
  return (
    <section className="relative h-[70vh] md:h-[85vh] overflow-hidden">
      <img
        src={heroImage}
        alt="Saffron Jewellery Collection"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-foreground/40" />
      <div className="relative h-full flex items-center justify-center text-center px-6">
        <div className="max-w-2xl">
          <p className="text-primary-foreground/80 text-xs tracking-[0.4em] uppercase mb-4 font-body">
            Handcrafted with love
          </p>
          <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl text-primary-foreground font-light leading-tight mb-6">
            Timeless Elegance,<br />Modern Craft
          </h2>
          <p className="text-primary-foreground/70 text-sm md:text-base font-body mb-8 max-w-md mx-auto">
            Discover our collection of 925 Sterling Silver jewelry — skin-friendly, anti-tarnish, and made to last.
          </p>
          <Link
            to="/collections"
            className="inline-block bg-primary-foreground text-foreground px-8 py-3 text-sm tracking-[0.2em] uppercase font-body hover:bg-primary-foreground/90 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
};

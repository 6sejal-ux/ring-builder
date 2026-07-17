import { Link } from "react-router-dom";
import { StoreHeader } from "@/components/StoreHeader";
import { HeroSection } from "@/components/HeroSection";
import { BestSellers } from "@/components/BestSellers";
import { ProductGrid } from "@/components/ProductGrid";
import { StoreFooter } from "@/components/StoreFooter";
import { PromiseSection } from "@/components/PromiseSection";

const CategoryHighlights = () => {
  const categories = [
    { name: "Rings", image: "💍", slug: "rings" },
    { name: "Earrings", image: "✨", slug: "earrings" },
    { name: "Bracelets", image: "⭐", slug: "bracelets" },
    { name: "Pendants", image: "🌙", slug: "pendants" },
  ];

  return (
    <section className="py-16 bg-card">
      <div className="container">
        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-3 font-body">
            Browse by
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-light">Categories</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/collections?category=${cat.slug}`}
              className="group cursor-pointer text-center p-8 bg-background hover:bg-muted transition-colors"
            >
              <span className="text-4xl block mb-4">{cat.image}</span>
              <h3 className="font-heading text-lg">{cat.name}</h3>
              <span className="inline-block mt-2 text-xs tracking-[0.15em] uppercase text-muted-foreground font-body group-hover:text-foreground transition-colors">
                Shop Now →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

const USPBanner = () => (
  <section className="py-12 bg-background">
    <div className="container">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {[
          { title: "925 Sterling Silver", desc: "Genuine hallmarked silver" },
          { title: "Anti-Tarnish", desc: "Long-lasting shine" },
          { title: "Free Shipping", desc: "On all prepaid orders" },
        ].map((usp) => (
          <div key={usp.title} className="py-4">
            <h3 className="font-heading text-xl mb-1">{usp.title}</h3>
            <p className="text-sm text-muted-foreground font-body">{usp.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Index = () => {
  return (
    <div className="min-h-screen">
      <StoreHeader />
      <HeroSection />
      <USPBanner />
      <BestSellers />
      <CategoryHighlights />
      <PromiseSection />
      <ProductGrid />
      <StoreFooter />
    </div>
  );
};

export default Index;

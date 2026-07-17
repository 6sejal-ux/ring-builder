import { Shield, Sparkles, Truck, RefreshCw } from "lucide-react";

const promises = [
  {
    icon: Shield,
    title: "925 Sterling Silver",
    desc: "Every piece is hallmarked and certified genuine sterling silver.",
  },
  {
    icon: Sparkles,
    title: "Anti-Tarnish Coating",
    desc: "Our special coating keeps your jewelry shining for years.",
  },
  {
    icon: Truck,
    title: "Free Shipping",
    desc: "Complimentary delivery on all prepaid orders, pan-India.",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    desc: "Hassle-free 7-day return policy on all purchases.",
  },
];

export const PromiseSection = () => {
  return (
    <section className="py-16 md:py-20 bg-card">
      <div className="container">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-3 font-body">
            Why Choose Us
          </p>
          <h2 className="font-heading text-3xl md:text-5xl font-light">
            The Saffron Promise
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {promises.map((item) => (
            <div
              key={item.title}
              className="text-center group"
            >
              <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                <item.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-heading text-lg md:text-xl mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const BestSellers = () => {
  const videos = [
    { src: "/videos/rose.mp4", label: "Rose Gold Collection" },
    { src: "/videos/white.mp4", label: "White Silver Collection" },
    { src: "/videos/yellow.mp4", label: "Gold Plated Collection" },
  ];

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-3 font-body">
            Trending Now
          </p>
          <h2 className="font-heading text-3xl md:text-5xl font-light">
            Shop Best Sellers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {videos.map((video) => (
            <div key={video.label} className="group relative cursor-pointer overflow-hidden">
              <div className="aspect-[3/4] bg-card">
                <video
                  src={video.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute inset-0 bg-foreground/20 group-hover:bg-foreground/30 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-heading text-xl md:text-2xl text-primary-foreground">
                  {video.label}
                </h3>
                <span className="inline-block mt-2 text-xs tracking-[0.2em] uppercase text-primary-foreground/80 font-body border-b border-primary-foreground/40 pb-0.5">
                  Shop Now
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

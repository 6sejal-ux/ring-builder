@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Outfit:wght@300;400;500;600&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 30% 15%;

    --card: 0 20% 96%;
    --card-foreground: 0 30% 15%;

    --popover: 0 0% 100%;
    --popover-foreground: 0 30% 15%;

    --primary: 0 100% 17%;
    --primary-foreground: 0 0% 100%;

    --secondary: 0 15% 93%;
    --secondary-foreground: 0 100% 17%;

    --muted: 0 8% 93%;
    --muted-foreground: 0 10% 45%;

    --accent: 0 100% 22%;
    --accent-foreground: 0 0% 100%;

    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 100%;

    --border: 0 12% 88%;
    --input: 0 12% 88%;
    --ring: 0 100% 17%;

    --radius: 0.25rem;

    --sidebar-background: 0 20% 96%;
    --sidebar-foreground: 0 30% 15%;
    --sidebar-primary: 0 100% 17%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 0 15% 93%;
    --sidebar-accent-foreground: 0 30% 15%;
    --sidebar-border: 0 12% 88%;
    --sidebar-ring: 0 100% 22%;

    --font-heading: 'Cormorant Garamond', serif;
    --font-body: 'Outfit', sans-serif;

    --announcement-bg: 0 100% 17%;
    --announcement-fg: 0 0% 100%;
    --hero-overlay: 0 100% 10% / 0.5;
  }
}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
    font-family: var(--font-body);
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
  }
}

@layer utilities {
  .font-heading {
    font-family: var(--font-heading);
  }
  .font-body {
    font-family: var(--font-body);
  }
}

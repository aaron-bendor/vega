"use client";

/**
 * Full-page mesh gradient background. Uses your PNG files if placed in
 * public/images/backgrounds/ as mesh-gradient-1.png, mesh-gradient-2.png, etc.
 * Copy "mesh-gradient (1).png" → mesh-gradient-1.png
 */
export function MeshBackground({
  variant = 1,
  overlay = true,
  className = "",
  children,
}: {
  variant?: 1 | 2 | 3;
  overlay?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const imagePath = `/images/backgrounds/mesh-gradient-${variant}.png`;

  return (
    <div
      className={`min-h-screen relative ${className}`}
      style={{
        backgroundImage: `url(${imagePath}), linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--muted)) 50%, hsl(var(--accent)) 100%)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {overlay && (
        <div className="absolute inset-0 bg-background/75 dark:bg-background/85 backdrop-blur-[1px]" aria-hidden />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// Reusable Crosshair (+) SVG marker
const Crosshair = ({ className }: { className?: string }) => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 11 11"
    fill="none"
    className={`absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-80 text-border-muted ${className || ''}`}
  >
    <line x1="5.5" y1="0" x2="5.5" y2="11" stroke="currentColor" strokeWidth="1" />
    <line x1="0" y1="5.5" x2="11" y2="5.5" stroke="currentColor" strokeWidth="1" />
  </svg>
);

export default function InteractiveGrid() {
  return (
    <div className="fixed inset-y-0 inset-x-4 md:inset-x-10 z-0 pointer-events-none h-full" aria-hidden="true">
      <div className="relative w-full h-full pointer-events-none">
        {/* Vertical lines */}
        <div className="absolute top-0 bottom-0 left-0 w-px border-l border-dotted border-border-muted/30 pointer-events-none" />
        <div className="absolute top-0 bottom-0 left-1/2 md:left-1/3 w-px border-l border-dotted border-border-muted/30 pointer-events-none" />
        <div className="absolute top-0 bottom-0 left-2/3 max-md:hidden w-px border-l border-dotted border-border-muted/30 pointer-events-none" />
        <div className="absolute top-0 bottom-0 left-full w-px border-l border-dotted border-border-muted/30 pointer-events-none" />

        {/* Horizontal lines */}
        <div className="absolute -left-4 md:-left-10 -right-4 md:-right-10 top-1/3 h-px border-t border-dotted border-border-muted/30 pointer-events-none" />
        <div className="absolute -left-4 md:-left-10 -right-4 md:-right-10 top-2/3 h-px border-t border-dotted border-border-muted/30 pointer-events-none" />

        {/* Crosshair markers (+) at grid intersections */}
        {/* Top horizontal row intersections */}
        <Crosshair className="top-1/3 left-0" />
        <Crosshair className="top-1/3 left-1/2 md:left-1/3" />
        <Crosshair className="top-1/3 left-2/3 max-md:hidden" />
        <Crosshair className="top-1/3 left-full" />

        {/* Bottom horizontal row intersections */}
        <Crosshair className="top-2/3 left-0" />
        <Crosshair className="top-2/3 left-1/2 md:left-1/3" />
        <Crosshair className="top-2/3 left-2/3 max-md:hidden" />
        <Crosshair className="top-2/3 left-full" />
      </div>
    </div>
  );
}

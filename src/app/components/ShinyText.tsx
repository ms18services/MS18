'use client';

type ShinyTextProps = {
  children: React.ReactNode;
  className?: string;
};

function joinClasses(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export default function ShinyText({ children, className }: ShinyTextProps) {
  return (
    <>
      <span className={joinClasses('group/shiny relative inline-block', className)}>
        <span className="relative z-10">{children}</span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 opacity-0 mix-blend-screen transition-opacity duration-300 group-hover/shiny:opacity-100"
          style={{
            background:
              'linear-gradient(110deg, transparent 0%, transparent 38%, rgba(255,255,255,0.10) 45%, rgba(255,255,255,0.88) 50%, rgba(255,255,255,0.10) 55%, transparent 62%, transparent 100%)',
            backgroundSize: '220% 100%',
            animation: 'shiny-text-sweep 2.2s linear infinite',
            WebkitMaskImage: 'linear-gradient(#000 0 0)',
            maskImage: 'linear-gradient(#000 0 0)',
          }}
        />
      </span>
      <style jsx global>{`
        @keyframes shiny-text-sweep {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -160% 0;
          }
        }
      `}</style>
    </>
  );
}

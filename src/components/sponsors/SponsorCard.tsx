import { Sponsor } from '@/contexts/AdminContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface SponsorCardProps {
    sponsor: Sponsor;
    variant: 'platinum' | 'gold' | 'silver';
}

export default function SponsorCard({ sponsor, variant }: SponsorCardProps) {
    const { language } = useLanguage();
    const name = language === 'en' ? sponsor.name : sponsor.nameTamil;

    // Sparkles Effect for Platinum
    const Sparkles = () => {
        if (variant !== 'platinum') return null;

        // Random positions for sparkles
        const sparkles = [
            { top: '10%', left: '10%', delay: '0s' },
            { top: '20%', right: '20%', delay: '1s' },
            { bottom: '15%', left: '30%', delay: '0.5s' },
            { top: '50%', right: '10%', delay: '1.5s' },
        ];

        return (
            <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
                {sparkles.map((s, i) => (
                    <div
                        key={i}
                        className="sparkle"
                        style={{
                            top: s.top,
                            left: s.left,
                            right: s.right,
                            bottom: s.bottom,
                            animationDelay: s.delay
                        }}
                    />
                ))}
            </div>
        );
    };

    // Variant-specific styles - INCREASED SIZES & Full Content Focus
    const getCardStyles = () => {
        switch (variant) {
            case 'platinum':
                return `
          w-[600px] h-[350px] 
          bg-slate-900
          border-2 border-slate-200/50 
          platinum-border-glow
          shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.6)]
          transform transition-all duration-500 hover:scale-105 z-30
          rounded-xl
          relative overflow-hidden
          group
        `;
            case 'gold':
                return `
          w-[350px] h-[220px] 
          bg-slate-900
          border-2 border-yellow-400/50
          shadow-[0_0_20px_rgba(250,204,21,0.2)] hover:shadow-[0_0_35px_rgba(250,204,21,0.4)]
          transform transition-all duration-300 hover:scale-105 z-20
          rounded-lg
          relative overflow-hidden
          group
        `;
            case 'silver':
                return `
          w-[250px] h-[160px] 
          bg-white 
          border border-slate-300
          shadow-md hover:shadow-xl
          transform transition-all duration-300 hover:scale-105 z-10
          rounded-md
          relative overflow-hidden
          group
          grayscale hover:grayscale-0
        `;
        }
    };

    // Shine/Sheen Effect - Retained for Premium feel
    const Sheen = () => {
        if (variant === 'platinum') {
            return (
                <div className="absolute inset-0 pointer-events-none z-40 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine" style={{ animationDuration: '1.5s' }} />
            );
        }
        return null;
    };

    // Full Card Content Renderer
    const CardContent = () => (
        <div className="w-full h-full flex items-center justify-center bg-white overflow-hidden relative z-10">
            {sponsor.logo ? (
                // Full bleed image - Object Contain to ensure whole ad is visible
                <img
                    src={sponsor.logo}
                    alt={name}
                    className="w-full h-full object-contain transform transition-transform duration-700 group-hover:scale-105"
                />
            ) : (
                // Fallback for missing assets
                <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-transparent text-center">
                    <div className={`
              font-bold mb-2
              ${variant === 'platinum' ? 'text-white text-6xl' : variant === 'gold' ? 'text-yellow-400 text-5xl' : 'text-slate-300 text-4xl'}
            `}>
                        {sponsor.name.charAt(0)}
                    </div>
                    <p className={`font-bold ${variant === 'platinum' ? 'text-white text-2xl' : variant === 'gold' ? 'text-yellow-400 text-lg' : 'text-slate-700 text-lg'}`}>
                        {name}
                    </p>
                    <span className={`text-xs mt-2 uppercase tracking-widest ${variant === 'silver' ? 'text-slate-400' : 'text-white/60'}`}>{variant} Sponsor</span>
                </div>
            )}
        </div>
    );

    // Aspirational Badge
    const TierBadge = () => {
        if (variant === 'platinum') {
            return (
                <div className="absolute top-0 right-0 bg-slate-900/90 text-white px-3 py-1 rounded-bl-lg border-b border-l border-slate-700 z-20 backdrop-blur-sm">
                    <span className="text-[10px] font-bold tracking-wider uppercase bg-gradient-to-r from-slate-200 to-white bg-clip-text text-transparent">Platinum</span>
                </div>
            );
        }
        if (variant === 'gold') {
            return (
                <div className="absolute top-0 right-0 bg-yellow-900/90 text-yellow-100 px-3 py-1 rounded-bl-lg border-b border-l border-yellow-700 z-20 backdrop-blur-sm">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-yellow-400">Gold</span>
                </div>
            );
        }
        return null;
    };

    return (
        <a
            href={sponsor.website}
            target="_blank"
            rel="noopener noreferrer"
            className={getCardStyles().replace(/\s+/g, ' ')}
        >
            <Sheen />
            <Sparkles />
            <TierBadge />
            <CardContent />
        </a>
    );
}

'use client';

import { Sponsor } from '@/contexts/AdminContext';
import SponsorCard from './SponsorCard';
import { useRef, useEffect, useState } from 'react';

interface TierRowProps {
    tier: 'platinum' | 'gold' | 'silver';
    sponsors: Sponsor[];
}

export default function TierRow({ tier, sponsors }: TierRowProps) {
    // Filter sponsors for this tier
    const tierSponsors = sponsors.filter(s => s.tier === tier && s.isActive);
    const [shouldAnimate, setShouldAnimate] = useState(false);

    useEffect(() => {
        setShouldAnimate(true);
    }, []);

    if (tierSponsors.length === 0) return null;

    // Duplicate items for seamless loop if there are enough items, 
    // otherwise just center them if very few.
    // For visual "infinite scroll", we usually need at least enough width to fill screen.
    // We'll simplisticly quadruple the array to ensure enough content for most screens.
    const displaySponsors = [...tierSponsors, ...tierSponsors, ...tierSponsors, ...tierSponsors];

    const getRowSettings = () => {
        switch (tier) {
            case 'platinum':
                return {
                    height: 'h-[400px]',
                    speed: 'animate-scroll-slow', // 40s defined in global css/tailwind
                    gap: 'gap-12',
                    padding: 'py-8'
                };
            case 'gold':
                return {
                    height: 'h-[250px]',
                    speed: 'animate-scroll-medium', // 30s
                    gap: 'gap-8',
                    padding: 'py-6'
                };
            case 'silver':
                return {
                    height: 'h-[180px]',
                    speed: 'animate-scroll-fast', // 20s
                    gap: 'gap-6',
                    padding: 'py-4'
                };
        }
    };

    const { height, speed, gap, padding } = getRowSettings();

    return (
        <div className={`w-full relative overflow-hidden ${height} ${padding} flex items-center group/row`}>
            {/* 
        Container for the moving track. 
        We use two identical tracks for seamless looping if we were using CSS translate.
        But a simple approach is a very long flex container moving left.
      */}
            <div
                className={`flex ${gap} items-center whitespace-nowrap will-change-transform ${shouldAnimate ? speed : ''} hover:[animation-play-state:paused] px-4`}
            >
                {displaySponsors.map((sponsor, index) => (
                    <div key={`${sponsor.id}-${index}`} className="flex-shrink-0">
                        <SponsorCard sponsor={sponsor} variant={tier} />
                    </div>
                ))}
            </div>

            {/* 
         Fade edges for smooth entry/exit 
         Platinum gets wider fade
      */}
            <div className={`absolute left-0 top-0 bottom-0 z-40 bg-gradient-to-r from-slate-900 to-transparent ${tier === 'platinum' ? 'w-32' : 'w-16'} pointer-events-none`} />
            <div className={`absolute right-0 top-0 bottom-0 z-40 bg-gradient-to-l from-slate-900 to-transparent ${tier === 'platinum' ? 'w-32' : 'w-16'} pointer-events-none`} />
        </div>
    );
}

import React, { useState, useEffect } from 'react';

interface MockAdData {
  id: string;
  title: string;
  tagline: string;
  description: string;
  url: string;
  badge: string;
  image: string;
  buttonText: string;
}

const ADS: MockAdData[] = [
  {
    id: 'westerosdle',
    title: 'Westerosdle ⚔️',
    tagline: 'Daily Westeros Guessing Game',
    description:
      'Test your ASOIAF & Game of Thrones knowledge with daily character clues and attributes!',
    url: 'https://coskntkk.github.io/westerosdle/',
    badge: 'Play Free',
    image: '/ads/westerosdle.png',
    buttonText: 'Play Westerosdle ↗',
  },
  {
    id: 'trguessr',
    title: 'TRguessr 📍',
    tagline: 'GeoGuessr for Turkey',
    description:
      'Drop into random street views across 81 provinces and guess the exact Turkish location!',
    url: 'https://coskntkk.github.io/TRguessr/',
    badge: 'Explore TR',
    image: '/ads/trguessr.png',
    buttonText: 'Play TRguessr ↗',
  },
  {
    id: 'twitter-clone',
    title: 'Old Twitter Clone 🐦',
    tagline: 'Nostalgic 2010s Social Network',
    description:
      'Experience the clean, chronological, nostalgic Twitter UI with modern tech stack under the hood.',
    url: 'https://old-twitter.vercel.app/',
    badge: 'Retro UI',
    image: '/ads/twitter-clone.jpg',
    buttonText: 'Visit ↗',
  },
  {
    id: 'numle',
    title: 'Numle 🔢',
    tagline: 'Daily Number Puzzle Game',
    description:
      'Can you guess the hidden 5-digit number in 6 tries? Test your daily math deduction skills!',
    url: 'https://coskntkk.github.io/numle/',
    badge: 'Play Now',
    image: '/ads/numle.jpg',
    buttonText: 'Play Numle ↗',
  },
  {
    id: 'viewme',
    title: 'ViewMe.md 📝',
    tagline: 'Markdown Profile Generator',
    description:
      'Supercharge your GitHub profile and dev portfolio with rich, interactive markdown templates.',
    url: 'https://coskntkk.github.io/viewme.md/',
    badge: 'Dev Tool',
    image: '/ads/viewme.jpg',
    buttonText: 'Explore ViewMe ↗',
  },
];

const MockAd: React.FC = () => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % ADS.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const ad = ADS[currentAdIndex];

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md group">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-gray-50 dark:bg-slate-800/60 border-b border-gray-100 dark:border-slate-800 text-[10px] text-gray-400 dark:text-slate-400 font-medium">
        <span className="uppercase tracking-wider font-semibold text-gray-400 dark:text-slate-400">
          Sponsored ({currentAdIndex + 1}/{ADS.length})
        </span>
        <button
          type="button"
          onClick={() => setCurrentAdIndex((prev) => (prev + 1) % ADS.length)}
          className="hover:text-sky-600 dark:hover:text-sky-400 transition flex items-center gap-1 cursor-pointer"
          title="Next promo"
        >
          <span>Next</span>
          <span>↻</span>
        </button>
      </div>

      {/* Image Banner Container */}
      <a
        href={ad.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative w-full bg-slate-950 p-2 flex items-center justify-center min-h-[105px] max-h-[125px] overflow-hidden"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ad.image}
          alt={ad.title}
          className="max-h-[105px] w-auto max-w-full object-contain mx-auto transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2 z-10">
          <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-xs text-white/90 shadow-xs border border-white/10">
            {ad.badge}
          </span>
        </div>
      </a>

      {/* Description & CTA */}
      <div className="p-3.5 space-y-2.5">
        <div>
          <h3 className="font-bold text-xs text-gray-900 dark:text-slate-100 leading-tight group-hover:text-sky-700 dark:group-hover:text-sky-400 transition">
            {ad.title}
          </h3>
          <p className="text-[11px] font-medium text-gray-500 dark:text-slate-400">{ad.tagline}</p>
        </div>

        <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed line-clamp-2">
          {ad.description}
        </p>

        <a
          href={ad.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-2 px-3 text-center text-xs font-semibold text-white bg-gray-900 dark:bg-sky-600 hover:bg-black dark:hover:bg-sky-700 rounded-lg transition shadow-xs group-hover:scale-[1.01]"
        >
          {ad.buttonText}
        </a>
      </div>
    </div>
  );
};

export default MockAd;

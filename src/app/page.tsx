'use client';

import { useEffect, useRef, useState, useLayoutEffect } from 'react';

// We'll load GSAP from a CDN since this is a self-contained file.
const gsapScript = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
const scrollTriggerScript = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js";
const easePackScript = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/EasePack.min.js";

// Extend the Window interface to include GSAP and ScrollTrigger for TypeScript
declare global {
  interface Window {
    gsap: any;
    ScrollTrigger: any;
  }
}

// Define the type for a single movie object to ensure type safety
interface Movie {
  id: number;
  title: string;
  tagline: string;
  posterUrl: string;
  genre: string;
  rating: number;
  duration: string;
  trailerUrl: string;
  ottUrl: string;
}

// Data for the movies (Restored to original 20 movies with local paths)
const cinematicMovies: Movie[] = [
    {
    id: 1,
    title: "Inception",
    tagline: "Your mind is the scene of the crime.",
    posterUrl: "/posters/inception_poster.jpg",
    genre: "Sci-Fi",
    rating: 8.8,
    duration: "2h 28m",
    trailerUrl: "https://www.youtube.com/embed/YoHD9XEInc0",
    ottUrl: "https://www.primevideo.com/detail/Inception/0OY5MW9WUP61HENZJ0E9ONAFGV"
  },
  {
    id: 2,
    title: "The Matrix",
    tagline: "Welcome to the real world.",
    posterUrl: "/posters/matrix-poster1.jpg",
    genre: "Sci-Fi",
    rating: 8.7,
    duration: "2h 36m",
    trailerUrl: "https://www.youtube.com/embed/vKQi3bBA1y8",
    ottUrl: "https://www.primevideo.com/detail/The-Matrix/0SC64NC24QA7M9AFWBEK87WWS0"
  },
  {
    id: 3,
    title: "Interstellar",
    tagline: "Mankind was born on Earth. It was never meant to die here.",
    posterUrl: "/posters/interstellar_poster.jpg",
    genre: "Sci-Fi",
    rating: 8.6,
    duration: "2h 49m",
    trailerUrl: "https://www.youtube.com/embed/zSWdZVtXT7E",
    ottUrl: "https://www.primevideo.com/detail/Interstellar/0PUNMGZEWOMYFKR1XIGOLTL2YM"
  },
  {
    id: 4,
    title: "Pulp Fiction",
    tagline: "You won't know the facts until you've seen the fiction.",
    posterUrl: "/posters/pulpfiction-poster.jpg",
    genre: "Crime",
    rating: 8.9,
    duration: "2h 34m",
    trailerUrl: "https://www.youtube.com/embed/s7EdQ4FqbhY",
    ottUrl: "https://www.primevideo.com/detail/Pulp-Fiction/0Q2FTG3Q68Q03JM2UFCWLUW3G9"
  },
  {
    id: 5,
    title: "The Dark Knight",
    tagline: "Why so serious?",
    posterUrl: "/posters/darkknight_poster.webp",
    genre: "Action",
    rating: 9.0,
    duration: "2h 32m",
    trailerUrl: "https://www.youtube.com/embed/EXeTwQWrcwY",
    ottUrl: "https://www.primevideo.com/detail/The-Dark-Knight/0QSTXR0EXWWYI4D3UGMLFM4A0Q"
  },
  {
    id: 6,
    title: "Mad Max: Fury Road",
    tagline: "What a lovely day!",
    posterUrl: "/posters/madmax-poster1.jpg",
    genre: "Action",
    rating: 8.1,
    duration: "2h 0m",
    trailerUrl: "https://www.youtube.com/embed/hEJnMQG9ev8",
    ottUrl: "https://www.primevideo.com/detail/Mad-Max-Fury-Road/0FWHWHC40XCMMU7GD9KAPGDR8Y"
  },
  {
    id: 7,
    title: "Parasite",
    tagline: "Act like you own the place.",
    posterUrl: "/posters/parasite-poster1.jpg",
    genre: "Thriller",
    rating: 8.5,
    duration: "2h 12m",
    trailerUrl: "https://www.youtube.com/embed/5xH0HfJHsaY",
    ottUrl: "https://www.primevideo.com/detail/Parasite/0IVA8FFJRSQ0L646NNEJWHOTGJ"
  },
  {
    id: 8,
    title: "Dune",
    tagline: "Fear is the mind-killer.",
    posterUrl: "/posters/dune-poster1.webp",
    genre: "Sci-Fi",
    rating: 8.0,
    duration: "2h 35m",
    trailerUrl: "https://www.youtube.com/embed/n9xhJrPXop4",
    ottUrl: "https://www.primevideo.com/detail/Dune/0KO7F8ZHN7HN5B67AFTXFYI81G"
  },
  {
    id: 9,
    title: "Arrival",
    tagline: "Why are they here?",
    posterUrl: "/posters/arrival-poster2.jpg",
    genre: "Sci-Fi",
    rating: 7.9,
    duration: "1h 56m",
    trailerUrl: "https://www.youtube.com/embed/tFMo3UJ4B4g",
    ottUrl: "https://www.netflix.com/title/80117799"
  },
  {
    id: 10,
    title: "Blade Runner 2049",
    tagline: "The future is in their hands.",
    posterUrl: "/posters/bladerunner-poster.jpg",
    genre: "Sci-Fi",
    rating: 8.0,
    duration: "2h 44m",
    trailerUrl: "https://www.youtube.com/embed/gCcx85zbxz4",
    ottUrl: "https://www.primevideo.com/detail/Blade-Runner-2049/0K63JD86RN2RF6HNBXVN07HMYF"
  },
  {
    id: 11,
    title: "Fight Club",
    tagline: "Mischief. Mayhem. Soap.",
    posterUrl: "/posters/fightclub-posterr.jpg",
    genre: "Drama",
    rating: 8.8,
    duration: "2h 19m",
    trailerUrl: "https://www.youtube.com/embed/BdJKm16j96o",
    ottUrl: "https://www.primevideo.com/detail/Fight-Club/0N0CS0LQQGWVRXWT1EI6LATOWB"
  },
  {
    id: 12,
    title: "American Psycho",
    tagline: "I think my mask of sanity is about to slip.",
    posterUrl: "/posters/american-psycho-poster.avif",
    genre: "Crime",
    rating: 7.6,
    duration: "1h 42m",
    trailerUrl: "https://www.youtube.com/embed/5Yt4ErA5Jd8",
    ottUrl: "https://www.primevideo.com/detail/American-Psycho/0F75F35NRL4EWBY83TV1WTNPTM"
  },
  {
    id: 13,
    title: "Mystic River",
    tagline: "We bury our sins. We wash them clean.",
    posterUrl: "/posters/mysticriver-poster.webp",
    genre: "Crime",
    rating: 7.9,
    duration: "2h 18m",
    trailerUrl: "https://www.youtube.com/embed/pu7g_gMOC-c",
    ottUrl: "https://www.primevideo.com/detail/Mystic-River/0U8DDDERAI4WQWKZY28JQJBCWX"
  },
  {
    id: 14,
    title: "Seven",
    tagline: "Seven deadly sins. Seven ways to die.",
    posterUrl: "/posters/seven_poster.jpg",
    genre: "Thriller",
    rating: 8.6,
    duration: "2h 7m",
    trailerUrl: "https://www.youtube.com/embed/znmZoYnS_fI",
    ottUrl: "https://www.netflix.com/in/title/950149"
  },
  {
    id: 15,
    title: "Schindler's List",
    tagline: "The list is life.",
    posterUrl: "/posters/schlinderslist-poster.webp",
    genre: "Biography",
    rating: 9.0,
    duration: "3h 15m",
    trailerUrl: "https://www.youtube.com/embed/gG22XN_H84s",
    ottUrl: "https://www.primevideo.com/detail/Schindlers-List/0GQFRLV513O3A7W2LL3JGO27TX"
  },
  {
    id: 16,
    title: "Forrest Gump",
    tagline: "Life is like a box of chocolates...",
    posterUrl: "/posters/forestgump-poster1.jpg",
    genre: "Drama",
    rating: 8.8,
    duration: "2h 22m",
    trailerUrl: "https://www.youtube.com/embed/bT_gI5rJ1tM",
    ottUrl: "https://www.primevideo.com/detail/Forrest-Gump/0RMLEUTKD0LKNDHSS10OQNYHF0"
  },
  {
    id: 17,
    title: "The Godfather",
    tagline: "An offer he can't refuse.",
    posterUrl: "/posters/godfather-poster.jpg",
    genre: "Crime",
    rating: 9.2,
    duration: "2h 55m",
    trailerUrl: "https://www.youtube.com/embed/sY1S34973z8",
    ottUrl: "https://www.primevideo.com/detail/The-Godfather/0L45IM106OK0SH586P7WW9F96I"
  },
  {
    id: 18,
    title: "The Shawshank Redemption",
    tagline: "Fear can hold you prisoner. Hope can set you free.",
    posterUrl: "/posters/shawshankred-poster.jpg",
    genre: "Drama",
    rating: 9.3,
    duration: "2h 22m",
    trailerUrl: "https://www.youtube.com/embed/6hB3S9bF9uw",
    ottUrl: "https://www.primevideo.com/detail/The-Shawshank-Redemption/0H3BD1NXV10WDK34UPWWVK4NNS"
  },
  {
    id: 19,
    title: "Citizen Kane",
    tagline: "No ordinary man... no ordinary motion picture.",
    posterUrl: "/posters/citizenkane-poster.png",
    genre: "Drama",
    rating: 8.3,
    duration: "1h 59m",
    trailerUrl: "https://www.youtube.com/embed/8dxh3lwsr-k",
    ottUrl: "https://www.primevideo.com/detail/Citizen-Kane/0JC35EG7DSKUL0R8UGYCMBCK73"
  },
  {
    id: 20,
    title: "Goodfellas",
    tagline: "Three decades of life in the Mafia.",
    posterUrl: "/posters/goodfellas-poster1.jpg",
    genre: "Crime",
    rating: 8.7,
    duration: "2h 26m",
    trailerUrl: "https://www.youtube.com/embed/qo5jgC6p0m8",
    ottUrl: "https://www.primevideo.com/detail/GoodFellas/0SCA37JIIDJKW1ZKA2DCXFJS6T"
  },
];


const Preloader = () => {
    const yogeshsEssence = "Yogesh's Essence".split("");
    const frames = "Frames I Love".split("");

    return (
        <div className="preloader fixed inset-0 bg-black z-50 flex flex-col items-center justify-center overflow-hidden">
             {/* We add a style tag here to import the new fonts */}
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Jost:wght@600&display=swap');
                    .font-montserrat { font-family: 'Montserrat', sans-serif; }
                    .font-jost { font-family: 'Jost', sans-serif; } /* Futura Alternative */
                `}
            </style>
            <div id="intro-stage-1" className="absolute flex items-center justify-center">
                {/* The intro text with Montserrat font */}
                <h1 className="text-5xl md:text-8xl text-white font-montserrat font-bold tracking-tighter text-center">
                    {yogeshsEssence.map((letter, index) => (
                         <span key={`intro-${index}`} className="intro-letter-wrapper inline-block overflow-hidden">
                             <span className="intro-letter inline-block">
                                {letter === " " ? "\u00A0" : letter}
                             </span>
                         </span>
                    ))}
                </h1>
            </div>
            <div id="intro-stage-2" className="absolute flex items-center justify-center" style={{ opacity: 0 }}>
                 {/* The second intro text with Jost (Futura-like) font */}
                <h1 className="text-5xl md:text-8xl text-white font-jost font-semibold tracking-wide text-center">
                    {frames.map((letter, index) => (
                         <span key={`frame-${index}`} className="intro-frames inline-block" style={{ opacity: 0 }}>
                            {letter === " " ? "\u00A0" : letter}
                         </span>
                    ))}
                </h1>
            </div>
        </div>
    );
};


const TrailerModal = ({ isOpen, onClose, trailerUrl }: { isOpen: boolean; onClose: () => void; trailerUrl: string; }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="relative w-full max-w-4xl aspect-video p-4" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute -top-4 -right-4 lg:top-0 lg:right-0 m-4 text-white text-4xl z-10">&times;</button>
                <iframe
                    className="w-full h-full rounded-lg"
                    src={`${trailerUrl}?autoplay=1&rel=0`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    );
};

const Footer = () => {
  const footerRef = useRef(null);

  useEffect(() => {
    if (window.gsap && footerRef.current) {
      window.gsap.fromTo(footerRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 95%',
            toggleActions: 'play none none none'
          }
        }
      );
    }
  }, []);

  return (
    <footer ref={footerRef} className="relative z-20 w-full px-8 md:px-16 py-8 mt-16 border-t border-white/10 text-center text-white/60">
      <div className="flex justify-center items-center gap-6 mb-4">
        <a href="https://www.linkedin.com/in/yogesh-krishna-k-b22699291" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
        </a>
        <a href="https://github.com/YogiKris11" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
        </a>
      </div>
      <p className="font-jost text-sm italic">“Built in this moment, meant for beyond.”</p>
      <p className="mt-4 text-xs tracking-widest uppercase">Author - Yogesh Krishna</p>
    </footer>
  );
};

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const ratingRef = useRef<HTMLSpanElement>(null);
  const durationRef = useRef<HTMLSpanElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const trailerLinkRef = useRef<HTMLAnchorElement>(null);
  const watchNowLinkRef = useRef<HTMLAnchorElement>(null);
  const posterRef = useRef<HTMLDivElement>(null);
  const posterImgRef = useRef<HTMLImageElement>(null);
  const bgImgRef = useRef<HTMLImageElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const exploreHeadingRef = useRef<HTMLHeadingElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [currentMovieIdx, setCurrentMovieIdx] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTrailerUrl, setCurrentTrailerUrl] = useState("");

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const initialLoadRef = useRef(true);
  const movieQueueRef = useRef<number[]>([]);

  const currentMovie = cinematicMovies[currentMovieIdx];

  const selectNextMovie = () => {
    if (movieQueueRef.current.length === 0) {
      let indices = cinematicMovies.map((_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      if (indices[0] === currentMovieIdx) {
        [indices[0], indices[indices.length - 1]] = [indices[indices.length - 1], indices[0]];
      }
      movieQueueRef.current = indices;
    }
    const nextIndex = movieQueueRef.current.shift();
    if (typeof nextIndex === 'number') setCurrentMovieIdx(nextIndex);
  };

  const resetInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(selectNextMovie, 7000);
  };

  const clearAndStopInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  };
  
  const handleOpenTrailer = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentTrailerUrl(currentMovie.trailerUrl);
    setIsModalOpen(true);
    clearAndStopInterval();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentTrailerUrl("");
    resetInterval();
  };


  useEffect(() => {
    document.title = "YK-frames i love";

    setIsClient(true);
    selectNextMovie();

    const scripts: HTMLScriptElement[] = [];
    const loadScript = (src: string, onLoad: () => void) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = onLoad;
      script.async = true;
      document.head.appendChild(script);
      scripts.push(script);
    };

    loadScript(gsapScript, () => loadScript(scrollTriggerScript, () => loadScript(easePackScript, () => {
        window.gsap.registerPlugin(window.ScrollTrigger);
        
        const tlIntro = window.gsap.timeline({
            onComplete: () => setIsLoading(false)
        });

        // --- Stage 1: Yogesh's Essence (Montserrat) ---
        // Reveal animation: letters slide up with a subtle blur
        tlIntro.fromTo('.intro-letter',
            { y: '110%', filter: 'blur(5px)' },
            {
                y: '0%',
                filter: 'blur(0px)',
                duration: 1.2,
                ease: 'power4.out',
                stagger: 0.05,
            }
        );
        // Exit animation: letters shatter and fade
        tlIntro.to('.intro-letter', {
            x: () => (Math.random() - 0.5) * 60,
            y: () => (Math.random() - 0.5) * 60,
            scale: () => Math.random() * 0.5,
            rotation: () => (Math.random() - 0.5) * 90,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.in',
            stagger: {
                each: 0.03,
                from: 'random'
            }
        }, "+=1.0"); // Hold for 1 second

        // Transition to Stage 2
        tlIntro.set('#intro-stage-1', { display: 'none' });
        tlIntro.set('#intro-stage-2', { opacity: 1, display: 'flex' });

        // --- Stage 2: Frames I Love (Futura/Jost) ---
        // Reveal animation: letters flip in 3D
        tlIntro.fromTo('.intro-frames',
            { opacity: 0, scale: 0.5, rotationX: -90, transformOrigin: '50% 50% -50' },
            {
                opacity: 1,
                scale: 1,
                rotationX: 0,
                duration: 1,
                ease: 'elastic.out(1, 0.5)',
                stagger: 0.06
            }
        );
        // Exit animation: letters drop down and fade
        tlIntro.to('.intro-frames', {
            opacity: 0,
            y: 100,
            ease: 'power3.in',
            stagger: {
                each: 0.04,
                from: 'end'
            },
            duration: 0.6
        }, "+=1.0"); // Hold for 1 second

        // --- Final Fade ---
        tlIntro.to('.preloader', {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                 const preloader = document.querySelector('.preloader');
                 if(preloader) preloader.style.display = 'none';
            }
        });
        
        // --- Reveal Corner Logos ---
        tlIntro.fromTo('#corner-logo-left',
            { opacity: 0, y: -15 },
            {
                opacity: 1,
                y: 0,
                duration: 1.5,
                ease: 'power3.out'
            },
            "-=0.5" // Start this animation slightly before the preloader is fully gone
        );
        tlIntro.fromTo('#corner-logo-right',
            { opacity: 0, y: 15 },
            {
                opacity: 1,
                y: 0,
                duration: 1.5,
                ease: 'power3.out'
            },
            "<" // Start at the same time as the one above
        );


        const initMainAnimations = () => {
            if (!window.gsap) return;
            
            window.gsap.to(backgroundRef.current, { y: "-10%", scale: 1.1, ease: "none", scrollTrigger: { trigger: containerRef.current, scrub: true, start: "top top", end: "bottom top" } });
            window.gsap.to(heroRef.current, { y: "10%", ease: "none", scrollTrigger: { trigger: containerRef.current, scrub: true, start: "top top", end: "bottom top" } });

            if (gridRef.current) {
                window.gsap.fromTo(gridRef.current.children, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.1, scrollTrigger: { trigger: gridRef.current, start: 'top 80%', toggleActions: 'play none none none' } });
            }
            
            if (exploreHeadingRef.current) {
                window.gsap.to(exploreHeadingRef.current, { letterSpacing: "15px", ease: "power2.out", scrollTrigger: { trigger: exploreHeadingRef.current, start: "top bottom", end: "bottom top", scrub: true } });
            }
        };

        // Delay main animations until preloader is done
        tlIntro.eventCallback('onComplete', () => {
            setIsLoading(false);
            setTimeout(initMainAnimations, 50);
        });
    })));
    
    resetInterval();
    
    // --- Cleanup function for the useEffect hook ---
    return () => {
      scripts.forEach(s => {
          if (s.parentNode) {
              s.parentNode.removeChild(s);
          }
      });
      clearAndStopInterval();
      window.ScrollTrigger?.getAll().forEach(t => t.kill());
      window.gsap?.globalTimeline.clear();
    };
  }, [isClient]); 

  // Effect for handling button hover animations
  useEffect(() => {
    const buttons = [trailerLinkRef.current, watchNowLinkRef.current];
    const listeners: { el: HTMLAnchorElement; type: string; listener: (e: MouseEvent) => void; }[] = [];

    buttons.forEach(btn => {
        if (!btn) return;
        const mouseMoveListener = (e: MouseEvent) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            window.gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.5, ease: 'power3.out' });
        };
        const mouseLeaveListener = () => {
            window.gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
        };

        btn.addEventListener('mousemove', mouseMoveListener);
        btn.addEventListener('mouseleave', mouseLeaveListener);
        
        listeners.push({ el: btn, type: 'mousemove', listener: mouseMoveListener });
        listeners.push({ el: btn, type: 'mouseleave', listener: mouseLeaveListener });
    });

    return () => {
        listeners.forEach(({ el, type, listener }) => {
            el.removeEventListener(type, listener as EventListener);
        });
    };
  }, [currentMovie]); 


  useLayoutEffect(() => {
    if (isLoading || !window.gsap) return;

    const elements = {
        titleEl: titleRef.current, taglineEl: taglineRef.current, detailsEl: detailsRef.current,
        buttonsEl: buttonsRef.current, posterEl: posterRef.current, ratingEl: ratingRef.current,
        durationEl: durationRef.current, trailerLinkEl: trailerLinkRef.current,
        watchNowLinkEl: watchNowLinkRef.current, posterImgEl: posterImgRef.current, bgImgEl: bgImgRef.current,
    };

    if (Object.values(elements).some(el => el === null)) return;

    const { titleEl, taglineEl, detailsEl, buttonsEl, posterEl, ratingEl, durationEl, trailerLinkEl, watchNowLinkEl, posterImgEl, bgImgEl } = elements as { [key: string]: HTMLElement };
    const allTextElements = [titleEl, taglineEl, detailsEl, buttonsEl];

    let scrambleInterval: number;
    const scrambleText = (element: HTMLElement, newText: string) => {
        let iteration = 0;
        clearInterval(scrambleInterval);
        scrambleInterval = window.setInterval(() => {
            element.innerText = newText.split("").map((_, index) => {
                if(index < iteration) return newText[index];
                return "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
            }).join("");
            if(iteration >= newText.length) clearInterval(scrambleInterval);
            iteration += 1 / 3;
        }, 30);
    };

    if (initialLoadRef.current) {
        titleEl.innerText = currentMovie.title;
        taglineEl.innerText = currentMovie.tagline;
        ratingEl.innerHTML = `<svg width="24" height="24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg> IMDb: ${currentMovie.rating}`;
        durationEl.innerText = currentMovie.duration;
        (trailerLinkEl as HTMLAnchorElement).href = currentMovie.trailerUrl;
        (watchNowLinkEl as HTMLAnchorElement).href = currentMovie.ottUrl;
        (posterImgEl as HTMLImageElement).src = currentMovie.posterUrl;
        (bgImgEl as HTMLImageElement).src = currentMovie.posterUrl;

        window.gsap.fromTo([...allTextElements, posterEl], { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", stagger: 0.1 });
        initialLoadRef.current = false;
    } else {
      const tl = window.gsap.timeline();
      
      tl.to([posterEl, ...allTextElements], { y: "-=50", opacity: 0, duration: 0.8, ease: 'power3.in', stagger: 0.05 });
      tl.to(bgImgEl, { opacity: 0, duration: 0.4, ease: 'power2.inOut' }, "<");

      tl.call(() => {
          // Hide images before changing src to prevent flash
          window.gsap.set([posterImgEl, bgImgEl], { autoAlpha: 0 });
          taglineEl.innerText = currentMovie.tagline;
          ratingEl.innerHTML = `<svg width="24" height="24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg> IMDb: ${currentMovie.rating}`;
          durationEl.innerText = currentMovie.duration;
          (trailerLinkEl as HTMLAnchorElement).href = currentMovie.trailerUrl;
          (watchNowLinkEl as HTMLAnchorElement).href = currentMovie.ottUrl;
          
          (posterImgEl as HTMLImageElement).src = currentMovie.posterUrl;
          (bgImgEl as HTMLImageElement).src = currentMovie.posterUrl;
      });

      tl.set([posterEl, ...allTextElements], { y: "+=50" }); // Keep opacity at 0, reset y
      
      tl.to(bgImgEl, { opacity: 0.2, duration: 0.6, ease: 'power2.out' });
      tl.to([posterEl, ...allTextElements], {
        y: "0", opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.1,
        onStart: () => {
            window.gsap.set([posterImgEl, bgImgEl], { autoAlpha: 1 }); // Make images visible again for fade in
            scrambleText(titleEl, currentMovie.title)
        }
      });
      
      return () => { tl.kill(); };
    }
  }, [currentMovie, isLoading]);

  const handleMovieSelect = (idx: number) => {
    clearAndStopInterval();
    setCurrentMovieIdx(idx);
    movieQueueRef.current = cinematicMovies.map((_, i) => i).filter(i => i !== idx);
  };

  const handlePosterMouseLeave = () => resetInterval();

  return (
    <>
      {isLoading && <Preloader />}
      <div className={`relative min-h-screen bg-black text-white font-sans overflow-hidden transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <style>
            {`
                .font-montserrat { font-family: 'Montserrat', sans-serif; }
                .font-jost { font-family: 'Jost', sans-serif; }
            `}
        </style>
        <TrailerModal isOpen={isModalOpen} onClose={handleCloseModal} trailerUrl={currentTrailerUrl} />
        
        {/* Persistent Corner Logos */}
        <div id="corner-logo-left" className="fixed top-8 left-8 z-30 text-white/80 font-montserrat font-semibold text-base pointer-events-none opacity-0 mix-blend-difference tracking-wider">
          Yogesh's Essence
        </div>
        <div id="corner-logo-right" className="fixed bottom-8 right-8 z-30 text-white/80 font-jost font-medium text-base pointer-events-none opacity-0 mix-blend-difference [writing-mode:vertical-rl] tracking-widest">
          Frames I Love
        </div>

        <div ref={backgroundRef} className="fixed inset-0 w-full h-full -z-10">
          <img ref={bgImgRef} alt="" className="w-full h-full object-cover" style={{ opacity: 0.2, filter: "blur(20px) saturate(1.2) brightness(0.5)" }} onError={(e) => { e.currentTarget.src = 'https://placehold.co/1920x1080/000000/FFFFFF?text=Image+Not+Found'; }} />
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
        </div>
        
        <div className="fixed bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black via-black to-transparent z-10 pointer-events-none"></div>

        <div ref={containerRef} className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8 lg:px-16">
          <div ref={heroRef} className="flex flex-col lg:flex-row items-center justify-center w-full max-w-7xl">
            <div className="flex-1 lg:w-1/2 flex flex-col justify-center text-center lg:text-left mb-12 lg:mb-0 lg:pr-20">
              <div className="overflow-hidden py-2">
                <h1 ref={titleRef} className="font-black leading-snug mb-6 text-white text-5xl md:text-6xl lg:text-7xl"></h1>
              </div>
              <div className="overflow-hidden py-2">
                <p ref={taglineRef} className="text-xl md:text-2xl lg:text-3xl text-white font-bold mb-4"></p>
              </div>
              <div ref={detailsRef} className="mt-4 flex flex-col md:flex-row items-center justify-center lg:justify-start md:space-x-8 gap-4 lg:gap-0">
                <span ref={ratingRef} className="text-yellow-400 font-bold text-xl flex items-center gap-2"></span>
                <span ref={durationRef} className="text-white font-bold text-lg"></span>
              </div>
              <div ref={buttonsRef} className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <a ref={trailerLinkRef} href="#" onClick={handleOpenTrailer} className="inline-block w-full sm:w-auto text-center px-8 py-4 text-lg font-bold text-white bg-white/10 rounded-full transition-all duration-300 hover:scale-105 backdrop-blur-md ring-1 ring-white/20 hover:ring-white/50">
                  <span className="flex items-center justify-center gap-3"><svg width="24" height="24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>Watch Trailer</span>
                </a>
                <a ref={watchNowLinkRef} href="#" target="_blank" rel="noopener noreferrer" className="inline-block w-full sm:w-auto text-center px-8 py-4 text-lg font-bold text-black bg-yellow-400 rounded-full transition-all duration-300 hover:scale-105 hover:bg-yellow-300">
                  <span className="flex items-center justify-center gap-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="currentColor"><path d="M10 16.5v-9l6 4.5-6 4.5zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>Watch Now</span>
                </a>
              </div>
            </div>
            
            <div className="flex-1 lg:w-1.2 flex items-center justify-center">
              <div ref={posterRef} className="w-full max-w-xs md:max-w-xs lg:max-w-sm aspect-[2/3] rounded-3xl overflow-hidden shadow-2xl backdrop-blur-2xl bg-white/5 transition-all duration-700 border-4 border-white/10">
                <img ref={posterImgRef} alt="" className="w-full h-full object-cover rounded-2xl" style={{ transform: "scale(1.02)" }} onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x600/000000/FFFFFF?text=Poster'; }} />
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-20 w-full px-8 md:px-16 pb-16 mt-16 mb-8">
          <h2 ref={exploreHeadingRef} className="text-4xl md:text-5xl font-extrabold text-white mb-10 text-center">
            Explore More
          </h2>
          <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {cinematicMovies.map((movie, idx) => (
              <div key={movie.id} className={`relative aspect-[2/3] rounded-xl overflow-hidden shadow-xl transition-all duration-500 ease-in-out transform hover:!scale-105 group border-2 border-transparent ${idx === currentMovieIdx ? "ring-4 ring-yellow-400 border-white/50" : ""}`} style={{ background: "radial-gradient(ellipse at bottom, #232526 0%, #0a0a0a 100%)", boxShadow: idx === currentMovieIdx ? "0 0 24px #e5d044, 0 0 64px #fff" : "0 8px 32px 0 #222" }} onMouseEnter={() => handleMovieSelect(idx)} onMouseLeave={handlePosterMouseLeave} tabIndex={0} aria-label={`Show details for ${movie.title}`} onFocus={() => handleMovieSelect(idx)} onBlur={handlePosterMouseLeave}>
                <img src={movie.posterUrl} alt={`${movie.title} Poster`} className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-500 ease-in-out" style={{ filter: idx === currentMovieIdx ? "brightness(1.1) saturate(1.2)" : "brightness(0.8)" }} onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x600/000000/FFFFFF?text=Poster'; }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out pointer-events-none" />
                <div className="absolute bottom-0 left-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out pointer-events-none">
                  <h3 className="font-bold text-lg md:text-xl">{movie.title}</h3>
                  <p className="text-sm md:text-base text-yellow-300 font-semibold">{movie.genre}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}


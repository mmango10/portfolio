import { StrictMode, useCallback, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { fetchCloudinarySections, isCloudinaryConfigured, normalizeCloudinaryAsset } from './cloudinary';
import { about, grandImage, mediaSections, site } from './data';
import { filmVideos, normalizeFilmVideo } from './videoData';
import './styles.css';

const GRAND_IMAGE_ROTATION_MS = 7000;
const GRAND_IMAGE_PRELOAD_LEAD_MS = 3000;
const GRAND_IMAGE_FADE_MS = 280;

function normalizePathname() {
  return window.location.pathname.replace(/\/+$/, '') || '/';
}

function usePathname() {
  const [pathname, setPathname] = useState(normalizePathname);

  useEffect(() => {
    const handlePopState = () => setPathname(normalizePathname());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return pathname;
}

function useCloudinaryMedia() {
  const [state, setState] = useState({
    status: isCloudinaryConfigured() ? 'loading' : 'disabled',
    sections: null,
  });

  useEffect(() => {
    if (!isCloudinaryConfigured()) return undefined;

    const controller = new AbortController();
    fetchCloudinarySections(controller.signal)
      .then((sections) => setState({ status: 'ready', sections }))
      .catch((error) => {
        if (error.name !== 'AbortError') {
          console.warn('Cloudinary media list unavailable; showing local placeholders.', error);
          setState({ status: 'error', sections: null });
        }
      });

    return () => controller.abort();
  }, []);

  return state;
}

function withCloudinaryItems(section, assets) {
  return {
    ...section,
    items: withFilmVideos(section, assets.map((asset, index) => normalizeCloudinaryAsset(asset, section, index, section.items[index % section.items.length]))),
  };
}

function withFilmVideos(section, items) {
  return section.id === 'film'
    ? [...filmVideos.map(normalizeFilmVideo), ...items]
    : items;
}

function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(() => (
    typeof window !== 'undefined'
      && typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ));

  useEffect(() => {
    const mediaQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mediaQuery) return undefined;

    const handleChange = () => setReducedMotion(mediaQuery.matches);
    handleChange();
    mediaQuery.addEventListener?.('change', handleChange);
    return () => mediaQuery.removeEventListener?.('change', handleChange);
  }, []);

  return reducedMotion;
}

function navHref(item, pathname) {
  if (item.id === about.id) return pathname === '/' ? '#about' : '/#about';
  return `/${item.id}`;
}

function TopNav({ pathname }) {
  return (
    <header className="top-nav">
      <a className="top-nav__brand" href="/" aria-label="Dennis Frenkel home">{site.name}</a>
      <span className="top-nav__meta">{site.location} / {site.year}</span>
      <nav aria-label="Media sections" className="top-nav__links">
        {site.nav.map((item) => (
          <a
            key={item.id}
            href={navHref(item, pathname)}
            aria-current={pathname === `/${item.id}` ? 'page' : undefined}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}

function InstagramWatchLink({ item }) {
  return (
    <a
      className="media-placeholder__instagram-link"
      href={item.embedUrl}
      target="_blank"
      rel="noreferrer"
      aria-label={`Watch ${item.title} on Instagram (opens in a new tab)`}
    >
      <svg className="media-placeholder__instagram-arrow" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        <path d="M8 40 40 8M19 8h21v21" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="square" strokeLinejoin="miter" />
      </svg>
      <span>Click to watch</span>
    </a>
  );
}

function MediaPlaceholder({ item, featured = false, loading = false }) {
  const isInstagram = item.type === 'video' && item.embedProvider === 'instagram' && Boolean(item.embedUrl);
  const isVideo = item.type === 'video' && Boolean(item.embedUrl) && !isInstagram;
  const isImage = !isVideo && !isInstagram && Boolean(item.src);
  const hasMedia = isImage || isVideo || isInstagram;
  const [mediaState, setMediaState] = useState(hasMedia ? 'loading' : 'idle');
  const imageRef = useCallback((node) => {
    if (node?.complete && node.naturalWidth > 0) setMediaState('loaded');
  }, []);
  const handleMediaLoad = useCallback(() => setMediaState('loaded'), []);

  const mediaFailed = mediaState === 'error';
  const showImage = isImage && !mediaFailed;
  const showVideo = isVideo && !mediaFailed;
  const showInstagram = isInstagram && !mediaFailed;
  const mediaLoading = (showImage || showVideo) && mediaState === 'loading';
  const showSkeleton = (loading && !mediaFailed && !isInstagram) || mediaLoading;
  const mediaClass = showImage
    ? ' media-placeholder--image'
    : showVideo || showInstagram
      ? ` media-placeholder--video${showInstagram ? ' media-placeholder--instagram' : ''}`
      : '';

  return (
    <div
      className={`media-placeholder${featured ? ' media-placeholder--featured' : ''}${mediaClass}${showSkeleton ? ' media-placeholder--loading' : ''}`}
      style={{ '--block-color': item.color, '--block-ratio': item.ratio, '--block-span': item.span }}
      aria-busy={showSkeleton || undefined}
      {...(showImage || showVideo || showInstagram ? {} : { role: 'img', 'aria-label': loading ? `${item.title} media loading` : `${item.title} placeholder; replace with Dennis's media` })}
    >
      {showVideo || showInstagram ? (
        <>
          <div className={`media-placeholder__video-frame${showInstagram ? ' media-placeholder__instagram-frame' : ''}`}>
            {showSkeleton && <span className="media-placeholder__skeleton" aria-hidden="true" />}
            {showInstagram ? (
              <InstagramWatchLink item={item} />
            ) : (
              <iframe
                className={`media-placeholder__video${mediaLoading ? ' media-placeholder__video--loading' : ''}`}
                src={item.embedUrl}
                title={item.title}
                loading={featured ? 'eager' : 'lazy'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                onLoad={handleMediaLoad}
              />
            )}
          </div>
          <div className="media-placeholder__video-info">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        </>
      ) : (
        <>
          {showSkeleton && <span className="media-placeholder__skeleton" aria-hidden="true" />}
          {showImage ? (
            <img
              className={`media-placeholder__image${mediaLoading ? ' media-placeholder__image--loading' : ''}`}
              src={item.src}
              alt={item.alt || item.title}
              ref={imageRef}
              loading={featured ? 'eager' : 'lazy'}
              decoding="async"
              onLoad={() => setMediaState('loaded')}
              onError={() => setMediaState('error')}
            />
          ) : (!loading || mediaFailed) ? (
            <>
              <span className="media-placeholder__meta">{item.meta || item.section}</span>
              <span className="media-placeholder__title">{item.title}</span>
              <span className="media-placeholder__replace">{mediaFailed ? 'Media unavailable' : 'Media placeholder'}</span>
            </>
          ) : null}
        </>
      )}
    </div>
  );
}

function Intro() {
  return (
    <section className="intro" aria-labelledby="intro-title">
      <div className="intro__label">{site.year} / Media portfilio</div>
      <h1 id="intro-title"><span>Dennis</span> Frenkel</h1>
      <p>{site.intro}</p>
    </section>
  );
}

function GrandImage({ items, loading }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const itemSignature = items.map((item) => item.id).join('|');
  const activeItem = items[activeIndex] || items[0];

  useEffect(() => {
    setActiveIndex(0);
    setFading(false);
  }, [itemSignature]);

  useEffect(() => {
    if (reducedMotion) setFading(false);
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion || items.length < 2) return undefined;

    const preloadedImages = new Map();
    let currentIndex = 0;
    let preloadTimer;
    let rotationTimer;
    let fadeToBlackTimer;
    let revealTimer;

    const preload = (item) => {
      if (!item?.src || preloadedImages.has(item.src)) return;

      const image = new window.Image();
      image.decoding = 'async';
      image.src = item.src;
      preloadedImages.set(item.src, image);
      const decodePromise = image.decode?.();
      decodePromise?.catch(() => {});
    };

    const scheduleNextRotation = () => {
      const nextIndex = (currentIndex + 1) % items.length;
      preloadTimer = window.setTimeout(() => preload(items[nextIndex]), GRAND_IMAGE_ROTATION_MS - GRAND_IMAGE_PRELOAD_LEAD_MS);
      rotationTimer = window.setTimeout(() => {
        setFading(true);
        fadeToBlackTimer = window.setTimeout(() => {
          currentIndex = nextIndex;
          setActiveIndex(nextIndex);
          revealTimer = window.setTimeout(() => {
            setFading(false);
            scheduleNextRotation();
          }, GRAND_IMAGE_FADE_MS);
        }, GRAND_IMAGE_FADE_MS);
      }, GRAND_IMAGE_ROTATION_MS);
    };

    scheduleNextRotation();

    return () => {
      window.clearTimeout(preloadTimer);
      window.clearTimeout(rotationTimer);
      window.clearTimeout(fadeToBlackTimer);
      window.clearTimeout(revealTimer);
      preloadedImages.clear();
    };
  }, [itemSignature, items.length, reducedMotion]);

  if (!activeItem) return null;

  return (
    <section className="featured-gallery" aria-label="Grand image">
      <div className={`featured-gallery__rotator${fading ? ' featured-gallery__rotator--fading' : ''}`}>
        <MediaPlaceholder key={activeItem.id} item={activeItem} featured loading={loading} />
      </div>
    </section>
  );
}

function MediaSection({ section, loading }) {
  const previewItems = section.items.slice(0, section.previewCount ?? section.items.length);

  return (
    <section className="media-section" id={section.id} aria-labelledby={`${section.id}-title`}>
      <div className="section-heading">
        <a
          className="section-heading__link"
          href={`/${section.id}`}
          aria-label={`Open ${section.label} archive`}
        >
          <h2 id={`${section.id}-title`}>{section.label}</h2>
          <svg className="section-heading__arrow" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
            <path d="M8 40 40 8M19 8h21v21" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="square" strokeLinejoin="miter" />
          </svg>
        </a>
        <span>{section.descriptor}</span>
      </div>
      <div className="media-grid">
        {previewItems.map((item) => <MediaPlaceholder item={item} loading={loading} key={item.id} />)}
      </div>
    </section>
  );
}

function ArchivePage({ section, loading }) {
  const archiveItems = section.id === 'film'
    ? section.items.filter((item) => item.type === 'video' || Boolean(item.src))
    : section.items;

  return (
    <main className={`archive-page archive-page--${section.id}`} id="main-content" aria-labelledby={`${section.id}-archive-title`}>
      <div className="section-heading archive-page__heading">
        <h1 id={`${section.id}-archive-title`}>{section.label}</h1>
        <span>{section.descriptor}</span>
      </div>
      <div className="media-grid archive-page__grid">
        {archiveItems.map((item) => <MediaPlaceholder item={item} loading={loading} key={item.id} />)}
      </div>
    </main>
  );
}

function AboutSection() {
  return (
    <section className="about-section" id={about.id} aria-labelledby="about-title">
      <div className="section-heading">
        <h2 id="about-title">{about.label}</h2>
        <span>{about.note}</span>
      </div>
      <div className="about-section__content">
        <p>{about.text}</p>
        <div className="about-section__awards">
          <h3>Awards</h3>
          <p>{about.awards}</p>
        </div>
      </div>
    </section>
  );
}

function SocialLinks() {
  return (
    <div className="social-links" id="socials" aria-label="Social links">
      {site.socials.map((social) => (
        <a
          key={social.id}
          className="social-link"
          href={social.href}
          target="_blank"
          rel="noreferrer"
          aria-label={`${social.label} (opens in a new tab)`}
        >
          <span>{social.shortLabel}</span>
          <small>{social.label}</small>
        </a>
      ))}
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <span>{site.name}</span>
      </div>
      <SocialLinks />
      <div className="footer__bottom">
        <span>Dennis Frenkel — Media Portfolio</span>
        <span>© {site.year} Dennis Frenkel</span>
      </div>
    </footer>
  );
}

function App() {
  const pathname = usePathname();
  const cloudinaryMedia = useCloudinaryMedia();
  const fallbackSections = mediaSections.map((section) => ({
    ...section,
    items: withFilmVideos(section, section.items),
  }));
  const activeSections = cloudinaryMedia.status === 'ready'
    ? mediaSections.map((section) => {
      const assets = cloudinaryMedia.sections[section.id];
      if (Array.isArray(assets)) return withCloudinaryItems(section, assets);
      return fallbackSections.find((fallbackSection) => fallbackSection.id === section.id);
    })
    : fallbackSections;
  const grandImageAssets = cloudinaryMedia.status === 'ready' ? cloudinaryMedia.sections.grandImage : null;
  const grandImageItems = Array.isArray(grandImageAssets) && grandImageAssets.length > 0
    ? grandImageAssets.map((asset, index) => normalizeCloudinaryAsset(asset, grandImage, index, grandImage))
    : [grandImage];
  const mediaLoading = cloudinaryMedia.status === 'loading';
  const archiveSection = activeSections.find((section) => pathname === `/${section.id}`);

  useEffect(() => {
    document.title = archiveSection ? `${archiveSection.label} — Dennis Frenkel` : 'Dennis Frenkel';
  }, [archiveSection]);

  return (
    <div className="app-shell" id="top">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <TopNav pathname={pathname} />
      {archiveSection ? (
        <ArchivePage section={archiveSection} loading={mediaLoading} />
      ) : (
        <main id="main-content">
          <Intro />
          <GrandImage items={grandImageItems} loading={mediaLoading} />
          {activeSections.map((section) => <MediaSection section={section} loading={mediaLoading} key={section.id} />)}
          <AboutSection />
        </main>
      )}
      <Footer />
    </div>
  );
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);

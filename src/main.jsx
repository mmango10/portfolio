import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { fetchCloudinarySections, isCloudinaryConfigured, normalizeCloudinaryAsset } from './cloudinary';
import { about, grandImage, mediaSections, site } from './data';
import './styles.css';

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
    items: assets.map((asset, index) => normalizeCloudinaryAsset(asset, section, index, section.items[index % section.items.length])),
  };
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
      <nav aria-label="Visual work sections" className="top-nav__links">
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

function MediaPlaceholder({ item, featured = false, loading = false }) {
  const isImage = Boolean(item.src);
  const [imageState, setImageState] = useState(isImage ? 'loading' : 'idle');

  useEffect(() => {
    setImageState(item.src ? 'loading' : 'idle');
  }, [item.src]);

  const imageFailed = imageState === 'error';
  const showImage = isImage && !imageFailed;
  const imageLoading = showImage && imageState === 'loading';
  const showSkeleton = (loading && !imageFailed) || imageLoading;

  return (
    <div
      className={`media-placeholder${featured ? ' media-placeholder--featured' : ''}${showImage ? ' media-placeholder--image' : ''}${showSkeleton ? ' media-placeholder--loading' : ''}`}
      style={{ '--block-color': item.color, '--block-ratio': item.ratio, '--block-span': item.span }}
      aria-busy={showSkeleton || undefined}
      {...(showImage ? {} : { role: 'img', 'aria-label': loading ? `${item.title} media loading` : `${item.title} placeholder; replace with Dennis's media` })}
    >
      {showSkeleton && <span className="media-placeholder__skeleton" aria-hidden="true" />}
      {showImage ? (
        <img
          className={`media-placeholder__image${imageLoading ? ' media-placeholder__image--loading' : ''}`}
          src={item.src}
          alt={item.alt || item.title}
          loading={featured ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setImageState('loaded')}
          onError={() => setImageState('error')}
        />
      ) : (!loading || imageFailed) ? (
        <>
          <span className="media-placeholder__meta">{item.meta || item.section}</span>
          <span className="media-placeholder__title">{item.title}</span>
          <span className="media-placeholder__replace">{imageFailed ? 'Media unavailable' : 'Media placeholder'}</span>
        </>
      ) : null}
    </div>
  );
}

function Intro() {
  return (
    <section className="intro" aria-labelledby="intro-title">
      <div className="intro__label">{site.year} / Visual work</div>
      <h1 id="intro-title"><span>Dennis</span> Frenkel</h1>
      <p>{site.intro}</p>
    </section>
  );
}

function GrandImage({ item, loading }) {
  return (
    <section className="featured-gallery" aria-label="Grand image">
      <MediaPlaceholder item={item} featured loading={loading} />
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
  return (
    <main className="archive-page" id="main-content" aria-labelledby={`${section.id}-archive-title`}>
      <div className="section-heading archive-page__heading">
        <h1 id={`${section.id}-archive-title`}>{section.label}</h1>
        <span>{section.descriptor}</span>
      </div>
      <div className="media-grid archive-page__grid">
        {section.items.map((item) => <MediaPlaceholder item={item} loading={loading} key={item.id} />)}
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
        <a href={`mailto:${site.email}`} className="about-section__email">{site.email}</a>
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
        <a href={`mailto:${site.email}`}>{site.email}</a>
      </div>
      <SocialLinks />
      <div className="footer__bottom">
        <span>Dennis Frenkel — Visual Work</span>
        <span>© {site.year} Dennis Frenkel</span>
      </div>
    </footer>
  );
}

function App() {
  const pathname = usePathname();
  const cloudinaryMedia = useCloudinaryMedia();
  const activeSections = cloudinaryMedia.status === 'ready'
    ? mediaSections.map((section) => withCloudinaryItems(section, cloudinaryMedia.sections[section.id] || []))
    : mediaSections;
  const grandImageAsset = cloudinaryMedia.status === 'ready' ? cloudinaryMedia.sections.grandImage?.[0] : null;
  const activeGrandImage = grandImageAsset
    ? normalizeCloudinaryAsset(grandImageAsset, grandImage, 0, grandImage)
    : grandImage;
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
          <GrandImage item={activeGrandImage} loading={mediaLoading} />
          {activeSections.map((section) => <MediaSection section={section} loading={mediaLoading} key={section.id} />)}
          <AboutSection />
        </main>
      )}
      <Footer />
    </div>
  );
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);

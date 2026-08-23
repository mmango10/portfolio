export const site = {
  name: 'Dennis Frenkel',
  year: '2026',
  location: 'Palo Alto, CA',
  intro: 'Photography, videography, cinematography, and editing.',
  nav: [
    { id: 'home', label: 'Home' },
    { id: 'collections', label: 'Collections' },
    { id: 'film', label: 'Film' },
    { id: 'about', label: 'About' },
  ],
  socials: [
    { id: 'instagram', label: 'Instagram', shortLabel: 'IG', href: 'https://www.instagram.com/_dennisfrenkel' },
    { id: 'cal', label: 'Cal.com', shortLabel: 'CAL', href: 'https://cal.com/frenkel' },
  ],
};

export const grandImage = {
  id: 'grand-image',
  label: 'Grand image',
  section: 'Grand image',
  title: 'Grand image',
  meta: 'Grand image',
  ratio: '16 / 9',
  span: 12,
  color: '#b8a18e',
};

// Collections are intentionally registered in code. Add one definition when a
// new Cloudinary tag is ready, then redeploy; photos can still be added/removed
// inside that tag without another code edit.
//
export const collectionDefinitions = [
  { id: 'tahoe-trip', label: "Tahoe '24", tag: 'collection-tahoe_trip', descriptor: 'Travel / Tahoe', featured: true, tileText: 'light' },
  { id: 'france-trip', label: "France '26", tag: 'collection-france_trip', descriptor: 'Travel / France', featured: true, tileText: 'dark' },
  { id: 'germany-trip', label: "Germany '25", tag: 'collection-germany_trip', descriptor: 'Travel / Germany', featured: true, tileText: 'light', tileNoWrap: true },
  { id: 'san-diego-trip-2026', label: "San Diego '26", tag: 'collection-san_diego_trip_2026', descriptor: 'Travel / San Diego', tileNoWrap: true },
  { id: 'vchs-hockey-game-1', label: 'VCHS Ice Hockey', tag: 'collection-vchs_hockey_game_1', descriptor: 'Sports / hockey' },
];

export const filmArchive = {
  id: 'film',
  label: 'Film',
  type: 'videos',
  descriptor: 'Events / broadcast / documentary',
};

export const about = {
  id: 'about',
  label: 'About',
  text: 'I\'m a photographer, videographer, and cinematographer based in Palo Alto, California. I currently attend Gunn High School, class of 2028.',
  note: 'The man behind the camera.',
  awards: 'Emmy Award "Magazine Program", 2x STN National Top 3 Awards.',
};

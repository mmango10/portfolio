export const site = {
  name: 'Dennis Frenkel',
  year: '2026',
  location: 'Palo Alto, CA',
  email: 'hello@dennisfrenkel.com',
  intro: 'Photography, videography, and cinematography by Dennis Frenkel.',
  nav: [
    { id: 'sports', label: 'Sports' },
    { id: 'life', label: 'Life' },
    { id: 'film', label: 'Film' },
    { id: 'about', label: 'About' },
  ],
  socials: [
    { id: 'instagram', label: 'Instagram', shortLabel: 'IG', href: 'https://www.instagram.com/_dennisfrenkel' },
    { id: 'cal', label: 'Cal.com', shortLabel: 'CAL', href: 'https://cal.com/frenkel' },
  ],
};

export const featuredMedia = [
  { id: 'coastline', section: 'Life', title: 'Coastline', meta: '01 / Life', ratio: '1 / 1', span: 7, color: '#b8a18e' },
  { id: 'track', section: 'Sports', title: 'Track', meta: '02 / Sports', ratio: '4 / 5', span: 5, color: '#8e9aa0' },
  { id: 'night-drive', section: 'Life', title: 'Night drive', meta: '03 / Life', ratio: '16 / 10', span: 5, color: '#a89d82' },
  { id: 'on-air', section: 'Film/video', title: 'On the air', meta: '04 / Film/video', ratio: '4 / 5', span: 7, color: '#9b8698' },
];

export const mediaSections = [
  {
    id: 'life',
    label: 'Life',
    descriptor: 'Landscapes / roads / distance',
    previewCount: 8,
    items: [
      { id: 'coastline', title: 'Coastline', meta: '01', ratio: '1 / 1', span: 5, color: '#b8a18e' },
      { id: 'desert-road', title: 'Desert road', meta: '02', ratio: '16 / 10', span: 7, color: '#c5b99d' },
      { id: 'late-arrival', title: 'Late arrival', meta: '03', ratio: '4 / 5', span: 4, color: '#9fa9a2' },
      { id: 'northbound', title: 'Northbound', meta: '04', ratio: '16 / 10', span: 8, color: '#a4adb1' },
      { id: 'night-drive', title: 'Night drive', meta: '01', ratio: '16 / 10', span: 7, color: '#a89d82' },
      { id: 'chrome', title: 'Chrome', meta: '02', ratio: '4 / 5', span: 5, color: '#9ca3a6' },
      { id: 'open-road', title: 'Open road', meta: '03', ratio: '1 / 1', span: 5, color: '#b6a18d' },
      { id: 'parked', title: 'Parked', meta: '04', ratio: '16 / 10', span: 7, color: '#a29aa6' },
      { id: 'valley-light', title: 'Valley light', meta: '05', ratio: '3 / 2', span: 7, color: '#b2a28f' },
      { id: 'window-seat', title: 'Window seat', meta: '06', ratio: '4 / 5', span: 5, color: '#9da6a5' },
      { id: 'mile-marker', title: 'Mile marker', meta: '07', ratio: '1 / 1', span: 4, color: '#a9a0a4' },
      { id: 'dawn-road', title: 'Dawn road', meta: '08', ratio: '16 / 10', span: 8, color: '#b6aa92' },
      { id: 'overlook', title: 'Overlook', meta: '09', ratio: '4 / 5', span: 5, color: '#9ea9ad' },
      { id: 'camp', title: 'Camp', meta: '10', ratio: '1 / 1', span: 4, color: '#a79482' },
      { id: 'detour', title: 'Detour', meta: '11', ratio: '16 / 10', span: 8, color: '#a69b91' },
      { id: 'last-light', title: 'Last light', meta: '12', ratio: '4 / 5', span: 5, color: '#a1a5ab' },
    ],
  },
  {
    id: 'sports',
    label: 'Sports',
    descriptor: 'Timing / movement / stills',
    previewCount: 4,
    items: [
      { id: 'track', title: 'Track', meta: '01', ratio: '4 / 5', span: 4, color: '#8e9aa0' },
      { id: 'field', title: 'Field', meta: '02', ratio: '16 / 10', span: 8, color: '#9da58e' },
      { id: 'courtside', title: 'Courtside', meta: '03', ratio: '1 / 1', span: 6, color: '#b0a2a0' },
      { id: 'finish-line', title: 'Finish line', meta: '04', ratio: '4 / 5', span: 6, color: '#a3a8b2' },
      { id: 'warmup', title: 'Warmup', meta: '05', ratio: '3 / 2', span: 7, color: '#9fa79f' },
      { id: 'sideline', title: 'Sideline', meta: '06', ratio: '4 / 5', span: 5, color: '#af9da0' },
      { id: 'home-stretch', title: 'Home stretch', meta: '07', ratio: '16 / 10', span: 8, color: '#9ba8af' },
      { id: 'after-whistle', title: 'After the whistle', meta: '08', ratio: '1 / 1', span: 4, color: '#a5a194' },
      { id: 'scoreboard', title: 'Scoreboard', meta: '09', ratio: '4 / 5', span: 5, color: '#9d98a4' },
      { id: 'practice', title: 'Practice', meta: '10', ratio: '16 / 10', span: 7, color: '#b0a68d' },
      { id: 'bleachers', title: 'Bleachers', meta: '11', ratio: '1 / 1', span: 4, color: '#a09fa4' },
      { id: 'relay', title: 'Relay', meta: '12', ratio: '4 / 5', span: 5, color: '#9aa8a1' },
    ],
  },
  {
    id: 'film',
    label: 'Film/video',
    descriptor: 'Events / broadcast / documentary',
    previewCount: 4,
    items: [
      { id: 'on-air', title: 'On the air', meta: '01', ratio: '4 / 5', span: 5, color: '#9b8698' },
      { id: 'homecoming', title: 'Homecoming / five days', meta: '02', ratio: '16 / 10', span: 7, color: '#9c9a82' },
      { id: 'graduation', title: 'Graduation / year two', meta: '03', ratio: '16 / 10', span: 8, color: '#9ca6ae' },
      { id: 'open-shelves', title: 'Open shelves', meta: '04', ratio: '4 / 5', span: 4, color: '#a98f82' },
      { id: 'control-room', title: 'Control room', meta: '05', ratio: '16 / 10', span: 8, color: '#989da4' },
      { id: 'backstage', title: 'Backstage', meta: '06', ratio: '4 / 5', span: 4, color: '#a38f86' },
      { id: 'interview', title: 'Interview', meta: '07', ratio: '1 / 1', span: 5, color: '#a0a9a8' },
      { id: 'soundcheck', title: 'Soundcheck', meta: '08', ratio: '16 / 10', span: 7, color: '#ad9c8b' },
      { id: 'edit-bay', title: 'Edit bay', meta: '09', ratio: '4 / 5', span: 5, color: '#998c9c' },
      { id: 'cutaway', title: 'Cutaway', meta: '10', ratio: '1 / 1', span: 4, color: '#a4a3a0' },
      { id: 'closing-frame', title: 'Closing frame', meta: '11', ratio: '16 / 10', span: 8, color: '#9da4ac' },
      { id: 'aisle', title: 'Aisle', meta: '12', ratio: '4 / 5', span: 4, color: '#a78e84' },
    ],
  },
];

export const about = {
  id: 'about',
  label: 'About',
  text: 'I\'m a photographer, videographer, and cinematographer based in Palo Alto, California.',
  note: 'Emmy Award / broadcast news work',
};

function youtubeEmbedUrl(youtubeUrl) {
  try {
    const url = new URL(youtubeUrl);
    const hostname = url.hostname.replace(/^www\./, '');
    const pathParts = url.pathname.split('/').filter(Boolean);
    const videoId = url.searchParams.get('v')
      || (hostname === 'youtu.be' ? pathParts[0] : null)
      || (['youtube.com', 'm.youtube.com'].includes(hostname) && ['embed', 'shorts'].includes(pathParts[0]) ? pathParts[1] : null);

    return videoId
      ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?rel=0`
      : '';
  } catch {
    return '';
  }
}

function googleDriveEmbedUrl(driveUrl) {
  try {
    const url = new URL(driveUrl);
    const hostname = url.hostname.replace(/^www\./, '');
    if (hostname !== 'drive.google.com') return '';

    const pathParts = url.pathname.split('/').filter(Boolean);
    const fileMarkerIndex = pathParts.indexOf('d');
    const fileId = url.searchParams.get('id')
      || (fileMarkerIndex >= 0 ? pathParts[fileMarkerIndex + 1] : '');

    return fileId
      ? `https://drive.google.com/file/d/${encodeURIComponent(fileId)}/preview`
      : '';
  } catch {
    return '';
  }
}

function instagramPermalinkUrl(instagramUrl) {
  try {
    const url = new URL(instagramUrl);
    const hostname = url.hostname.replace(/^www\./, '');
    if (!['instagram.com', 'm.instagram.com'].includes(hostname)) return '';

    const pathParts = url.pathname.split('/').filter(Boolean);
    const mediaTypeIndex = pathParts.findIndex((part) => ['p', 'reel', 'tv'].includes(part));
    const mediaType = mediaTypeIndex >= 0 ? pathParts[mediaTypeIndex] : '';
    const shortcode = mediaTypeIndex >= 0 ? pathParts[mediaTypeIndex + 1] : '';

    return mediaType && shortcode
      ? `https://www.instagram.com/${mediaType}/${encodeURIComponent(shortcode)}/`
      : '';
  } catch {
    return '';
  }
}

// Add or remove Film videos in this list. Use youtubeUrl for YouTube,
// instagramUrl for Instagram, or googleDriveUrl for a Google Drive share or
// /preview URL.
export const filmVideos = [
  {
    id: 'bells-books-documentary',
    youtubeUrl: 'https://www.youtube.com/watch?v=aLbqUWNAClI',
    title: 'Bells Books Documentary',
    description: 'A documentary about a local bookstore in Palo Alto, California. Showcasing their backstory, how they started, and cool books.',
  },
  {
    id: 'snr-paper-toss-2026',
    instagramUrl: 'https://www.instagram.com/reel/DY8u_hDyz-4/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
    title: 'Senior Paper Toss 2026',
    description: 'A video capturing the Senior Paper Toss event in 2026, highlighting the paper toss and the seniors.',
  },
  {
    id: 'tbn-sf-show',
    googleDriveUrl: 'https://drive.google.com/file/d/1eQxSoKebXX7qLjTy5rvjagL1Gzambboy/view?usp=sharing',
    title: 'TBN SF Show',
    description: 'This Emmy Award-winning show about the local scene in San Francisco, highlights various cultural happenings and photographs.',
  },
  {
    id: 'hoco-recap-2025-day-1',
    youtubeUrl: 'https://www.youtube.com/watch?v=OpBmJQ4qsJg',
    title: 'Homecoming 2025 Recap Day 1',
    description: 'A recap of the first day of the homecoming event, capturing the highlights and key moments of the day. Filmed and edited in one day, demonstrating fast turnaround time without compromising quality.',
  },
  {
    id: 'hoco-recap-2025-day-2',
    youtubeUrl: 'https://www.youtube.com/watch?v=5N4bfzOUVBQ',
    title: 'Homecoming 2025 Recap Day 2',
    description: 'A recap of the second day of the homecoming event, capturing the highlights and key moments of the day. Filmed and edited in one day, demonstrating fast turnaround time without compromising quality.',
  },
  {
    id: 'hoco-recap-2025-day-3',
    youtubeUrl: 'https://www.youtube.com/watch?v=hffwgpji1KY',
    title: 'Homecoming 2025 Recap Day 3',
    description: 'A recap of the third day of the homecoming event, capturing the highlights and key moments of the day. Filmed and edited in one day, demonstrating fast turnaround time without compromising quality.',
  },
  {
    id: 'hoco-recap-2025-day-4',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQXJh4EHAlw',
    title: 'Homecoming 2025 Recap Day 4',
    description: 'A recap of the fourth day of the homecoming event, capturing the highlights and key moments of the day. Filmed and edited in one day, demonstrating fast turnaround time without compromising quality.',
  },
  {
    id: 'hoco-recap-2025-day-5',
    youtubeUrl: 'https://www.youtube.com/watch?v=JZO3Wj361AM',
    title: 'Homecoming 2025 Recap Day 5',
    description: 'A recap of the fifth day of the homecoming event, capturing the highlights and key moments of the day. Filmed and edited in one day, demonstrating fast turnaround time without compromising quality.',
  },
  {
    id: 'hoco-recap-2024-day-1',
    youtubeUrl: 'https://www.youtube.com/watch?v=JEdEC8Hdghc',
    title: 'Homecoming 2024 Recap Day 1',
    description: 'A recap of the first day of the homecoming event, capturing the highlights and key moments of the day.',
  },
  {
    id: 'hoco-recap-2024-day-2',
    youtubeUrl: 'https://www.youtube.com/watch?v=QWJlhsRnU24',
    title: 'Homecoming 2024 Recap Day 2',
    description: 'A recap of the second day of the homecoming event, capturing the highlights and key moments of the day.',
  },
  {
    id: 'hoco-recap-2024-day-3',
    youtubeUrl: 'https://www.youtube.com/watch?v=A9yNP3-s5jo',
    title: 'Homecoming 2024 Recap Day 3',
    description: 'A recap of the third day of the homecoming event, capturing the highlights and key moments of the day.',
  },
  {
    id: 'hoco-recap-2024-day-4',
    youtubeUrl: 'https://www.youtube.com/watch?v=DefOxbuuZ5o',
    title: 'Homecoming 2024 Recap Day 4',
    description: 'A recap of the fourth day of the homecoming event, capturing the highlights and key moments of the day.',
  },
  {
    id: 'hoco-recap-2024-day-5',
    youtubeUrl: 'https://www.youtube.com/watch?v=DefOxbuuZ5o',
    title: 'Homecoming 2024 Recap Day 5',
    description: 'A recap of the fifth day of the homecoming event, capturing the highlights and key moments of the day.',
  },
  {
    id: 'tedx-ghs-2026-v1',
    youtubeUrl: 'https://www.youtube.com/watch?v=B4tPSxdBSbk',
    title: 'TEDx Gunn High School 2026',
    description: 'A multicam production of the TEDx event at Gunn, capturing the talks of the event. Filmed and live cut, similar to a live broadcast setup.',
  },
  {
    id: 'tedx-ghs-2026-v2',
    youtubeUrl: 'https://www.youtube.com/watch?v=cFDeFqXbdFQ',
    title: 'TEDx Gunn High School 2026',
    description: 'A multicam production of the TEDx event at Gunn, capturing the talks of the event. Filmed and live cut, similar to a live broadcast setup.',
  },
  {
    id: 'tedx-ghs-2026-v3',
    youtubeUrl: 'https://www.youtube.com/watch?v=HZMnDkOLB1s',
    title: 'TEDx Gunn High School 2026',
    description: 'A multicam production of the TEDx event at Gunn, capturing the talks of the event. Filmed and live cut, similar to a live broadcast setup.',
  },
  {
    id: 'tedx-ghs-2026-v4',
    youtubeUrl: 'https://www.youtube.com/watch?v=MNJ_YvdTHTU',
    title: 'TEDx Gunn High School 2026',
    description: 'A multicam production of the TEDx event at Gunn, capturing the talks of the event. Filmed and live cut, similar to a live broadcast setup.',
  },
  {
    id: 'gunn-high-school-graduation-2026',
    youtubeUrl: 'https://www.youtube.com/watch?v=kNDnd8KkUFI',
    title: 'Gunn High School Graduation 2026',
    description: 'A live, multicam production of the graduation event at Gunn High School, capturing the ceremony and key moments of the event. Filmed and cut live. Months of logistical planning alongside hours of physical work went into ensuring the event was captured seamlessly without issues. From coordinating camera positions, running cables, drawing cable routes and maps, setting up an entire live broadcast production under the California sun to managing live feeds, every detail was meticulously planned for flawless execution. This was the biggest production I have ever undertaken, and it turned out amazing. ',
  },
];

export function normalizeFilmVideo(video, index) {
  const youtubeEmbed = youtubeEmbedUrl(video.youtubeUrl);
  const instagramPermalink = instagramPermalinkUrl(video.instagramUrl);
  const googleDriveEmbed = googleDriveEmbedUrl(video.googleDriveUrl);

  return {
    ...video,
    id: video.id || `film-video-${index + 1}`,
    type: 'video',
    embedUrl: youtubeEmbed || instagramPermalink || googleDriveEmbed,
    embedProvider: youtubeEmbed ? 'youtube' : instagramPermalink ? 'instagram' : googleDriveEmbed ? 'google-drive' : '',
    meta: `V${String(index + 1).padStart(2, '0')}`,
    ratio: '16 / 9',
    span: 7,
    color: '#9b8698',
  };
}

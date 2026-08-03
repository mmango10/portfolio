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

// Add or remove Film videos in this list. Use a normal YouTube watch URL.
export const filmVideos = [
  {
    id: 'bells-books-documentary',
    youtubeUrl: 'https://www.youtube.com/watch?v=aLbqUWNAClI',
    title: 'Bells Books Documentary',
    description: 'A documentary about a local bookstore in Palo Alto, California. Showcasing their backstory, how they started, and cool books.',
  },
];

export function normalizeFilmVideo(video, index) {
  return {
    ...video,
    id: video.id || `film-video-${index + 1}`,
    type: 'video',
    embedUrl: youtubeEmbedUrl(video.youtubeUrl),
    meta: `V${String(index + 1).padStart(2, '0')}`,
    ratio: '16 / 9',
    span: 7,
    color: '#9b8698',
  };
}

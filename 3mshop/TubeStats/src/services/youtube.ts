/**
 * Represents YouTube video statistics.
 */
export interface VideoStats {
  /**
   * The number of likes.
   */
  likes: number;
  /**
   * The number of comments.
   */
  comments: number;
  /**
   * The number of views.
   */
  views: number;
}

/**
 * Asynchronously retrieves YouTube video statistics for a given video ID.
 *
 * @param videoId The ID of the YouTube video.
 * @returns A promise that resolves to a VideoStats object containing likes, comments, and views.
 */
export async function getVideoStats(videoId: string): Promise<VideoStats> {
  // TODO: Implement this by calling the YouTube API.

  return {
    likes: 1000,
    comments: 500,
    views: 100000,
  };
}

/**
 * Extracts the video ID from a YouTube video URL.
 *
 * @param url The YouTube video URL.
 * @returns The video ID, or null if the URL is invalid.
 */
export function extractVideoId(url: string): string | null {
  const regExp = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})(?:.+)?$/;
  const match = url.match(regExp);
  return (match && match[1]) ? match[1] : null;
}

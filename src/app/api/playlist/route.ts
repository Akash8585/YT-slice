import { NextRequest, NextResponse } from 'next/server';

interface PlaylistItem {
  snippet: {
    title: string;
    resourceId: {
      videoId: string;
    };
  };
}

interface VideoItem {
  id: string;
  snippet: {
    title: string;
  };
  contentDetails: {
    duration: string;
  };
}

interface PlaylistResponse {
  items: PlaylistItem[];
  nextPageToken?: string;
  pageInfo: {
    totalResults: number;
  };
}

interface VideosResponse {
  items: VideoItem[];
}

function extractPlaylistId(url: string): string | null {
  const regex = /(?:youtube\.com\/playlist\?list=|youtu\.be\/playlist\?list=)([a-zA-Z0-9_-]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function parseDuration(duration: string): number {
  // Parse ISO 8601 duration format (PT1H2M3S)
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const match = duration.match(regex);
  
  if (!match) return 0;
  
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  
  return hours * 3600 + minutes * 60 + seconds;
}

async function fetchAllPlaylistItems(playlistId: string, apiKey: string): Promise<PlaylistItem[]> {
  const allItems: PlaylistItem[] = [];
  let nextPageToken: string | undefined;

  do {
    const url = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
    url.searchParams.set('part', 'snippet');
    url.searchParams.set('playlistId', playlistId);
    url.searchParams.set('maxResults', '50');
    url.searchParams.set('key', apiKey);
    
    if (nextPageToken) {
      url.searchParams.set('pageToken', nextPageToken);
    }

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch playlist items');
    }

    const data: PlaylistResponse = await response.json();
    allItems.push(...data.items);
    nextPageToken = data.nextPageToken;
  } while (nextPageToken);

  return allItems;
}

async function fetchVideoDetails(videoIds: string[], apiKey: string): Promise<VideoItem[]> {
  const allVideos: VideoItem[] = [];
  
  // Process videos in batches of 50 (YouTube API limit)
  for (let i = 0; i < videoIds.length; i += 50) {
    const batch = videoIds.slice(i, i + 50);
    
    const url = new URL('https://www.googleapis.com/youtube/v3/videos');
    url.searchParams.set('part', 'snippet,contentDetails');
    url.searchParams.set('id', batch.join(','));
    url.searchParams.set('key', apiKey);

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch video details');
    }

    const data: VideosResponse = await response.json();
    allVideos.push(...data.items);
  }

  return allVideos;
}

export async function POST(request: NextRequest) {
  try {
    const { playlistUrl, startVideo, endVideo, completePlaylist } = await request.json();

    if (!playlistUrl || (!completePlaylist && (!startVideo || !endVideo))) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'YouTube API key not configured' },
        { status: 500 }
      );
    }

    const playlistId = extractPlaylistId(playlistUrl);
    if (!playlistId) {
      return NextResponse.json(
        { error: 'Invalid YouTube playlist URL' },
        { status: 400 }
      );
    }

    // Fetch all playlist items
    const playlistItems = await fetchAllPlaylistItems(playlistId, apiKey);

    if (playlistItems.length === 0) {
      return NextResponse.json(
        { error: 'Playlist is empty or not found' },
        { status: 404 }
      );
    }

    // Handle complete playlist or validate range
    let selectedItems: PlaylistItem[];
    
    if (completePlaylist) {
      selectedItems = playlistItems;
    } else {
      // Validate range
      if (startVideo < 1 || endVideo < startVideo || startVideo > playlistItems.length) {
        return NextResponse.json(
          { error: 'Invalid video range' },
          { status: 400 }
        );
      }
      
      // Get the selected range (adjust for 0-based indexing)
      selectedItems = playlistItems.slice(startVideo - 1, Math.min(endVideo, playlistItems.length));
    }
    const videoIds = selectedItems.map(item => item.snippet.resourceId.videoId);

    // Fetch video details including durations
    const videoDetails = await fetchVideoDetails(videoIds, apiKey);

    // Create video data with durations
    const selectedVideos = selectedItems.map((item, index) => {
      const videoDetail = videoDetails.find(v => v.id === item.snippet.resourceId.videoId);
      const durationSeconds = videoDetail ? parseDuration(videoDetail.contentDetails.duration) : 0;
      
      return {
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        duration: videoDetail?.contentDetails.duration || 'PT0S',
        durationSeconds
      };
    });

    // Calculate total and average durations
    const totalDuration = selectedVideos.reduce((sum, video) => sum + video.durationSeconds, 0);
    const averageDuration = Math.round(totalDuration / selectedVideos.length);

    // Get playlist title from first item or fetch separately
    let playlistTitle = 'Unknown Playlist';
    try {
      const playlistUrl = new URL('https://www.googleapis.com/youtube/v3/playlists');
      playlistUrl.searchParams.set('part', 'snippet');
      playlistUrl.searchParams.set('id', playlistId);
      playlistUrl.searchParams.set('key', apiKey);

      const playlistResponse = await fetch(playlistUrl.toString());
      if (playlistResponse.ok) {
        const playlistData = await playlistResponse.json();
        if (playlistData.items && playlistData.items.length > 0) {
          playlistTitle = playlistData.items[0].snippet.title;
        }
      }
    } catch (error) {
      // Use fallback title if playlist details fetch fails
      console.warn('Failed to fetch playlist title:', error);
    }

    const result = {
      playlist: {
        title: playlistTitle,
        totalVideos: playlistItems.length,
        videos: [] // We don't need all videos, just the selected ones
      },
      selectedVideos,
      totalDuration,
      averageDuration
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 
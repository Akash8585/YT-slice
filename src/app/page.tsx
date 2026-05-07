'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';

interface FormData {
  playlistUrl: string;
  startVideo: number;
  endVideo: number;
  completePlaylist: boolean;
}

interface VideoData {
  id: string;
  title: string;
  duration: string;
  durationSeconds: number;
}

interface PlaylistData {
  title: string;
  totalVideos: number;
  videos: VideoData[];
}

interface ResultsData {
  playlist: PlaylistData;
  selectedVideos: VideoData[];
  totalDuration: number;
  averageDuration: number;
}

const faqs = [
  {
    question: 'How do I calculate YouTube playlist length?',
    answer:
      'Paste a YouTube playlist URL into YT Slice, then calculate the complete playlist or choose the exact video range you want to measure.',
  },
  {
    question: 'Can I calculate a custom range inside a playlist?',
    answer:
      'Yes. Enter the start video number and end video number to calculate only that slice of the playlist instead of the full playlist.',
  },
  {
    question: 'Does the calculator show watch time at different playback speeds?',
    answer:
      'Yes. After the playlist is calculated, YT Slice shows watch-time estimates for common speeds including 1.25x, 1.5x, 1.75x, and 2x.',
  },
];

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ResultsData | null>(null);

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<FormData>({
    defaultValues: {
      startVideo: 1,
      endVideo: 10,
      completePlaylist: false
    }
  });

  const completePlaylist = watch('completePlaylist');

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours} hr${hours !== 1 ? 's' : ''} ${minutes} min${minutes !== 1 ? 's' : ''}`;
    } else if (minutes > 0) {
      return `${minutes} min${minutes !== 1 ? 's' : ''} ${secs > 0 ? ` ${secs} sec${secs !== 1 ? 's' : ''}` : ''}`;
    } else {
      return `${secs} sec${secs !== 1 ? 's' : ''}`;
    }
  };

  const formatDurationDetailed = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours} hr${hours !== 1 ? 's' : ''} ${minutes} min${minutes !== 1 ? 's' : ''}`;
    } else {
      return `${minutes} min${minutes !== 1 ? 's' : ''} ${remainingSeconds} sec${remainingSeconds !== 1 ? 's' : ''}`;
    }
  };

  const calculatePlaybackTime = (totalSeconds: number, speed: number): string => {
    const adjustedSeconds = Math.round(totalSeconds / speed);
    return formatDuration(adjustedSeconds);
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('/api/playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playlistUrl: data.playlistUrl,
          startVideo: data.completePlaylist ? 1 : data.startVideo,
          endVideo: data.completePlaylist ? -1 : data.endVideo, // -1 indicates complete playlist
          completePlaylist: data.completePlaylist,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch playlist data');
      }

      const result = await response.json();
      setResults(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const playbackSpeeds = [1.0, 1.25, 1.5, 1.75, 2.0];

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <section className="text-center mb-8">
        <p className="text-sm font-medium text-muted-foreground mb-2">
          YouTube playlist duration and range calculator
        </p>
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          YouTube Playlist Length Calculator
        </h1>
        <p className="text-lg text-muted-foreground">
          Calculate the total watch time of a complete YouTube playlist or choose a custom start and end video range.
        </p>
      </section>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Playlist Input and Range Selection</CardTitle>
          <CardDescription>Enter a YouTube playlist URL and select the video range you want to analyze</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="playlistUrl">YouTube Playlist URL</Label>
              <Input
                id="playlistUrl"
                placeholder="https://www.youtube.com/playlist?list=..."
                {...register('playlistUrl', { 
                  required: 'Playlist URL is required',
                  pattern: {
                    value: /(?:youtube\.com\/playlist\?list=|youtu\.be\/playlist\?list=)([a-zA-Z0-9_-]+)/,
                    message: 'Please enter a valid YouTube playlist URL'
                  }
                })}
              />
              {errors.playlistUrl && (
                <p className="text-sm text-red-500">{errors.playlistUrl.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="completePlaylist"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                {...register('completePlaylist')}
                onChange={(e) => {
                  setValue('completePlaylist', e.target.checked);
                  if (e.target.checked) {
                    setValue('startVideo', 1);
                    setValue('endVideo', 1);
                  }
                }}
              />
              <Label htmlFor="completePlaylist" className="text-sm font-medium">
                Calculate for complete playlist
              </Label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startVideo" className={completePlaylist ? 'text-gray-400' : ''}>
                  Start Video Number
                </Label>
                <Input
                  id="startVideo"
                  type="number"
                  min="1"
                  disabled={completePlaylist}
                  className={completePlaylist ? 'bg-gray-100 cursor-not-allowed' : ''}
                  {...register('startVideo', { 
                    required: !completePlaylist && 'Start video number is required',
                    min: { value: 1, message: 'Start video must be at least 1' },
                    valueAsNumber: true
                  })}
                />
                {errors.startVideo && !completePlaylist && (
                  <p className="text-sm text-red-500">{errors.startVideo.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endVideo" className={completePlaylist ? 'text-gray-400' : ''}>
                  End Video Number
                </Label>
                <Input
                  id="endVideo"
                  type="number"
                  min="1"
                  disabled={completePlaylist}
                  className={completePlaylist ? 'bg-gray-100 cursor-not-allowed' : ''}
                  {...register('endVideo', { 
                    required: !completePlaylist && 'End video number is required',
                    min: { value: 1, message: 'End video must be at least 1' },
                    valueAsNumber: true,
                    validate: (value) => {
                      if (completePlaylist) return true;
                      const startVideo = watch('startVideo');
                      return value >= startVideo || 'End video must be greater than or equal to start video';
                    }
                  })}
                />
                {errors.endVideo && !completePlaylist && (
                  <p className="text-sm text-red-500">{errors.endVideo.message}</p>
                )}
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Fetching Playlist...' : 'Fetch Playlist'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Card className="mb-8 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {results && (
        <div className="space-y-6">
          {/* Results Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Playlist Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold text-sm text-muted-foreground">PLAYLIST TITLE</p>
                  <p className="font-medium">{results.playlist.title}</p>
                </div>
                <div>
                  <p className="font-semibold text-sm text-muted-foreground">TOTAL VIDEOS</p>
                  <p className="font-medium">{results.playlist.totalVideos}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold text-sm text-muted-foreground">SELECTED RANGE</p>
                  <p className="font-medium">
                    {completePlaylist 
                      ? `Complete playlist - ${results.selectedVideos.length} videos`
                      : `Videos ${watch('startVideo')} to ${watch('endVideo')} - ${results.selectedVideos.length} videos`
                    }
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-sm text-muted-foreground">SELECTED RANGE DURATION</p>
                  <p className="font-medium">{formatDuration(results.totalDuration)}</p>
                </div>
              </div>

              <div>
                <p className="font-semibold text-sm text-muted-foreground">AVERAGE VIDEO LENGTH</p>
                <p className="font-medium">{formatDuration(results.averageDuration)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Playback Speed Estimates */}
          <Card>
            <CardHeader>
              <CardTitle>Playback Speed Estimates</CardTitle>
              <CardDescription>How long the selected range would take to watch at different speeds</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Speed</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {playbackSpeeds.map((speed) => (
                    <TableRow key={speed}>
                      <TableCell className="font-medium">{speed}x</TableCell>
                      <TableCell>{calculatePlaybackTime(results.totalDuration, speed)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* List of Selected Videos */}
          <Card>
            <CardHeader>
              <CardTitle>Selected Videos</CardTitle>
              <CardDescription>All videos in the selected range with their durations</CardDescription>
            </CardHeader>
            <CardContent>
                                <div className="space-y-2 max-h-96 overflow-y-auto">
                 {results.selectedVideos.map((video) => (
                   <div key={video.id} className="flex justify-between items-start p-3 rounded-lg bg-muted/50">
                     <div className="flex-1 min-w-0">
                       <p className="font-medium text-sm">
                         {video.title}
                       </p>
                     </div>
                     <div className="ml-4 text-sm text-muted-foreground font-mono">
                       {formatDurationDetailed(video.durationSeconds)}
                     </div>
                   </div>
                 ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <section className="mt-10 space-y-6" aria-labelledby="playlist-length-guide">
        <div className="space-y-2">
          <h2 id="playlist-length-guide" className="text-2xl font-semibold tracking-tight">
            Calculate Any YouTube Playlist Range
          </h2>
          <p className="text-muted-foreground">
            YT Slice helps students, course viewers, creators, and researchers find the total duration of a YouTube playlist before they start watching. Use the full playlist option for the complete watch time, or choose a custom range when you only need videos from one part of a long playlist.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Full Playlist Length</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Get the complete duration and average video length for a YouTube playlist.
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Custom Video Range</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Select a start and end video number to calculate only the playlist section you care about.
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Playback Speed Time</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Compare how long the selected playlist range takes at common YouTube playback speeds.
            </p>
          </div>
        </div>
      </section>

      <section id="faq" className="mt-10 space-y-4" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-2xl font-semibold tracking-tight">
          YouTube Playlist Length FAQ
        </h2>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <article key={faq.question} className="rounded-lg border p-4">
              <h3 className="font-semibold">{faq.question}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

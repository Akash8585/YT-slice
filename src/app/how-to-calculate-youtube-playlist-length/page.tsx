import type { Metadata } from "next";
import Link from "next/link";

const title = "How to Calculate YouTube Playlist Length";
const description =
  "Learn how to calculate the total length of a YouTube playlist, check watch time at faster playback speeds, and measure a custom playlist range.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/how-to-calculate-youtube-playlist-length",
  },
  openGraph: {
    title,
    description,
    url: "/how-to-calculate-youtube-playlist-length",
    type: "article",
  },
};

export default function PlaylistLengthGuide() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: title,
    description,
    step: [
      {
        "@type": "HowToStep",
        name: "Copy the playlist URL",
        text: "Open the YouTube playlist and copy the URL from the browser address bar.",
      },
      {
        "@type": "HowToStep",
        name: "Paste the playlist into YT Slice",
        text: "Paste the YouTube playlist link into the calculator input.",
      },
      {
        "@type": "HowToStep",
        name: "Choose full playlist or range",
        text: "Calculate the complete playlist or enter a start and end video number for a custom range.",
      },
      {
        "@type": "HowToStep",
        name: "Review total watch time",
        text: "Read the total duration, average video length, selected videos, and playback speed estimates.",
      },
    ],
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <p className="text-sm font-medium text-muted-foreground">
        YouTube playlist duration guide
      </p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight">
        How to Calculate YouTube Playlist Length
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        YouTube does not always show the total runtime of a playlist in a way that helps you plan. YT Slice calculates the total length of a playlist and can also measure only a selected range of videos.
      </p>

      <section className="mt-8 space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Quick Answer</h2>
        <p className="text-muted-foreground">
          To calculate YouTube playlist length, copy the playlist URL, paste it into YT Slice, and choose whether to calculate the full playlist or a custom range. The result shows total watch time, average video length, and playback speed estimates.
        </p>
        <Link href="/" className="inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Open the calculator
        </Link>
      </section>

      <section className="mt-8 space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Steps</h2>
        <ol className="space-y-3 text-muted-foreground">
          <li><strong className="text-foreground">1. Copy the playlist URL.</strong> Use a public YouTube playlist link that contains a playlist ID after <code>list=</code>.</li>
          <li><strong className="text-foreground">2. Paste it into YT Slice.</strong> The calculator fetches the playlist videos and reads each video duration.</li>
          <li><strong className="text-foreground">3. Choose a range if needed.</strong> Leave the full playlist option on, or enter start and end video numbers.</li>
          <li><strong className="text-foreground">4. Check the watch time.</strong> Review the total duration and compare times at common playback speeds.</li>
        </ol>
      </section>

      <section className="mt-8 space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">When a Range Calculator Helps</h2>
        <p className="text-muted-foreground">
          Range selection is useful for long playlists, online courses, study plans, and playlists where you have already watched the first set of videos. Instead of calculating the whole playlist again, you can measure only videos 20 to 45 or any other section.
        </p>
      </section>
    </main>
  );
}

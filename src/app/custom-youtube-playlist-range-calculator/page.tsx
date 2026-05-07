import type { Metadata } from "next";
import Link from "next/link";

const title = "Custom YouTube Playlist Range Calculator";
const description =
  "Calculate the duration of a custom YouTube playlist range by choosing the start video and end video instead of measuring the full playlist.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/custom-youtube-playlist-range-calculator",
  },
  openGraph: {
    title,
    description,
    url: "/custom-youtube-playlist-range-calculator",
    type: "article",
  },
};

export default function CustomRangeGuide() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is a YouTube playlist range calculator?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A YouTube playlist range calculator measures only the videos between a selected start number and end number in a playlist.",
        },
      },
      {
        "@type": "Question",
        name: "Can I calculate videos 10 to 25 in a playlist?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Enter 10 as the start video and 25 as the end video in YT Slice to calculate that playlist section.",
        },
      },
    ],
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <p className="text-sm font-medium text-muted-foreground">
        Custom playlist duration calculator
      </p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight">
        Custom YouTube Playlist Range Calculator
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        YT Slice lets you calculate only part of a YouTube playlist. Choose a start video and end video to find the exact duration of the section you want to watch.
      </p>

      <section className="mt-8 space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Calculate Only the Videos You Need</h2>
        <p className="text-muted-foreground">
          A full playlist duration is helpful, but sometimes you only need one chapter, week, module, or unfinished section. With custom range selection, you can calculate videos 1 to 10, 25 to 50, 100 to 150, or any valid range inside a playlist.
        </p>
        <Link href="/" className="inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Calculate a playlist range
        </Link>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h2 className="font-semibold">For Course Playlists</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Measure one course module or a week of lessons without including the entire playlist.
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <h2 className="font-semibold">For Watch Planning</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Find out how long your remaining videos take at 1x, 1.5x, or 2x speed.
          </p>
        </div>
      </section>

      <section className="mt-8 space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">FAQ</h2>
        <article className="rounded-lg border p-4">
          <h3 className="font-semibold">What is a YouTube playlist range calculator?</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            It is a calculator that totals only the videos between a selected start number and end number in a playlist.
          </p>
        </article>
        <article className="rounded-lg border p-4">
          <h3 className="font-semibold">Can I calculate videos 10 to 25 in a playlist?</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Yes. Enter 10 as the start video and 25 as the end video to calculate just that section.
          </p>
        </article>
      </section>
    </main>
  );
}

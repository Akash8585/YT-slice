# YT Slice

A full-stack web application that calculates the total duration of a selected range of videos from a YouTube playlist.

## Features

- 🔗 **Playlist Input & Range Selection**: Enter YouTube playlist URL and select video range
- 🧠 **YouTube Data Handling**: Uses YouTube Data API v3 for playlist and video data
- 📋 **Result Summary Display**: Shows playlist info, selected range details, and statistics
- ⏩ **Playback Speed Estimates**: Calculate viewing time at different playback speeds (1x to 2x)
- 📃 **List of Selected Videos**: Scrollable list of videos in selected range with durations

## Tech Stack

- **Next.js (App Router)** - React framework with server-side rendering
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **ShadCN UI** - Modern UI components
- **React Hook Form** - Form handling and validation
- **YouTube Data API v3** - Playlist and video data

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd yt-slice
npm install
```

### 2. Get YouTube API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **YouTube Data API v3**
4. Create credentials (API Key)
5. Copy your API key

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
YOUTUBE_API_KEY=your_youtube_api_key_here
```

Replace `your_youtube_api_key_here` with your actual YouTube API key.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Usage

1. **Enter Playlist URL**: Paste a YouTube playlist URL in the input field
2. **Set Video Range**: Specify start and end video numbers (e.g., videos 3 to 15)
3. **Fetch Playlist**: Click the "Fetch Playlist" button to analyze the playlist
4. **View Results**: See playlist summary, duration calculations, and video list

## Features Overview

### Playlist Analysis
- Fetches complete playlist data with pagination support
- Handles playlists with more than 50 videos
- Validates playlist URLs and video ranges

### Duration Calculations
- Parses ISO 8601 duration format from YouTube API
- Calculates total and average durations for selected range
- Shows playback time estimates at multiple speeds

### Modern UI/UX
- Clean, responsive design with ShadCN UI components
- Loading states and error handling
- Scrollable video list for large ranges
- Form validation with helpful error messages

## API Endpoints

### POST `/api/playlist`

Fetches YouTube playlist data and calculates durations for selected video range.

**Request Body:**
```json
{
  "playlistUrl": "https://www.youtube.com/playlist?list=...",
  "startVideo": 1,
  "endVideo": 10
}
```

**Response:**
```json
{
  "playlist": {
    "title": "Playlist Title",
    "totalVideos": 50
  },
  "selectedVideos": [...],
  "totalDuration": 3600,
  "averageDuration": 360
}
```

## Development

### Project Structure

```
src/
├── app/
│   ├── api/playlist/route.ts    # YouTube API integration
│   ├── page.tsx                 # Main application page
│   └── layout.tsx              # Root layout
└── components/ui/              # ShadCN UI components
```

### Key Components

- **Main Form**: Playlist URL input and range selection
- **Results Display**: Summary cards with playlist information
- **Playback Speed Table**: Time estimates at different speeds
- **Video List**: Scrollable list of selected videos

## License

This project is open source and available under the [MIT License](LICENSE).

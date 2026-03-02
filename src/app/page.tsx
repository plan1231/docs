import { db } from "@/db";
import { movies, episodes, series, seasons } from "@/db/schema";
import { eq } from "drizzle-orm";
import { MediaGrid } from "@/components/media-grid";
import { MediaGridSkeleton } from "@/components/loading-skeleton";

async function getMediaData() {
  const allMovies = await db.select({
    id: movies.id,
    title: movies.title,
    year: movies.year,
    fileSize: movies.fileSize,
    uploadStatus: movies.uploadStatus,
  }).from(movies);

  const allEpisodes = await db.select({
    id: episodes.id,
    title: episodes.title,
    episodeNumber: episodes.episodeNumber,
    fileSize: episodes.fileSize,
    uploadStatus: episodes.uploadStatus,
    seasonNumber: seasons.seasonNumber,
    seriesTitle: series.title,
  })
    .from(episodes)
    .innerJoin(seasons, eq(episodes.seasonId, seasons.id))
    .innerJoin(series, eq(seasons.seriesId, series.id));

  return {
    movies: allMovies,
    episodes: allEpisodes,
  };
}

export default async function Home() {
  const { movies, episodes } = await getMediaData();

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent">
            TV Box Server
          </h1>
          <p className="text-zinc-500 mt-2">
            {movies.length} movies • {episodes.length} episodes
          </p>
        </header>

        <MediaGrid movies={movies} episodes={episodes} />
      </div>
    </main>
  );
}

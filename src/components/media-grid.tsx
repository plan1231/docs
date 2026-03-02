"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { MediaCard } from "@/components/media-card";

interface Movie {
  id: number;
  title: string;
  year: number | null;
  fileSize: number | null;
  uploadStatus: string;
}

interface EpisodeWithSeries {
  id: number;
  title: string | null;
  episodeNumber: number | null;
  fileSize: number | null;
  uploadStatus: string;
  seasonNumber: number | null;
  seriesTitle: string;
}

interface MediaGridProps {
  movies: Movie[];
  episodes: EpisodeWithSeries[];
}

export function MediaGrid({ movies, episodes }: MediaGridProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEpisodes = episodes.filter(
    (episode) =>
      episode.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      episode.seriesTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Input
          type="search"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm bg-zinc-900 border-zinc-800 placeholder:text-zinc-500"
        />
      </div>

      <Tabs defaultValue="movies" className="w-full">
        <TabsList className="bg-zinc-900 border-zinc-800">
          <TabsTrigger
            value="movies"
            className="data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-400"
          >
            Movies ({filteredMovies.length})
          </TabsTrigger>
          <TabsTrigger
            value="episodes"
            className="data-[state=active]:bg-teal-900/30 data-[state=active]:text-teal-400"
          >
            TV Shows ({filteredEpisodes.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="movies" className="mt-6">
          {filteredMovies.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              {searchQuery ? "No movies match your search" : "No movies uploaded yet"}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredMovies.map((movie) => (
                <MediaCard
                  key={movie.id}
                  title={movie.title}
                  year={movie.year}
                  fileSize={movie.fileSize}
                  uploadStatus={movie.uploadStatus}
                  type="movie"
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="episodes" className="mt-6">
          {filteredEpisodes.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              {searchQuery ? "No episodes match your search" : "No episodes uploaded yet"}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredEpisodes.map((episode) => (
                <MediaCard
                  key={episode.id}
                  title={episode.title || episode.seriesTitle}
                  fileSize={episode.fileSize}
                  uploadStatus={episode.uploadStatus}
                  type="episode"
                  episodeInfo={`S${episode.seasonNumber} E${episode.episodeNumber}`}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

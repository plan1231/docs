import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface MediaCardProps {
  title: string;
  year?: number | null;
  fileSize?: number | null;
  uploadStatus: string;
  type: "movie" | "episode";
  episodeInfo?: string;
}

function formatFileSize(bytes: number | null | undefined): string {
  if (!bytes) return "Unknown size";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "completed":
      return "default";
    case "uploading":
      return "secondary";
    case "pending":
      return "outline";
    case "failed":
      return "destructive";
    default:
      return "outline";
  }
}

export function MediaCard({ title, year, fileSize, uploadStatus, type, episodeInfo }: MediaCardProps) {
  return (
    <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors duration-200 group">
      <CardContent className="p-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-zinc-100 group-hover:text-purple-400 transition-colors line-clamp-2">
              {title}
            </h3>
            <Badge variant={getStatusVariant(uploadStatus)} className="shrink-0 text-xs">
              {uploadStatus}
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-sm text-zinc-500">
            {year && <span>{year}</span>}
            {year && fileSize && <span>•</span>}
            {fileSize && <span>{formatFileSize(fileSize)}</span>}
            {episodeInfo && (
              <>
                {(year || fileSize) && <span>•</span>}
                <span className="text-teal-400">{episodeInfo}</span>
              </>
            )}
          </div>

          <div className="text-xs text-zinc-600 mt-1">
            {type === "movie" ? "Movie" : "Episode"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/db';
import { uploadLogs } from '@/db/schema';
import { desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const logs = await db
      .select({
        id: uploadLogs.id,
        mediaType: uploadLogs.mediaType,
        mediaId: uploadLogs.mediaId,
        filePath: uploadLogs.filePath,
        fileSize: uploadLogs.fileSize,
        s3Key: uploadLogs.s3Key,
        s3Bucket: uploadLogs.s3Bucket,
        status: uploadLogs.status,
        errorMessage: uploadLogs.errorMessage,
        loggedAt: uploadLogs.loggedAt,
      })
      .from(uploadLogs)
      .orderBy(desc(uploadLogs.loggedAt))
      .limit(limit);

    return NextResponse.json({
      logs: logs.map((log) => ({
        id: log.id,
        media_type: log.mediaType,
        media_id: log.mediaId,
        file_path: log.filePath,
        file_size: log.fileSize,
        s3_key: log.s3Key,
        s3_bucket: log.s3Bucket,
        status: log.status,
        error_message: log.errorMessage,
        logged_at: log.loggedAt,
      })),
    });
  } catch (error) {
    console.error('Error getting upload logs:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

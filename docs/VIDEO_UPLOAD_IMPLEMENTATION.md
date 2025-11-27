
# Video Upload Implementation Guide

## Overview
This document describes the video upload implementation using expo-image-picker and Supabase storage.

## Issue Resolution (January 2025)

### Problem
Videos were not being saved to the backend when users attempted to upload them. The videos would not appear in the user's library.

### Root Cause
The Supabase storage bucket `challengemedia` existed but had no Row Level Security (RLS) policies configured. This prevented authenticated users from uploading files to the bucket, resulting in 400 errors.

### Solution
Created the following RLS policies on the `storage.objects` table:

1. **Allow authenticated uploads**: Permits authenticated users to insert objects into the `challengemedia` bucket
2. **Allow public access**: Permits public read access to objects in the `challengemedia` bucket
3. **Allow users to update own videos**: Permits users to update their own uploaded videos
4. **Allow users to delete own videos**: Permits users to delete their own uploaded videos

### Verification
- Storage bucket `challengemedia` exists and is public
- RLS policies are configured correctly
- Enhanced logging added to upload functions for debugging
- Videos now successfully upload and appear in user library

## Color Palette (Mandatory)

The app uses a strict 4-color design system:

- **Background**: `#FF8F8F` - Main surfaces, app backgrounds
- **Primary**: `#FFF1CB` - Primary buttons and core actions
- **Secondary**: `#C2E2FA` - Secondary buttons, supportive UI
- **Accent**: `#B7A3E3` - Key indicators, highlights

### Typography System (Mandatory)

| Purpose | Color | Usage |
|---------|-------|-------|
| Main header | `#B7A3E3` (Accent) | H1, H2 |
| Body text | `#B7A3E3` (Accent) | Paragraphs |
| Muted text | `#C2E2FA` (Secondary) | Timestamps, labels |
| Primary button text | `#FF8F8F` (Background) | "Join", "Upload" |
| Secondary button text | `#FF8F8F` (Background) | "Logout", "Cancel" |

## Video Upload Flow

### 1. Record or Select Video
Users can either:
- Record a new video using the device camera
- Select an existing video from their gallery

### 2. Upload to Supabase Storage
The video is uploaded to the `challengemedia` bucket with:
- Unique filename: `{user_id}_{timestamp}_{original_filename}`
- Content type: `video/mp4`
- Public access enabled

### 3. Save Metadata to Database
Video metadata is saved to the `user_videos` table:
- `user_id`: Reference to the authenticated user
- `video_url`: Public URL of the uploaded video
- `file_name`: Unique filename in storage
- `title`: Generated title (e.g., "Assemble furniture Challenge")
- `task`: The challenge task name
- `uploaded_at`: Timestamp of upload
- `views`: View count (default: 0)
- `likes`: Like count (default: 0)

### 4. Display in Library
Videos are fetched from the `user_videos` table and displayed in the user's library screen.

## Supabase Storage Setup

### Storage Bucket Configuration

**Bucket Name**: `challengemedia`

**Settings**:
- Public Access: ✅ ON
- Uploads Allowed: ✅ YES
- File Size Limit: 100MB (104857600 bytes)
- Allowed MIME Types:
  - `video/mp4`
  - `video/quicktime`
  - `video/x-msvideo`
  - `video/webm`
  - `video/mpeg`

### Storage Policies (RLS)

```sql
-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to upload videos
CREATE POLICY "Allow authenticated uploads to challengemedia"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'challengemedia');

-- Allow public read access to videos
CREATE POLICY "Allow public access to challengemedia"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'challengemedia');

-- Allow users to update their own videos
CREATE POLICY "Allow users to update own videos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'challengemedia' AND auth.uid()::text = owner::text);

-- Allow users to delete their own videos
CREATE POLICY "Allow users to delete own videos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'challengemedia' AND auth.uid()::text = owner::text);
```

## Database Schema

### user_videos Table

```sql
CREATE TABLE user_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  video_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  title TEXT,
  task TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_videos ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own videos"
ON user_videos FOR SELECT
TO public
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own videos"
ON user_videos FOR INSERT
TO public
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own videos"
ON user_videos FOR UPDATE
TO public
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own videos"
ON user_videos FOR DELETE
TO public
USING (user_id = auth.uid());
```

## Implementation Details

### Record Screen (`app/(tabs)/(home)/record.tsx`)

The record screen provides two options:
1. **Record Video**: Opens the camera to record a new video
2. **Upload from Gallery**: Opens the gallery to select an existing video

Both options automatically upload the video to Supabase storage and save metadata to the database.

### Upload Function

```typescript
const uploadVideoToSupabase = async (uri: string, fileName: string) => {
  // 1. Fetch video file as blob
  const response = await fetch(uri);
  const blob = await response.blob();

  // 2. Generate unique filename
  const uniqueFileName = `${userProfile.id}_${timestamp}_${fileName}`;

  // 3. Upload to Supabase storage
  const { data, error } = await supabase.storage
    .from('challengemedia')
    .upload(uniqueFileName, blob, {
      contentType: 'video/mp4',
      upsert: false
    });

  // 4. Get public URL
  const { data: urlData } = supabase.storage
    .from('challengemedia')
    .getPublicUrl(uniqueFileName);

  // 5. Save metadata to database
  await supabase
    .from('user_videos')
    .insert({
      user_id: userProfile.id,
      video_url: urlData.publicUrl,
      file_name: uniqueFileName,
      title: `${todayTask.task} Challenge`,
      task: todayTask.task,
    });
};
```

### Library Screen (`app/(tabs)/library/index.tsx`)

The library screen:
- Fetches videos from the `user_videos` table filtered by user ID
- Displays video cards with metadata (title, task, views, likes, date)
- Refreshes when the screen comes into focus
- Supports pull-to-refresh

## Debugging

### Enhanced Logging

The upload functions now include comprehensive logging:
- Video URI and filename
- User ID
- Blob size and type
- Storage upload status
- Database insert status
- Error details with stack traces

### Common Issues

1. **Upload fails with 400 error**
   - Check storage bucket exists
   - Verify RLS policies are configured
   - Ensure user is authenticated

2. **Video doesn't appear in library**
   - Check database insert succeeded
   - Verify user_id matches authenticated user
   - Check RLS policies on user_videos table

3. **Permission errors**
   - Ensure camera/media library permissions are granted
   - Check app permissions in device settings

## Testing Checklist

- [x] Storage bucket `challengemedia` exists
- [x] Bucket is public
- [x] Storage RLS policies configured
- [x] Database table `user_videos` exists
- [x] Database RLS policies configured
- [x] Video upload from camera works
- [x] Video upload from gallery works
- [x] Videos appear in library
- [x] Enhanced logging implemented
- [x] Error handling improved

## Next Steps

1. Implement video playback in Library
2. Add video thumbnail generation
3. Implement voting/likes system
4. Add video moderation
5. Implement challenge submission flow
6. Add video compression for large files
7. Implement progress indicator during upload


# Video Upload Implementation Guide

## Overview
This document describes the video upload implementation using expo-image-picker and Supabase storage.

## Recent Fix (January 2025)

### Problem
Users were experiencing "Failed to select video. Please try again" errors when attempting to upload videos. The videos would not upload to Supabase storage, resulting in 400 Bad Request errors.

### Root Causes Identified
1. **Blob Conversion Issues**: The original implementation used a simple `fetch()` and `blob()` approach which didn't work reliably across all platforms (iOS, Android, Web)
2. **File Reading Strategy**: Native platforms (iOS/Android) require different file reading strategies than web
3. **Error Handling**: Generic error messages didn't help users understand what went wrong

### Solution Implemented
Created a robust multi-platform upload strategy:

1. **Platform-Specific Upload Logic**:
   - **Web**: Uses `fetch()` + `blob()` (works well on web)
   - **Native (iOS/Android)**: Uses `expo-file-system` to read files as base64, then converts to blob
   - **Fallback**: If FileSystem fails, falls back to fetch method

2. **Enhanced Error Handling**:
   - Specific error messages for common issues (permissions, file size, format)
   - Detailed console logging for debugging
   - User-friendly error alerts

3. **File Name Sanitization**:
   - Removes special characters from filenames
   - Ensures unique filenames with timestamp
   - Preserves file extension

### Code Changes

#### Key Implementation Details

```typescript
// Platform detection
if (Platform.OS === 'web') {
  // Web strategy: fetch + blob
  const response = await fetch(uri);
  const blob = await response.blob();
  // Upload blob...
} else {
  // Native strategy: FileSystem + base64
  try {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    
    // Convert base64 to blob
    const byteCharacters = atob(base64);
    const byteArray = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i);
    }
    const blob = new Blob([byteArray], { type: 'video/mp4' });
    // Upload blob...
  } catch (fsError) {
    // Fallback to fetch method
    const response = await fetch(uri);
    const blob = await response.blob();
    // Upload blob...
  }
}
```

#### Error Message Improvements

```typescript
if (uploadError.message?.includes('row-level security')) {
  throw new Error('Permission denied. Please contact support.');
} else if (uploadError.message?.includes('size')) {
  throw new Error('Video file is too large. Maximum size is 100MB.');
} else if (uploadError.message?.includes('mime')) {
  throw new Error('Invalid video format. Please use MP4, MOV, or AVI.');
}
```

### Testing Results
- ✅ Video upload from camera works on iOS
- ✅ Video upload from camera works on Android
- ✅ Video upload from gallery works on iOS
- ✅ Video upload from gallery works on Android
- ✅ Video upload works on Web
- ✅ Error messages are user-friendly
- ✅ Videos appear in library after upload
- ✅ Comprehensive logging for debugging

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
- Unique filename: `{user_id}_{timestamp}_{sanitized_filename}`
- Content type: `video/mp4`
- Public access enabled
- Platform-specific upload strategy

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
  // 1. Sanitize filename
  const uniqueFileName = `${userProfile.id}_${timestamp}_${fileName.replace(/[^a-zA-Z0-9.]/g, '_')}`;

  // 2. Platform-specific file reading
  let blob;
  if (Platform.OS === 'web') {
    const response = await fetch(uri);
    blob = await response.blob();
  } else {
    // Native: Use FileSystem
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    // Convert to blob...
  }

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
- Platform detection
- Video URI and filename
- User ID
- File info (size, exists)
- Base64 length (for native)
- Blob size and type
- Storage upload status
- Database insert status
- Error details with stack traces

### Common Issues & Solutions

1. **"Failed to select video" error**
   - **Cause**: File reading strategy not compatible with platform
   - **Solution**: Implemented platform-specific upload strategies with fallback

2. **400 Bad Request from storage**
   - **Cause**: Blob not properly formatted or RLS policies missing
   - **Solution**: Enhanced blob conversion and verified RLS policies

3. **Video doesn't appear in library**
   - **Cause**: Database insert failed or RLS policies blocking
   - **Solution**: Check database insert logs and verify RLS policies

4. **Permission errors**
   - **Cause**: Camera/media library permissions not granted
   - **Solution**: Request permissions before launching picker

5. **File size too large**
   - **Cause**: Video exceeds 100MB limit
   - **Solution**: Show user-friendly error message

## Testing Checklist

- [x] Storage bucket `challengemedia` exists
- [x] Bucket is public
- [x] Storage RLS policies configured
- [x] Database table `user_videos` exists
- [x] Database RLS policies configured
- [x] Video upload from camera works (iOS)
- [x] Video upload from camera works (Android)
- [x] Video upload from camera works (Web)
- [x] Video upload from gallery works (iOS)
- [x] Video upload from gallery works (Android)
- [x] Video upload from gallery works (Web)
- [x] Videos appear in library
- [x] Enhanced logging implemented
- [x] Error handling improved
- [x] Platform-specific strategies implemented
- [x] Fallback mechanism works
- [x] User-friendly error messages

## Dependencies

- `expo-image-picker`: For camera and gallery access
- `expo-file-system`: For native file reading (legacy version)
- `@supabase/supabase-js`: For storage and database operations

## Next Steps

1. Implement video playback in Library
2. Add video thumbnail generation
3. Implement voting/likes system
4. Add video moderation
5. Implement challenge submission flow
6. Add video compression for large files
7. Implement progress indicator during upload
8. Add retry mechanism for failed uploads

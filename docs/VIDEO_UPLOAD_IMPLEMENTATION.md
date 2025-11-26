
# Video Upload Implementation Guide

## Overview
This document describes how to implement video uploads using the Natively Upload component and Supabase storage.

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

## Natively Upload Component

### Basic Usage

```tsx
import { Upload } from 'natively'; // Import from Natively package

<Upload
  storage="challengemedia"
  accept="video/*"
  style={{
    backgroundColor: '#FFF1CB',
    padding: 16,
    borderRadius: 12
  }}
/>
```

### Theme Configuration

Add this to your `styles/commonStyles.ts`:

```typescript
export const theme = {
  colors: {
    background: '#FF8F8F',
    primary: '#FFF1CB',
    secondary: '#C2E2FA',
    accent: '#B7A3E3',
    text: '#B7A3E3',
    border: '#B7A3E3'
  }
}
```

## Supabase Storage Setup

### 1. Create Storage Bucket

The storage bucket must be named: **`challengemedia`**

### 2. Bucket Configuration

- **Public Access**: ON
- **Uploads Allowed**: YES
- **File Size Limit**: 100MB (recommended)
- **Allowed MIME Types**: 
  - `video/mp4`
  - `video/quicktime`
  - `video/x-msvideo`
  - `video/webm`

### 3. Storage Policies (RLS)

```sql
-- Allow authenticated users to upload videos
CREATE POLICY "Users can upload videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'challengemedia');

-- Allow public read access to videos
CREATE POLICY "Public can view videos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'challengemedia');

-- Allow users to delete their own videos
CREATE POLICY "Users can delete own videos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'challengemedia' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## Implementation Steps

### Step 1: Install Natively Package (if not already installed)

The Natively Upload component should be available in your Natively environment.

### Step 2: Update Record Screen

Replace the placeholder in `app/(tabs)/(home)/record.tsx`:

```tsx
import { Upload } from 'natively';

// Inside your component:
<Upload
  storage="challengemedia"
  accept="video/*"
  onUploadComplete={(url) => {
    console.log('Video uploaded:', url);
    // Handle successful upload
  }}
  onUploadError={(error) => {
    console.error('Upload error:', error);
    Alert.alert('Upload Failed', error.message);
  }}
  style={{
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12
  }}
/>
```

### Step 3: Create Video Submissions Table

```sql
CREATE TABLE video_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id UUID, -- Reference to challenges table
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration INTEGER, -- Duration in seconds
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  likes_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0
);

-- Enable RLS
ALTER TABLE video_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view all submissions"
ON video_submissions FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can create their own submissions"
ON video_submissions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own submissions"
ON video_submissions FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own submissions"
ON video_submissions FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
```

## User Account

### Demo User Credentials

- **Email**: `user@bloop.app`
- **Password**: `user1234`
- **Role**: Normal user
- **Permissions**:
  - ✅ Join challenges
  - ✅ Upload video
  - ✅ View library
  - ✅ Like / vote
  - ❌ No admin tools
  - ❌ No backend access

## Logout Button

The logout button has been added to the Library screen:

```tsx
<TouchableOpacity
  onPress={() => supabase.auth.signOut()}
  style={{
    backgroundColor: '#C2E2FA',
    padding: 14,
    borderRadius: 12,
    alignSelf: 'flex-end',
    marginBottom: 12
  }}
>
  <Text style={{ color: '#FF8F8F', fontWeight: 'bold' }}>Logout</Text>
</TouchableOpacity>
```

**Behavior**:
- Signs out the user
- Redirects to login screen
- Uses only the approved color palette

## Testing Checklist

- [ ] Storage bucket `challengemedia` exists
- [ ] Bucket is public
- [ ] Video uploads are allowed
- [ ] RLS policies are configured
- [ ] Upload component uses correct colors
- [ ] Logout button works correctly
- [ ] Demo user can log in
- [ ] Demo user can upload videos
- [ ] Videos appear in library
- [ ] Color palette is enforced everywhere

## Troubleshooting

### Upload Fails

1. Check if bucket exists: `challengemedia`
2. Verify bucket is public
3. Check RLS policies
4. Verify user is authenticated
5. Check file size limits

### Colors Not Matching

1. Verify `styles/commonStyles.ts` has correct colors
2. Check all components use `colors` from commonStyles
3. Ensure no hardcoded colors exist
4. Use the typography system for all text

### Logout Not Working

1. Check Supabase client is imported
2. Verify `supabase.auth.signOut()` is called
3. Check navigation redirects to `/auth/login`
4. Verify AuthContext updates correctly

## Next Steps

1. Implement video playback in Library
2. Add video thumbnail generation
3. Implement voting/likes system
4. Add video moderation
5. Implement challenge submission flow

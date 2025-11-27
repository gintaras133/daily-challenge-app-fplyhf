
# User Invitation System

## Overview
The user invitation system allows existing users to invite new users to the platform using Gmail addresses. This feature helps grow the user base through trusted referrals.

## Features

### For Inviters (Existing Users)
- **Send Invitations**: Invite new users by entering their Gmail address
- **Track Status**: View all sent invitations and their current status
- **Cancel Invitations**: Cancel pending invitations before they're accepted
- **Invitation History**: See when invitations were sent and accepted

### For Invitees (New Users)
- **Email Notification**: Receive an invitation email (in production)
- **Easy Signup**: Pre-filled email when following invitation link
- **Automatic Acceptance**: Invitation automatically marked as accepted upon signup

## How It Works

### 1. Sending an Invitation
1. Navigate to Settings (Profile screen)
2. Tap "Invite New User" button
3. Enter the Gmail address of the person you want to invite
4. Tap "Send Invitation"
5. The system creates an invitation record and sends an email (in production)

### 2. Invitation Statuses
- **Pending**: Invitation sent, waiting for user to sign up
- **Accepted**: User has signed up using the invited email
- **Expired**: Invitation expired after 7 days
- **Cancelled**: Inviter cancelled the invitation

### 3. Accepting an Invitation
1. Invited user receives email with signup link
2. Link opens the app with email pre-filled
3. User completes signup with password
4. System automatically marks invitation as accepted

## Database Schema

### user_invitations Table
```sql
- id: UUID (primary key)
- inviter_id: UUID (references auth.users)
- invitee_email: TEXT (email address of invitee)
- status: TEXT (pending, accepted, expired, cancelled)
- invited_at: TIMESTAMP (when invitation was sent)
- accepted_at: TIMESTAMP (when invitation was accepted)
- expires_at: TIMESTAMP (7 days from invited_at)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

## Security

### Row Level Security (RLS)
- Users can only view their own sent invitations
- Users can only create invitations with their own user ID
- Users can only update their own invitations

### Email Validation
- Only Gmail addresses are accepted
- Email format is validated before sending
- Duplicate invitations to the same email are prevented

## Edge Functions

### send-invitation
Handles sending invitation emails to new users.

**Endpoint**: `/functions/v1/send-invitation`

**Request Body**:
```json
{
  "email": "user@gmail.com",
  "invitationId": "uuid"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Invitation sent successfully",
  "signupUrl": "https://natively.dev/auth/login?email=user@gmail.com&invited=true"
}
```

## Database Functions

### expire_old_invitations()
Automatically marks pending invitations as expired if they're past their expiration date.

**Usage**: Called automatically when loading invitations list.

### handle_new_user()
Trigger function that runs when a new user signs up. Automatically:
1. Creates user profile
2. Accepts any pending invitations for the user's email

## Future Enhancements

1. **Email Integration**: Integrate with SendGrid/Mailgun for actual email sending
2. **Invitation Limits**: Limit number of invitations per user
3. **Referral Rewards**: Add rewards for successful referrals
4. **Invitation Analytics**: Track invitation conversion rates
5. **Custom Messages**: Allow inviters to add personal messages
6. **Bulk Invitations**: Send multiple invitations at once
7. **Invitation Reminders**: Send reminder emails for pending invitations

## Testing

### Test Invitation Flow
1. Sign in as an existing user
2. Go to Settings → Invite New User
3. Enter a Gmail address
4. Check that invitation appears in "My Invitations" list
5. Sign out and sign up with the invited email
6. Verify invitation status changes to "Accepted"

### Test Expiration
1. Create an invitation
2. Manually update expires_at to past date in database
3. Reload invitations list
4. Verify status changes to "Expired"

### Test Cancellation
1. Create an invitation
2. Tap "Cancel" on the invitation
3. Verify status changes to "Cancelled"

## Troubleshooting

### Invitation Not Sending
- Check that email is a valid Gmail address
- Verify user is authenticated
- Check Edge Function logs for errors

### Invitation Not Accepting
- Verify email matches exactly (case-insensitive)
- Check that invitation status is "pending"
- Verify trigger is enabled on auth.users table

### RLS Policy Issues
- Ensure user is authenticated
- Verify inviter_id matches auth.uid()
- Check Supabase logs for policy violations

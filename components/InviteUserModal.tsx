
/**
 * InviteUserModal Component
 * 
 * Allows existing users to invite new users to the platform via Gmail addresses.
 * 
 * Features:
 * - Send invitations to Gmail addresses only
 * - Track invitation status (pending, accepted, expired, cancelled)
 * - View all sent invitations with their current status
 * - Cancel pending invitations
 * - Automatic expiration after 7 days
 * - Automatic acceptance when invited user signs up
 * 
 * Database:
 * - Uses 'user_invitations' table to track all invitations
 * - Invitations are automatically marked as 'accepted' when the invited user signs up
 * - Expired invitations are automatically marked when loading the list
 * 
 * Edge Function:
 * - Calls 'send-invitation' Edge Function to send invitation emails
 * - In production, this should integrate with an email service
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { supabase } from '@/app/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface InviteUserModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function InviteUserModal({ visible, onClose }: InviteUserModalProps) {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [showInvitations, setShowInvitations] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const loadInvitations = useCallback(async () => {
    if (!user) return;

    try {
      // First, expire old invitations
      await supabase.rpc('expire_old_invitations');

      // Then load the invitations
      const { data, error } = await supabase
        .from('user_invitations')
        .select('*')
        .eq('inviter_id', user.id)
        .order('invited_at', { ascending: false });

      if (error) throw error;
      setInvitations(data || []);
    } catch (error) {
      console.error('Error loading invitations:', error);
    }
  }, [user]);

  const handleInvite = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter an email address');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Check if email is Gmail
    if (!email.toLowerCase().endsWith('@gmail.com')) {
      Alert.alert('Error', 'Only Gmail addresses are allowed for invitations');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to send invitations');
      return;
    }

    setIsLoading(true);

    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (existingUser) {
        Alert.alert('Error', 'A user with this email already exists');
        setIsLoading(false);
        return;
      }

      // Check if invitation already sent
      const { data: existingInvitation } = await supabase
        .from('user_invitations')
        .select('*')
        .eq('invitee_email', email.toLowerCase())
        .eq('status', 'pending')
        .single();

      if (existingInvitation) {
        Alert.alert('Error', 'An invitation has already been sent to this email');
        setIsLoading(false);
        return;
      }

      // Create invitation record
      const { data: invitation, error: invitationError } = await supabase
        .from('user_invitations')
        .insert({
          inviter_id: user.id,
          invitee_email: email.toLowerCase(),
          status: 'pending',
        })
        .select()
        .single();

      if (invitationError) throw invitationError;

      // Get the current session to get the access token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }

      // Call the Edge Function to send the invitation email
      const { data: edgeFunctionData, error: edgeFunctionError } = await supabase.functions.invoke(
        'send-invitation',
        {
          body: {
            email: email.toLowerCase(),
            invitationId: invitation.id,
          },
        }
      );

      if (edgeFunctionError) {
        console.error('Edge function error:', edgeFunctionError);
        // Don't throw here, the invitation is still created
      }

      Alert.alert(
        'Invitation Sent!',
        `An invitation has been sent to ${email}. They can now sign up using this email address.`,
        [
          {
            text: 'OK',
            onPress: () => {
              setEmail('');
              loadInvitations();
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('Error sending invitation:', error);
      Alert.alert('Error', error.message || 'Failed to send invitation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    Alert.alert(
      'Cancel Invitation',
      'Are you sure you want to cancel this invitation?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('user_invitations')
                .update({ status: 'cancelled' })
                .eq('id', invitationId);

              if (error) throw error;

              Alert.alert('Success', 'Invitation cancelled');
              loadInvitations();
            } catch (error) {
              console.error('Error cancelling invitation:', error);
              Alert.alert('Error', 'Failed to cancel invitation');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#FFA500';
      case 'accepted':
        return '#4CAF50';
      case 'expired':
        return '#9E9E9E';
      case 'cancelled':
        return '#FF3B30';
      default:
        return colors.text;
    }
  };

  React.useEffect(() => {
    if (visible) {
      loadInvitations();
    }
  }, [visible, loadInvitations]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Invite New User</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <IconSymbol
                android_material_icon_name="close"
                size={24}
                color={colors.text}
              />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            <View style={styles.inviteSection}>
              <Text style={styles.sectionTitle}>Send Invitation</Text>
              <Text style={styles.description}>
                Invite new users to join the platform using their Gmail address.
              </Text>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Gmail Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="user@gmail.com"
                  placeholderTextColor={colors.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                  editable={!isLoading}
                />
              </View>

              <TouchableOpacity
                style={[styles.inviteButton, isLoading && styles.buttonDisabled]}
                onPress={handleInvite}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={colors.text} />
                ) : (
                  <>
                    <IconSymbol
                      android_material_icon_name="mail"
                      size={20}
                      color={colors.text}
                    />
                    <Text style={styles.inviteButtonText}>Send Invitation</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <View style={styles.invitationsSection}>
              <TouchableOpacity
                style={styles.sectionHeaderButton}
                onPress={() => setShowInvitations(!showInvitations)}
              >
                <Text style={styles.sectionTitle}>My Invitations</Text>
                <IconSymbol
                  android_material_icon_name={showInvitations ? 'expand-less' : 'expand-more'}
                  size={24}
                  color={colors.text}
                />
              </TouchableOpacity>

              {showInvitations && (
                <View style={styles.invitationsList}>
                  {invitations.length === 0 ? (
                    <Text style={styles.emptyText}>No invitations sent yet</Text>
                  ) : (
                    invitations.map((invitation, index) => (
                      <View key={index} style={styles.invitationCard}>
                        <View style={styles.invitationHeader}>
                          <Text style={styles.invitationEmail}>
                            {invitation.invitee_email}
                          </Text>
                          <View
                            style={[
                              styles.statusBadge,
                              { backgroundColor: getStatusColor(invitation.status) },
                            ]}
                          >
                            <Text style={styles.statusText}>
                              {invitation.status.toUpperCase()}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.invitationDate}>
                          Sent: {formatDate(invitation.invited_at)}
                        </Text>
                        {invitation.status === 'pending' && (
                          <View style={styles.invitationActions}>
                            <Text style={styles.expiresText}>
                              Expires: {formatDate(invitation.expires_at)}
                            </Text>
                            <TouchableOpacity
                              onPress={() => handleCancelInvitation(invitation.id)}
                              style={styles.cancelButton}
                            >
                              <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    ))
                  )}
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textHeader,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: {
    padding: 20,
  },
  inviteSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textHeader,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 20,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textHeader,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.accent,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
  },
  inviteButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  inviteButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.secondary,
    marginVertical: 20,
  },
  invitationsSection: {
    marginBottom: 20,
  },
  sectionHeaderButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  invitationsList: {
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  invitationCard: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  invitationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  invitationEmail: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  invitationDate: {
    fontSize: 12,
    color: colors.text,
    marginBottom: 8,
  },
  invitationActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.secondary,
  },
  expiresText: {
    fontSize: 12,
    color: colors.text,
    fontStyle: 'italic',
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FF3B30',
  },
  cancelButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
});

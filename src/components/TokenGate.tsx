/**
 * Token Gate Component
 * Displays Solana Mobile Seeker holder status with visual feedback
 */

import { MaterialCommunityIcons } from '@expo/vector-icons'
import React from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import type { SeekerGenesisResult } from '../../services/seekerGenesisService'

interface TokenGateProps {
  result: SeekerGenesisResult | null
  loading?: boolean
  error?: string | null
}

export default function TokenGate({ result, loading, error }: TokenGateProps) {
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color="#74C69D" />
          <Text style={styles.loadingText}>Checking Seeker access NFT...</Text>
        </View>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={[styles.card, styles.errorCard]}>
          <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#FF5555" />
          <Text style={styles.title}>Verification Error</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    )
  }

  if (!result) {
    return null
  }

  if (result.isHolder) {
    return (
      <View style={styles.container}>
        <View style={[styles.card, styles.holderCard]}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="check-decagram" size={56} color="#74C69D" />
          </View>
          <Text style={styles.title}>🔥 Seeker Access Holder</Text>
          <Text style={styles.holderSubtitle}>Access Granted</Text>

          <View style={styles.detailsBox}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Mint:</Text>
              <Text style={styles.detailValue} numberOfLines={1} ellipsizeMode="middle">
                {result.mint.mint}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Epoch:</Text>
              <Text style={styles.detailValue}>{result.mint.epoch}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Slot:</Text>
              <Text style={styles.detailValue}>{result.mint.slot}</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={[styles.card, styles.nonHolderCard]}>
        <MaterialCommunityIcons name="lock-outline" size={48} color="#888" />
        <Text style={styles.title}>Not an Access Holder</Text>
        <Text style={styles.nonHolderText}>You need the Seeker access NFT to use this feature</Text>
        <Text style={styles.infoText}>This access NFT is exclusive to eligible Solana Mobile Seeker users</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
  },
  loadingCard: {
    backgroundColor: 'rgba(116, 198, 157, 0.05)',
    borderColor: 'rgba(116, 198, 157, 0.2)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  holderCard: {
    backgroundColor: 'rgba(116, 198, 157, 0.1)',
    borderColor: '#74C69D',
  },
  nonHolderCard: {
    backgroundColor: 'rgba(136, 136, 136, 0.05)',
    borderColor: 'rgba(136, 136, 136, 0.3)',
  },
  errorCard: {
    backgroundColor: 'rgba(255, 85, 85, 0.05)',
    borderColor: 'rgba(255, 85, 85, 0.3)',
  },
  iconContainer: {
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontFamily: 'ClashDisplay-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  holderSubtitle: {
    fontSize: 16,
    fontFamily: 'ClashDisplay-Semibold',
    color: '#74C69D',
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'ClashDisplay-Regular',
    color: '#888',
    marginTop: 12,
  },
  nonHolderText: {
    fontSize: 14,
    fontFamily: 'ClashDisplay-Regular',
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 12,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'ClashDisplay-Regular',
    color: '#FF5555',
    textAlign: 'center',
    marginTop: 8,
  },
  infoText: {
    fontSize: 12,
    fontFamily: 'ClashDisplay-Light',
    color: '#888',
    textAlign: 'center',
  },
  detailsBox: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: 'ClashDisplay-Semibold',
    color: '#888',
    marginRight: 8,
  },
  detailValue: {
    fontSize: 12,
    fontFamily: 'ClashDisplay-Regular',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'right',
  },
})

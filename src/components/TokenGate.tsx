/**
 * Token Gate Component
 * Displays Solana Mobile Seeker holder status with visual feedback
 */

import { MaterialCommunityIcons } from '@expo/vector-icons'
import React from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import BrutalistBox from './BrutalistBox'
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
        <BrutalistBox offset={6} contentStyle={styles.loadingCardContent}>
          <ActivityIndicator size="large" color="#0A0A18" />
          <Text style={styles.loadingText}>Checking Seeker access NFT...</Text>
        </BrutalistBox>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.container}>
        <BrutalistBox offset={6} contentStyle={styles.cardContent}>
          <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#0A0A18" />
          <Text style={styles.title}>Verification Error</Text>
          <Text style={styles.errorText}>{error}</Text>
        </BrutalistBox>
      </View>
    )
  }

  if (!result) {
    return null
  }

  if (result.isHolder) {
    return (
      <View style={styles.container}>
        <BrutalistBox backgroundColor="#74C69D" offset={6} contentStyle={styles.cardContent}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="check-decagram" size={56} color="#0A0A18" />
          </View>
          <Text style={styles.title}>Seeker Access Holder</Text>
          <Text style={styles.holderSubtitle}>Access Granted</Text>

          <BrutalistBox borderWidth={2} offset={4} contentStyle={styles.detailsBoxContent} style={styles.detailsBoxWrapper}>
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
          </BrutalistBox>
        </BrutalistBox>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <BrutalistBox offset={6} contentStyle={styles.cardContent}>
        <MaterialCommunityIcons name="lock-outline" size={48} color="#0A0A18" />
        <Text style={styles.title}>Not an Access Holder</Text>
        <Text style={styles.nonHolderText}>You need the Seeker access NFT to use this feature</Text>
        <Text style={styles.infoText}>This access NFT is exclusive to eligible Solana Mobile Seeker users</Text>
      </BrutalistBox>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  cardContent: {
    padding: 24,
    alignItems: 'center',
  },
  loadingCardContent: {
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontFamily: 'ClashDisplay-Bold',
    color: '#0A0A18',
    marginBottom: 8,
    textAlign: 'center',
  },
  holderSubtitle: {
    fontSize: 16,
    fontFamily: 'ClashDisplay-Bold',
    color: '#0A0A18',
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'ClashDisplay-Bold',
    color: '#0A0A18',
    marginTop: 12,
  },
  nonHolderText: {
    fontSize: 14,
    fontFamily: 'ClashDisplay-Medium',
    color: '#0A0A18',
    textAlign: 'center',
    marginBottom: 12,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'ClashDisplay-Bold',
    color: '#0A0A18',
    textAlign: 'center',
    marginTop: 8,
  },
  infoText: {
    fontSize: 12,
    fontFamily: 'ClashDisplay-Medium',
    color: '#666',
    textAlign: 'center',
  },
  detailsBoxWrapper: {
    width: '100%',
    marginTop: 8,
  },
  detailsBoxContent: {
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: 'ClashDisplay-Bold',
    color: '#0A0A18',
    marginRight: 8,
  },
  detailValue: {
    fontSize: 12,
    fontFamily: 'ClashDisplay-Medium',
    color: '#0A0A18',
    flex: 1,
    textAlign: 'right',
  },
})

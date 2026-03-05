/**
 * Dashboard Screen - Expo Router version
 */

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import solanaService from '../../services/solanaService'
import { useNfcHandshake } from '../hooks/useNfcHandshake'

export default function DashboardScreen() {
  const [refreshing, setRefreshing] = useState(false)
  const [skrState, setSkrState] = useState<any>(null)
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const { supported, enabled, handshaking, lastTagId, resetHandshake } = useNfcHandshake()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const key = solanaService.getPublicKey()
    setPublicKey(key)

    if (key) {
      try {
        const state = await solanaService.fetchSKRState(key)
        setSkrState(state)
      } catch (error) {
        console.error('Failed to load SKR state:', error)
      }
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadData()
    setRefreshing(false)
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'gold':
        return '#FFD700'
      case 'diamond_hands':
        return '#74C69D'
      case 'paper_hands':
        return '#F8D7BF'
      default:
        return '#FFFFFF'
    }
  }

  const getStatusEmoji = (status: string): string => {
    switch (status) {
      case 'gold':
        return '💎✨'
      case 'diamond_hands':
        return '💎'
      case 'paper_hands':
        return '📄'
      default:
        return '⚡'
    }
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#74C69D"
              colors={['#74C69D']}
            />
          }
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>ECHO</Text>
              <Text style={styles.subtitle}>Seeker Signal</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/settings')} hitSlop={8}>
              <Ionicons name="settings-outline" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {publicKey && (
            <View style={styles.walletCard}>
              <Text style={styles.cardLabel}>Connected Wallet</Text>
              <Text style={styles.walletAddress} numberOfLines={1}>
                {publicKey}
              </Text>
            </View>
          )}

          {skrState && (
            <View style={styles.skrCard}>
              <View style={styles.skrHeader}>
                <Text style={styles.cardTitle}>SKR Token Status</Text>
                <Text style={styles.statusEmoji}>{getStatusEmoji(skrState.status)}</Text>
              </View>

              <View style={styles.skrStats}>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Balance</Text>
                  <Text style={styles.statValue}>{skrState.balance.toFixed(2)}</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>24h Change</Text>
                  <Text style={[styles.statValue, { color: skrState.changePercentage >= 0 ? '#74C69D' : '#F8D7BF' }]}>
                    {skrState.changePercentage >= 0 ? '+' : ''}
                    {skrState.changePercentage.toFixed(2)}%
                  </Text>
                </View>
              </View>

              <View style={styles.statusBadge}>
                <View style={[styles.statusBadgeGradient, { backgroundColor: getStatusColor(skrState.status) }]}>
                  <Text style={styles.statusText}>{skrState.status.toUpperCase().replace('_', ' ')}</Text>
                </View>
              </View>
            </View>
          )}

          <View style={styles.statsGrid}>
            <View style={styles.statsCard}>
              <Text style={styles.statsNumber}>0</Text>
              <Text style={styles.statsLabel}>Handshakes</Text>
            </View>
            <View style={styles.statsCard}>
              <Text style={styles.statsNumber}>0</Text>
              <Text style={styles.statsLabel}>Events</Text>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.push('/x-banner-update')}
              activeOpacity={0.8}
            >
              <Ionicons name="image-outline" size={20} color="#74C69D" />
              <Text style={styles.secondaryButtonText}>Update Banner</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={16} color="#F8D7BF" />
            <Text style={styles.infoText}>
              Bring two Seeker devices together to start a handshake session automatically via NFC.
            </Text>
          </View>

          {supported === false && (
            <View style={styles.infoBox}>
              <Ionicons name="alert-circle-outline" size={16} color="#FF5555" />
              <Text style={styles.infoText}>This device does not support NFC handshakes.</Text>
            </View>
          )}

          {supported && !enabled && (
            <View style={styles.infoBox}>
              <Ionicons name="alert-circle-outline" size={16} color="#FFAA00" />
              <Text style={styles.infoText}>Turn on NFC in your system settings to enable handshakes.</Text>
            </View>
          )}

          {handshaking && (
            <View style={styles.handshakeModalBackdrop}>
              <View style={styles.handshakeModal}>
                <MaterialCommunityIcons name="handshake-outline" size={40} color="#74C69D" />
                <Text style={styles.handshakeTitle}>Handshake Detected</Text>
                {lastTagId && (
                  <Text style={styles.handshakeSubtitle} numberOfLines={1} ellipsizeMode="middle">
                    Tag: {lastTagId}
                  </Text>
                )}
                <Text style={styles.handshakeText}>You can now record or act on this connection.</Text>
                <TouchableOpacity style={styles.primaryButton} onPress={resetHandshake} activeOpacity={0.85}>
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a18' },
  scrollView: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontFamily: 'ClashDisplay-Bold',
    color: '#FFFFFF',
    letterSpacing: 3,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'ClashDisplay-Semibold',
    color: '#74C69D',
    letterSpacing: 2,
    marginTop: 4,
  },
  walletCard: {
    backgroundColor: 'rgba(116, 198, 157, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(116, 198, 157, 0.3)',
  },
  cardLabel: {
    fontSize: 12,
    fontFamily: 'ClashDisplay-Medium',
    color: '#FFFFFF',
    opacity: 0.6,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  walletAddress: {
    fontSize: 12,
    fontFamily: 'ClashDisplay-Regular',
    color: '#FFFFFF',
  },
  skrCard: {
    backgroundColor: 'rgba(116, 198, 157, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(116, 198, 157, 0.2)',
  },
  skrHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'ClashDisplay-Semibold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  statusEmoji: { fontSize: 24 },
  skrStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  stat: { alignItems: 'center' },
  statLabel: {
    fontSize: 12,
    fontFamily: 'ClashDisplay-Medium',
    color: '#FFFFFF',
    opacity: 0.6,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'ClashDisplay-Bold',
    color: '#FFFFFF',
  },
  statusBadge: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  statusBadgeGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    fontFamily: 'ClashDisplay-Semibold',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginBottom: 24,
    gap: 12,
  },
  statsCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statsNumber: {
    fontSize: 32,
    fontFamily: 'ClashDisplay-Bold',
    color: '#74C69D',
    marginBottom: 8,
  },
  statsLabel: {
    fontSize: 12,
    fontFamily: 'ClashDisplay-Medium',
    color: '#FFFFFF',
    opacity: 0.6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  actions: {
    marginHorizontal: 24,
    marginBottom: 24,
    gap: 12,
  },
  primaryButton: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#74C69D',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'ClashDisplay-Semibold',
    color: '#FFFFFF',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  secondaryButton: {
    backgroundColor: 'rgba(116, 198, 157, 0.1)',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(116, 198, 157, 0.3)',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: 'ClashDisplay-Semibold',
    color: '#74C69D',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: 'rgba(248, 215, 191, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(248, 215, 191, 0.3)',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'ClashDisplay-Regular',
    color: '#F8D7BF',
    lineHeight: 20,
  },
  handshakeModalBackdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  handshakeModal: {
    width: '80%',
    backgroundColor: '#12001f',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(116, 198, 157, 0.4)',
    gap: 12,
  },
  handshakeTitle: {
    fontSize: 20,
    fontFamily: 'ClashDisplay-Bold',
    color: '#FFFFFF',
  },
  handshakeSubtitle: {
    fontSize: 12,
    fontFamily: 'ClashDisplay-Regular',
    color: '#FFFFFF',
    opacity: 0.7,
  },
  handshakeText: {
    fontSize: 14,
    fontFamily: 'ClashDisplay-Regular',
    color: '#FFFFFF',
    opacity: 0.8,
    textAlign: 'center',
    marginVertical: 4,
  },
})

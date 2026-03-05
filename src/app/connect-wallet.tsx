import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import solanaService from '../../services/solanaService'
import TokenGate from '../components/TokenGate'
import { useTokenGate } from '../hooks/useTokenGate'

export default function ConnectWalletScreen() {
  const [connecting, setConnecting] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const { result, loading, error, checkHolder } = useTokenGate()

  // Auto-navigate after successful verification
  useEffect(() => {
    if (walletConnected && !loading && result?.isHolder) {
      // Small delay for better UX - user can see the success state
      const timer = setTimeout(() => {
        router.push('/device-verification')
      }, 1000)

      return () => clearTimeout(timer)
    } else if (walletConnected && !loading && result && !result.isHolder) {
      Alert.alert('Access Denied', 'You need a Seeker Genesis NFT to access this app.', [{ text: 'OK' }])
    }
  }, [walletConnected, loading, result])

  const handleConnect = async () => {
    setConnecting(true)
    try {
      const { publicKey } = await solanaService.connectWallet()
      setWalletAddress(publicKey)
      setWalletConnected(true)

      // Automatically check for Seeker Genesis NFT
      await checkHolder(publicKey)
    } catch (error) {
      console.log('====================================')
      console.log(error)
      console.log('====================================')
      console.error('Connection failed:', error)
      Alert.alert(
        'Connection Failed',
        'Failed to connect wallet. In Expo Go, demo mode is used. For full functionality, create a custom dev client.',
        [{ text: 'OK' }],
      )
    } finally {
      setConnecting(false)
    }
  }

  const handleContinue = () => {
    if (result?.isHolder) {
      router.push('/device-verification')
    } else {
      Alert.alert('Access Denied', 'You need a Seeker Genesis NFT to access this app.', [{ text: 'OK' }])
    }
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableOpacity style={styles.backRow} onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color="#74C69D" />
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.header}>
            <MaterialCommunityIcons name="wallet-outline" size={60} color="#74C69D" style={styles.walletIcon} />
            <Text style={styles.title}>{walletConnected ? 'Token Gate Verification' : 'Connect Your Wallet'}</Text>
            <Text style={styles.description}>
              {walletConnected
                ? 'Verifying Seeker Genesis NFT ownership...'
                : 'Echo requires a Solana wallet with Seeker Genesis NFT'}
            </Text>
          </View>

          {!walletConnected && (
            <>
              <View style={styles.requirements}>
                <Text style={styles.requirementsTitle}>Requirements:</Text>
                {['Solana Seeker device', 'Compatible Solana wallet', 'Seeker Genesis NFT 🔥'].map((req) => (
                  <View key={req} style={styles.requirement}>
                    <Ionicons name="checkmark" size={18} color="#74C69D" />
                    <Text style={styles.requirementText}>{req}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={[styles.button, connecting && styles.buttonDisabled]}
                onPress={handleConnect}
                disabled={connecting}
                activeOpacity={0.8}
              >
                {connecting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.buttonText}>Connect Wallet</Text>
                )}
              </TouchableOpacity>

              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  Running in Expo Go uses demo mode. For full Mobile Wallet Adapter support, create a custom dev client
                  with: npx expo run:android
                </Text>
              </View>
            </>
          )}

          {walletConnected && (
            <>
              <TokenGate result={result} loading={loading} error={error} />

              {walletAddress && (
                <View style={styles.walletInfo}>
                  <Text style={styles.walletLabel}>Connected Wallet:</Text>
                  <Text style={styles.walletAddress} numberOfLines={1} ellipsizeMode="middle">
                    {walletAddress}
                  </Text>
                </View>
              )}

              {result?.isHolder && (
                <TouchableOpacity style={styles.button} onPress={handleContinue} activeOpacity={0.8}>
                  <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a18' },
  backRow: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 4,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  walletIcon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: 'ClashDisplay-Bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    fontFamily: 'ClashDisplay-Regular',
    color: '#FFFFFF',
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  requirements: {
    backgroundColor: 'rgba(116, 198, 157, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(116, 198, 157, 0.2)',
  },
  requirementsTitle: {
    fontSize: 16,
    fontFamily: 'ClashDisplay-Semibold',
    color: '#74C69D',
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  requirementText: {
    fontSize: 16,
    fontFamily: 'ClashDisplay-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  button: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#74C69D',
    paddingVertical: 18,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: {
    fontSize: 18,
    fontFamily: 'ClashDisplay-Semibold',
    color: '#FFFFFF',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  infoBox: {
    backgroundColor: 'rgba(248, 215, 191, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(248, 215, 191, 0.3)',
  },
  infoText: {
    fontSize: 13,
    fontFamily: 'ClashDisplay-Regular',
    color: '#F8D7BF',
    lineHeight: 20,
    textAlign: 'center',
  },
  walletInfo: {
    backgroundColor: 'rgba(116, 198, 157, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(116, 198, 157, 0.3)',
  },
  walletLabel: {
    fontSize: 12,
    fontFamily: 'ClashDisplay-Semibold',
    color: '#888',
    marginBottom: 6,
  },
  walletAddress: {
    fontSize: 14,
    fontFamily: 'ClashDisplay-Regular',
    color: '#FFFFFF',
  },
})

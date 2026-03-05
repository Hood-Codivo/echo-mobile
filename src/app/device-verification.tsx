/**
 * Device Verification Screen
 */

import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import solanaService from '../../services/solanaService'

export default function DeviceVerificationScreen() {
  const [verifying, setVerifying] = useState(true)
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [publicKey, setPublicKey] = useState<string | null>(null)

  useEffect(() => {
    verifyDevice()
  }, [])

  const verifyDevice = async () => {
    const key = solanaService.getPublicKey()
    setPublicKey(key)

    if (!key) {
      setError('No wallet connected')
      setVerifying(false)
      return
    }

    setVerifying(true)
    setError(null)

    try {
      const sgt = await solanaService.verifySeekerGenesisToken(key)

      if (sgt) {
        setVerified(true)
        setTimeout(() => {
          router.replace('/dashboard')
        }, 2000)
      } else {
        setError('No Solana Mobile Seeker access NFT found in this wallet')
      }
    } catch (err) {
      console.error('Verification failed:', err)
      setError('Failed to verify device. Please try again.')
    } finally {
      setVerifying(false)
    }
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableOpacity
          style={styles.backRow}
          onPress={() => {
            if (router.canGoBack()) {
              router.back()
            } else {
              router.replace('/dashboard')
            }
          }}
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={24} color="#74C69D" />
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.statusContainer}>
            {verifying && (
              <>
                <ActivityIndicator size="large" color="#74C69D" />
                <Text style={styles.statusTitle}>Verifying Device</Text>
                <Text style={styles.statusText}>Checking for Solana Mobile Seeker access NFT...</Text>
              </>
            )}

            {!verifying && verified && (
              <>
                <Ionicons name="checkmark-circle" size={80} color="#74C69D" style={styles.statusIcon} />
                <Text style={styles.statusTitle}>Device Verified!</Text>
                <Text style={styles.statusText}>Seeker access NFT confirmed</Text>
                {publicKey && <Text style={styles.walletAddress}>{publicKey}</Text>}
              </>
            )}

            {!verifying && error && (
              <>
                <Ionicons name="close-circle" size={80} color="#F8D7BF" style={styles.statusIcon} />
                <Text style={styles.statusTitle}>Verification Failed</Text>
                <Text style={styles.errorText}>{error}</Text>
                {publicKey && <Text style={styles.walletAddress}>{publicKey}</Text>}
              </>
            )}
          </View>

          {!verifying && error && (
            <TouchableOpacity style={styles.button} onPress={verifyDevice}>
              <Text style={styles.buttonText}>Retry Verification</Text>
            </TouchableOpacity>
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
  statusContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  statusIcon: {
    marginBottom: 4,
  },
  statusTitle: {
    fontSize: 28,
    fontFamily: 'ClashDisplay-Bold',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  statusText: {
    fontSize: 16,
    fontFamily: 'ClashDisplay-Regular',
    color: '#FFFFFF',
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 20,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'ClashDisplay-Regular',
    color: '#F8D7BF',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  walletAddress: {
    fontSize: 12,
    fontFamily: 'ClashDisplay-Regular',
    color: '#FFFFFF',
    opacity: 0.5,
    textAlign: 'center',
  },
  button: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#74C69D',
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'ClashDisplay-Semibold',
    color: '#FFFFFF',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
})

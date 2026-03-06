/**
 * Banner Composer Component
 * Renders a banner with phone overlay and text that can be captured as an image
 */

import React, { forwardRef } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { type OverlayConfig } from '../../services/bannerOverlayService'

interface BannerComposerProps {
  bannerUri: string
  config: OverlayConfig
  width: number
  height: number
}

// Pre-load phone assets
const PHONE_1 = require('../assets/phone_1.png')
const PHONE_2 = require('../assets/phone_2.png')

/**
 * Component that renders the banner composition
 * Use with react-native-view-shot to capture as image
 */
export const BannerComposer = forwardRef<View, BannerComposerProps>(({ bannerUri, config, width, height }, ref) => {
  const phoneAssetModule = config.phoneAsset === 'phone_1' ? PHONE_1 : PHONE_2

  const isPhoneLeft = config.phonePosition === 'left'

  // Create dynamic styles based on banner dimensions
  const dynamicStyles = StyleSheet.create({
    container: {
      width,
      height,
      position: 'relative',
      backgroundColor: '#000',
    },
    bannerImage: {
      width,
      height,
      position: 'absolute',
      top: 0,
      left: 0,
    },
    phoneImage: {
      position: 'absolute',
      width: height * 1.4,
      height: height * 1.7,
      top: height * 0.075,
    },
    textContainer: {
      position: 'absolute',
      top: height * 0.1,
      maxWidth: width * 0.55,
      paddingHorizontal: Math.max(20, width * 0.027),
    },
    mainText: {
      fontSize: Math.max(24, height * 0.096),
      fontFamily: 'ClashDisplay-Bold',
      color: '#74C69D',
      marginBottom: Math.max(8, height * 0.032),
      lineHeight: Math.max(28, height * 0.112),
    },
    footnoteText: {
      fontSize: Math.max(12, height * 0.04),
      fontFamily: 'ClashDisplay-Bold',
      color: '#F8D7BF',
      lineHeight: Math.max(16, height * 0.052),
      textTransform: 'uppercase' as const,
    },
  })

  return (
    <View ref={ref} style={dynamicStyles.container}>
      {/* Background banner image */}
      <Image source={{ uri: bannerUri }} style={dynamicStyles.bannerImage} resizeMode="cover" />

      {/* Overlay gradient for better text visibility */}
      <View style={styles.overlay} />

      {/* Phone image */}
      <Image
        source={phoneAssetModule}
        style={[dynamicStyles.phoneImage, isPhoneLeft ? styles.phoneLeft : styles.phoneRight]}
        resizeMode="contain"
      />

      {/* Text content */}
      <View style={[dynamicStyles.textContainer, isPhoneLeft ? styles.textRight : styles.textLeft]}>
        <Text style={dynamicStyles.mainText}>{config.mainText}</Text>
        <Text style={dynamicStyles.footnoteText}>{config.footnoteText}</Text>
      </View>
    </View>
  )
})

BannerComposer.displayName = 'BannerComposer'

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
  phoneLeft: {
    left: 0,
  },
  phoneRight: {
    right: 0,
  },
  textLeft: {
    left: 0,
    alignItems: 'flex-start',
  },
  textRight: {
    right: 0,
    alignItems: 'flex-end',
  },
})

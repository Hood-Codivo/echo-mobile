import React from 'react'
import { StyleSheet, View, type ViewStyle } from 'react-native'

interface BrutalistBoxProps {
  children: React.ReactNode
  backgroundColor?: string
  offset?: number
  borderWidth?: number
  borderColor?: string
  shadowColor?: string
  style?: ViewStyle
  contentStyle?: ViewStyle
  offsetColor?: string
}

/**
 * A reusable component that implements the Neubrutalism "offset black box" shadow effect.
 * It renders a shadow box behind the main content box.
 */
export const BrutalistBox: React.FC<BrutalistBoxProps> = ({
  children,
  backgroundColor = '#FEF5E7',
  offset = 6,
  borderWidth = 3,
  borderColor = '#0A0A18',
  shadowColor = '#0A0A18',
  style,
  contentStyle,
  offsetColor = '#0A0A18',
}) => {
  return (
    <View style={[styles.container, style]}>
      {/* The Shadow Box */}
      <View
        style={[
          styles.shadow,
          {
            backgroundColor: offsetColor ? offsetColor : shadowColor,
            top: offset,
            left: offset,
          },
        ]}
      />
      {/* The Content Box */}
      <View
        style={[
          styles.content,
          {
            backgroundColor,
            borderWidth,
            borderColor,
          },
          contentStyle,
        ]}
      >
        {children}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  shadow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 0,
  },
})

export default BrutalistBox

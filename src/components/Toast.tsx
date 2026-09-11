import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useFleet } from '../store';
import { colors, fonts } from '../theme';
import { Icon } from './Icon';

export function Toast({bottom}: { bottom: number }) {
  const {toast} = useFleet();
  const lift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!toast) return;
    lift.setValue(0);
    Animated.spring(lift, {toValue: 1, useNativeDriver: false, bounciness: 8}).start();
  }, [toast, lift]);

  if (!toast) return null;

  const translateY = lift.interpolate({inputRange: [0, 1], outputRange: [24, 0]});

  return (
    <View pointerEvents="none" style={[styles.frame, {bottom}]}>
      <Animated.View accessibilityRole="alert" style={[styles.toast, toast.error && styles.error, {opacity: lift, transform: [{translateY}]}]}>
        <Icon name={toast.error ? 'close' : 'check'} size={18} color={toast.error ? colors.signal : colors.goSoft} weight={2.4}/>
        <Text style={styles.text}>{toast.text}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {position: 'absolute', left: 16, right: 16, alignItems: 'center'},
  toast: {flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.asphalt, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8, maxWidth: 400},
  error: {borderLeftWidth: 4, borderColor: colors.signal},
  text: {fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.asphaltText, flexShrink: 1},
});

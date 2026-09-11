import * as Haptics from 'expo-haptics';
import React, { useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, Platform, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import { Icon } from './Icon';

type Props = {
  label: string;
  onConfirm: () => void;
};

const KNOB = 56;
const INSET = 4;

export function SlideToConfirm({label, onConfirm}: Props) {
  const [track, setTrack] = useState(0);
  const offset = useRef(new Animated.Value(0)).current;
  const done = useRef(false);
  const travel = Math.max(track - KNOB - INSET * 2, 1);

  const buzz = () => {
    if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
  };

  const responder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => !done.current,
    onMoveShouldSetPanResponder: () => !done.current,
    onPanResponderTerminationRequest: () => false,
    onPanResponderMove: (_, gesture) => offset.setValue(Math.min(Math.max(gesture.dx, 0), travel)),
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx >= travel * 0.82) {
        done.current = true;
        buzz();
        Animated.timing(offset, {toValue: travel, duration: 120, useNativeDriver: false}).start(() => onConfirm());
        return;
      }
      if (Math.abs(gesture.dx) < 4) {
        Animated.sequence([
          Animated.timing(offset, {toValue: 26, duration: 160, useNativeDriver: false}),
          Animated.spring(offset, {toValue: 0, useNativeDriver: false, bounciness: 12}),
        ]).start();
        return;
      }
      Animated.spring(offset, {toValue: 0, useNativeDriver: false, bounciness: 6}).start();
    },
  }), [travel, offset, onConfirm]);

  const labelOpacity = offset.interpolate({inputRange: [0, travel * 0.6], outputRange: [1, 0], extrapolate: 'clamp'});
  const fill = Animated.add(offset, KNOB + INSET);

  return (
    <View
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityActions={[{name: 'activate'}]}
      onAccessibilityAction={() => onConfirm()}
      onLayout={event => setTrack(event.nativeEvent.layout.width)}
      style={styles.track}
    >
      <Animated.View style={[styles.fill, {width: fill}]}/>
      <Animated.Text style={[styles.label, {opacity: labelOpacity}]}>{label}</Animated.Text>
      <Animated.View {...responder.panHandlers} style={[styles.knob, {transform: [{translateX: offset}]}]}>
        <Icon name="arrow" size={24} color={colors.ink} weight={2.4}/>
      </Animated.View>
      <View pointerEvents="none" style={styles.chevrons}>
        <Text style={styles.chevronText}>›››</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {height: KNOB + INSET * 2, borderRadius: 8, backgroundColor: colors.asphaltRaised, justifyContent: 'center', overflow: 'hidden'},
  fill: {position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: 'rgba(255,90,31,0.28)'},
  label: {position: 'absolute', left: KNOB + 22, right: 40, fontFamily: fonts.display, fontSize: 18, letterSpacing: 1, color: colors.asphaltText, textTransform: 'uppercase'},
  knob: {position: 'absolute', left: INSET, width: KNOB, height: KNOB, borderRadius: 6, backgroundColor: colors.signal, alignItems: 'center', justifyContent: 'center'},
  chevrons: {position: 'absolute', right: 16},
  chevronText: {fontFamily: fonts.display, fontSize: 22, color: '#5C5852', letterSpacing: -2},
});

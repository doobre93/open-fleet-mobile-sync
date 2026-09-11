import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import type { DeliveryStatus, Driver } from '../domain';
import { statusLabels } from '../domain';
import { colors, fonts, monogramTints, type } from '../theme';
import { Icon } from './Icon';
import type { IconName } from './Icon';

const statusTones: Record<DeliveryStatus, { background: string; text: string; border?: string }> = {
  unassigned: {background: 'transparent', text: colors.signal, border: colors.signal},
  assigned: {background: 'transparent', text: colors.ink, border: colors.ink},
  in_transit: {background: colors.signal, text: colors.ink},
  delivered: {background: colors.goSoft, text: colors.go},
};

export function StatusTag({status, inverted = false}: { status: DeliveryStatus; inverted?: boolean }) {
  const tone = statusTones[status];
  const text = inverted && status === 'assigned' ? colors.asphaltText : tone.text;
  return (
    <View style={[styles.tag, {backgroundColor: tone.background, borderColor: inverted && status === 'assigned' ? colors.asphaltText : tone.border ?? tone.background}]}>
      <Text style={[styles.tagText, {color: text}]}>{statusLabels[status]}</Text>
    </View>
  );
}

export function Monogram({driver, size = 44}: { driver: Pick<Driver, 'id' | 'name'>; size?: number }) {
  const initials = driver.name.split(' ').map(part => part[0]).join('').slice(0, 2);
  const tint = monogramTints[driver.id.charCodeAt(0) % monogramTints.length];
  return (
    <View style={[styles.monogram, {width: size, height: size, backgroundColor: tint}]}>
      <Text style={[styles.monogramText, {fontSize: size * 0.42}]}>{initials}</Text>
    </View>
  );
}

type ButtonProps = {
  label: string;
  onPress: () => void;
  icon?: IconName;
  kind?: 'primary' | 'outline' | 'quiet';
  style?: StyleProp<ViewStyle>;
};

export function Button({label, onPress, icon, kind = 'primary', style}: ButtonProps) {
  const foreground = kind === 'primary' ? colors.card : colors.ink;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({pressed}) => [styles.button, styles[kind], pressed && styles.pressed, style]}
    >
      {icon && <Icon name={icon} size={19} color={foreground}/>}
      <Text style={[styles.buttonText, {color: foreground}]}>{label}</Text>
    </Pressable>
  );
}

export function Row({children, onPress, label}: { children: React.ReactNode; onPress?: () => void; label?: string }) {
  if (!onPress) return <View style={styles.row}>{children}</View>;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({pressed}) => [styles.row, pressed && styles.rowPressed]}>
      {children}
    </Pressable>
  );
}

export function Section({title, aside, children}: { title: string; aside?: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHead}>
        <Text style={type.caps}>{title}</Text>
        {aside && <Text style={type.mono}>{aside}</Text>}
      </View>
      {children}
    </View>
  );
}

export function Fact({label, value}: { label: string; value: string }) {
  return (
    <View style={styles.fact}>
      <Text style={type.caps}>{label}</Text>
      <Text style={type.heading}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {paddingHorizontal: 8, paddingVertical: 3, borderRadius: 3, borderWidth: 1.5, alignSelf: 'flex-start'},
  tagText: {fontFamily: fonts.displaySemi, fontSize: 13, letterSpacing: 0.8, textTransform: 'uppercase'},
  monogram: {borderRadius: 10, alignItems: 'center', justifyContent: 'center'},
  monogramText: {fontFamily: fonts.display, color: colors.ink},
  button: {minHeight: 52, borderRadius: 6, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10},
  primary: {backgroundColor: colors.ink},
  outline: {borderWidth: 1.5, borderColor: colors.ink},
  quiet: {backgroundColor: colors.paper},
  pressed: {transform: [{scale: 0.98}], opacity: 0.85},
  buttonText: {fontFamily: fonts.display, fontSize: 18, letterSpacing: 0.6, textTransform: 'uppercase'},
  row: {flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14},
  rowPressed: {opacity: 0.6},
  section: {gap: 6},
  sectionHead: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', paddingBottom: 6, borderBottomWidth: 1.5, borderColor: colors.ink},
  fact: {flex: 1, gap: 3, minWidth: 96},
});

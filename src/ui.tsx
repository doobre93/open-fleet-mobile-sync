import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { DeliveryStatus } from './domain';
import { statusLabels } from './domain';

export const palette = { navy: '#122b39', teal: '#087f75', ink: '#193340', muted: '#5d7280', line: '#dce5e9', paper: '#ffffff', canvas: '#f3f6f8' };

export function Button({ children, onPress, secondary = false, disabled = false }: { children: string; onPress: () => void; secondary?: boolean; disabled?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.button, secondary && styles.secondary, (pressed || disabled) && { opacity: 0.6 }]}><Text style={[styles.buttonText, secondary && { color: palette.ink }]}>{children}</Text></Pressable>;
}

export function Chip({ children, selected, onPress }: { children: string; selected?: boolean; onPress: () => void }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ selected }} onPress={onPress} style={[styles.chip, selected && styles.chipSelected]}><Text style={[styles.chipText, selected && { color: palette.teal }]}>{children}</Text></Pressable>;
}

export function Badge({ status }: { status: DeliveryStatus }) {
  const colors = { unassigned: ['#fff2da', '#805100'], assigned: ['#edf1ff', '#435f9d'], in_transit: ['#def3ee', '#096c5e'], delivered: ['#edf0f2', '#526473'] }[status];
  return <View style={[styles.badge, { backgroundColor: colors[0] }]}><Text style={[styles.badgeText, { color: colors[1] }]}>{statusLabels[status]}</Text></View>;
}

export function Sheet({ title, visible, onClose, children }: { title: string; visible: boolean; onClose: () => void; children: React.ReactNode }) {
  return <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}><View style={styles.overlay}><View style={styles.sheet}><View style={styles.sheetHeader}><Text accessibilityRole="header" style={styles.h2}>{title}</Text><Button secondary onPress={onClose}>Close</Button></View><ScrollView contentContainerStyle={{ padding: 24, gap: 18 }} keyboardShouldPersistTaps="handled">{children}</ScrollView></View></View></Modal>;
}

export const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.canvas },
  shell: { flex: 1, flexDirection: 'row' },
  sidebar: { width: 204, padding: 24, backgroundColor: palette.navy, gap: 28 },
  brand: { fontSize: 24, fontWeight: '700', color: palette.paper, letterSpacing: -0.6 },
  brandSub: { fontSize: 11, color: '#97b2bc', letterSpacing: 2, marginTop: 7 },
  nav: { padding: 14, borderRadius: 8 },
  navSelected: { backgroundColor: '#234755' },
  navText: { color: '#c3d4dc', fontSize: 15, fontWeight: '600' },
  sidebarNote: { marginTop: 'auto', color: '#aac0ca', fontSize: 13, lineHeight: 20 },
  main: { flex: 1, minWidth: 0 },
  page: { padding: 28, gap: 24, width: '100%', maxWidth: 1500, alignSelf: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 10 },
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 },
  eyebrow: { fontSize: 11, letterSpacing: 1.5, fontWeight: '700', color: palette.muted, marginBottom: 7 },
  h1: { fontSize: 30, lineHeight: 37, fontWeight: '700', color: palette.ink, letterSpacing: -0.8 },
  h2: { fontSize: 19, fontWeight: '700', color: palette.ink },
  h3: { fontSize: 15, fontWeight: '700', color: palette.ink },
  text: { fontSize: 14, lineHeight: 22, color: palette.ink },
  muted: { fontSize: 13, lineHeight: 20, color: palette.muted },
  demoBadge: { backgroundColor: '#e5efed', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6 },
  demoText: { color: '#27685f', fontSize: 12, fontWeight: '600' },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  stat: { flex: 1, minWidth: 100, padding: 18, backgroundColor: palette.paper, borderWidth: 1, borderColor: palette.line, borderRadius: 10, gap: 6 },
  statValue: { fontSize: 28, fontWeight: '600', color: palette.ink },
  card: { backgroundColor: palette.paper, borderRadius: 12, borderWidth: 1, borderColor: palette.line, overflow: 'hidden' },
  cardHeader: { padding: 20, gap: 16, borderBottomWidth: 1, borderColor: palette.line },
  input: { backgroundColor: '#f8fafb', borderColor: '#cddbe1', borderWidth: 1, paddingHorizontal: 13, paddingVertical: 12, borderRadius: 7, minHeight: 46, color: palette.ink, fontSize: 14 },
  order: { padding: 20, borderBottomWidth: 1, borderColor: palette.line, gap: 12 },
  orderSelected: { backgroundColor: '#eef7f5', borderLeftWidth: 3, borderLeftColor: palette.teal },
  orderTitle: { fontSize: 16, fontWeight: '600', color: palette.ink, lineHeight: 24 },
  reference: { fontSize: 12, fontWeight: '700', color: palette.muted, letterSpacing: 0.6 },
  badge: { paddingHorizontal: 9, paddingVertical: 5, borderRadius: 5, alignSelf: 'flex-start' },
  badgeText: { fontSize: 11, fontWeight: '700' },
  button: { paddingHorizontal: 16, paddingVertical: 12, minHeight: 44, borderRadius: 7, backgroundColor: palette.teal, justifyContent: 'center', alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 13, fontWeight: '600' },
  secondary: { backgroundColor: '#eef3f5', borderWidth: 1, borderColor: palette.line },
  chip: { paddingHorizontal: 12, paddingVertical: 11, borderRadius: 7, minHeight: 42, justifyContent: 'center', backgroundColor: '#f4f6f8', borderWidth: 1, borderColor: 'transparent' },
  chipSelected: { backgroundColor: '#e3f1ed', borderColor: '#acd2c8' },
  chipText: { color: palette.muted, fontSize: 12, fontWeight: '600' },
  detail: { padding: 22, gap: 22 },
  section: { gap: 10, borderTopWidth: 1, borderColor: palette.line, paddingTop: 18 },
  route: { backgroundColor: '#f4f7f8', padding: 16, borderRadius: 8, gap: 14 },
  stop: { flexDirection: 'row', gap: 12 },
  stopMark: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#dfede9' },
  label: { fontSize: 10, color: palette.muted, letterSpacing: 1, marginBottom: 4, fontWeight: '700' },
  document: { gap: 9, padding: 13, backgroundColor: '#f5f8f9', borderRadius: 7 },
  event: { borderLeftWidth: 2, borderColor: '#c6dbd4', paddingLeft: 12, paddingBottom: 8, gap: 3 },
  notice: { padding: 14, borderWidth: 1, borderColor: '#acd2c8', backgroundColor: '#e9f4ef', borderRadius: 8 },
  error: { backgroundColor: '#fff1ee', borderColor: '#e6bfb7' },
  empty: { padding: 36, alignItems: 'center', gap: 10 },
  overlay: { flex: 1, backgroundColor: 'rgba(9,27,38,0.55)', padding: 16, alignItems: 'center', justifyContent: 'center' },
  sheet: { width: '100%', maxWidth: 620, maxHeight: '94%', backgroundColor: 'white', borderRadius: 14, overflow: 'hidden' },
  sheetHeader: { padding: 20, borderBottomWidth: 1, borderColor: palette.line, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
});

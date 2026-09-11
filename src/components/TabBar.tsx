import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts } from '../theme';
import { Icon } from './Icon';
import type { IconName } from './Icon';

export type TabItem<T extends string> = { key: T; label: string; icon: IconName; badge?: number };

type Props<T extends string> = {
  tabs: TabItem<T>[];
  active: T;
  onChange: (key: T) => void;
};

export function TabBar<T extends string>({tabs, active, onChange}: Props<T>) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, {paddingBottom: Math.max(insets.bottom, 10)}]}>
      {tabs.map(tab => {
        const selected = tab.key === active;
        return (
          <Pressable
            key={tab.key}
            accessibilityRole="tab"
            aria-selected={selected}
            accessibilityLabel={tab.label}
            onPress={() => onChange(tab.key)}
            style={styles.tab}
          >
            <View style={[styles.marker, selected && styles.markerOn]}/>
            <View>
              <Icon name={tab.icon} size={24} color={selected ? colors.ink : colors.faint} weight={selected ? 2.2 : 1.8}/>
              {!!tab.badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{tab.badge}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.label, selected && styles.labelOn]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {flexDirection: 'row', backgroundColor: colors.card, borderTopWidth: 1, borderColor: colors.rule},
  tab: {flex: 1, alignItems: 'center', gap: 3, paddingTop: 0},
  marker: {width: 28, height: 3, borderBottomLeftRadius: 2, borderBottomRightRadius: 2, marginBottom: 7},
  markerOn: {backgroundColor: colors.signal},
  label: {fontFamily: fonts.bodySemi, fontSize: 11, letterSpacing: 0.6, color: colors.faint, textTransform: 'uppercase'},
  labelOn: {color: colors.ink},
  badge: {position: 'absolute', top: -5, right: -10, minWidth: 18, height: 18, borderRadius: 9, paddingHorizontal: 4, backgroundColor: colors.signal, alignItems: 'center', justifyContent: 'center'},
  badgeText: {fontFamily: fonts.display, fontSize: 12, color: colors.ink},
});

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Driver, Order } from '../domain';
import { distance, splitPlace } from '../format';
import { colors, fonts, type } from '../theme';
import { StatusTag } from './bits';
import { Icon } from './Icon';

type Props = {
  order: Order;
  driver?: Driver;
  dark?: boolean;
  label?: string;
  onPress?: () => void;
  children?: React.ReactNode;
};

export function Ticket({order, driver, dark = false, label, onPress, children}: Props) {
  const ink = dark ? colors.asphaltText : colors.ink;
  const faint = dark ? colors.asphaltFaint : colors.faint;
  const from = splitPlace(order.origin);
  const to = splitPlace(order.destination);

  const body = (
    <>
      <View style={styles.top}>
        <View style={styles.head}>
          <Text style={[type.mono, {color: faint}]}>{label ? `${label}  ·  ${order.reference}` : order.reference}</Text>
          <StatusTag status={order.status} inverted={dark}/>
        </View>
        <View style={styles.route}>
          <View style={styles.place}>
            <Text style={[type.city, {color: ink}]} numberOfLines={2}>{from.city}</Text>
            {from.country && <Text style={[type.mono, {color: faint}]}>{from.country}</Text>}
          </View>
          <View style={styles.leg}>
            <Icon name="arrow" size={20} color={dark ? colors.signal : colors.ink}/>
            <Text style={[styles.km, {color: faint}]}>{distance(order.distanceKm)}</Text>
          </View>
          <View style={[styles.place, styles.placeEnd]}>
            <Text style={[type.city, styles.end, {color: ink}]} numberOfLines={2}>{to.city}</Text>
            {to.country && <Text style={[type.mono, styles.end, {color: faint}]}>{to.country}</Text>}
          </View>
        </View>
      </View>

      <Perforation dark={dark}/>

      <View style={styles.bottom}>
        <View style={styles.slots}>
          <Slot label="Load" value={order.loadingSlot} ink={ink} faint={faint}/>
          <Slot label="Drop" value={order.unloadingSlot} ink={ink} faint={faint} end/>
        </View>
        <View style={styles.meta}>
          {driver
            ? <Text style={[type.small, {color: faint}]}>{driver.name} · {driver.plate}</Text>
            : <Text style={[type.small, styles.unassigned]}>No driver yet</Text>}
          {order.temperature && (
            <View style={styles.cold}>
              <Icon name="snow" size={13} color={colors.cold} weight={2.2}/>
              <Text style={styles.coldText}>{order.temperature}</Text>
            </View>
          )}
        </View>
        {children}
      </View>
    </>
  );

  const surface = [styles.ticket, dark && styles.dark];
  if (!onPress) return <View style={surface}>{body}</View>;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open ${order.reference}`}
      onPress={onPress}
      style={({pressed}) => [surface, pressed && styles.pressed]}
    >
      {body}
    </Pressable>
  );
}

function Slot({label, value, ink, faint, end = false}: { label: string; value: string; ink: string; faint: string; end?: boolean }) {
  return (
    <View style={[styles.slot, end && styles.placeEnd]}>
      <Text style={[type.caps, {color: faint}]}>{label}</Text>
      <Text style={[styles.slotValue, end && styles.end, {color: ink}]}>{value}</Text>
    </View>
  );
}

function Perforation({dark}: { dark: boolean }) {
  return (
    <View style={styles.perforation}>
      <View style={[styles.notch, styles.notchLeft]}/>
      <View style={styles.dashes}>
        {Array.from({length: 22}, (_, index) => (
          <View key={index} style={[styles.dash, {backgroundColor: dark ? '#46433E' : colors.rule}]}/>
        ))}
      </View>
      <View style={[styles.notch, styles.notchRight]}/>
    </View>
  );
}

const NOTCH = 18;

const styles = StyleSheet.create({
  ticket: {backgroundColor: colors.card, borderRadius: 10, overflow: 'hidden'},
  dark: {backgroundColor: colors.asphalt},
  pressed: {opacity: 0.88, transform: [{scale: 0.99}]},
  top: {paddingHorizontal: 18, paddingTop: 16, paddingBottom: 14, gap: 14},
  head: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10},
  route: {flexDirection: 'row', alignItems: 'flex-start', gap: 8},
  place: {flex: 1, gap: 2},
  placeEnd: {alignItems: 'flex-end'},
  end: {textAlign: 'right'},
  leg: {alignItems: 'center', paddingTop: 3, gap: 2},
  km: {fontFamily: fonts.mono, fontSize: 10},
  perforation: {height: NOTCH, justifyContent: 'center'},
  notch: {position: 'absolute', width: NOTCH, height: NOTCH, borderRadius: NOTCH / 2, backgroundColor: colors.paper},
  notchLeft: {left: -NOTCH / 2},
  notchRight: {right: -NOTCH / 2},
  dashes: {flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: NOTCH},
  dash: {width: 6, height: 1.5, borderRadius: 1},
  bottom: {paddingHorizontal: 18, paddingTop: 10, paddingBottom: 16, gap: 12},
  slots: {flexDirection: 'row', justifyContent: 'space-between', gap: 12},
  slot: {gap: 3},
  slotValue: {fontFamily: fonts.mono, fontSize: 13},
  meta: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10},
  unassigned: {color: colors.signal, fontFamily: fonts.bodySemi},
  cold: {flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.coldSoft, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 3},
  coldText: {fontFamily: fonts.mono, fontSize: 11, color: colors.cold},
});

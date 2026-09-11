import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Monogram, Section } from '../components/bits';
import { Icon } from '../components/Icon';
import { SlideToConfirm } from '../components/SlideToConfirm';
import { Ticket } from '../components/Ticket';
import { documentOf, visibleOrders } from '../domain';
import type { Driver, Order } from '../domain';
import { firstName, greeting, splitPlace, todayStamp } from '../format';
import { useSignedIn } from '../store';
import { colors, fonts, type } from '../theme';

type Props = {
  driver: Driver;
  topInset: number;
  onOpen: (order: Order) => void;
  onProfile: () => void;
};

export function TodayScreen({driver, topInset, onOpen, onProfile}: Props) {
  const {state, actor, perform} = useSignedIn();
  const mine = visibleOrders(state, actor);
  const current = mine.find(order => order.status === 'in_transit') ?? mine.find(order => order.status === 'assigned');
  const upcoming = mine.filter(order => order.status === 'assigned' && order !== current);
  const done = mine.filter(order => order.status === 'delivered');

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, {paddingTop: topInset + 14}]}>
      <View style={styles.top}>
        <View style={styles.hello}>
          <Text style={type.mono}>{todayStamp()}</Text>
          <Text style={type.display}>{greeting()},{'\n'}{firstName(driver.name)}</Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Profile" onPress={onProfile}>
          <Monogram driver={driver} size={46}/>
        </Pressable>
      </View>

      {current ? (
        <View style={styles.hero}>
          <Ticket
            order={current}
            driver={driver}
            dark
            label={current.status === 'in_transit' ? 'Now' : 'Next'}
          >
            <SlideToConfirm
              key={`${current.id}-${current.status}`}
              label={current.status === 'in_transit' ? 'Slide when delivered' : 'Slide to start journey'}
              onConfirm={() => perform({type: 'advance', orderId: current.id})}
            />
          </Ticket>
          <Pressable accessibilityRole="button" onPress={() => onOpen(current)} style={styles.link}>
            <Text style={styles.linkText}>Journey details</Text>
            <Icon name="forward" size={18}/>
          </Pressable>
        </View>
      ) : (
        <View style={styles.empty}>
          <Icon name="road" size={34} color={colors.faint}/>
          <Text style={type.heading}>Nothing on the road</Text>
          <Text style={type.small}>New journeys from dispatch show up here.</Text>
        </View>
      )}

      {upcoming.length > 0 && (
        <Section title="Coming up" aside={String(upcoming.length)}>
          <View style={styles.stack}>
            {upcoming.map(order => <Ticket key={order.id} order={order} driver={driver} onPress={() => onOpen(order)}/>)}
          </View>
        </Section>
      )}

      {done.length > 0 && (
        <Section title="Delivered" aside={String(done.length)}>
          {done.map(order => {
            const cmr = documentOf(order, 'cmr');
            return (
              <Pressable
                key={order.id}
                accessibilityRole="button"
                accessibilityLabel={`Open ${order.reference}`}
                onPress={() => onOpen(order)}
                style={({pressed}) => [styles.doneRow, pressed && styles.pressed]}
              >
                <View style={styles.doneText}>
                  <Text style={type.heading}>{splitPlace(order.origin).city} → {splitPlace(order.destination).city}</Text>
                  <Text style={type.mono}>{order.reference}</Text>
                </View>
                <Text style={[styles.cmrState, !cmr && styles.cmrMissing]}>
                  {!cmr ? 'Scan CMR' : cmr.verified ? 'CMR ok' : 'CMR sent'}
                </Text>
              </Pressable>
            );
          })}
        </Section>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1},
  content: {paddingHorizontal: 18, paddingBottom: 110, gap: 26},
  top: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'},
  hello: {gap: 6, flex: 1},
  hero: {gap: 4},
  link: {flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 4, paddingVertical: 10},
  linkText: {fontFamily: fonts.bodySemi, fontSize: 14, color: colors.ink},
  empty: {alignItems: 'center', gap: 6, paddingVertical: 42, borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.rule, borderRadius: 10},
  stack: {gap: 12, paddingTop: 8},
  doneRow: {flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderColor: colors.rule},
  pressed: {opacity: 0.6},
  doneText: {flex: 1, gap: 2},
  cmrState: {fontFamily: fonts.displaySemi, fontSize: 15, textTransform: 'uppercase', letterSpacing: 0.6, color: colors.go},
  cmrMissing: {color: colors.signal},
});

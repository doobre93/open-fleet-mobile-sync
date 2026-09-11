import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Row, Section } from '../components/bits';
import { Icon } from '../components/Icon';
import { documentOf, driverOf, visibleOrders } from '../domain';
import type { Order } from '../domain';
import { splitPlace } from '../format';
import { useSignedIn } from '../store';
import { colors, type } from '../theme';

type Props = {
  topInset: number;
  onOpen: (order: Order) => void;
};

export function DocumentsScreen({topInset, onOpen}: Props) {
  const {state, actor} = useSignedIn();
  const orders = visibleOrders(state, actor);
  const dispatcher = actor.role === 'dispatcher';
  const waiting = orders.filter(order => documentOf(order, 'cmr')?.verified === false);
  const missing = orders.filter(order => order.status === 'delivered' && !documentOf(order, 'cmr'));
  const approved = orders.filter(order => documentOf(order, 'cmr')?.verified === true);
  const groups = dispatcher
    ? [
      {title: 'To review', orders: waiting, note: 'Waiting for your approval'},
      {title: 'Not scanned yet', orders: missing, note: 'Driver has not sent a CMR'},
      {title: 'Approved', orders: approved, note: 'Approved'},
    ]
    : [
      {title: 'Scan now', orders: missing, note: 'Delivered — CMR missing'},
      {title: 'Sent to dispatch', orders: waiting, note: 'Waiting for approval'},
      {title: 'Approved', orders: approved, note: 'Approved by dispatch'},
    ];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, {paddingTop: topInset + 14}]}>
      <Text style={type.display}>Paperwork</Text>

      {groups.every(group => group.orders.length === 0) && (
        <Text style={type.small}>No CMRs yet. They appear here once a delivery is confirmed.</Text>
      )}

      {groups.map((group, index) => group.orders.length > 0 && (
        <Section key={group.title} title={group.title} aside={String(group.orders.length)}>
          {group.orders.map(order => (
            <Row key={order.id} label={`Open ${order.reference}`} onPress={() => onOpen(order)}>
              <View style={[styles.icon, index === 0 && styles.iconHot]}>
                <Icon name="doc" size={20} color={index === 0 ? colors.ink : colors.inkSoft}/>
              </View>
              <View style={styles.grow}>
                <Text style={type.heading}>{splitPlace(order.origin).city} → {splitPlace(order.destination).city}</Text>
                <Text style={type.mono}>
                  {order.reference}{dispatcher ? ` · ${driverOf(state, order)?.name ?? '—'}` : ''}
                </Text>
                <Text style={type.small}>{group.note}</Text>
              </View>
              <Icon name="forward" size={18} color={colors.faint}/>
            </Row>
          ))}
        </Section>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1},
  content: {paddingHorizontal: 18, paddingBottom: 110, gap: 24},
  grow: {flex: 1, gap: 1},
  icon: {width: 42, height: 42, borderRadius: 8, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center'},
  iconHot: {backgroundColor: colors.signal},
});

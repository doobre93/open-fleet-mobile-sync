import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Fact, Monogram, Row, Section, StatusTag } from '../components/bits';
import { BottomSheet } from '../components/BottomSheet';
import { DocumentSheet } from '../components/DocumentSheet';
import { Icon } from '../components/Icon';
import { SlideToConfirm } from '../components/SlideToConfirm';
import { documentOf, driverOf } from '../domain';
import type { DocumentKind, Order } from '../domain';
import { cargoParts, distance, splitPlace } from '../format';
import { useSignedIn } from '../store';
import { colors, fonts, type } from '../theme';

type Props = {
  order: Order;
  topInset: number;
  onBack: () => void;
};

const factLabels = ['Load', 'Goods', 'Weight'];

export function JourneyScreen({order, topInset, onBack}: Props) {
  const {state, actor, perform} = useSignedIn();
  const [picking, setPicking] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [viewing, setViewing] = useState<DocumentKind | null>(null);
  const driver = driverOf(state, order);
  const dispatcher = actor.role === 'dispatcher';
  const canAssign = dispatcher && (order.status === 'unassigned' || order.status === 'assigned');
  const cmr = documentOf(order, 'cmr');
  const reeferLog = documentOf(order, 'temperature');
  const from = splitPlace(order.origin);
  const to = splitPlace(order.destination);

  return (
    <View style={styles.screen}>
      <View style={[styles.bar, {paddingTop: topInset + 8}]}>
        <Pressable accessibilityRole="button" accessibilityLabel="Back" hitSlop={10} onPress={onBack} style={styles.back}>
          <Icon name="back"/>
        </Pressable>
        <Text style={type.mono}>{order.reference}</Text>
        <StatusTag status={order.status}/>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={type.display}>{from.city}{'\n'}<Text style={styles.to}>→ {to.city}</Text></Text>

        <View style={styles.stops}>
          <Stop mark="A" label="Pick up" place={order.origin} slot={order.loadingSlot}/>
          <View style={styles.legLine}>
            <View style={styles.dots}/>
            <Text style={type.mono}>{distance(order.distanceKm)}</Text>
          </View>
          <Stop mark="B" label="Drop off" place={order.destination} slot={order.unloadingSlot}/>
        </View>

        <View style={styles.facts}>
          {cargoParts(order.cargo).map((part, index) => (
            <Fact key={index} label={factLabels[index] ?? 'Note'} value={part}/>
          ))}
        </View>

        {order.temperature && (
          <View style={styles.cold}>
            <Icon name="snow" size={20} color={colors.cold}/>
            <Text style={styles.coldText}>Keep between {order.temperature}</Text>
          </View>
        )}

        <Section title="Driver & truck">
          {driver ? (
            <Row>
              <Monogram driver={driver}/>
              <View style={styles.grow}>
                <Text style={type.heading}>{driver.name}</Text>
                <Text style={type.small}>{driver.truck}</Text>
                <Text style={type.mono}>{driver.plate}</Text>
              </View>
              {canAssign && <Button kind="quiet" label="Change" onPress={() => setPicking(true)}/>}
            </Row>
          ) : (
            <Row>
              <View style={styles.grow}>
                <Text style={[type.heading, styles.signal]}>No driver yet</Text>
                <Text style={type.small}>Pick someone before the loading slot.</Text>
              </View>
              {canAssign && <Button label="Assign" onPress={() => setPicking(true)}/>}
            </Row>
          )}
        </Section>

        {(order.status === 'assigned' || order.status === 'in_transit') && (
          <SlideToConfirm
            key={order.status}
            label={order.status === 'assigned' ? 'Slide to start journey' : 'Slide when delivered'}
            onConfirm={() => perform({type: 'advance', orderId: order.id})}
          />
        )}

        <Section title="Documents">
          {cmr ? (
            <Row label="View CMR" onPress={() => setViewing('cmr')}>
              <Icon name="doc"/>
              <View style={styles.grow}>
                <Text style={type.heading}>CMR</Text>
                <Text style={[type.small, cmr.verified && styles.ok]}>{cmr.verified ? 'Approved by dispatch' : 'Waiting for dispatch'}</Text>
              </View>
              <Icon name="forward" size={18} color={colors.faint}/>
            </Row>
          ) : (
            <Row>
              <Icon name="doc" color={colors.faint}/>
              <View style={styles.grow}>
                <Text style={type.heading}>CMR</Text>
                <Text style={type.small}>{order.status === 'delivered' ? 'Missing — scan the signed copy' : 'Scan after unloading'}</Text>
              </View>
              {!dispatcher && <Button kind="outline" icon="camera" label="Scan" onPress={() => setScanning(true)}/>}
            </Row>
          )}

          {order.temperature && (reeferLog ? (
            <Row label="View reefer log" onPress={() => setViewing('temperature')}>
              <Icon name="snow" color={colors.cold}/>
              <View style={styles.grow}>
                <Text style={type.heading}>Reefer log</Text>
                <Text style={type.small}>Attached</Text>
              </View>
              <Icon name="forward" size={18} color={colors.faint}/>
            </Row>
          ) : (
            <Row>
              <Icon name="snow" color={colors.faint}/>
              <View style={styles.grow}>
                <Text style={type.heading}>Reefer log</Text>
                <Text style={type.small}>Needed for chilled loads</Text>
              </View>
              {!dispatcher && <Button kind="outline" label="Attach" onPress={() => perform({type: 'attach', orderId: order.id, kind: 'temperature'})}/>}
            </Row>
          ))}

          {dispatcher && cmr && !cmr.verified && (
            <Button icon="check" label="Approve CMR" onPress={() => perform({type: 'verify', orderId: order.id})} style={styles.approve}/>
          )}
        </Section>

        <Section title="Log">
          {order.events.map((event, index) => (
            <View key={`${event.time}-${index}`} style={styles.event}>
              <Text style={[type.mono, styles.eventTime]}>{event.time.replace('Today ', '')}</Text>
              <View style={[styles.eventDot, index === 0 && styles.eventDotFresh]}/>
              <Text style={[type.body, styles.grow]}>{event.title}</Text>
            </View>
          ))}
        </Section>
      </ScrollView>

      <BottomSheet visible={picking} title="Assign driver" onClose={() => setPicking(false)}>
        {state.drivers.map(item => {
          const open = state.orders.filter(other => other.driverId === item.id && other.status !== 'delivered').length;
          const selected = item.id === order.driverId;
          return (
            <Row
              key={item.id}
              label={`Assign ${item.name}`}
              onPress={() => {
                perform({type: 'assign', orderId: order.id, driverId: item.id});
                setPicking(false);
              }}
            >
              <Monogram driver={item} size={40}/>
              <View style={styles.grow}>
                <Text style={type.heading}>{item.name}</Text>
                <Text style={type.mono}>{item.plate} · {open} open</Text>
              </View>
              {selected && <Icon name="check" color={colors.go}/>}
            </Row>
          );
        })}
        {order.driverId !== null && (
          <Button
            kind="quiet"
            label="Remove driver"
            onPress={() => {
              perform({type: 'assign', orderId: order.id, driverId: null});
              setPicking(false);
            }}
          />
        )}
      </BottomSheet>

      <BottomSheet visible={scanning} title="Scan CMR" onClose={() => setScanning(false)}>
        <View style={styles.viewfinder}>
          <View style={[styles.corner, styles.cornerTL]}/>
          <View style={[styles.corner, styles.cornerTR]}/>
          <View style={[styles.corner, styles.cornerBL]}/>
          <View style={[styles.corner, styles.cornerBR]}/>
          <Text style={styles.viewfinderText}>Lay the signed copy flat{'\n'}and fit it inside the frame</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Capture"
          onPress={() => {
            perform({type: 'attach', orderId: order.id, kind: 'cmr'});
            setScanning(false);
          }}
          style={({pressed}) => [styles.shutter, pressed && styles.shutterPressed]}
        >
          <View style={styles.shutterInner}/>
        </Pressable>
        <Text style={[type.small, styles.center]}>The camera is simulated in this build.</Text>
      </BottomSheet>

      <DocumentSheet order={order} driver={driver} kind={viewing} onClose={() => setViewing(null)}/>
    </View>
  );
}

function Stop({mark, label, place, slot}: { mark: string; label: string; place: string; slot: string }) {
  const [, day = slot, hours = ''] = slot.match(/^(.*?)\s(\d{2}:\d{2}.*)$/) ?? [];
  return (
    <View style={styles.stop}>
      <View style={styles.mark}>
        <Text style={styles.markText}>{mark}</Text>
      </View>
      <View style={styles.grow}>
        <Text style={type.caps}>{label}</Text>
        <Text style={type.heading}>{place}</Text>
      </View>
      <View style={styles.slot}>
        <Text style={type.caps}>{day}</Text>
        {!!hours && <Text style={type.mono}>{hours}</Text>}
      </View>
    </View>
  );
}

const CORNER = 26;

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.paper},
  bar: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingBottom: 8},
  back: {width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center'},
  content: {paddingHorizontal: 18, paddingTop: 10, paddingBottom: 40, gap: 24},
  to: {color: colors.signal},
  stops: {backgroundColor: colors.card, borderRadius: 10, padding: 16},
  stop: {flexDirection: 'row', alignItems: 'center', gap: 12},
  mark: {width: 30, height: 30, borderRadius: 4, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center'},
  markText: {fontFamily: fonts.display, fontSize: 17, color: colors.card},
  slot: {alignItems: 'flex-end', gap: 2},
  legLine: {flexDirection: 'row', alignItems: 'center', gap: 22, paddingLeft: 14, height: 34},
  dots: {width: 2, height: '100%', borderLeftWidth: 2, borderStyle: 'dotted', borderColor: colors.faint},
  facts: {flexDirection: 'row', flexWrap: 'wrap', gap: 14},
  cold: {flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.coldSoft, padding: 12, borderRadius: 8},
  coldText: {fontFamily: fonts.bodySemi, fontSize: 15, color: colors.cold},
  grow: {flex: 1, gap: 2},
  signal: {color: colors.signal},
  ok: {color: colors.go},
  approve: {marginTop: 8},
  event: {flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8},
  eventTime: {width: 74},
  eventDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: colors.rule},
  eventDotFresh: {backgroundColor: colors.signal},
  viewfinder: {height: 260, borderRadius: 10, backgroundColor: colors.asphalt, alignItems: 'center', justifyContent: 'center'},
  viewfinderText: {fontFamily: fonts.bodyMedium, fontSize: 14, lineHeight: 20, color: colors.asphaltFaint, textAlign: 'center'},
  corner: {position: 'absolute', width: CORNER, height: CORNER, borderColor: colors.signal},
  cornerTL: {top: 22, left: 22, borderTopWidth: 3, borderLeftWidth: 3},
  cornerTR: {top: 22, right: 22, borderTopWidth: 3, borderRightWidth: 3},
  cornerBL: {bottom: 22, left: 22, borderBottomWidth: 3, borderLeftWidth: 3},
  cornerBR: {bottom: 22, right: 22, borderBottomWidth: 3, borderRightWidth: 3},
  shutter: {alignSelf: 'center', width: 72, height: 72, borderRadius: 36, borderWidth: 4, borderColor: colors.ink, alignItems: 'center', justifyContent: 'center'},
  shutterPressed: {transform: [{scale: 0.94}]},
  shutterInner: {width: 54, height: 54, borderRadius: 27, backgroundColor: colors.signal},
  center: {textAlign: 'center'},
});

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { DocumentKind, Driver, Order } from '../domain';
import { cargoParts } from '../format';
import { colors, fonts, type } from '../theme';
import { BottomSheet } from './BottomSheet';

type Props = {
  order: Order;
  driver?: Driver;
  kind: DocumentKind | null;
  onClose: () => void;
};

export function DocumentSheet({order, driver, kind, onClose}: Props) {
  return (
    <BottomSheet visible={kind !== null} title={kind === 'temperature' ? 'Reefer log' : 'CMR'} onClose={onClose}>
      {kind === 'temperature' ? <ReeferLog order={order} driver={driver}/> : <Consignment order={order} driver={driver}/>}
    </BottomSheet>
  );
}

function Consignment({order, driver}: { order: Order; driver?: Driver }) {
  const [packages = order.cargo, goods = '', weight = ''] = cargoParts(order.cargo);

  return (
    <View style={styles.paper}>
      <View style={styles.header}>
        <Text style={styles.cmr}>CMR</Text>
        <View style={styles.headerText}>
          <Text style={styles.formTitle}>International consignment note</Text>
          <Text style={type.mono}>No. {order.reference}</Text>
        </View>
      </View>
      <View style={styles.grid}>
        <Box n="1" label="Sender" value={order.customer}/>
        <Box n="2" label="Consignee" value="Receiving warehouse"/>
        <Box n="3" label="Place of delivery" value={order.destination}/>
        <Box n="4" label="Place & date of taking over" value={`${order.origin}\n${order.loadingSlot}`}/>
        <Box n="7" label="Packages" value={packages} third/>
        <Box n="9" label="Nature of goods" value={goods || '—'} third/>
        <Box n="11" label="Gross weight" value={weight || '—'} third/>
        <Box n="16" label="Carrier" value={driver ? `Lendago fleet\n${driver.plate}` : 'Lendago fleet'}/>
        <Box n="18" label="Carrier's reservations" value="None"/>
        <Box n="22" label="Sender" value="" third sign/>
        <Box n="23" label="Carrier" value="" third sign/>
        <Box n="24" label="Consignee" value="" third sign/>
      </View>
      <View pointerEvents="none" style={styles.watermark}>
        <Text style={styles.watermarkText}>Specimen</Text>
      </View>
    </View>
  );
}

function ReeferLog({order, driver}: { order: Order; driver?: Driver }) {
  return (
    <View style={[styles.paper, styles.log]}>
      <Text style={type.mono}>{order.reference} · {driver?.plate ?? 'no unit'}</Text>
      <View style={styles.band}>
        <Text style={type.caps}>Set range</Text>
        <Text style={styles.range}>{order.temperature}</Text>
      </View>
      <Text style={type.small}>Readings are pulled from the reefer unit once telematics are connected. This build has no unit attached.</Text>
      <View pointerEvents="none" style={styles.watermark}>
        <Text style={styles.watermarkText}>Specimen</Text>
      </View>
    </View>
  );
}

function Box({n, label, value, third = false, sign = false}: { n: string; label: string; value: string; third?: boolean; sign?: boolean }) {
  return (
    <View style={[styles.box, third && styles.third, sign && styles.sign]}>
      <Text style={styles.boxLabel}><Text style={styles.boxNumber}>{n}  </Text>{label}</Text>
      {!!value && <Text style={styles.boxValue}>{value}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  paper: {backgroundColor: '#FBF7EE', borderWidth: 1.5, borderColor: '#B8412A', padding: 12, overflow: 'hidden'},
  header: {flexDirection: 'row', alignItems: 'center', gap: 12, paddingBottom: 10},
  cmr: {fontFamily: fonts.display, fontSize: 40, lineHeight: 42, color: '#B8412A'},
  headerText: {flex: 1, gap: 2},
  formTitle: {fontFamily: fonts.bodySemi, fontSize: 13, color: colors.ink},
  grid: {flexDirection: 'row', flexWrap: 'wrap', borderTopWidth: 1, borderLeftWidth: 1, borderColor: '#D9A79B'},
  box: {width: '50%', minHeight: 58, padding: 6, gap: 3, borderRightWidth: 1, borderBottomWidth: 1, borderColor: '#D9A79B'},
  third: {width: '33.333%'},
  sign: {minHeight: 64},
  boxLabel: {fontFamily: fonts.body, fontSize: 9.5, color: '#9A5A4B', textTransform: 'uppercase', letterSpacing: 0.4},
  boxNumber: {fontFamily: fonts.mono, color: '#B8412A'},
  boxValue: {fontFamily: fonts.mono, fontSize: 11.5, lineHeight: 15, color: colors.ink},
  watermark: {...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center'},
  watermarkText: {fontFamily: fonts.display, fontSize: 64, color: 'rgba(184,65,42,0.12)', textTransform: 'uppercase', letterSpacing: 6, transform: [{rotate: '-24deg'}]},
  log: {gap: 12, borderColor: colors.cold},
  band: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.coldSoft, padding: 12},
  range: {fontFamily: fonts.display, fontSize: 26, color: colors.cold},
});

import React, { useState } from 'react';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Monogram, Row, Section } from '../components/bits';
import { BottomSheet } from '../components/BottomSheet';
import { Icon } from '../components/Icon';
import { useSignedIn } from '../store';
import { colors, fonts, type } from '../theme';

export function AccountScreen({topInset}: { topInset: number }) {
  const {state, actor, signOut, reset} = useSignedIn();
  const [confirmReset, setConfirmReset] = useState(false);
  const driver = actor.role === 'driver' ? state.drivers.find(item => item.id === actor.driverId) : undefined;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, {paddingTop: topInset + 14}]}>
      <Text style={type.display}>Profile</Text>

      <View style={styles.card}>
        {driver ? <Monogram driver={driver} size={56}/> : (
          <View style={styles.office}>
            <Icon name="board" size={26} color={colors.signal}/>
          </View>
        )}
        <View style={styles.grow}>
          <Text style={type.title}>{driver?.name ?? 'Dispatch office'}</Text>
          <Text style={type.mono}>{driver ? `${driver.truck} · ${driver.plate}` : 'Lendago fleet · 3 trucks'}</Text>
        </View>
      </View>

      <Section title="This device">
        <Row label="Switch profile" onPress={signOut}>
          <Icon name="swap"/>
          <Text style={[type.body, styles.grow]}>Switch profile</Text>
          <Icon name="forward" size={18} color={colors.faint}/>
        </Row>
        <Row label="Reset demo data" onPress={() => setConfirmReset(true)}>
          <Icon name="road"/>
          <Text style={[type.body, styles.grow]}>Reset demo data</Text>
          <Icon name="forward" size={18} color={colors.faint}/>
        </Row>
      </Section>

      <Section title="About">
        <Text style={[type.body, styles.about]}>
          Open Fleet is a standalone demo of the driver and dispatch workflow we run at Lendago. Drivers, trucks and
          orders here are invented, and changes stay on this device until you reload.
        </Text>
        <Text style={[type.body, styles.about]}>
          Next on the roadmap: an offline queue for patchy coverage, safe retries and a small open sync server.
        </Text>
        <Row label="lendago.ro" onPress={() => Linking.openURL('https://lendago.ro/')}>
          <Text style={[styles.link, styles.grow]}>lendago.ro</Text>
          <Icon name="forward" size={18} color={colors.faint}/>
        </Row>
      </Section>

      <Text style={[type.mono, styles.version]}>open-fleet 0.2.0</Text>

      <BottomSheet visible={confirmReset} title="Reset demo?" onClose={() => setConfirmReset(false)}>
        <Text style={type.body}>Orders, assignments and scanned documents go back to how they were at the start.</Text>
        <Button
          label="Reset"
          onPress={() => {
            reset();
            setConfirmReset(false);
          }}
        />
      </BottomSheet>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1},
  content: {paddingHorizontal: 18, paddingBottom: 110, gap: 26},
  card: {flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.card, borderRadius: 10, padding: 16},
  office: {width: 56, height: 56, borderRadius: 10, backgroundColor: colors.asphalt, alignItems: 'center', justifyContent: 'center'},
  grow: {flex: 1, gap: 3},
  about: {color: colors.inkSoft, paddingTop: 8},
  link: {fontFamily: fonts.bodySemi, fontSize: 15, color: colors.ink, textDecorationLine: 'underline'},
  version: {textAlign: 'center', color: colors.faint},
});

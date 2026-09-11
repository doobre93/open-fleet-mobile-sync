import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Monogram } from '../components/bits';
import { Icon } from '../components/Icon';
import { useFleet } from '../store';
import { colors, fonts, type } from '../theme';

export function WelcomeScreen() {
  const {state, signIn} = useFleet();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, {paddingTop: insets.top + 36, paddingBottom: insets.bottom + 24}]}>
      <View style={styles.brand}>
        <View style={styles.mark}>
          {[0, 1, 2].map(index => <View key={index} style={styles.markLane}/>)}
        </View>
        <View>
          <Text style={styles.wordmark}>Open Fleet</Text>
          <Text style={[type.mono, styles.faint]}>driver app · v0.2</Text>
        </View>
      </View>

      <Text style={styles.question}>Who's{'\n'}driving today?</Text>

      <View style={styles.list}>
        {state.drivers.map(driver => {
          const open = state.orders.filter(order => order.driverId === driver.id && order.status !== 'delivered').length;
          return (
            <Pressable
              key={driver.id}
              accessibilityRole="button"
              accessibilityLabel={`Sign in as ${driver.name}`}
              onPress={() => signIn({role: 'driver', driverId: driver.id})}
              style={({pressed}) => [styles.profile, pressed && styles.pressed]}
            >
              <Monogram driver={driver}/>
              <View style={styles.profileText}>
                <Text style={styles.name}>{driver.name}</Text>
                <Text style={[type.mono, styles.faint]}>{driver.plate} · {open} open</Text>
              </View>
              <Icon name="forward" color={colors.asphaltFaint}/>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Sign in as dispatch"
        onPress={() => signIn({role: 'dispatcher'})}
        style={({pressed}) => [styles.dispatch, pressed && styles.pressed]}
      >
        <Icon name="board" color={colors.signal}/>
        <View style={styles.profileText}>
          <Text style={styles.name}>Dispatch office</Text>
          <Text style={[type.mono, styles.faint]}>assign · review CMR</Text>
        </View>
        <Icon name="forward" color={colors.asphaltFaint}/>
      </Pressable>

      <Text style={[type.small, styles.footnote]}>
        Demo build. The fleet, drivers and orders are made up and nothing leaves this device.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.asphalt},
  content: {flexGrow: 1, paddingHorizontal: 22, gap: 28},
  brand: {flexDirection: 'row', alignItems: 'center', gap: 12},
  mark: {width: 40, height: 40, borderRadius: 8, backgroundColor: colors.signal, alignItems: 'center', justifyContent: 'center', gap: 4, transform: [{rotate: '-8deg'}]},
  markLane: {width: 5, height: 7, borderRadius: 1.5, backgroundColor: colors.asphalt},
  wordmark: {fontFamily: fonts.display, fontSize: 26, lineHeight: 28, color: colors.asphaltText, textTransform: 'uppercase', letterSpacing: 0.6},
  faint: {color: colors.asphaltFaint},
  question: {fontFamily: fonts.display, fontSize: 46, lineHeight: 46, color: colors.asphaltText, textTransform: 'uppercase', marginTop: 12},
  list: {gap: 2},
  profile: {flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, borderBottomWidth: 1, borderColor: colors.asphaltRaised},
  pressed: {opacity: 0.6},
  profileText: {flex: 1, gap: 2},
  name: {fontFamily: fonts.bodySemi, fontSize: 18, color: colors.asphaltText},
  dispatch: {flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: 10, borderWidth: 1.5, borderColor: '#3A3733'},
  footnote: {color: colors.asphaltFaint, marginTop: 'auto'},
});

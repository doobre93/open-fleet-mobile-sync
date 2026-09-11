import { Barlow_400Regular } from '@expo-google-fonts/barlow/400Regular';
import { Barlow_500Medium } from '@expo-google-fonts/barlow/500Medium';
import { Barlow_600SemiBold } from '@expo-google-fonts/barlow/600SemiBold';
import { BarlowCondensed_600SemiBold } from '@expo-google-fonts/barlow-condensed/600SemiBold';
import { BarlowCondensed_700Bold } from '@expo-google-fonts/barlow-condensed/700Bold';
import { IBMPlexMono_500Medium } from '@expo-google-fonts/ibm-plex-mono/500Medium';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { BackHandler, StyleSheet, View, useWindowDimensions } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { TabBar } from './src/components/TabBar';
import type { TabItem } from './src/components/TabBar';
import { Toast } from './src/components/Toast';
import { awaitingCmrReview, documentOf, visibleOrders } from './src/domain';
import type { Actor, FleetState } from './src/domain';
import { AccountScreen } from './src/screens/AccountScreen';
import { BoardScreen } from './src/screens/BoardScreen';
import { DocumentsScreen } from './src/screens/DocumentsScreen';
import { JourneyScreen } from './src/screens/JourneyScreen';
import { TodayScreen } from './src/screens/TodayScreen';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { FleetProvider, useFleet } from './src/store';
import { colors } from './src/theme';

type Tab = 'today' | 'board' | 'documents' | 'account';

export default function App() {
  const [loaded] = useFonts({
    Barlow_400Regular,
    Barlow_500Medium,
    Barlow_600SemiBold,
    BarlowCondensed_600SemiBold,
    BarlowCondensed_700Bold,
    IBMPlexMono_500Medium,
  });

  return (
    <SafeAreaProvider>
      <FleetProvider>
        <PhoneFrame>{loaded ? <Shell/> : <View style={styles.splash}/>}</PhoneFrame>
      </FleetProvider>
    </SafeAreaProvider>
  );
}

function PhoneFrame({children}: { children: React.ReactNode }) {
  const {width} = useWindowDimensions();
  if (width <= 560) return <View style={styles.fill}>{children}</View>;
  return (
    <View style={styles.desk}>
      <View style={styles.column}>{children}</View>
    </View>
  );
}

function Shell() {
  const {actor} = useFleet();

  if (!actor) {
    return (
      <View style={styles.fill}>
        <StatusBar style="light"/>
        <WelcomeScreen/>
      </View>
    );
  }
  return <Workspace key={actor.role === 'driver' ? actor.driverId : 'dispatch'} actor={actor}/>;
}

function Workspace({actor}: { actor: Actor }) {
  const {state} = useFleet();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>(actor.role === 'dispatcher' ? 'board' : 'today');
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (!openId) return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      setOpenId(null);
      return true;
    });
    return () => subscription.remove();
  }, [openId]);

  const open = openId ? state.orders.find(order => order.id === openId) : undefined;
  const openOrder = (order: { id: string }) => setOpenId(order.id);
  const driver = actor.role === 'driver' ? state.drivers.find(item => item.id === actor.driverId) : undefined;

  return (
    <View style={styles.app}>
      <StatusBar style="dark"/>
      {open ? (
        <JourneyScreen order={open} topInset={insets.top} onBack={() => setOpenId(null)}/>
      ) : (
        <>
          <View style={styles.fill}>
            {tab === 'today' && driver && (
              <TodayScreen driver={driver} topInset={insets.top} onOpen={openOrder} onProfile={() => setTab('account')}/>
            )}
            {tab === 'board' && <BoardScreen topInset={insets.top} onOpen={openOrder}/>}
            {tab === 'documents' && <DocumentsScreen topInset={insets.top} onOpen={openOrder}/>}
            {tab === 'account' && <AccountScreen topInset={insets.top}/>}
          </View>
          <TabBar tabs={tabsFor(actor, state)} active={tab} onChange={setTab}/>
        </>
      )}
      <Toast bottom={open ? insets.bottom + 24 : insets.bottom + 86}/>
    </View>
  );
}

function tabsFor(actor: Actor, state: FleetState): TabItem<Tab>[] {
  const orders = visibleOrders(state, actor);
  if (actor.role === 'dispatcher') {
    return [
      {key: 'board', label: 'Board', icon: 'board', badge: orders.filter(order => order.status === 'unassigned').length},
      {key: 'documents', label: 'CMR', icon: 'doc', badge: awaitingCmrReview(orders)},
      {key: 'account', label: 'Profile', icon: 'user'},
    ];
  }
  return [
    {key: 'today', label: 'Today', icon: 'truck'},
    {key: 'documents', label: 'CMR', icon: 'doc', badge: orders.filter(order => order.status === 'delivered' && !documentOf(order, 'cmr')).length},
    {key: 'account', label: 'Profile', icon: 'user'},
  ];
}

const styles = StyleSheet.create({
  fill: {flex: 1},
  splash: {flex: 1, backgroundColor: colors.asphalt},
  app: {flex: 1, backgroundColor: colors.paper},
  desk: {flex: 1, backgroundColor: colors.backdrop, alignItems: 'center'},
  column: {flex: 1, width: '100%', maxWidth: 430, backgroundColor: colors.paper, shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 30},
});

import React, { useState } from 'react';
import { Linking, Pressable, ScrollView, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { applyAction, statusLabels, visibleOrders } from './src/domain';
import type { Actor, DeliveryStatus, DocumentKind, FleetAction, Order } from './src/domain';
import { createDemoState } from './src/fixtures';
import { Badge, Button, Chip, Sheet, palette, styles as s } from './src/ui';

type Page = 'Orders' | 'Drivers' | 'Project';

export default function App() {
  const { width } = useWindowDimensions();
  const wide = width >= 1050;
  const [state, setState] = useState(createDemoState);
  const [actor, setActor] = useState<Actor>({ role: 'dispatcher' });
  const [page, setPage] = useState<Page>('Orders');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<DeliveryStatus | 'all'>('all');
  const [selectedId, setSelectedId] = useState<string | null>('1001');
  const [detailOpen, setDetailOpen] = useState(false);
  const [newOrder, setNewOrder] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [sample, setSample] = useState<{ order: Order; kind: DocumentKind } | null>(null);
  const [form, setForm] = useState({ origin: '', destination: '', cargo: '' });
  const [notice, setNotice] = useState<{ text: string; error?: boolean } | null>(null);
  const accessible = visibleOrders(state, actor);
  const filtered = accessible.filter(order => (filter === 'all' || order.status === filter) &&
    [order.reference, order.origin, order.destination, order.customer, state.drivers.find(driver => driver.id === order.driverId)?.name ?? ''].join(' ').toLowerCase().includes(query.toLowerCase().trim()));
  const selected = accessible.find(order => order.id === selectedId) ?? filtered[0];
  const pendingCmr = accessible.filter(order => order.documents.some(document => document.kind === 'cmr' && !document.verified)).length;

  function act(action: FleetAction): boolean {
    try {
      const time = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' }).format(new Date());
      setState(applyAction(state, action, actor, `This session · ${time}`));
      setNotice({ text: 'Demo updated. Changes stay in this session.' });
      return true;
    } catch (error) {
      setNotice({ text: error instanceof Error ? error.message : 'The action could not be completed.', error: true });
      return false;
    }
  }

  function changeActor(next: Actor) {
    setActor(next); setPage('Orders'); setSelectedId(null); setFilter('all'); setQuery(''); setDetailOpen(false); setNotice(null);
  }

  function details(order: Order) {
    const driver = state.drivers.find(item => item.id === order.driverId);
    const cmr = order.documents.find(document => document.kind === 'cmr');
    return <View style={s.detail}>
      <View style={s.between}><Text style={s.reference}>{order.reference}</Text><Badge status={order.status} /></View>
      <Text style={s.h2}>Journey details</Text>
      <View style={s.route}>{([{ location: order.origin, slot: order.loadingSlot, label: 'LOADING', mark: 'A' }, { location: order.destination, slot: order.unloadingSlot, label: 'DELIVERY', mark: 'B' }]).map(stop => <View key={stop.mark} style={s.stop}><View style={s.stopMark}><Text style={{ color: palette.teal, fontWeight: '700' }}>{stop.mark}</Text></View><View style={{ flex: 1 }}><Text style={s.label}>{stop.label}</Text><Text style={s.h3}>{stop.location}</Text><Text style={s.muted}>{stop.slot}</Text></View></View>)}</View>
      <View><Text style={s.label}>CARGO</Text><Text style={s.text}>{order.cargo}</Text>{order.temperature && <Text style={s.muted}>Required temperature: {order.temperature}</Text>}</View>
      <View style={s.section}><Text style={s.h3}>Driver & vehicle</Text><Text style={s.text}>{driver ? `${driver.name} · ${driver.vehicle}` : 'Waiting for driver assignment'}</Text>
        {actor.role === 'dispatcher' && ['unassigned', 'assigned'].includes(order.status) && <View style={s.row}>{state.drivers.map(item => <Chip key={item.id} selected={item.id === order.driverId} onPress={() => act({ type: 'assign', orderId: order.id, driverId: item.id })}>{item.name}</Chip>)}{order.driverId && <Chip onPress={() => act({ type: 'assign', orderId: order.id, driverId: null })}>Unassign</Chip>}</View>}
        {(order.status === 'assigned' || order.status === 'in_transit') && <Button onPress={() => act({ type: 'advance', orderId: order.id })}>{order.status === 'assigned' ? 'Start journey' : 'Mark as delivered'}</Button>}
      </View>
      <View style={s.section}><View style={s.between}><Text style={s.h3}>Transport documents</Text><Text style={s.muted}>{order.documents.length} attached</Text></View>
        {order.documents.length === 0 && <Text style={s.muted}>No sample documents attached yet.</Text>}
        {order.documents.map(document => <View key={document.kind} style={s.document}><View style={s.between}><Text style={s.h3}>{document.kind === 'cmr' ? 'CMR sample' : 'Temperature report sample'}</Text><Text style={s.muted}>{document.verified ? 'Reviewed' : 'Not reviewed'}</Text></View><Button secondary onPress={() => setSample({ order, kind: document.kind })}>View sample</Button></View>)}
        <View style={s.row}>{!cmr && <Button secondary onPress={() => act({ type: 'attach', orderId: order.id, kind: 'cmr' })}>Add sample CMR</Button>}{order.temperature && !order.documents.some(document => document.kind === 'temperature') && <Button secondary onPress={() => act({ type: 'attach', orderId: order.id, kind: 'temperature' })}>Add sample temperature report</Button>}{actor.role === 'dispatcher' && cmr && !cmr.verified && <Button secondary onPress={() => act({ type: 'verify', orderId: order.id })}>Mark CMR as reviewed</Button>}</View>
      </View>
      <View style={s.section}><Text style={s.h3}>Activity</Text>{order.events.map((event, index) => <View key={`${event.time}-${index}`} style={s.event}><Text style={s.text}>{event.title}</Text><Text style={s.muted}>{event.time}</Text></View>)}</View>
    </View>;
  }

  return <View style={s.root}><View style={s.shell}>
    {width >= 800 && <View style={s.sidebar}><View><Text style={s.brand}>Open Fleet</Text><Text style={s.brandSub}>BY LENDAGO</Text></View><View style={{ gap: 8 }}>{(['Orders', 'Drivers', 'Project'] as Page[]).map(item => <Pressable key={item} accessibilityRole="button" accessibilityState={{ selected: page === item }} onPress={() => setPage(item)} style={[s.nav, page === item && s.navSelected]}><Text style={s.navText}>{item}</Text></Pressable>)}</View><Text style={s.sidebarNote}>Workflow demonstrator{ '\n' }Version 0.1{ '\n\n' }Fictional records.{ '\n' }No fleet connection.</Text></View>}
    <ScrollView style={s.main} contentContainerStyle={[s.page, width < 600 && { padding: 16, gap: 16 }]} keyboardShouldPersistTaps="handled">
      <View style={s.between}><View><Text style={s.eyebrow}>{width < 800 ? 'OPEN FLEET / LENDAGO' : 'TRANSPORT OPERATIONS'}</Text><Text accessibilityRole="header" style={s.h1}>{page === 'Orders' ? (actor.role === 'driver' ? 'My journeys' : 'Order board') : page === 'Drivers' ? 'Drivers & assignments' : 'About this project'}</Text></View><View style={s.demoBadge}><Text style={s.demoText}>DEMO · SAMPLE DATA</Text></View></View>
      {width < 800 && <View style={s.row}>{(['Orders', 'Drivers', 'Project'] as Page[]).map(item => <Chip key={item} selected={page === item} onPress={() => setPage(item)}>{item}</Chip>)}</View>}
      <View style={s.between}><View style={s.row}><Text style={s.muted}>Explore as</Text><Chip selected={actor.role === 'dispatcher'} onPress={() => changeActor({ role: 'dispatcher' })}>Dispatcher</Chip><Chip selected={actor.role === 'driver'} onPress={() => changeActor({ role: 'driver', driverId: 'a' })}>Driver</Chip></View><Button secondary onPress={() => setResetOpen(true)}>{width < 600 ? 'Reset' : 'Reset demo'}</Button></View>
      {actor.role === 'driver' && <View style={s.row}>{state.drivers.map(driver => <Chip key={driver.id} selected={actor.driverId === driver.id} onPress={() => changeActor({ role: 'driver', driverId: driver.id })}>{driver.name}</Chip>)}</View>}
      {notice && <View accessibilityRole="alert" style={[s.notice, notice.error && s.error]}><View style={s.between}><Text style={[s.text, { flex: 1 }]}>{notice.text}</Text><Pressable accessibilityRole="button" accessibilityLabel="Dismiss message" onPress={() => setNotice(null)}><Text style={s.h3}>×</Text></Pressable></View></View>}
      {page === 'Orders' && <>
        <View style={s.stats}>{[{ label: width < 600 ? 'Orders' : 'Visible orders', value: accessible.length }, { label: 'In transit', value: accessible.filter(order => order.status === 'in_transit').length }, { label: width < 600 ? 'CMR review' : 'CMR awaiting review', value: pendingCmr }].map(stat => <View key={stat.label} style={[s.stat, width < 600 && { padding: 12, minWidth: 85 }]}><Text style={s.muted}>{stat.label}</Text><Text style={s.statValue}>{stat.value.toString().padStart(2, '0')}</Text></View>)}</View>
        <View style={{ flexDirection: wide ? 'row' : 'column', gap: 20, alignItems: 'flex-start' }}><View style={[s.card, { flex: wide ? 1.15 : undefined, width: wide ? undefined : '100%', minWidth: 0 }]}><View style={s.cardHeader}><View style={s.between}><Text style={s.h2}>Transport orders</Text>{actor.role === 'dispatcher' && <Button onPress={() => { setForm({ origin: '', destination: '', cargo: '' }); setNewOrder(true); setNotice(null); }}>+ New order</Button>}</View><TextInput accessibilityLabel="Search orders" placeholder="Search route, reference or driver" value={query} onChangeText={setQuery} style={s.input} /><View style={s.row}>{(['all', 'unassigned', 'assigned', 'in_transit', 'delivered'] as const).map(value => <Chip key={value} selected={filter === value} onPress={() => setFilter(value)}>{value === 'all' ? 'All orders' : statusLabels[value]}</Chip>)}</View></View>
          {filtered.length === 0 && <View style={s.empty}><Text style={s.h3}>No matching orders</Text><Text style={s.muted}>Try another route or clear the filters.</Text><Button secondary onPress={() => { setFilter('all'); setQuery(''); }}>Clear filters</Button></View>}
          {filtered.map(order => <Pressable key={order.id} accessibilityRole="button" accessibilityLabel={`Open ${order.reference}`} onPress={() => { setSelectedId(order.id); setDetailOpen(true); }} style={({ pressed }) => [s.order, wide && selected?.id === order.id && s.orderSelected, pressed && { opacity: 0.7 }]}><View style={s.between}><Text style={s.reference}>{order.reference}</Text><Badge status={order.status} /></View><Text style={s.orderTitle}>{order.origin} → {order.destination}</Text><Text style={s.muted}>{order.cargo}</Text><View style={s.between}><Text style={s.muted}>{state.drivers.find(driver => driver.id === order.driverId)?.name ?? 'Assign a driver'}</Text><Text style={s.muted}>{order.documents.some(document => document.kind === 'cmr') ? 'CMR attached' : 'CMR pending'} →</Text></View></Pressable>)}<View style={{ padding: 16 }}><Text style={s.muted}>{filtered.length} of {accessible.length} orders · Session-only changes</Text></View></View>
          {wide && selected && <View style={[s.card, { flex: 1, minWidth: 0 }]}>{details(selected)}</View>}
        </View>
      </>}
      {page === 'Drivers' && <View style={{ gap: 16 }}><Text style={s.muted}>Sample driver profiles. Select a driver to explore their assigned journeys.</Text>{state.drivers.map(driver => <View key={driver.id} style={[s.card, { padding: 22, gap: 16 }]}><View style={s.between}><View><Text style={s.h2}>{driver.name}</Text><Text style={s.muted}>{driver.vehicle}</Text></View><Text style={s.text}>{state.orders.filter(order => order.driverId === driver.id && order.status !== 'delivered').length} active journeys</Text><Button secondary onPress={() => changeActor({ role: 'driver', driverId: driver.id })}>View driver workspace</Button></View></View>)}</View>}
      {page === 'Project' && <View style={[s.card, { padding: 26, gap: 22 }]}><Text style={s.h2}>Open Fleet Mobile Sync</Text><Text style={s.text}>A small, standalone demonstrator of transport orders, driver assignment and document handover. The workflows are informed by the existing VALIMARTRANS application. This is a new implementation with fictional records, not a connection to a customer fleet.</Text><View style={s.section}><Text style={s.h3}>Available in this demo</Text><Text style={s.text}>Create and find orders; assign a driver; start and complete a journey; attach sample transport documents; review a CMR; inspect the activity history. Switch roles to explore both sides of the workflow.</Text></View><View style={s.section}><Text style={s.h3}>Proposed development</Text><Text style={s.text}>Persistent offline queues, retry and duplicate handling, conflict review, real file transfer and an independently usable reference server. These capabilities are not implemented here and funding has not been awarded.</Text></View><View style={s.section}><Text style={s.h3}>Demo boundaries</Text><Text style={s.text}>All changes stay in memory and disappear on reload or reset. Role selection is a demonstration control, not authentication. Sample document previews are not legal transport records. There are no accounts, uploads, analytics or production API calls.</Text></View><Button secondary onPress={() => Linking.openURL('https://lendago.ro/')}>About Lendago</Button></View>}
      <Text style={s.muted}>Fictional records for demonstration. Reloading the app restores the sample dataset.</Text>
    </ScrollView>
  </View>
    <Sheet visible={!wide && detailOpen && !!selected} title={selected?.reference ?? 'Order'} onClose={() => setDetailOpen(false)}>{selected && details(selected)}</Sheet>
    <Sheet visible={newOrder} title="New demo order" onClose={() => setNewOrder(false)}><Text style={s.muted}>Use sample route and cargo information only.</Text>{(['origin', 'destination', 'cargo'] as const).map(field => <View key={field} style={{ gap: 6 }}><Text style={s.h3}>{field === 'origin' ? 'Loading location' : field === 'destination' ? 'Delivery location' : 'Cargo description'}</Text><TextInput accessibilityLabel={field === 'origin' ? 'Loading location' : field === 'destination' ? 'Delivery location' : 'Cargo description'} maxLength={120} value={form[field]} onChangeText={value => setForm({ ...form, [field]: value })} style={s.input} /></View>)}{notice?.error && <Text accessibilityRole="alert" style={s.text}>{notice.text}</Text>}<Button onPress={() => { if (act({ type: 'create', ...form })) { setNewOrder(false); setFilter('all'); setQuery(''); setSelectedId(null); } }}>Create demo order</Button></Sheet>
    <Sheet visible={resetOpen} title="Reset this demo?" onClose={() => setResetOpen(false)}><Text style={s.text}>Your session changes will be removed and the five sample orders restored.</Text><Button onPress={() => { setState(createDemoState()); changeActor({ role: 'dispatcher' }); setResetOpen(false); setNotice({ text: 'Demo restored to its starting state.' }); }}>Restore sample data</Button></Sheet>
    <Sheet visible={!!sample} title={sample?.kind === 'cmr' ? 'CMR sample preview' : 'Temperature report sample'} onClose={() => setSample(null)}>{sample && <><View style={s.demoBadge}><Text style={s.demoText}>DEMONSTRATION ONLY · NOT A TRANSPORT RECORD</Text></View><Text style={s.h2}>{sample.order.reference}</Text><Text style={s.text}>{sample.order.origin} → {sample.order.destination}</Text><Text style={s.text}>{sample.order.cargo}</Text>{sample.kind === 'temperature' && <Text style={s.text}>Requested range: {sample.order.temperature}{'\n'}Measured temperatures: not collected.</Text>}<Text style={s.muted}>This preview contains fictional route information. No customer document, signature or real measurement is included. It illustrates the document review step.</Text></>}</Sheet>
  </View>;
}

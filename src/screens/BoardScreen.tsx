import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button } from '../components/bits';
import { BottomSheet } from '../components/BottomSheet';
import { Icon } from '../components/Icon';
import { Ticket } from '../components/Ticket';
import { driverOf, filterOrders, statusFilters, statusLabels } from '../domain';
import type { Order, StatusFilter } from '../domain';
import { todayStamp } from '../format';
import { useSignedIn } from '../store';
import { colors, fonts, type } from '../theme';

type Props = {
  topInset: number;
  onOpen: (order: Order) => void;
};

export function BoardScreen({topInset, onOpen}: Props) {
  const {state} = useSignedIn();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [creating, setCreating] = useState(false);
  const orders = filterOrders(state, state.orders, query, filter);
  const count = (status: StatusFilter) => status === 'all' ? state.orders.length : state.orders.filter(order => order.status === status).length;

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={[styles.content, {paddingTop: topInset + 14}]} keyboardShouldPersistTaps="handled">
        <View style={styles.top}>
          <View style={styles.grow}>
            <Text style={type.mono}>{todayStamp()}</Text>
            <Text style={type.display}>Dispatch</Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="New order" onPress={() => setCreating(true)} style={styles.add}>
            <Icon name="plus" color={colors.card} weight={2.4}/>
          </Pressable>
        </View>

        <View style={styles.search}>
          <Icon name="search" size={19} color={colors.faint}/>
          <TextInput
            accessibilityLabel="Search orders"
            placeholder="City, reference, driver"
            placeholderTextColor={colors.faint}
            value={query}
            onChangeText={setQuery}
            style={styles.input}
          />
          {query.length > 0 && (
            <Pressable accessibilityRole="button" accessibilityLabel="Clear search" onPress={() => setQuery('')} hitSlop={10}>
              <Icon name="close" size={17} color={colors.faint}/>
            </Pressable>
          )}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {statusFilters.map(value => {
            const selected = value === filter;
            return (
              <Pressable
                key={value}
                accessibilityRole="button"
                aria-selected={selected}
                onPress={() => setFilter(value)}
                style={[styles.filter, selected && styles.filterOn]}
              >
                <Text style={[styles.filterText, selected && styles.filterTextOn]}>
                  {value === 'all' ? 'All' : statusLabels[value]}
                </Text>
                <Text style={[styles.filterCount, selected && styles.filterTextOn]}>{count(value)}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {orders.length === 0 ? (
          <View style={styles.empty}>
            <Text style={type.heading}>Nothing matches</Text>
            <Button
              kind="quiet"
              label="Clear filters"
              onPress={() => {
                setQuery('');
                setFilter('all');
              }}
            />
          </View>
        ) : (
          <View style={styles.list}>
            {orders.map(order => (
              <Ticket key={order.id} order={order} driver={driverOf(state, order)} onPress={() => onOpen(order)}/>
            ))}
          </View>
        )}
      </ScrollView>

      {creating && (
        <NewOrderSheet
          onClose={() => setCreating(false)}
          onCreated={() => {
            setCreating(false);
            setFilter('all');
            setQuery('');
          }}
        />
      )}
    </View>
  );
}

const fields = [
  {key: 'origin', label: 'Pick up', placeholder: 'Iași, RO'},
  {key: 'destination', label: 'Drop off', placeholder: 'Chișinău, MD'},
  {key: 'cargo', label: 'Load', placeholder: '10 pallets · furniture · 4,000 kg'},
] as const;

function NewOrderSheet({onClose, onCreated}: { onClose: () => void; onCreated: () => void }) {
  const {perform} = useSignedIn();
  const [values, setValues] = useState({origin: '', destination: '', cargo: ''});
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    const failure = perform({type: 'create', ...values});
    if (failure) setError(failure);
    else onCreated();
  };

  return (
    <BottomSheet visible title="New order" onClose={onClose}>
      {fields.map(field => (
        <View key={field.key} style={styles.field}>
          <Text style={type.caps}>{field.label}</Text>
          <TextInput
            accessibilityLabel={field.label}
            placeholder={field.placeholder}
            placeholderTextColor={colors.rule}
            maxLength={120}
            value={values[field.key]}
            onChangeText={value => setValues(current => ({...current, [field.key]: value}))}
            style={styles.fieldInput}
          />
        </View>
      ))}
      {error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
      <Button label="Create order" onPress={submit}/>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1},
  content: {paddingHorizontal: 18, paddingBottom: 110, gap: 16},
  top: {flexDirection: 'row', alignItems: 'flex-end', gap: 12},
  grow: {flex: 1, gap: 6},
  add: {width: 52, height: 52, borderRadius: 26, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center'},
  search: {flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.card, borderRadius: 8, paddingHorizontal: 14, height: 48},
  input: {flex: 1, fontFamily: fonts.body, fontSize: 16, color: colors.ink, height: '100%'},
  filters: {gap: 8, paddingRight: 18},
  filter: {flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, height: 38, borderRadius: 19, borderWidth: 1.5, borderColor: colors.rule},
  filterOn: {backgroundColor: colors.ink, borderColor: colors.ink},
  filterText: {fontFamily: fonts.bodySemi, fontSize: 14, color: colors.inkSoft},
  filterCount: {fontFamily: fonts.mono, fontSize: 12, color: colors.faint},
  filterTextOn: {color: colors.card},
  list: {gap: 12},
  empty: {alignItems: 'center', gap: 12, paddingVertical: 40},
  field: {gap: 6},
  fieldInput: {fontFamily: fonts.bodyMedium, fontSize: 18, color: colors.ink, borderBottomWidth: 1.5, borderColor: colors.ink, paddingVertical: 8},
  error: {fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.signal},
});

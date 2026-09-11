import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, type } from '../theme';
import { Icon } from './Icon';

type Props = {
  title: string;
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export function BottomSheet({title, visible, onClose, children}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.frame}>
        <Pressable accessibilityLabel="Dismiss" style={styles.scrim} onPress={onClose}/>
        <View style={[styles.sheet, {paddingBottom: insets.bottom + 20}]}>
          <View style={styles.grabber}/>
          <View style={styles.head}>
            <Text accessibilityRole="header" style={type.title}>{title}</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Close" hitSlop={12} onPress={onClose} style={styles.close}>
              <Icon name="close" size={20}/>
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  frame: {flex: 1, justifyContent: 'flex-end', alignItems: 'center'},
  scrim: {...StyleSheet.absoluteFill, backgroundColor: 'rgba(22,21,19,0.45)'},
  sheet: {width: '100%', maxWidth: 430, maxHeight: '88%', backgroundColor: colors.card, borderTopLeftRadius: 18, borderTopRightRadius: 18},
  grabber: {alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: colors.rule, marginTop: 10},
  head: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 14, paddingBottom: 8},
  close: {width: 36, height: 36, borderRadius: 18, backgroundColor: colors.paper, alignItems: 'center', justifyContent: 'center'},
  body: {paddingHorizontal: 20, paddingTop: 8, gap: 14},
});

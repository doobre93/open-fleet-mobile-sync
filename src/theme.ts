import { StyleSheet } from 'react-native';

export const colors = {
  paper: '#F2EEE5',
  card: '#FFFCF6',
  ink: '#161513',
  inkSoft: '#4F4B44',
  faint: '#8A857A',
  rule: '#DAD3C4',
  asphalt: '#1B1A18',
  asphaltRaised: '#2A2825',
  asphaltText: '#EDE8DD',
  asphaltFaint: '#9A948A',
  signal: '#FF5A1F',
  signalSoft: '#FFE2D3',
  go: '#2F6B46',
  goSoft: '#DCEBDD',
  cold: '#2A64C9',
  coldSoft: '#DEE7F7',
  backdrop: '#CFC8BA',
};

export const fonts = {
  display: 'BarlowCondensed_700Bold',
  displaySemi: 'BarlowCondensed_600SemiBold',
  body: 'Barlow_400Regular',
  bodyMedium: 'Barlow_500Medium',
  bodySemi: 'Barlow_600SemiBold',
  mono: 'IBMPlexMono_500Medium',
};

export const monogramTints = ['#E9C46A', '#8FB8A8', '#D8A48F', '#A7B4D6'];

export const type = StyleSheet.create({
  display: {fontFamily: fonts.display, fontSize: 40, lineHeight: 42, color: colors.ink, textTransform: 'uppercase', letterSpacing: 0.2},
  title: {fontFamily: fonts.display, fontSize: 26, lineHeight: 28, color: colors.ink, textTransform: 'uppercase', letterSpacing: 0.3},
  city: {fontFamily: fonts.display, fontSize: 24, lineHeight: 26, color: colors.ink, textTransform: 'uppercase'},
  heading: {fontFamily: fonts.bodySemi, fontSize: 17, lineHeight: 22, color: colors.ink},
  body: {fontFamily: fonts.body, fontSize: 15, lineHeight: 21, color: colors.ink},
  small: {fontFamily: fonts.body, fontSize: 13, lineHeight: 18, color: colors.inkSoft},
  caps: {fontFamily: fonts.bodySemi, fontSize: 11, lineHeight: 14, letterSpacing: 1.4, textTransform: 'uppercase', color: colors.faint},
  mono: {fontFamily: fonts.mono, fontSize: 12, lineHeight: 16, letterSpacing: 0.4, color: colors.inkSoft},
});

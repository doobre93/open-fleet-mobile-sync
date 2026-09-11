import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import { colors } from '../theme';

const glyphs = {
  back: <Path d="M15 5l-7 7 7 7"/>,
  forward: <Path d="M9 5l7 7-7 7"/>,
  close: <Path d="M6 6l12 12M18 6L6 18"/>,
  plus: <Path d="M12 5v14M5 12h14"/>,
  check: <Path d="M5 12.5l4.5 4.5L19 7"/>,
  arrow: <Path d="M4 12h15M13 6l6 6-6 6"/>,
  road: <Path d="M8 3L5 21M16 3l3 18M12 4v3M12 11v3M12 18v2"/>,
  board: <Path d="M4 6h16M4 12h16M4 18h9"/>,
  doc: <Path d="M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5"/>,
  user: (
    <>
      <Circle cx={12} cy={8} r={3.5}/>
      <Path d="M5 20c1.4-3.6 3.9-5.2 7-5.2s5.6 1.6 7 5.2"/>
    </>
  ),
  truck: (
    <>
      <Path d="M2.5 6.5h11.5v9.5H2.5zM14 10h4l3 3.2v2.8h-7"/>
      <Circle cx={6.5} cy={17.5} r={1.8}/>
      <Circle cx={17.5} cy={17.5} r={1.8}/>
    </>
  ),
  camera: (
    <>
      <Path d="M4 8h3.2l1.8-2.6h6L16.8 8H20v11H4z"/>
      <Circle cx={12} cy={13.2} r={3.4}/>
    </>
  ),
  snow: <Path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M9.5 4.5L12 7l2.5-2.5M9.5 19.5L12 17l2.5 2.5"/>,
  search: (
    <>
      <Circle cx={10.5} cy={10.5} r={6}/>
      <Path d="M15 15l5 5"/>
    </>
  ),
  swap: <Path d="M7 4L3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7"/>,
};

export type IconName = keyof typeof glyphs;

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  weight?: number;
};

export function Icon({name, size = 22, color = colors.ink, weight = 1.9}: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={weight} strokeLinecap="round" strokeLinejoin="round">
      {glyphs[name]}
    </Svg>
  );
}

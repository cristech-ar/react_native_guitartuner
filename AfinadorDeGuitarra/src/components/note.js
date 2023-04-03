
import React from 'react';
import { Path } from 'react-native-svg';

const Note = ({ note }) => {
  const notePosition = {
    C: 6,
    D: 5,
    E: 4,
    F: 3,
    G: 2,
    A: 1,
    B: 0,
  }[note[0]];
  const noteColor = note.endsWith('#') ? '#000' : '#777';
  const noteHead = `M50,${30 - notePosition * 4}a20,20 0 1,0 0.1,0`;

  return (
    <Path d={noteHead} stroke={noteColor} strokeWidth="2" fill="none" />
  );
};

export default Note;

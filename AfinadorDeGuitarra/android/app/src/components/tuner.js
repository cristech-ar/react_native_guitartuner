import React, { useState, useEffect } from 'react';
import { View, Text, PermissionsAndroid } from 'react-native';
import KeepAwake from 'react-native-keep-awake';
import { Svg } from 'react-native-svg';
import Note from './note';
import { noteFrequencies } from '../utils/noteFrequencies';
import { requestRecordAudioPermission } from '../utils/permissions';
import { AudioRecorder, AudioUtils } from 'react-native-audio';

const Tuner = () => {
  const [note, setNote] = useState('A4');
  const [frequency, setFrequency] = useState(noteFrequencies.A4);
  const [pitch, setPitch] = useState(0);

  useEffect(() => {
    requestRecordAudioPermission().then(() => {
      AudioRecorder.prepareRecordingAtPath(
        AudioUtils.DocumentDirectoryPath + '/test.aac',
        {
          SampleRate: 22050,
          Channels: 1,
          AudioQuality: 'Low',
          AudioEncoding: 'aac',
        },
      );
      AudioRecorder.onProgress = data => {
        const pitch = data.currentPitch;
        setPitch(pitch);
        const nearestNote = getNearestNoteName(pitch);
        setNote(nearestNote);
        setFrequency(noteFrequencies[nearestNote]);
      };
      AudioRecorder.startRecording();
    });
    return () => {
      AudioRecorder.stopRecording();
    };
  }, []);

  const getNearestNoteName = pitch => {
    const noteNames = Object.keys(noteFrequencies);
    const distances = noteNames.map(name => Math.abs(noteFrequencies[name] - pitch));
    const minDistance = Math.min(...distances);
    return noteNames[distances.indexOf(minDistance)];
  };

  return (
    <View>
      <Svg height="100" width="100">
        <Note note={note} />
      </Svg>
      <Text>{`${note} (${frequency.toFixed(2)} Hz)`}</Text> 
      <Text>{`Pitch: ${pitch.toFixed(2)}`}</Text>
<KeepAwake />
</View>
);
};

export default Tuner;

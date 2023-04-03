import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { Permissions } from 'expo-permissions';
import { closestNoteToFrequency } from 'src/utils/noteFrequencies';

const Tuner = () => {
  const [frequency, setFrequency] = useState(0);
  const [note, setNote] = useState('');

  useEffect(() => {
    let recording = null;

    const getMicrophonePermission = async () => {
      const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);

      if (status !== 'granted') {
        alert('Microphone permission required to use tuner.');
      } else {
        recording = new Audio.Recording();
        recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        recording.startAsync();
      }
    };

    getMicrophonePermission();

    const intervalId = setInterval(async () => {
      if (recording !== null) {
        const { isRecording } = await recording.getStatusAsync();

        if (isRecording) {
          const { frequency } = await recording.getNewSoundFrequencyAsync();
          setFrequency(frequency);

          const closestNote = closestNoteToFrequency(frequency);
          setNote(closestNote.note);
        }
      }
    }, 100);

    return () => {
      clearInterval(intervalId);

      if (recording !== null) {
        recording.stopAndUnloadAsync();
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.frequencyText}>{frequency.toFixed(2)} Hz</Text>
      <Text style={styles.noteText}>{note}</Text>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5fcff',
  },
  frequencyText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  noteText: {
    fontSize: 24,
    fontStyle: 'italic',
  },
});

export default Tuner;



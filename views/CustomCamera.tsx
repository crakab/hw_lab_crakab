import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import * as mobilenet from '@tensorflow-models/mobilenet';
import jpeg from 'jpeg-js';

// Load MobileNet once per app session. This component remounts every round,
// and reloading the model each time would eat into the round's 10 seconds.
let cachedModel: mobilenet.MobileNet | null = null;

type Props = {
  emojiNames: string[];
  onEmojiFound: () => void;
  onTensorLoaded: (loaded: boolean) => void;
};

export default function CustomCamera({ emojiNames, onEmojiFound, onTensorLoaded }: Props) {
  const [model, setModel] = useState<mobilenet.MobileNet | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  // Remember *which* target we reported, so a new target (new emojiNames
  // array) automatically counts as "not found yet" -- no reset effect needed.
  const [foundFor, setFoundFor] = useState<string[] | null>(null);
  const foundThisRound = foundFor === emojiNames;
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);

  // Ask for camera permission if we don't have it.
  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) requestPermission();
  }, [permission, requestPermission]);

  // Load MobileNet the first time; later rounds reuse cachedModel.
  useEffect(() => {
    (async () => {
      try {
        await tf.ready();
        if (!cachedModel) cachedModel = await mobilenet.load();
        setModel(cachedModel);
        onTensorLoaded(true);
      } catch (err) {
        console.error('Failed to load MobileNet:', err);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function classifyImage(uri: string) {
    if (!model) return;
    setIsProcessing(true);
    try {
      const tensor = await imageToTensor(uri);
      const predictions = await model.classify(tensor);
      tensor.dispose(); // free the frame's memory -- we create one every second
      console.log('Predictions:', predictions);

      for (const prediction of predictions) {
        const labels = prediction.className
          .toLowerCase()
          .split(',')
          .map((s) => s.trim());
        const matches = labels.some((label) => emojiNames.includes(label));
        if (matches && prediction.probability > 0.2) {
          setFoundFor(emojiNames);
          onEmojiFound();
          break;
        }
      }
    } catch (err) {
      console.error('Classification error:', err);
    } finally {
      setIsProcessing(false);
    }
  }

  // Every second: snap a frame, classify it, dispatch "found" if it matches.
  useEffect(() => {
    if (!model || foundThisRound) return;
    const id = setInterval(async () => {
      if (isProcessing || foundThisRound) return;
      if (!cameraRef.current) return;
      try {
        const photo = await cameraRef.current.takePictureAsync({
          skipProcessing: true,
          shutterSound: false,
        });
        if (!photo) return;
        await classifyImage(photo.uri);
      } catch (err) {
        console.error('Frame capture failed:', err);
      }
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model, foundThisRound, isProcessing, emojiNames]);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>We need camera access to play EmojiHunter.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />
      {!model && (
        <View style={styles.overlay}>
          <Text style={styles.loadingText}>Loading image classification model…</Text>
        </View>
      )}
    </View>
  );
}

async function imageToTensor(uri: string) {
  // Resize to MobileNet's expected 224x224 input.
  const resized = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 224, height: 224 } }],
    { format: ImageManipulator.SaveFormat.JPEG },
  );

  // Fetch the resized file and decode the JPEG into RGB(A) pixels.
  const response = await fetch(resized.uri);
  const buffer = await response.arrayBuffer();
  const { width, height, data } = jpeg.decode(new Uint8Array(buffer), { useTArray: true });

  // Drop the alpha channel -- MobileNet expects RGB, not RGBA.
  const rgb = new Uint8Array(width * height * 3);
  for (let i = 0, j = 0; i < data.length; i += 4) {
    rgb[j++] = data[i];
    rgb[j++] = data[i + 1];
    rgb[j++] = data[i + 2];
  }
  return tf.tensor3d(rgb, [height, width, 3]);
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  message: { fontSize: 16, textAlign: 'center' },
  camera: { width, height },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});

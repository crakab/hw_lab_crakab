import React from 'react';
import WebView from 'react-native-webview';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'RepoWebView'>;

export default function RepoWebView({ route }: Props) {
  const { url } = route.params;
  return <WebView source={{ uri: url }} />;
}

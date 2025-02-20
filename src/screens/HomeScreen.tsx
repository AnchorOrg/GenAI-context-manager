import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Card, Text, useTheme } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import { useDatabase } from '../context/DatabaseContext';
import { FileList } from '../components/FileList';
import { ContextOutput } from '../components/ContextOutput';
import { estimateTokenCount } from '../utils/fileHelpers';

export default function HomeScreen() {
  const theme = useTheme();
  const { saveContext } = useDatabase();
  const [files, setFiles] = useState([]);
  const [tokenLimit, setTokenLimit] = useState(4000);

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'text/*',
        multiple: true,
      });

      if (!result.canceled) {
        const newFiles = await Promise.all(
          result.assets.map(async (file) => ({
            name: file.name,
            uri: file.uri,
            content: await FileSystem.readAsStringAsync(file.uri),
          }))
        );
        setFiles([...files, ...newFiles]);
      }
    } catch (err) {
      console.error('Error picking files:', err);
    }
  };

  const handleSave = async () => {
    try {
      await saveContext({
        files,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Error saving context:', err);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">Create New Context</Text>
          <Text variant="bodyMedium" style={styles.description}>
            Upload your project files to generate a context that GPT can understand.
          </Text>
          <Button
            mode="contained"
            onPress={handleFilePick}
            style={styles.button}
          >
            Pick Files
          </Button>
          <FileList files={files} onRemoveFile={(index) => {
            setFiles(files.filter((_, i) => i !== index));
          }} />
        </Card.Content>
      </Card>

      {files.length > 0 && (
        <ContextOutput
          files={files}
          tokenLimit={tokenLimit}
          onSave={handleSave}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
  },
  description: {
    marginVertical: 8,
  },
  button: {
    marginVertical: 16,
  },
});
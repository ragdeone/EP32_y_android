import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Switch, Alert } from 'react-native';
import axios from 'axios';

export default function App() {
  const [ip, setIp] = useState('');
  const [connected, setConnected] = useState(false);
  const [presets, setPresets] = useState({
    preset1: false,
    preset2: false,
    preset3: false,
    preset4: false,
    preset5: false,
  });

  const connectDevice = () => {
    if (ip) {
      setConnected(true);
      Alert.alert("Conectado", `Conectado al dispositivo con IP ${ip}`);
    } else {
      Alert.alert("Error", "Por favor, ingrese una IP válida.");
    }
  };

  const disconnectDevice = () => {
    setConnected(false);
    Alert.alert("Desconectado", "Se ha desconectado del dispositivo");
  };

  const togglePreset = (presetName) => {
    if (connected) {
      axios.get(`http://${ip}/?preset=${presetName.slice(-1)}`)
        .then(response => {
          setPresets({
            ...presets,
            [presetName]: !presets[presetName],
          });
          Alert.alert(`Preset ${presetName}`, `Se ha cambiado el preset ${presetName}`);
        })
        .catch(error => {
          console.error(error);
          Alert.alert("Error", "No se pudo enviar el comando al ESP32");
        });
    } else {
      Alert.alert("Error", "No estás conectado al ESP32");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>IP Equipo:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese la IP del equipo"
        value={ip}
        onChangeText={setIp}
      />
      <Button title="Conectar Equipo" onPress={connectDevice} disabled={connected} />
      <Button title="Desconectar Equipo" onPress={disconnectDevice} disabled={!connected} />

      {Object.keys(presets).map((preset) => (
        <View key={preset} style={styles.switchContainer}>
          <Text>{preset.toUpperCase()}</Text>
          <Switch
            onValueChange={() => togglePreset(preset)}
            value={presets[preset]}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
});

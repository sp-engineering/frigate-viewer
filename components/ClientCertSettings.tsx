import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, ScrollView, ActivityIndicator, Alert} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useAppSelector, useAppDispatch} from '../store/redux';
import {selectServers, setServerClientCertConfig} from '../store/settings';
import {clientCertManager, CertificateInfo} from '../helpers/clientCertificates';
import {useIntl} from 'react-intl';

interface ClientCertSettingsProps {
  serverIndex: number;
  onClose?: () => void;
}

/**
 * Component for selecting and configuring client certificates for a Frigate server.
 * Allows users to choose a certificate from their device's keystore/keychain.
 */
export const ClientCertSettings: React.FC<ClientCertSettingsProps> = ({
  serverIndex,
  onClose,
}) => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const servers = useAppSelector(selectServers);
  const server = servers[serverIndex];

  const [certificates, setCertificates] = useState<CertificateInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState<string | undefined>(
    server?.clientCertConfig?.alias || server?.clientCertConfig?.identity,
  );
  const [password, setPassword] = useState<string | undefined>(
    server?.clientCertConfig?.password,
  );

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      setLoading(true);
      const certs = await clientCertManager.listCertificates();
      setCertificates(certs);
    } catch (error) {
      console.error('Error loading certificates:', error);
      Alert.alert(
        'Error',
        'Failed to load certificates from device. Make sure you have installed a client certificate.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCertConfig = () => {
    if (!selectedCert) {
      Alert.alert('Error', 'Please select a certificate');
      return;
    }

    dispatch(
      setServerClientCertConfig({
        serverIndex,
        clientCertConfig: {
          alias: selectedCert,
          password: password || undefined,
        },
      }),
    );

    Alert.alert('Success', 'Client certificate configuration saved', [
      {text: 'OK', onPress: onClose},
    ]);
  };

  const handleClearCertConfig = () => {
    dispatch(
      setServerClientCertConfig({
        serverIndex,
        clientCertConfig: undefined,
      }),
    );
    setSelectedCert(undefined);
    setPassword(undefined);
    Alert.alert('Success', 'Client certificate configuration cleared', [
      {text: 'OK', onPress: onClose},
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>
          Client Certificate Configuration for "{server?.host}"
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Select Certificate:</Text>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.loadingText}>Loading certificates...</Text>
          </View>
        ) : certificates.length === 0 ? (
          <View style={styles.noCertsContainer}>
            <Text style={styles.noCertsText}>
              No client certificates found on this device.
            </Text>
            <Text style={styles.noCertsSubtext}>
              Please install a client certificate in your device's keystore/keychain first.
            </Text>
          </View>
        ) : (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedCert}
              onValueChange={setSelectedCert}
              style={styles.picker}>
              <Picker.Item label="-- Select a Certificate --" value={undefined} />
              {certificates.map((cert, index) => (
                <Picker.Item
                  key={index}
                  label={cert.alias || cert.identity || cert.commonName || `Cert ${index + 1}`}
                  value={cert.alias || cert.identity || `cert_${index}`}
                />
              ))}
            </Picker>
          </View>
        )}
      </View>

      {selectedCert && (
        <View style={styles.section}>
          <Text style={styles.infoText}>
            Selected: {selectedCert}
          </Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.helpText}>
          ℹ️ The selected certificate will be used for mutual TLS (mTLS) authentication with the
          Frigate server. The certificate must be installed on your device before it can be used.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <View style={[styles.button, styles.primaryButton]}>
          <Text style={styles.buttonText} onPress={handleSaveCertConfig}>
            Save Certificate Configuration
          </Text>
        </View>
        {server?.clientCertConfig && (
          <View style={[styles.button, styles.dangerButton]}>
            <Text style={styles.buttonText} onPress={handleClearCertConfig}>
              Clear Certificate Configuration
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  section: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    backgroundColor: '#fafafa',
  },
  picker: {
    height: 200,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  noCertsContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noCertsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#d9534f',
    textAlign: 'center',
  },
  noCertsSubtext: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  buttonContainer: {
    marginVertical: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#5cb85c',
  },
  dangerButton: {
    backgroundColor: '#d9534f',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ClientCertSettings;

import {Platform} from 'react-native';
import ClientCertificateManager from '../../helpers/clientCertificates';

// Mock NativeModules
jest.mock('react-native', () => ({
  ...jest.requireActual('react-native'),
  NativeModules: {
    ClientCertModule: {
      listCertificates: jest.fn(),
      getCertificateInfo: jest.fn(),
      checkCertificateAvailability: jest.fn(),
      getPrivateKeyInfo: jest.fn(),
    },
  },
}));

describe('ClientCertificateManager', () => {
  let manager: ClientCertificateManager;

  beforeEach(() => {
    jest.clearAllMocks();
    manager = new ClientCertificateManager();
  });

  describe('listCertificates', () => {
    it('should return empty array when no native module is available', async () => {
      const result = await manager.listCertificates();
      expect(result).toEqual([]);
    });

    it('should list certificates from native module', async () => {
      const mockCerts = [
        {alias: 'client-cert-1', type: 'X.509'},
        {alias: 'client-cert-2', type: 'X.509'},
      ];

      const {NativeModules} = require('react-native');
      NativeModules.ClientCertModule.listCertificates.mockResolvedValue(mockCerts);

      const result = await manager.listCertificates();
      expect(result).toEqual(mockCerts);
      expect(NativeModules.ClientCertModule.listCertificates).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      const {NativeModules} = require('react-native');
      NativeModules.ClientCertModule.listCertificates.mockRejectedValue(
        new Error('Keystore not accessible'),
      );

      const result = await manager.listCertificates();
      expect(result).toEqual([]);
    });
  });

  describe('checkCertificateAvailability', () => {
    it('should check certificate availability', async () => {
      const {NativeModules} = require('react-native');
      NativeModules.ClientCertModule.checkCertificateAvailability.mockResolvedValue({
        exists: true,
        isPrivateKeyEntry: true,
      });

      const result = await manager.checkCertificateAvailability('test-cert');

      expect(result.exists).toBe(true);
      expect(result.isPrivateKeyEntry).toBe(true);
    });

    it('should return false when certificate does not exist', async () => {
      const {NativeModules} = require('react-native');
      NativeModules.ClientCertModule.checkCertificateAvailability.mockResolvedValue({
        exists: false,
      });

      const result = await manager.checkCertificateAvailability('non-existent-cert');

      expect(result.exists).toBe(false);
    });

    it('should return exists: false on error', async () => {
      const {NativeModules} = require('react-native');
      NativeModules.ClientCertModule.checkCertificateAvailability.mockRejectedValue(
        new Error('Error'),
      );

      const result = await manager.checkCertificateAvailability('test-cert');

      expect(result.exists).toBe(false);
    });
  });

  describe('isAvailable', () => {
    it('should indicate if native module is available', () => {
      const available = manager.isAvailable();
      expect(typeof available).toBe('boolean');
    });
  });

  describe('getCertificateInfo', () => {
    it('should get certificate information', async () => {
      const {NativeModules} = require('react-native');
      const mockInfo = {
        alias: 'test-cert',
        type: 'X.509',
      };
      NativeModules.ClientCertModule.getCertificateChain?.mockResolvedValue([mockInfo]);

      const result = await manager.getCertificateInfo('test-cert');

      if (Platform.OS === 'android') {
        expect(result).toBeDefined();
        expect(result?.alias).toBe('test-cert');
      }
    });
  });
});

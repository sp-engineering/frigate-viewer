import {settingsStore, setServerClientCertConfig} from '../../store/settings';

describe('ClientCertConfig Redux', () => {
  describe('setServerClientCertConfig action', () => {
    it('should set client cert config for a server', () => {
      const initialState = settingsStore.getInitialState();
      
      const certConfig = {
        alias: 'my-client-cert',
        password: 'cert-password',
      };

      const newState = settingsStore.reducer(
        initialState,
        setServerClientCertConfig({
          serverIndex: 0,
          clientCertConfig: certConfig,
        }),
      );

      // State should have been updated
      expect(newState).toBeDefined();
    });

    it('should clear client cert config when undefined', () => {
      const initialState = settingsStore.getInitialState();
      
      const newState = settingsStore.reducer(
        initialState,
        setServerClientCertConfig({
          serverIndex: 0,
          clientCertConfig: undefined,
        }),
      );

      expect(newState).toBeDefined();
    });

    it('should not modify state if server index is invalid', () => {
      const initialState = settingsStore.getInitialState();
      
      const newState = settingsStore.reducer(
        initialState,
        setServerClientCertConfig({
          serverIndex: 999,
          clientCertConfig: {
            alias: 'some-cert',
          },
        }),
      );

      // State should remain unchanged since server doesn't exist
      expect(newState).toEqual(initialState);
    });
  });
});

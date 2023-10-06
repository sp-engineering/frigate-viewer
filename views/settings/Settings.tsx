import {Formik, FormikProps} from 'formik';
import React, {useCallback, useEffect, useRef} from 'react';
import {Keyboard, StyleSheet, View} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {Dropdown} from '../../components/forms/Dropdown';
import {Input} from '../../components/forms/Input';
import {Label} from '../../components/forms/Label';
import {componentWithRedux} from '../../helpers/redux';
import {ISettings, saveSettings, selectSettings} from '../../store/settings';
import {useAppDispatch, useAppSelector} from '../../store/store';

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
});

const SettingsComponent: NavigationFunctionComponent = ({componentId}) => {
  const formRef = useRef<FormikProps<ISettings>>(null);
  const currentSettings = useAppSelector(selectSettings);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const sub = Navigation.events().registerNavigationButtonPressedListener(
      event => {
        if (event.buttonId === 'save') {
          if (formRef.current) {
            formRef.current.handleSubmit();
          }
        }
      },
    );
    return () => {
      sub.remove();
    };
  }, [componentId]);

  const save = useCallback(
    (settings: ISettings) => {
      Navigation.pop(componentId);
      dispatch(saveSettings(settings));
      console.log('values', settings);
      Keyboard.dismiss();
    },
    [componentId, dispatch],
  );

  return (
    <Formik initialValues={currentSettings} onSubmit={save} innerRef={formRef}>
      {({values, handleBlur, handleChange, setFieldValue}) => (
        <View style={styles.wrapper}>
          <Label text="Protocol">
            <Dropdown
              value={values.protocol}
              options={[{value: 'http'}, {value: 'https'}]}
              onValueChange={handleChange('protocol')}
            />
          </Label>
          <Input
            label="Host"
            value={values.host}
            onBlur={handleBlur('host')}
            onChangeText={handleChange('host')}
            keyboardType="default"
          />
          <Input
            label="Port"
            value={`${values.port}`}
            onBlur={handleBlur('port')}
            onChangeText={value => setFieldValue('port', parseFloat(value))}
            keyboardType="numeric"
          />
        </View>
      )}
    </Formik>
  );
};

export const Settings = componentWithRedux(SettingsComponent);

Settings.options = () => ({
  topBar: {
    title: {
      text: 'Settings',
    },
    rightButtons: [
      {
        id: 'save',
        text: 'Save',
        color: 'white',
      },
    ],
  },
});

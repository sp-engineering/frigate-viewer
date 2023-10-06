import {Formik, FormikProps} from 'formik';
import React, {useCallback, useEffect, useRef} from 'react';
import {Keyboard, StyleSheet, View} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import * as yup from 'yup';
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

const requiredError = 'This field is required.';

const settingsValidationSchema = yup.object().shape({
  protocol: yup.string().required(requiredError),
  host: yup.string().required(requiredError),
  port: yup.number().required(requiredError),
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
      Keyboard.dismiss();
    },
    [componentId, dispatch],
  );

  return (
    <Formik
      initialValues={currentSettings}
      validationSchema={settingsValidationSchema}
      onSubmit={save}
      innerRef={formRef}>
      {({values, handleBlur, handleChange, setFieldValue, errors, touched}) => (
        <View style={styles.wrapper}>
          <Label
            text="Protocol"
            touched={touched.protocol}
            error={errors.protocol}>
            <Dropdown
              value={values.protocol}
              options={[{value: 'http'}, {value: 'https'}]}
              onValueChange={handleChange('protocol')}
            />
          </Label>
          <Input
            text="Host"
            touched={touched.host}
            error={errors.host}
            value={values.host}
            onBlur={handleBlur('host')}
            onChangeText={handleChange('host')}
            keyboardType="default"
          />
          <Input
            text="Port"
            touched={touched.port}
            error={errors.port}
            value={`${values.port || ''}`}
            onBlur={handleBlur('port')}
            onChangeText={value =>
              setFieldValue('port', parseFloat(value) || null)
            }
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

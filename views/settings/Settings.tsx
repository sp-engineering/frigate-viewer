import {Formik, FormikProps} from 'formik';
import React, {useCallback, useEffect, useRef} from 'react';
import {Keyboard, StyleSheet, View} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import * as yup from 'yup';
import {Dropdown} from '../../components/forms/Dropdown';
import {Input} from '../../components/forms/Input';
import {Label} from '../../components/forms/Label';
import {Section} from '../../components/forms/Section';
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
  server: yup.object().shape({
    protocol: yup.string().required(requiredError),
    host: yup.string().required(requiredError),
    port: yup.number().required(requiredError),
  }),
  locale: yup.object().shape({
    region: yup.string().required(requiredError),
    datesDisplay: yup.string().required(requiredError),
  }),
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
      console.log(currentSettings, settings);
      Navigation.pop(componentId);
      dispatch(saveSettings(settings));
      Keyboard.dismiss();
    },
    [componentId, dispatch, currentSettings],
  );

  return (
    <Formik
      initialValues={currentSettings}
      validationSchema={settingsValidationSchema}
      onSubmit={save}
      innerRef={formRef}>
      {({values, handleBlur, handleChange, setFieldValue, errors, touched}) => (
        <View style={styles.wrapper}>
          <Section header="Server">
            <Label
              text="Protocol"
              touched={touched.server?.protocol}
              error={errors.server?.protocol}>
              <Dropdown
                value={values.server.protocol}
                options={[{value: 'http'}, {value: 'https'}]}
                onValueChange={handleChange('server.protocol')}
              />
            </Label>
            <Label
              text="Host"
              touched={touched.server?.host}
              error={errors.server?.host}>
              <Input
                value={values.server.host}
                onBlur={handleBlur('host')}
                onChangeText={handleChange('server.host')}
                keyboardType="default"
              />
            </Label>
            <Label
              text="Port"
              touched={touched.server?.port}
              error={errors.server?.port}>
              <Input
                value={`${values.server.port || ''}`}
                onBlur={handleBlur('port')}
                onChangeText={value =>
                  setFieldValue('server.port', parseFloat(value) || null)
                }
                keyboardType="numeric"
              />
            </Label>
          </Section>
          <Section header="Locale">
            <Label
              text="Region"
              touched={touched.locale?.region}
              error={errors.locale?.region}>
              <Dropdown
                value={values.locale.region}
                options={[
                  {value: 'enGB', label: 'Great Britain'},
                  {value: 'enUS', label: 'United States'},
                  {value: 'pl', label: 'Poland'},
                ]}
                onValueChange={handleChange('locale.region')}
              />
            </Label>
            <Label
              text="Dates display"
              touched={touched.locale?.datesDisplay}
              error={errors.locale?.datesDisplay}>
              <Dropdown
                value={values.locale.datesDisplay}
                options={[
                  {value: 'descriptive', label: 'Descriptive'},
                  {value: 'numeric', label: 'Numeric'},
                ]}
                onValueChange={handleChange('locale.datesDisplay')}
              />
            </Label>
          </Section>
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

import {Formik, FormikProps} from 'formik';
import React, {useCallback, useEffect, useRef} from 'react';
import {Keyboard, ScrollView, StyleSheet} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import * as yup from 'yup';
import {Dropdown} from '../../components/forms/Dropdown';
import {Input} from '../../components/forms/Input';
import {Label} from '../../components/forms/Label';
import {Section} from '../../components/forms/Section';
import {componentWithRedux} from '../../helpers/redux';
import {ISettings, saveSettings, selectSettings} from '../../store/settings';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {camerasListMenuItem, navigateToMenuItem} from '../menu/Menu';
import {menuButton, useMenu} from '../menu/menuHelpers';

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 20,
    paddingHorizontal: 16,
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
});

const requiredError = 'This field is required.';
const minError = ({min}: {min: number}) => `Minimum value is ${min}.`;
const maxError = ({max}: {max: number}) => `Maximum value is ${max}`;

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
  cameras: yup.object().shape({
    refreshFrequency: yup.number().required(requiredError).min(1, minError),
    numColumns: yup
      .number()
      .required(requiredError)
      .min(1, minError)
      .max(3, maxError),
  }),
  events: yup.object().shape({
    numColumns: yup
      .number()
      .required(requiredError)
      .min(1, minError)
      .max(3, maxError),
  }),
});

const SettingsComponent: NavigationFunctionComponent = ({componentId}) => {
  useMenu(componentId, 'settings');
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
  }, []);

  const save = useCallback(
    (settings: ISettings) => {
      navigateToMenuItem(camerasListMenuItem)();
      dispatch(saveSettings(settings));
      Keyboard.dismiss();
    },
    [dispatch],
  );

  return (
    <Formik
      initialValues={currentSettings}
      validationSchema={settingsValidationSchema}
      onSubmit={save}
      innerRef={formRef}>
      {({values, handleBlur, handleChange, setFieldValue, errors, touched}) => (
        <ScrollView style={styles.wrapper}>
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
          <Section header="Cameras">
            <Label
              text="Image refresh frequency (seconds)"
              touched={touched.cameras?.refreshFrequency}
              error={errors.cameras?.refreshFrequency}>
              <Input
                value={`${values.cameras.refreshFrequency || ''}`}
                onBlur={handleBlur('refreshFrequency')}
                onChangeText={value =>
                  setFieldValue(
                    'cameras.refreshFrequency',
                    parseFloat(value) || null,
                  )
                }
                keyboardType="numeric"
              />
            </Label>
            <Label
              text="Number of columns"
              touched={touched.cameras?.numColumns}
              error={errors.cameras?.numColumns}>
              <Dropdown
                value={values.cameras.numColumns}
                options={[{value: 1}, {value: 2}, {value: 3}]}
                onValueChange={v => setFieldValue('cameras.numColumns', v)}
              />
            </Label>
          </Section>
          <Section header="Events">
            <Label
              text="Number of columns"
              touched={touched.events?.numColumns}
              error={errors.events?.numColumns}>
              <Dropdown
                value={values.events.numColumns}
                options={[{value: 1}, {value: 2}, {value: 3}]}
                onValueChange={v => setFieldValue('events.numColumns', v)}
              />
            </Label>
          </Section>
        </ScrollView>
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
      menuButton,
    ],
  },
});

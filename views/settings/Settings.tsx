import {Formik, FormikProps} from 'formik';
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {useIntl} from 'react-intl';
import {Keyboard, Pressable, StyleSheet, Text} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import * as yup from 'yup';
import {Dropdown} from '../../components/forms/Dropdown';
import {Input} from '../../components/forms/Input';
import {Label} from '../../components/forms/Label';
import {Section} from '../../components/forms/Section';
import {
  ISettings,
  saveSettings,
  selectServerApiUrl,
  selectSettings,
} from '../../store/settings';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {camerasListMenuItem, navigateToMenuItem} from '../menu/Menu';
import {menuButton, useMenu} from '../menu/menuHelpers';
import {MessageKey, messages} from './messages';
import {ActionBar, Switch, View} from 'react-native-ui-lib';
import {ScrollView} from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'space-between',
  },
  scrollArea: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    width: '100%',
    flexGrow: 1,
    backgroundColor: 'white',
  },
  header: {
    color: 'black',
    fontSize: 22,
    fontWeight: 'bold',
  },
  demoServerButton: {
    color: 'blue',
  },
});

export const Settings: NavigationFunctionComponent = ({componentId}) => {
  const formRef = useRef<FormikProps<ISettings>>(null);
  const currentSettings = useAppSelector(selectSettings);
  const apiUrl = useAppSelector(selectServerApiUrl);
  const dispatch = useAppDispatch();
  const intl = useIntl();

  const settingsValidationSchema = useMemo(() => {
    const requiredError = intl.formatMessage(messages['error.required']);
    const minError = ({min}: {min: number}) =>
      intl.formatMessage(messages['error.min'], {min});
    const maxError = ({max}: {max: number}) =>
      intl.formatMessage(messages['error.max'], {max});

    return yup.object().shape({
      server: yup.object().shape({
        protocol: yup.string().required(requiredError),
        host: yup.string().required(requiredError),
        port: yup.number().required(requiredError),
        credentials: yup.object().shape({
          username: yup.string(),
          password: yup.string(),
        }),
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
        photoPreference: yup.string().required(requiredError),
      }),
    });
  }, [intl]);

  const cancel = () => {
    Navigation.dismissAllModals();
  };

  const save = useCallback(
    (settings: ISettings) => {
      dispatch(saveSettings(settings));
      Keyboard.dismiss();
      Navigation.dismissAllModals();
    },
    [dispatch],
  );

  const fillDemoServer = useCallback(() => {
    if (formRef.current) {
      formRef.current.setFieldValue('server.protocol', 'https');
      formRef.current.setFieldValue('server.host', 'demo.frigate.video');
      formRef.current.setFieldValue('server.port', 443);
      formRef.current.setFieldValue('server.credentials.username', '');
      formRef.current.setFieldValue('server.credentials.password', '');
    }
  }, []);

  const actions = useMemo(() => {
    const cancelButton = {
      label: intl.formatMessage(messages['action.cancel']),
      onPress: cancel,
    };
    const saveButton = {
      label: intl.formatMessage(messages['action.save']),
      onPress: () => {
        formRef.current?.handleSubmit();
      },
    };
    return apiUrl ? [cancelButton, saveButton] : [saveButton];
  }, [apiUrl, formRef]);

  return (
    <Formik
      initialValues={currentSettings}
      validationSchema={settingsValidationSchema}
      onSubmit={save}
      innerRef={formRef}>
      {({values, handleBlur, handleChange, setFieldValue, errors, touched}) => (
        <View style={styles.wrapper}>
          <ScrollView contentContainerStyle={styles.scrollArea}>
            <Text style={styles.header}>
              {intl.formatMessage(messages['topBar.title'])}
            </Text>
            <Section header={intl.formatMessage(messages['server.header'])}>
              <Label
                text={intl.formatMessage(messages['server.protocol.label'])}
                touched={touched.server?.protocol}
                error={errors.server?.protocol}
                required={true}>
                <Dropdown
                  value={values.server.protocol}
                  options={[{value: 'http'}, {value: 'https'}]}
                  onValueChange={handleChange('server.protocol')}
                />
              </Label>
              <Label
                text={intl.formatMessage(messages['server.host.label'])}
                touched={touched.server?.host}
                error={errors.server?.host}
                required={true}>
                <Input
                  value={values.server.host}
                  onBlur={handleBlur('host')}
                  onChangeText={handleChange('server.host')}
                  keyboardType="default"
                />
              </Label>
              <Label
                text={intl.formatMessage(messages['server.port.label'])}
                touched={touched.server?.port}
                error={errors.server?.port}
                required={true}>
                <Input
                  value={`${values.server.port || ''}`}
                  onBlur={handleBlur('port')}
                  onChangeText={value =>
                    setFieldValue('server.port', parseFloat(value) || null)
                  }
                  keyboardType="numeric"
                />
              </Label>
              <Label
                text={intl.formatMessage(messages['server.path.label'])}
                touched={touched.server?.path}
                error={errors.server?.path}>
                <Input
                  value={values.server.path}
                  onBlur={handleBlur('path')}
                  onChangeText={handleChange('server.path')}
                  keyboardType="default"
                />
              </Label>
              <Label
                text={intl.formatMessage(messages['server.username.label'])}
                touched={touched.server?.credentials?.username}
                error={errors.server?.credentials?.username}>
                <Input
                  value={values.server.credentials?.username}
                  onBlur={handleBlur('username')}
                  onChangeText={handleChange('server.credentials.username')}
                  keyboardType="default"
                />
              </Label>
              <Label
                text={intl.formatMessage(messages['server.password.label'])}
                touched={touched.server?.credentials?.password}
                error={errors.server?.credentials?.password}>
                <Input
                  value={values.server.credentials?.password}
                  onBlur={handleBlur('password')}
                  onChangeText={handleChange('server.credentials.password')}
                  keyboardType="default"
                  secureTextEntry={true}
                />
              </Label>
              <Pressable onPress={fillDemoServer}>
                <Text style={styles.demoServerButton}>
                  {intl.formatMessage(messages['server.useDemoServerButton'])}
                </Text>
              </Pressable>
            </Section>
            <Section header={intl.formatMessage(messages['locale.header'])}>
              <Label
                text={intl.formatMessage(messages['locale.region.label'])}
                touched={touched.locale?.region}
                error={errors.locale?.region}>
                <Dropdown
                  value={values.locale.region}
                  options={[
                    'es_AR', // Argentina
                    'en_AU', // Australia
                    'de_AT', // Austria
                    'es_BO', // Bolivia
                    'pt_BR', // Brazil
                    'en_CA', // Canada
                    'fr_CA', // Canada
                    'es_CL', // Chile
                    'es_CO', // Columbia
                    'es_CR', // Costa Rica
                    'es_DO', // Dominican Republic
                    'es_EC', // Ecuador
                    'fr_FR', // France
                    'de_DE', // Germany
                    'en_GB', // Great Britain
                    'es_GT', // Guatemala
                    'es_HN', // Honduras
                    'en_IE', // Ireland
                    'it_IT', // Italy
                    'de_LU', // Luxembourg
                    'es_MX', // Mexico
                    'en_NZ', // New Zealand
                    'es_NI', // Nicaragua
                    'es_PA', // Panama
                    'es_PY', // Paraguay
                    'es_PE', // Peru
                    'pl_PL', // Poland
                    'pt_PT', // Portugal
                    'es_SV', // El Salvador
                    'es_ES', // Spain
                    'sv_SE', // Sweden
                    'de_CH', // Switzerland
                    'fr_CH', // Switzerland
                    'it_CH', // Switzerland
                    'en_US', // United States
                    'uk_UA', // Ukraine
                    'es_UY', // Uruguay
                    'es_VE', // Venezuela
                  ].map(code => ({
                    value: code,
                    label: intl.formatMessage(
                      messages[`locale.region.option.${code}` as MessageKey],
                    ),
                  }))}
                  onValueChange={handleChange('locale.region')}
                />
              </Label>
              <Label
                text={intl.formatMessage(messages['locale.datesDisplay.label'])}
                touched={touched.locale?.datesDisplay}
                error={errors.locale?.datesDisplay}>
                <Dropdown
                  value={values.locale.datesDisplay}
                  options={[
                    {
                      value: 'descriptive',
                      label: intl.formatMessage(
                        messages['locale.datesDisplay.option.descriptive'],
                      ),
                    },
                    {
                      value: 'numeric',
                      label: intl.formatMessage(
                        messages['locale.datesDisplay.option.numeric'],
                      ),
                    },
                  ]}
                  onValueChange={handleChange('locale.datesDisplay')}
                />
              </Label>
            </Section>
            <Section header={intl.formatMessage(messages['cameras.header'])}>
              <Label
                text={intl.formatMessage(
                  messages['cameras.imageRefreshFrequency.label'],
                )}
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
                text={intl.formatMessage(messages['cameras.liveView.label'])}>
                <Switch
                  value={values.cameras.liveView}
                  onValueChange={value =>
                    setFieldValue('cameras.liveView', value)
                  }
                />
                <Text>
                  {intl.formatMessage(messages['cameras.liveView.disclaimer'])}
                </Text>
              </Label>
              <Label
                text={intl.formatMessage(
                  messages['cameras.numberOfColumns.label'],
                )}
                touched={touched.cameras?.numColumns}
                error={errors.cameras?.numColumns}>
                <Dropdown
                  value={values.cameras.numColumns}
                  options={[{value: 1}, {value: 2}, {value: 3}]}
                  onValueChange={v => setFieldValue('cameras.numColumns', v)}
                />
              </Label>
            </Section>
            <Section header={intl.formatMessage(messages['events.header'])}>
              <Label
                text={intl.formatMessage(
                  messages['events.numberOfColumns.label'],
                )}
                touched={touched.events?.numColumns}
                error={errors.events?.numColumns}>
                <Dropdown
                  value={values.events.numColumns}
                  options={[{value: 1}, {value: 2}, {value: 3}]}
                  onValueChange={v => setFieldValue('events.numColumns', v)}
                />
              </Label>
              <Label
                text={intl.formatMessage(
                  messages['events.photoPreference.label'],
                )}
                touched={touched.events?.photoPreference}
                error={errors.events?.photoPreference}>
                <Dropdown
                  value={values.events.photoPreference}
                  options={[
                    {
                      value: 'snapshot',
                      label: intl.formatMessage(
                        messages['events.photoPreference.option.snapshot'],
                      ),
                    },
                    {
                      value: 'thumbnail',
                      label: intl.formatMessage(
                        messages['events.photoPreference.option.thumbnail'],
                      ),
                    },
                  ]}
                  onValueChange={handleChange('events.photoPreference')}
                />
              </Label>
              <Label
                text={intl.formatMessage(
                  messages['events.lockLandscapePlaybackOrientation.label'],
                )}>
                <Switch
                  value={values.events.lockLandscapePlaybackOrientation}
                  onValueChange={value =>
                    setFieldValue(
                      'events.lockLandscapePlaybackOrientation',
                      value,
                    )
                  }
                />
              </Label>
            </Section>
          </ScrollView>
          <ActionBar keepRelative actions={actions} />
        </View>
      )}
    </Formik>
  );
};

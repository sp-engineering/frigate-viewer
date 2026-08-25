import {Formik, FormikProps} from 'formik';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useIntl} from 'react-intl';
import {Keyboard, Pressable, Text} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import * as yup from 'yup';
import {Dropdown} from '../../components/forms/Dropdown';
import {Input} from '../../components/forms/Input';
import {Label} from '../../components/forms/Label';
import {Section} from '../../components/forms/Section';
import {emptyServer, Server} from '../../store/settings';
import {useAppDispatch} from '../../store/store';
import {messages} from './messages';
import {ActionBar, View} from 'react-native-ui-lib';
import {ScrollView} from 'react-native-gesture-handler';
import {useTheme, useStyles} from '../../helpers/colors';
import {clientCertManager, CertificateInfo} from '../../helpers/clientCertificates';

interface ServerProps {
  server?: Server;
  onSubmit: (server: Server) => void;
}

export const ServerForm: NavigationFunctionComponent<ServerProps> = ({
  componentId,
  server,
  onSubmit,
}) => {
  const [certificates, setCertificates] = useState<CertificateInfo[]>([]);
  const [certificatesLoading, setCertificatesLoading] = useState(false);

  const styles = useStyles(({theme}) => ({
    wrapper: {
      flex: 1,
      justifyContent: 'space-between',
    },
    scrollArea: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      width: '100%',
      flexGrow: 1,
      backgroundColor: theme.background,
    },
    header: {
      color: theme.text,
      fontSize: 22,
      fontWeight: 'bold',
    },
    demoServerButton: {
      color: theme.link,
    },
    tip: {
      color: theme.text,
    },
  }));
  const theme = useTheme();

  const formRef = useRef<FormikProps<Server>>(null);
  const dispatch = useAppDispatch();
  const intl = useIntl();

  // Load available certificates on mount
  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      setCertificatesLoading(true);
      const certs = await clientCertManager.listCertificates();
      setCertificates(certs);
    } catch (error) {
      console.error('Error loading client certificates:', error);
      setCertificates([]);
    } finally {
      setCertificatesLoading(false);
    }
  };

  const settingsValidationSchema = useMemo(() => {
    const requiredError = intl.formatMessage(messages['error.required']);

    return yup.object().shape({
      protocol: yup.string().required(requiredError),
      host: yup.string().required(requiredError),
      port: yup.number().nullable(),
      auth: yup.string(),
      credentials: yup.object().when('auth', {
        is: (val: 'none' | 'basic' | 'frigate') =>
          val === 'frigate' || val === 'basic',
        then: () =>
          yup.object().shape({
            username: yup.string().required(requiredError),
            password: yup.string().required(requiredError),
          }),
      }),
      clientCertConfig: yup.object().nullable().shape({
        alias: yup.string(),
        password: yup.string().nullable(),
      }),
    });
  }, [intl]);

  const cancel = () => {
    Navigation.dismissModal(componentId);
  };

  const save = useCallback(
    (modifiedServer: Server) => {
      onSubmit(modifiedServer);
      Keyboard.dismiss();
      Navigation.dismissModal(componentId);
    },
    [dispatch],
  );

  const fillDemoServer = useCallback(() => {
    if (formRef.current) {
      formRef.current.setFieldValue('protocol', 'https');
      formRef.current.setFieldValue('host', 'demo.frigate.video');
      formRef.current.setFieldValue('port', undefined);
      formRef.current.setFieldValue('auth', 'none');
      formRef.current.setFieldValue('credentials.username', '');
      formRef.current.setFieldValue('credentials.password', '');
    }
  }, []);

  const actions = useMemo(() => {
    const cancelButton = {
      label: intl.formatMessage(messages['action.cancel']),
      color: theme.link,
      onPress: cancel,
    };
    const saveButton = {
      label: intl.formatMessage(
        messages[server ? 'action.edit' : 'action.add'],
      ),
      color: theme.link,
      onPress: () => {
        formRef.current?.handleSubmit();
      },
    };
    return [cancelButton, saveButton];
  }, [intl, server, formRef, theme]);

  return (
    <Formik
      initialValues={server ?? emptyServer()}
      validationSchema={settingsValidationSchema}
      onSubmit={save}
      innerRef={formRef}>
      {({values, handleBlur, handleChange, setFieldValue, errors, touched}) => (
        <View style={styles.wrapper}>
          <ScrollView contentContainerStyle={styles.scrollArea}>
            <Text style={styles.header}>
              {intl.formatMessage(messages['server.header'])}
            </Text>
            <Section
              header={intl.formatMessage(messages['server.address.header'])}>
              <Label
                text={intl.formatMessage(messages['server.protocol.label'])}
                touched={touched.protocol}
                error={errors.protocol}
                required={true}>
                <Dropdown
                  value={values.protocol}
                  options={[{value: 'http'}, {value: 'https'}]}
                  onValueChange={handleChange('protocol')}
                />
              </Label>
              <Label
                text={intl.formatMessage(messages['server.host.label'])}
                touched={touched.host}
                error={errors.host}
                required={true}>
                <Input
                  value={values.host}
                  onBlur={handleBlur('host')}
                  onChangeText={handleChange('host')}
                  keyboardType="default"
                />
              </Label>
              <Label
                text={intl.formatMessage(messages['server.port.label'])}
                touched={touched.port}
                error={errors.port}>
                <Input
                  value={`${values.port || ''}`}
                  onBlur={handleBlur('port')}
                  onChangeText={value =>
                    setFieldValue('port', parseFloat(value) || null)
                  }
                  keyboardType="numeric"
                />
              </Label>
              <Label
                text={intl.formatMessage(messages['server.path.label'])}
                touched={touched.path}
                error={errors.path}>
                <Input
                  value={values.path}
                  onBlur={handleBlur('path')}
                  onChangeText={handleChange('path')}
                  keyboardType="default"
                />
              </Label>
              <Pressable onPress={fillDemoServer}>
                <Text style={styles.demoServerButton}>
                  {intl.formatMessage(messages['server.useDemoServerButton'])}
                </Text>
              </Pressable>
            </Section>
            <Section
              header={intl.formatMessage(messages['server.auth.header'])}>
              <Label
                text={intl.formatMessage(messages['server.auth.label'])}
                touched={touched.auth}
                error={errors.auth}>
                <Dropdown
                  value={values.auth}
                  options={[
                    {
                      value: 'none',
                      label: intl.formatMessage(
                        messages['server.auth.option.none'],
                      ),
                    },
                    {value: 'basic', label: 'BasicAuth'},
                    {value: 'frigate', label: 'Frigate auth'},
                  ]}
                  onValueChange={handleChange('auth')}
                />
              </Label>
              {values.auth !== 'none' && (
                <>
                  <Label
                    text={intl.formatMessage(messages['server.username.label'])}
                    touched={touched.credentials?.username}
                    error={errors.credentials?.username}
                    required={true}>
                    <Input
                      value={values.credentials?.username}
                      onBlur={handleBlur('username')}
                      onChangeText={handleChange('credentials.username')}
                      keyboardType="default"
                    />
                  </Label>
                  <Label
                    text={intl.formatMessage(messages['server.password.label'])}
                    touched={touched.credentials?.password}
                    error={errors.credentials?.password}
                    required={true}>
                    <Input
                      value={values.credentials?.password}
                      onBlur={handleBlur('password')}
                      onChangeText={handleChange('credentials.password')}
                      keyboardType="default"
                      secureTextEntry={true}
                    />
                  </Label>
                </>
              )}
            </Section>
            <Section header="Client Certificate (mTLS)">
              <Label
              text="Certificate"
              touched={touched.clientCertConfig?.alias}
              error={errors.clientCertConfig?.alias as any}>
              <Dropdown
                value={values.clientCertConfig?.alias || ''}
                options={[
                  {
                    value: '',
                    label: certificatesLoading
                      ? 'Loading certificates...'
                      : certificates.length === 0
                      ? 'No certificates available'
                      : '-- Select a Certificate --',
                  },
                  ...certificates.map(cert => ({
                    value: cert.alias || cert.identity || '',
                    label: cert.alias || cert.identity || cert.commonName || 'Unknown',
                  })),
                ]}
                onValueChange={value => {
                  if (value) {
                    setFieldValue('clientCertConfig', {
                      alias: value,
                      password: values.clientCertConfig?.password || '',
                    });
                  } else {
                    setFieldValue('clientCertConfig', undefined);
                  }
                }}
              />
              </Label>
              {values.clientCertConfig?.alias && (
              <Label
                text="Certificate Password (optional)"
                touched={touched.clientCertConfig?.password}
                error={errors.clientCertConfig?.password as any}>
                <Input
                  value={values.clientCertConfig?.password || ''}
                  onBlur={handleBlur('clientCertConfig.password')}
                  onChangeText={handleChange('clientCertConfig.password')}
                  secureTextEntry={true}
                  placeholder="Leave blank if certificate is not password-protected"
                />
              </Label>
              )}
              <Text style={styles.tip}>
              💡 Use this if your Frigate server requires mutual TLS (mTLS) authentication.
              The certificate must be installed on your device.
              </Text>
            </Section>
          <ActionBar
            backgroundColor={theme.background}
            keepRelative
            actions={actions}
          />
        </View>
      )}
    </Formik>
  );
};

import {Formik, FormikProps} from 'formik';
import React, {useCallback, useMemo, useRef} from 'react';
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

interface ServerProps {
  server?: Server;
  onSubmit: (server: Server) => void;
}

export const ServerForm: NavigationFunctionComponent<ServerProps> = ({
  componentId,
  server,
  onSubmit,
}) => {
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
          </ScrollView>
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

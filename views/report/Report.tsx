import {Formik, FormikProps} from 'formik';
import React, {useEffect, useMemo, useRef} from 'react';
import {useIntl} from 'react-intl';
import {Keyboard, Text, ToastAndroid} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import crashlytics from '@react-native-firebase/crashlytics';
import {Input} from '../../components/forms/Input';
import {Label} from '../../components/forms/Label';
import {Section} from '../../components/forms/Section';
import {messages} from './messages';
import {ActionBar, View} from 'react-native-ui-lib';
import {ScrollView} from 'react-native-gesture-handler';
import {useTheme, useStyles} from '../../helpers/colors';
import {useAppSelector} from '../../store/store';
import {selectAppSendCrashReports, selectSettings} from '../../store/settings';
import {menuButton, useMenu} from '../menu/menuHelpers';

interface Problem {
  issue: {
    description: string;
  };
}

const initialValues = {
  issue: {
    description: '',
  },
};

export const Report: NavigationFunctionComponent = ({componentId}) => {
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
    p: {
      color: theme.text,
    },
    demoServerButton: {
      color: theme.link,
    },
    tip: {
      color: theme.text,
    },
  }));
  const theme = useTheme();

  const formRef = useRef<FormikProps<Problem>>(null);
  const currentSettings = useAppSelector(selectSettings);
  const sendCrashReportEnabled = useAppSelector(selectAppSendCrashReports);
  const intl = useIntl();

  useMenu(componentId, 'report');

  useEffect(() => {
    Navigation.mergeOptions(componentId, {
      topBar: {
        title: {
          text: intl.formatMessage(messages['topBar.title']),
        },
        leftButtons: [menuButton],
      },
    });
  }, [componentId, intl]);

  const send = async (problem: Problem) => {
    Keyboard.dismiss();
    crashlytics().log('Reporting an issue');
    if (problem.issue.description) {
      crashlytics().log(`Description: ${problem.issue.description}`);
    }
    const {server, ...settingsWithoutServerData} = currentSettings;
    const settings = (
      Object.keys(
        settingsWithoutServerData,
      ) as (keyof typeof settingsWithoutServerData)[]
    ).reduce(
      (obj, key) => ({
        ...obj,
        [key]: JSON.stringify(settingsWithoutServerData[key]),
      }),
      {},
    );
    await crashlytics().setAttributes(settings);
    crashlytics().recordError(new Error('Reported by user'), 'reported');
    formRef.current?.resetForm();
    ToastAndroid.show(
      intl.formatMessage(messages['toast.success']),
      ToastAndroid.LONG,
    );
  };

  const actions = useMemo(() => {
    const sendButton = {
      label: intl.formatMessage(messages['action.send']),
      color: theme.link,
      onPress: () => {
        formRef.current?.handleSubmit();
      },
    };
    return [sendButton];
  }, [formRef, theme]);

  if (!sendCrashReportEnabled) {
    return (
      <ScrollView contentContainerStyle={styles.scrollArea}>
        <Text style={styles.p}>
          {intl.formatMessage(messages['error.crash-report-disabled'])}
        </Text>
      </ScrollView>
    );
  }

  return (
    <Formik initialValues={initialValues} onSubmit={send} innerRef={formRef}>
      {({values, handleBlur, handleChange, errors, touched}) => (
        <View style={styles.wrapper}>
          <ScrollView contentContainerStyle={styles.scrollArea}>
            <Text style={styles.p}>
              {intl.formatMessage(messages['introduction.info'])}
            </Text>
            <Section header={intl.formatMessage(messages['issue.header'])}>
              <Label
                text={intl.formatMessage(messages['issue.description.label'])}
                touched={touched.issue?.description}
                error={errors.issue?.description}>
                <Input
                  value={values.issue.description}
                  onBlur={handleBlur('description')}
                  onChangeText={handleChange('issue.description')}
                  keyboardType="default"
                  multiline
                />
              </Label>
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

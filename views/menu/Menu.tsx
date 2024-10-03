import {IconOutline, OutlineGlyphMapType} from '@ant-design/icons-react-native';
import React, {FC, useCallback, useMemo} from 'react';
import {useIntl} from 'react-intl';
import {Image, Text, TouchableNativeFeedback, View} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {MenuId} from './menuHelpers';
import {MessageKey, messages} from './messages';
import {ICameraEventsProps} from '../camera-events/CameraEvents';
import {ScrollView} from 'react-native-gesture-handler';
import {useAppColorScheme, usePalette, useStyles} from '../../helpers/colors';

interface IMenuProps {
  current: string;
}

interface IMenuItem<P = {}> {
  id: MenuId;
  icon: OutlineGlyphMapType;
  label?: string;
  view?: string;
  stack?: boolean;
  passProps?: P;
}

export const camerasListMenuItem: IMenuItem = {
  id: 'camerasList',
  icon: 'video-camera',
  view: 'CamerasList',
};

export const cameraEventsMenuItem: IMenuItem = {
  id: 'cameraEvents',
  icon: 'unordered-list',
  view: 'CameraEvents',
};

export const retainedMenuItem: IMenuItem<ICameraEventsProps> = {
  id: 'retained',
  icon: 'star',
  view: 'CameraEvents',
  passProps: {
    retained: true,
  },
};

export const storageMenuItem: IMenuItem = {
  id: 'storage',
  icon: 'pie-chart',
  view: 'Storage',
};

export const systemMenuItem: IMenuItem = {
  id: 'system',
  icon: 'cloud-server',
  view: 'System',
};

export const logsMenuItem: IMenuItem = {
  id: 'logs',
  icon: 'file-text',
  view: 'Logs',
};

export const settingsMenuItem: IMenuItem = {
  id: 'settings',
  icon: 'tool',
  view: 'Settings',
};

export const authorMenuItem: IMenuItem = {
  id: 'author',
  icon: 'robot',
  view: 'Author',
};

export const navigateToMenuItem =
  ({view, stack, passProps}: IMenuItem) =>
  () => {
    if (view) {
      Navigation[stack ? 'push' : 'setStackRoot']('MainMenu', {
        component: {
          name: view,
          passProps,
          options: {
            sideMenu: {
              left: {
                visible: false,
              },
            },
          },
        },
      });
    }
  };

export const Menu: FC<IMenuProps> = ({current}) => {
  const intl = useIntl();

  const palette = usePalette();
  const appColorScheme = useAppColorScheme();

  const styles = useStyles(({colorScheme}) => ({
    menuWrapper: {
      backgroundColor: colorScheme.background,
      width: '100%',
      height: '100%',
    },
    menuLogo: {
      width: 150,
      height: 80,
      resizeMode: 'contain',
      marginHorizontal: 10,
    },
    menuItem: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    menuItemCurrent: {
      backgroundColor: colorScheme.highlighted,
    },
    menuItemIcon: {
      fontSize: 20,
      marginRight: 20,
    },
    menuItemText: {
      fontSize: 20,
      color: colorScheme.text,
    },
  }));

  const menuItems: IMenuItem[] = useMemo(
    () =>
      [
        camerasListMenuItem,
        cameraEventsMenuItem,
        retainedMenuItem,
        storageMenuItem,
        systemMenuItem,
        logsMenuItem,
        settingsMenuItem,
        authorMenuItem,
      ].map(item => ({
        ...item,
        label: intl.formatMessage(
          messages[`item.${item.id}.label` as MessageKey],
        ),
      })),
    [intl],
  );

  const navigate = useCallback(navigateToMenuItem, []);

  const logo = useMemo(
    () =>
      appColorScheme === 'light'
        ? require('./logo.png')
        : require('./logo-dark.png'),
    [appColorScheme],
  );

  return (
    <ScrollView style={[styles.menuWrapper]}>
      <Image source={logo} style={styles.menuLogo} />
      {menuItems.map(item => (
        <TouchableNativeFeedback onPress={navigate(item)} key={item.id}>
          <View
            style={[
              styles.menuItem,
              item.id === current ? styles.menuItemCurrent : undefined,
            ]}>
            <IconOutline
              name={item.icon}
              color={palette.text}
              style={[styles.menuItemIcon]}
            />
            <Text style={[styles.menuItemText]}>{item.label}</Text>
          </View>
        </TouchableNativeFeedback>
      ))}
    </ScrollView>
  );
};

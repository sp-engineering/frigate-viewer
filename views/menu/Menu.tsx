import { IconOutline, OutlineGlyphMapType } from '@ant-design/icons-react-native';
import React, { FC, useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import {
  Image,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { MenuId } from './menuHelpers';
import { MessageKey, messages } from './messages';
import { ICameraEventsProps } from '../camera-events/CameraEvents';
import { ScrollView } from 'react-native-gesture-handler';
import { colors } from '../../store/colors';

interface IMenuProps {
  current: string;
}

const styles = StyleSheet.create({
  menuWrapper: {
    backgroundColor: colors.background,
    color: colors.text,
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
    backgroundColor: '#f5f5f5',
    color: colors.background
  },
  menuItemIcon: {
    fontSize: 20,
    marginRight: 20,
    color: colors.text,
  },
  menuItemText: {
    fontSize: 20,
    color: colors.text,
  },
});

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

export const notificationsMenuItem: IMenuItem = {
  id: 'notifications',
  icon: 'notification',
  view: 'Notifications',
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
  ({ view, stack, passProps }: IMenuItem) =>
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

export const Menu: FC<IMenuProps> = ({ current }) => {
  const intl = useIntl();
  const menuItems: IMenuItem[] = useMemo(
    () =>
      [
        camerasListMenuItem,
        cameraEventsMenuItem,
        retainedMenuItem,
        notificationsMenuItem,
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

  return (
    <ScrollView style={[styles.menuWrapper]}>
      <Image source={colors.dark ? require('./logo_large_dark.png') : require('./logo_large_light.png')} style={styles.menuLogo} />
      {menuItems.map(item => (
        <TouchableNativeFeedback onPress={navigate(item)} key={item.id}>
          <View
            style={[
              styles.menuItem,
              item.id === current ? styles.menuItemCurrent : undefined,
            ]}>
            <IconOutline name={item.icon} style={[
              styles.menuItemIcon,
              item.id === current ? styles.menuItemCurrent : undefined,
            ]} />
            <Text style={[
              styles.menuItemText,
              item.id === current ? styles.menuItemCurrent : undefined,
            ]}>{item.label}</Text>
          </View>
        </TouchableNativeFeedback>
      ))}
    </ScrollView>
  );
};

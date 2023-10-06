import {IconOutline, OutlineGlyphMapType} from '@ant-design/icons-react-native';
import React, {FC, useCallback, useMemo} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {MenuId} from './menuHelpers';

interface IMenuProps {
  current: string;
  navComponentId: string;
}

const styles = StyleSheet.create({
  menuWrapper: {
    backgroundColor: 'white',
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
  },
  menuItemIcon: {
    fontSize: 20,
    marginRight: 20,
  },
  menuItemText: {
    fontSize: 20,
    color: 'black',
  },
});

interface IMenuItem {
  id: MenuId;
  icon: OutlineGlyphMapType;
  label: string;
  view?: string;
}

export const Menu: FC<IMenuProps> = ({current, navComponentId}) => {
  const menuItems: IMenuItem[] = useMemo(
    () => [
      {
        id: 'camerasList',
        icon: 'video-camera',
        label: 'List of cameras',
        view: 'CamerasList',
      },
      // {
      //   id: 'retained',
      //   icon: 'picture',
      //   label: 'Retained',
      // },
      {
        id: 'settings',
        icon: 'tool',
        label: 'Settings',
        view: 'Settings',
      },
      {
        id: 'author',
        icon: 'robot',
        label: 'Author',
        view: 'Author',
      },
    ],
    [],
  );

  const navigate = useCallback(
    ({view}: IMenuItem) =>
      () => {
        if (view) {
          Navigation.push(navComponentId, {
            component: {
              name: view,
            },
          });
          Navigation.dismissAllModals();
        }
      },
    [navComponentId],
  );

  return (
    <View style={[styles.menuWrapper]}>
      <Image source={require('./logo.png')} style={styles.menuLogo} />
      {menuItems.map(item => (
        <TouchableNativeFeedback onPress={navigate(item)} key={item.id}>
          <View
            style={[
              styles.menuItem,
              item.id === current ? styles.menuItemCurrent : undefined,
            ]}>
            <IconOutline name={item.icon} style={[styles.menuItemIcon]} />
            <Text style={[styles.menuItemText]}>{item.label}</Text>
          </View>
        </TouchableNativeFeedback>
      ))}
    </View>
  );
};

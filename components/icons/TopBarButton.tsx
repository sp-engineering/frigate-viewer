import {IconOutline, OutlineGlyphMapType} from '@ant-design/icons-react-native';
import React, {FC, useCallback} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const styles = StyleSheet.create({
  button: {
    padding: 8,
    margin: 8,
    backgroundColor: 'black',
    borderRadois: '50%',
  },
  bullet: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    minWidth: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'red',
  },
  bulletText: {
    color: 'white',
    textAlign: 'center',
    lineHeight: 12,
    fontSize: 10,
    fontWeight: '700',
  },
});

interface ITopBarButtonProps {
  icon: OutlineGlyphMapType;
  count?: number;
  onPress: () => void;
}

export const TopBarButton: FC<ITopBarButtonProps> = ({
  icon,
  count,
  onPress,
}) => {
  const press = useCallback(() => {
    if (onPress) {
      onPress();
    }
  }, [onPress]);

  return (
    <TouchableOpacity style={styles.button} onPress={press}>
      <IconOutline name={icon} color="white" size={20} />
      {count !== undefined && count !== 0 && (
        <View style={styles.bullet}>
          <Text style={styles.bulletText}>{`${count}`}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

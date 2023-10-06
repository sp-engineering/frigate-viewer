import React, {FC, useCallback, useEffect, useState} from 'react';
import {FlatList, Pressable, StyleSheet, Text} from 'react-native';
import {formsStyles} from './styles';

interface IDropdownOption {
  value: any;
  label?: string;
}

interface IDropdownProps {
  value?: any;
  options: IDropdownOption[];
  onValueChange?: (value: any) => void;
}

const styles = StyleSheet.create({
  dropdown: {
    position: 'relative',
    zIndex: 1000,
  },
  overlay: {
    // position: 'absolute',
    // left: 0,
    // top: 0,
    // right: 0,
    // bottom: 0,
    // backgroundColor: '#00000077',
  },
  options: {
    position: 'absolute',
    backgroundColor: 'white',
    top: 37,
    width: '100%',
    zIndex: 1000,
  },
  item: {
    paddingHorizontal: 4,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: 'black',
    backgroundColor: 'white',
  },
  itemText: {
    color: 'black',
  },
});

export const Dropdown: FC<IDropdownProps> = ({
  value,
  options,
  onValueChange,
}) => {
  const [opened, setOpened] = useState<boolean>(false);
  const [selected, setSelected] = useState<IDropdownOption>();

  const open = useCallback(() => {
    setOpened(true);
  }, []);

  const close = useCallback(() => {
    setOpened(false);
  }, []);

  const toggle = useCallback(() => {
    if (opened) {
      close();
    } else {
      open();
    }
  }, [opened, open, close]);

  const select = useCallback(
    (option: IDropdownOption) => () => {
      setSelected(option);
      if (onValueChange) {
        onValueChange(option.value);
      }
      close();
    },
    [close, onValueChange],
  );

  useEffect(() => {
    const found = options.find(option => value === option.value);
    if (found) {
      setSelected(found);
    }
  }, [value, options]);

  return (
    <>
      {opened && <Pressable style={styles.overlay} onPress={close} />}
      <Pressable style={[formsStyles.input, styles.dropdown]} onPress={toggle}>
        <Text style={formsStyles.inputText}>
          {selected ? selected.label || selected.value : ''}
        </Text>
        {opened && (
          <FlatList
            style={[styles.options]}
            data={options}
            renderItem={({item}) => (
              <Pressable style={styles.item} onPress={select(item)}>
                <Text style={styles.itemText}>{item.label || item.value}</Text>
              </Pressable>
            )}
          />
        )}
      </Pressable>
    </>
  );
};

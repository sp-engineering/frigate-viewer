import React, {FC, useCallback, useEffect, useState} from 'react';
import {FlatList, Modal, Pressable, StyleSheet, Text} from 'react-native';
import {formsStyles} from './styles';
import { colors } from '../../store/colors';

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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#00000077',
  },
  options: {
    flexGrow: 1,
    justifyContent: 'center',
    width: '100%',
    borderTopWidth: 1,
    borderColor: colors.background,
  },
  item: {
    paddingHorizontal: 4,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: colors.background,
    backgroundColor: colors.text,
  },
  itemSelected: {
    backgroundColor: '#ccd',
  },
  itemText: {
    color: colors.text,
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
      {opened && (
        <Modal>
          <Pressable style={styles.overlay} />
          <FlatList
            contentContainerStyle={[styles.options]}
            data={options}
            renderItem={({item}) => (
              <Pressable
                style={[
                  styles.item,
                  item === selected ? styles.itemSelected : undefined,
                ]}
                onPress={select(item)}>
                <Text style={styles.itemText}>{item.label || item.value}</Text>
              </Pressable>
            )}
          />
        </Modal>
      )}
      <Pressable style={formsStyles.input} onPress={toggle}>
        <Text style={formsStyles.inputText}>
          {selected ? selected.label || selected.value : ''}
        </Text>
      </Pressable>
    </>
  );
};

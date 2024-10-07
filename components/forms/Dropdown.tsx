import React, {FC, useCallback, useEffect, useState} from 'react';
import {FlatList, Modal, Pressable, StyleSheet, Text} from 'react-native';
import {useFormsStyles} from './styles';
import {useStyles} from '../../helpers/colors';

interface IDropdownOption {
  value: any;
  label?: string;
}

interface IDropdownProps {
  value?: any;
  options: IDropdownOption[];
  onValueChange?: (value: any) => void;
}

export const Dropdown: FC<IDropdownProps> = ({
  value,
  options,
  onValueChange,
}) => {
  const formsStyles = useFormsStyles();
  const styles = useStyles(({theme}) => ({
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.overlay,
    },
    options: {
      flexGrow: 1,
      justifyContent: 'center',
      width: '100%',
      borderTopWidth: 1,
      borderColor: theme.border,
    },
    item: {
      paddingHorizontal: 4,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.background,
    },
    itemSelected: {
      backgroundColor: theme.highlighted,
    },
    itemText: {
      color: theme.text,
    },
  }));

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

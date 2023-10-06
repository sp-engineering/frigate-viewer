import React, {FC} from 'react';
import {TextInput, TextInputProps} from 'react-native';
import {Label} from './Label';
import {formsStyles} from './styles';

interface IInputProps extends TextInputProps {
  label: string;
}

export const Input: FC<IInputProps> = ({label, ...inputProps}) => (
  <Label text={label}>
    <TextInput
      style={[formsStyles.input, formsStyles.inputText]}
      {...inputProps}
    />
  </Label>
);

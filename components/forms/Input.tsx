import React, {FC} from 'react';
import {TextInput, TextInputProps} from 'react-native';
import {ILabelProps, Label} from './Label';
import {formsStyles} from './styles';

type IInputProps = ILabelProps & TextInputProps;

export const Input: FC<IInputProps> = ({
  text,
  touched,
  error,
  ...inputProps
}) => (
  <Label text={text} touched={touched} error={error}>
    <TextInput
      style={[formsStyles.input, formsStyles.inputText]}
      {...inputProps}
    />
  </Label>
);

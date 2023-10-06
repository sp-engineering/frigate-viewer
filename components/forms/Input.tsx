import React, {FC} from 'react';
import {TextInput, TextInputProps} from 'react-native';
import {formsStyles} from './styles';

type IInputProps = TextInputProps;

export const Input: FC<IInputProps> = inputProps => (
  <TextInput
    style={[formsStyles.input, formsStyles.inputText]}
    {...inputProps}
  />
);

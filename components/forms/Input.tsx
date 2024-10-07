import React, {FC} from 'react';
import {TextInput, TextInputProps} from 'react-native';
import {useFormsStyles} from './styles';

type IInputProps = TextInputProps;

export const Input: FC<IInputProps> = inputProps => {
  const formsStyles = useFormsStyles();

  return (
    <TextInput
      style={[formsStyles.input, formsStyles.inputText]}
      {...inputProps}
    />
  );
};

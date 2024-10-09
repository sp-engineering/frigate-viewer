import React from 'react';
import {NavigationFunctionComponent} from 'react-native-navigation';
import {useStyles} from '../../helpers/colors';
import {LivePreview} from './LivePreview';
import {View} from 'react-native-ui-lib';

interface CameraPreviewProps {
  cameraName: string;
}

export const CameraPreview: NavigationFunctionComponent<CameraPreviewProps> = ({
  cameraName,
}) => {
  const styles = useStyles(({theme}) => ({
    wrapper: {
      backgroundColor: theme.background,
    },
  }));

  return (
    <View style={styles.wrapper}>
      <LivePreview cameraName={cameraName} />
    </View>
  );
};

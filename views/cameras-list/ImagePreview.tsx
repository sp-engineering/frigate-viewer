import React, {FC} from 'react';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {StyleSheet, View} from 'react-native';
import {ZoomableImage} from '../../components/ZoomableImage';
import {useAppSelector} from '../../store/store';
import {
  selectCamerasPreviewHeight,
  selectServerCredentials,
} from '../../store/settings';
import {authorizationHeader} from '../../helpers/rest';

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 2,
    paddingHorizontal: 1,
  },
  image: {
    flex: 1,
  },
});

interface IImagePreviewProps {
  imageUrl?: string;
  onPress?: () => void;
  onPreviewLoad?: () => void;
}

export const ImagePreview: FC<IImagePreviewProps> = ({
  imageUrl,
  onPress,
  onPreviewLoad,
}) => {
  const previewHeight = useAppSelector(selectCamerasPreviewHeight);
  const credentials = useAppSelector(selectServerCredentials);

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styles.wrapper, {width: '100%', height: previewHeight}]}>
        {imageUrl && (
          <ZoomableImage
            source={{uri: imageUrl, headers: authorizationHeader(credentials)}}
            style={styles.image}
            fadeDuration={0}
            resizeMode="contain"
            resizeMethod="scale"
            onLoad={onPreviewLoad}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

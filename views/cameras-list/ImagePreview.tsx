import React, {FC} from 'react';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {StyleSheet, View} from 'react-native';
import {ZoomableImage} from '../../components/ZoomableImage';
import {useAppSelector} from '../../store/store';
import {
  selectCamerasNumColumns,
  selectCamerasPreviewHeight,
} from '../../store/settings';

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
  const numColumns = useAppSelector(selectCamerasNumColumns);
  const previewHeight = useAppSelector(selectCamerasPreviewHeight);

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        style={[
          styles.wrapper,
          {width: `${100 / numColumns}%`, height: previewHeight},
        ]}>
        {imageUrl && (
          <ZoomableImage
            source={{uri: imageUrl}}
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

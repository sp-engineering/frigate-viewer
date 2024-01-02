import { useIntl } from 'react-intl';
import { Navigation, NavigationFunctionComponent } from 'react-native-navigation';
import { Carousel, LoaderScreen, PageControlPosition, Text, View } from 'react-native-ui-lib';
import { useAppSelector } from '../../store/store';
import { selectServerApiUrl, selectServerCredentials } from '../../store/settings';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { menuButton, useMenu } from '../menu/menuHelpers';
import { messages } from './messages';
import { get } from '../../helpers/rest';
import { Stats } from '../../helpers/interfaces';
import { ScrollView } from 'react-native-gesture-handler';
import { Background } from '../../components/Background';
import { StyleSheet } from 'react-native';
import { refreshButton } from '../../helpers/buttonts';
import { selectAvailableCameras } from '../../store/events';
import { DetectorRow, DetectorsTable } from './DetectorsTable';
import { GpuRow, GpusTable } from './GpusTable';
import { CameraInfo, CameraTable } from './CameraTable';
import { SectionTitle } from './SectionTitle';
import { CpuUsageChart } from './CpuUsageChart';
import { CameraInfoChart } from './CameraInfoChart';
import { SystemInfo } from './SystemInfo';
import { colors } from '../../store/colors';

const styles = StyleSheet.create({
  wrapper: {
    margin: 20,
    backgroundColor: colors.background,
    color: colors.text,
  },
  cameraTableWrapper: {
    marginBottom: 10,
  },
  cameraTableTitle: {
    fontWeight: '600',
    marginVertical: 6,
  },
  loader: {
    position: 'absolute',
    top: 10,
    width: '100%',
  },
});

const refreshFrequency = 30;

export const System: NavigationFunctionComponent = ({componentId}) => {
  useMenu(componentId, 'system');
  const [stats, setStats] = useState<Stats>();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const apiUrl = useAppSelector(selectServerApiUrl);
  const credentials = useAppSelector(selectServerCredentials);
  const cameras = useAppSelector(selectAvailableCameras);
  const intl = useIntl();
  const interval = useRef<NodeJS.Timer>();

  useEffect(() => {
    Navigation.mergeOptions(componentId, {
      topBar: {
        title: {
          text: intl.formatMessage(messages['topBar.title']),
        },
        leftButtons: [menuButton],
        rightButtons: [refreshButton(refresh)],
      },
    });
  }, [componentId, intl]);

  useEffect(() => {
    refresh();
    const removeRefreshing = () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
    removeRefreshing();
    interval.current = setInterval(async () => {
      await refresh();
    }, refreshFrequency * 1000);
    return removeRefreshing;
  }, []);

  const refresh = useCallback(() => {
    setLoading(true);
    return get<Stats>(`${apiUrl}/stats`, credentials)
      .then(stats => {
        setStats(stats);
        setLoading(false);
      });
  }, [apiUrl]);

  const detectors: DetectorRow[] = useMemo(
    () => stats
      ? Object.keys(stats.detectors).map(name => {
        const detector = stats.detectors[name];
        const cpu_usage = stats.cpu_usages ? stats.cpu_usages[detector.pid] : undefined;
        return {
          name,
          inferenceSpeed: detector.inference_speed,
          cpu: cpu_usage ? parseFloat(cpu_usage.cpu) : undefined,
          mem: cpu_usage ? parseFloat(cpu_usage.mem) : undefined,
        };
      })
      : [],
    [stats],
  );

  const gpus: GpuRow[] = useMemo(
    () => stats && stats.gpu_usages
      ? Object.keys(stats.gpu_usages).map(name => ({
        name,
        gpu: parseFloat(stats.gpu_usages![name].gpu.slice(0, -2)),
        mem: parseFloat(stats.gpu_usages![name].mem.slice(0, -2)),
      }))
      : [],
    [stats],
  );

  const cameraTables: Record<string, CameraInfo> = useMemo(
    () => stats && cameras
      ? cameras.reduce(
        (result, cameraName) => {
          const cameraInfo = stats[cameraName];
          const ffmpegUsage = stats.cpu_usages && cameraInfo?.ffmpeg_pid ? stats.cpu_usages[cameraInfo.ffmpeg_pid] : undefined;
          const captureUsage = stats.cpu_usages && cameraInfo ? stats.cpu_usages[cameraInfo.capture_pid] : undefined;
          const detectUsage = stats.cpu_usages && cameraInfo ? stats.cpu_usages[cameraInfo.pid] : undefined;
          return {
            ...result,
            [cameraName]: {
              ffmpeg: {
                fps: cameraInfo?.camera_fps,
                cpu: ffmpegUsage ? parseFloat(ffmpegUsage.cpu) : undefined,
                mem: ffmpegUsage ? parseFloat(ffmpegUsage.mem) : undefined,
              },
              capture: {
                fps: cameraInfo?.process_fps,
                cpu: captureUsage ? parseFloat(captureUsage.cpu) : undefined,
                mem: captureUsage ? parseFloat(captureUsage.mem) : undefined,
              },
              detect: {
                fps: cameraInfo?.detection_fps,
                fps_skipped: cameraInfo?.skipped_fps,
                cpu: detectUsage ? parseFloat(detectUsage.cpu) : undefined,
                mem: detectUsage ? parseFloat(detectUsage.mem) : undefined,
              },
            },
          };
        },
        {} as Record<string, CameraInfo>,
      )
      : {},
    [stats, cameras],
  );

  const isCarousel = useMemo(
    () => detectors && gpus && cameraTables && (
      detectors.some(detector => detector.cpu !== undefined) ||
      gpus.some(gpu => gpu.gpu !== undefined) ||
      Object.values(cameraTables).some(
        info => info.ffmpeg.cpu !== undefined ||
        info.capture.cpu !== undefined ||
        info.detect.cpu !== undefined
      )
    ),
    [detectors, gpus, cameraTables],
  );

  const detectorsAndGpusFragment = (
    <View>
      {detectors.length > 0 && (
        <View>
          <SectionTitle>{intl.formatMessage(messages['detectors.title'])}</SectionTitle>
          <DetectorsTable detectors={detectors} />
        </View>
      )}
      {gpus.length > 0 && (
        <View>
          <SectionTitle>{intl.formatMessage(messages['gpus.title'])}</SectionTitle>
          <GpusTable gpus={gpus} />
        </View>
      )}
    </View>
  );

  const cameraTablesFragment = (
    <View>
      <SectionTitle>{intl.formatMessage(messages['cameras.title'])}</SectionTitle>
      {cameras.map(cameraName => (
        <View style={styles.cameraTableWrapper} key={cameraName}>
          <Text style={styles.cameraTableTitle}>{cameraName}</Text>
          <CameraTable cameraInfo={cameraTables[cameraName]} />
        </View>
      ))}
    </View>
  );

  return (
    stats === undefined
      ? (
          <LoaderScreen />
        )
      : (
          <Background>
            {loading && <LoaderScreen containerStyle={styles.loader} />}
            <ScrollView style={styles.wrapper}>
              {isCarousel ? (
                <>
                  <Carousel
                    pageControlPosition={PageControlPosition.UNDER}
                    onChangePage={setPage}
                  >
                    <CpuUsageChart {...{detectors, gpus}} />
                    <CameraInfoChart cameraInfos={cameraTables} />
                  </Carousel>
                  {page === 0 && detectors && gpus && detectorsAndGpusFragment}
                  {page === 1 && cameraTables && cameras.length > 0 && cameraTablesFragment}
                </>
              ) : (
                <>
                  {detectors && gpus && detectorsAndGpusFragment}
                  {cameraTables && cameras.length > 0 && cameraTablesFragment}
                </>
              )}
              <SystemInfo service={stats.service} />
            </ScrollView>
          </Background>
        )
  );
};

import {useEffect, useState} from 'react';

export const useLoadingTime = () => {
  const [startLoadingTime, setStartLoadingTime] = useState<number>();
  const [endLoadingTime, setEndLoadingTime] = useState<number>();
  const [loadingTime, setLoadingTime] = useState<number>();

  useEffect(() => {
    if (
      startLoadingTime &&
      endLoadingTime &&
      endLoadingTime > startLoadingTime
    ) {
      setLoadingTime(endLoadingTime - startLoadingTime);
    }
  }, [startLoadingTime, endLoadingTime]);

  return {
    loadingTime,
    setStartLoadingTime,
    setEndLoadingTime,
  };
};

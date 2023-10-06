import {enGB, enUS, pl} from 'date-fns/locale';
import React, {useEffect, useState} from 'react';
import {defineMessages, IntlProvider, MessageDescriptor} from 'react-intl';
import {
  NavigationFunctionComponent,
  NavigationProps,
} from 'react-native-navigation';
import {Region, selectLocaleRegion} from '../store/settings';
import {useAppSelector} from '../store/store';
import enLang from '../i18n/en';
import plLang from '../i18n/pl';

export const useDateLocale = () => {
  const region = useAppSelector(selectLocaleRegion);
  const regionLocaleMap: Record<Region, Locale> = {
    enGB,
    enUS,
    pl,
  };
  const fallbackLocale = enGB;
  return regionLocaleMap[region] || fallbackLocale;
};

export const formatVideoTime = (t: number) => {
  const sign = t < 0 ? '-' : '';
  const time = Math.abs(Math.round(t / 1000));
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${sign}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

type Lang = Record<string, string>;
type LangCode = 'en' | 'pl';

const regionTranslationsMap: Record<Region, [LangCode, Lang]> = {
  enGB: ['en', enLang],
  enUS: ['en', enLang],
  pl: ['pl', plLang],
};

const fallbackLanguage = 'en';

const useTranslations = () => {
  const [langCode, setLangCode] = useState<LangCode>(fallbackLanguage);
  const [messages, setMessages] = useState<Lang>({});
  const locale = useAppSelector(selectLocaleRegion);

  useEffect(() => {
    if (locale && regionTranslationsMap[locale]) {
      const [translationsLangCode, translationsMessages] =
        regionTranslationsMap[locale];
      setLangCode(translationsLangCode);
      setMessages(translationsMessages);
    }
  }, [locale]);

  return [langCode, messages] as [LangCode, Lang];
};

export const withTranslations =
  <P extends object>(
    Component: NavigationFunctionComponent<P>,
  ): NavigationFunctionComponent<P> =>
  (props: P & NavigationProps) => {
    const [langCode, messages] = useTranslations();

    return (
      <IntlProvider locale={langCode} messages={messages}>
        <Component {...props} />
      </IntlProvider>
    );
  };

export const makeMessages = <K extends string>(
  scope: string,
  dict: Record<K, string>,
) =>
  defineMessages(
    Object.entries(dict).reduce(
      (msgs, [id, defaultMessage]) => ({
        ...msgs,
        [id]: {id: `${scope}.${id}`, defaultMessage},
      }),
      {},
    ) as Record<K, MessageDescriptor>,
  );

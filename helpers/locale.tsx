import {enGB, enUS, pl, es, enAU, enCA, enIE, enNZ, fr, frCA, frCH, deAT, de, pt, ptBR, uk} from 'date-fns/locale';
import React, {useEffect, useState} from 'react';
import {defineMessages, IntlProvider, MessageDescriptor} from 'react-intl';
import {
  NavigationFunctionComponent,
  NavigationProps,
} from 'react-native-navigation';
import {Region, selectLocaleRegion} from '../store/settings';
import {useAppSelector} from '../store/store';
import deLang from '../i18n/de';
import enLang from '../i18n/en';
import esLang from '../i18n/es';
import frLang from '../i18n/fr';
import plLang from '../i18n/pl';
import ptLang from '../i18n/pt';
import ukLang from '../i18n/uk';

export const useDateLocale = () => {
  const region = useAppSelector(selectLocaleRegion);
  const regionLocaleMap: Record<Region, Locale> = {
    de_AT: deAT,
    de_DE: de,
    de_LU: de,
    de_CH: de,
    en_AU: enAU,
    en_CA: enCA,
    en_GB: enGB,
    en_IE: enIE,
    en_NZ: enNZ,
    en_US: enUS,
    es_AR: es,
    es_BO: es,
    es_CL: es,
    es_CO: es,
    es_CR: es,
    es_DO: es,
    es_EC: es,
    es_ES: es,
    es_GT: es,
    es_HN: es,
    es_MX: es,
    es_NI: es,
    es_PA: es,
    es_PE: es,
    es_PY: es,
    es_SV: es,
    es_UY: es,
    es_VE: es,
    pl_PL: pl,
    fr_FR: fr,
    fr_CA: frCA,
    fr_CH: frCH,
    pt_PT: pt,
    pt_BR: ptBR,
    uk_UA: uk,
  };
  const fallbackLocale = enGB;
  return regionLocaleMap[region] || fallbackLocale;
};

export const formatVideoTime = (t: number) => {
  const sign = t < 0 ? '-' : '';
  const time = Math.abs(Math.round(t));
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${sign}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

type Lang = Record<string, string>;
type LangCode = 'en' | 'pl' | 'es' | 'fr' | 'de' | 'pt' | 'uk';

const regionTranslationsMap: Record<Region, [LangCode, Lang]> = {
  de_AT: ['de', deLang],
  de_DE: ['de', deLang],
  de_LU: ['de', deLang],
  de_CH: ['de', deLang],
  en_AU: ['en', enLang],
  en_CA: ['en', enLang],
  en_GB: ['en', enLang],
  en_IE: ['en', enLang],
  en_NZ: ['en', enLang],
  en_US: ['en', enLang],
  pl_PL: ['pl', plLang],
  es_AR: ['es', esLang],
  es_BO: ['es', esLang],
  es_CL: ['es', esLang],
  es_CO: ['es', esLang],
  es_CR: ['es', esLang],
  es_DO: ['es', esLang],
  es_EC: ['es', esLang],
  es_ES: ['es', esLang],
  es_GT: ['es', esLang],
  es_HN: ['es', esLang],
  es_MX: ['es', esLang],
  es_NI: ['es', esLang],
  es_PA: ['es', esLang],
  es_PE: ['es', esLang],
  es_PY: ['es', esLang],
  es_SV: ['es', esLang],
  es_UY: ['es', esLang],
  es_VE: ['es', esLang],
  fr_FR: ['fr', frLang],
  fr_CA: ['fr', frLang],
  fr_CH: ['fr', frLang],
  pt_BR: ['pt', ptLang],
  pt_PT: ['pt', ptLang],
  uk_UA: ['uk', ukLang],
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

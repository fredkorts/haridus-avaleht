import { FrontpageApi, FrontpageVM } from '../../core/models/frontpage.types';

function first<T>(v?: Record<string, T> | Array<T>): T | undefined {
  if (!v) return undefined;
  if (Array.isArray(v)) return v[0];
  const k = Object.keys(v)[0];
  return k ? (v as Record<string, T>)[k] : undefined;
}

export function mapFrontpage(api: FrontpageApi): FrontpageVM {
  const c = api.content ?? ({} as FrontpageApi['content']);

  const newsAllowed = c.fieldFrontpageNewsAllowed === '1';
  const newsItem = newsAllowed ? c.fieldFrontpageNews?.[0] : undefined;

  const services = Object.values(c.fieldFrontpageServices ?? {}).map(s => {
    const imgContainer = first(s.fieldServiceImage);
    const imgFile = imgContainer?.fieldServiceImg && first(imgContainer.fieldServiceImg);
    return {
      title: s.fieldServiceTitle || '',
      content: s.fieldServiceContent,
      img: imgFile?.url,
      alt: imgContainer?.fieldAlt,
      linkTitle: s.fieldServiceLink?.[0]?.title,
      linkPath: s.fieldServiceLink?.[0]?.path
    };
  });

  const topics = Object.values(c.fieldFrontpageTopics ?? {})
    .map(t => t.fieldTopicLink?.[0])
    .filter(Boolean) as Array<{ title: string; path: string }>;

  const links = Object.values(c.fieldLinkCards ?? {}).map(l => ({
    title: l.fieldTitle,
    desc: l.fieldDescription,
    img: l.fieldMediaImg?.[0]?.url,
    alt: l.fieldMediaImg?.[0]?.alt,
    href: l.fieldSingleLink?.[0]?.path
  }));

  return {
    title: c.title || 'Avaleht',
    contact: (c.fieldFrontpageContactEmail || c.fieldFrontpageContactName || c.fieldFrontpageContactPhone)
      ? { name: c.fieldFrontpageContactName, email: c.fieldFrontpageContactEmail, phone: c.fieldFrontpageContactPhone }
      : null,
    news: newsItem?.entityUrl?.path ? { title: newsItem.title, path: newsItem.entityUrl.path } : null,
    descriptionHtml: c.fieldFrontpageNewsDescription,
    services,
    topics,
    links
  };
}

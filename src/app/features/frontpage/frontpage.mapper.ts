import { FrontpageApi, FrontpageLinkVM, FrontpageVM } from '../../core/models/frontpage.types';

function sortedValues<T>(v?: Record<string, T> | Array<T>): Array<T> {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  return Object.keys(v)
    .sort((a, b) => a.localeCompare(b))
    .map(key => (v as Record<string, T>)[key]);
}

function first<T>(v?: Record<string, T> | Array<T>): T | undefined {
  return sortedValues(v)[0];
}

function normalizeLink(link?: { title?: string; path?: string; routed?: boolean } | null): FrontpageLinkVM | undefined {
  if (!link?.path) return undefined;
  const url = link.path;
  const routed = Boolean(link.routed && !/^https?:/i.test(url));
  return { title: link.title || '', url, routed };
}

function normalizeEntityLink(link?: { title?: string; entityUrl?: { path: string; routed: boolean } }): FrontpageLinkVM | undefined {
  const path = link?.entityUrl?.path;
  if (!path) return undefined;
  const routed = Boolean(link?.entityUrl?.routed && !/^https?:/i.test(path));
  return { title: link?.title || '', url: path, routed };
}

export function mapFrontpage(api: FrontpageApi): FrontpageVM {
  const c = api.content ?? ({} as FrontpageApi['content']);

  const newsAllowed = c.fieldFrontpageNewsAllowed === '1';
  const newsItem = newsAllowed ? first(c.fieldFrontpageNews) : undefined;

  const services = sortedValues(c.fieldFrontpageServices).map(s => {
    const imgContainer = first(s.fieldServiceImage);
    const imgFile = imgContainer?.fieldServiceImg && first(imgContainer.fieldServiceImg);
    return {
      title: s.fieldServiceTitle || '',
      content: s.fieldServiceContent,
      img: imgFile?.url,
      alt: imgContainer?.fieldAlt,
      link: normalizeLink(first(s.fieldServiceLink))
    };
  });

  const topics = sortedValues(c.fieldFrontpageTopics)
    .map(t => normalizeLink(first(t.fieldTopicLink)))
    .filter((link): link is FrontpageLinkVM => Boolean(link?.url));

  const links = sortedValues(c.fieldLinkCards).map(l => {
    const img = l.fieldMediaImg?.[0];
    return {
      title: l.fieldTitle,
      desc: l.fieldDescription,
      img: img?.url,
      alt: img?.alt,
      link: normalizeLink(first(l.fieldSingleLink))
    };
  });

  const references = sortedValues(c.fieldFrontpageReferences).map(r => ({
    title: r.fieldReferenceTitle,
    questionTitle: r.fieldReferenceQuestionTitle,
    content: r.fieldReferenceContent,
    link: r.fieldReferenceLink ? normalizeLink(first(r.fieldReferenceLink)) : undefined
  }));

  const languages = Object.values(api.language_links ?? {})
    .sort((a, b) => (a.langcode || '').localeCompare(b.langcode || ''))
    .map(l => ({
      code: l.langcode,
      active: Boolean(l.active),
      path: l.path
    }))
    .filter(l => Boolean(l.code));

  return {
    title: c.title || 'Avaleht',
    contact: (c.fieldFrontpageContactEmail || c.fieldFrontpageContactName || c.fieldFrontpageContactPhone)
      ? { name: c.fieldFrontpageContactName, email: c.fieldFrontpageContactEmail, phone: c.fieldFrontpageContactPhone }
      : null,
    news: newsItem ? normalizeEntityLink(newsItem) ?? null : null,
    descriptionHtml: c.fieldFrontpageNewsDescription,
    services,
    topics,
    links,
    references,
    languages
  };
}

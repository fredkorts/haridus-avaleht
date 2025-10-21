export type LangLink = { langcode: string; active: boolean; path: string };

export interface FrontpageApi {
  content: {
    title: string;
    fieldFrontpageContactEmail?: string;
    fieldFrontpageContactName?: string;
    fieldFrontpageContactPhone?: string;
    fieldFrontpageNewsAllowed?: string; // "1" | "0"
    fieldFrontpageNews?: Array<{
      title: string;
      entityUrl?: { path: string; routed: boolean };
    }>;
    fieldFrontpageNewsDescription?: string; // HTML
    fieldFrontpageServices?: Record<string, {
      fieldServiceTitle?: string;
      fieldServiceContent?: string;
      fieldServiceImage?: Record<string, {
        fieldServiceImg?: Record<string, { url: string }>;
        fieldAlt?: string;
      }>;
      fieldServiceLink?: Array<{ title?: string; path?: string; routed?: boolean }>;
    }>;
    fieldFrontpageTopics?: Record<string, {
      fieldTopicLink?: Array<{ title: string; path: string; routed: boolean }>;
    }>;
    fieldLinkCards?: Record<string, {
      fieldTitle?: string;
      fieldDescription?: string;
      fieldMediaImg?: Array<{ url: string; alt?: string; title?: string }>;
      fieldSingleLink?: Array<{ title?: string; path?: string; routed?: boolean }>;
    }>;
    fieldFrontpageReferences?: Record<string, {
      fieldReferenceTitle?: string;
      fieldReferenceQuestionTitle?: string;
      fieldReferenceContent?: string;
      fieldReferenceLink?: Array<{ title?: string; path?: string; routed?: boolean }> | null;
      paraType?: string;
    }>;
  };
  language_links?: Record<'et'|'en'|string, LangLink>;
}

export interface FrontpageLinkVM {
  title: string;
  url: string;
  routed: boolean;
}

export interface FrontpageVM {
  title: string;
  contact: { name?: string; email?: string; phone?: string } | null;
  news: FrontpageLinkVM | null;
  descriptionHtml?: string;
  services: Array<{ title: string; content?: string; img?: string; alt?: string; link?: FrontpageLinkVM }>;
  topics: Array<FrontpageLinkVM>;
  links: Array<{ title?: string; desc?: string; img?: string; alt?: string; link?: FrontpageLinkVM }>;
  references: Array<{ title?: string; questionTitle?: string; content?: string; link?: FrontpageLinkVM }>;
  languages: Array<{ code: string; active: boolean; path?: string }>;
}

import { mapFrontpage } from './frontpage.mapper';
import { FrontpageApi, FrontpageVM } from '../../core/models/frontpage.types';
import { FRONTPAGE_DEFAULT_TITLE } from './frontpage.constants';

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[K] extends Record<string, any>
      ? DeepPartial<T[K]>
      : T[K];
};

class FrontpageApiBuilder {
  private data: FrontpageApi;

  constructor() {
    this.data = {
      content: {
        title: 'Frontpage title',
        fieldFrontpageContactEmail: 'info@example.com',
        fieldFrontpageContactName: 'Education Board',
        fieldFrontpageContactPhone: '+372 600 0000',
        fieldFrontpageNewsAllowed: '1',
        fieldFrontpageNews: [
          {
            title: 'Latest news',
            entityUrl: { path: '/news/latest', routed: true }
          }
        ],
        fieldFrontpageNewsDescription: '<p>Important update</p>',
        fieldFrontpageServices: {
          b: {
            fieldServiceTitle: 'Second service',
            fieldServiceContent: 'Detailed description for service B.',
            fieldServiceImage: {
              img2: {
                fieldServiceImg: {
                  file2: { url: 'https://cdn.example.com/service-b.jpg' }
                },
                fieldAlt: 'Service B illustration'
              }
            },
            fieldServiceLink: [
              { title: 'Service B external', path: 'https://example.com/service-b', routed: true }
            ]
          },
          a: {
            fieldServiceTitle: 'First service',
            fieldServiceContent: 'Detailed description for service A.',
            fieldServiceImage: {
              img1: {
                fieldServiceImg: {
                  file1: { url: '/assets/service-a.png' }
                },
                fieldAlt: 'Service A illustration'
              }
            },
            fieldServiceLink: [
              { title: 'Service A details', path: '/services/a', routed: true }
            ]
          }
        },
        fieldFrontpageTopics: {
          b: {
            fieldTopicLink: [
              { title: 'Incomplete topic', path: '', routed: false }
            ]
          },
          a: {
            fieldTopicLink: [
              { title: 'Curriculum', path: '/topics/curriculum', routed: true }
            ]
          }
        },
        fieldLinkCards: {
          card2: {
            fieldTitle: 'External resource',
            fieldDescription: 'A helpful resource.',
            fieldMediaImg: [
              { url: 'https://cdn.example.com/resource.jpg', alt: 'Resource image' }
            ],
            fieldSingleLink: [
              { title: 'Open resource', path: 'https://example.com/resource', routed: false }
            ]
          },
          card1: {
            fieldTitle: 'Study programmes',
            fieldDescription: 'Explore programmes.',
            fieldMediaImg: [
              { url: '/assets/programme.jpg', alt: 'Programme image' }
            ],
            fieldSingleLink: [
              { title: 'View programmes', path: '/programmes', routed: true }
            ]
          }
        },
        fieldFrontpageReferences: {
          ref1: {
            fieldReferenceTitle: 'Need assistance?',
            fieldReferenceQuestionTitle: 'How can we help?',
            fieldReferenceContent: 'Contact our support team for guidance.',
            fieldReferenceLink: [
              { title: 'Contact us', path: '/contact', routed: true }
            ]
          }
        }
      },
      language_links: {
        et: { langcode: 'et', active: true, path: '/et' },
        en: { langcode: 'en', active: false, path: '/en' }
      }
    } as FrontpageApi;
  }

  with(overrides: DeepPartial<FrontpageApi>) {
    this.data = mergeDeep(this.data, overrides);
    return this;
  }

  withNewsAllowed(allowed: boolean) {
    this.data.content.fieldFrontpageNewsAllowed = allowed ? '1' : '0';
    return this;
  }

  build(): FrontpageApi {
    return cloneDeep(this.data);
  }
}

function cloneDeep<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function mergeDeep<T>(target: T, source?: DeepPartial<T>): T {
  if (!source) {
    return cloneDeep(target);
  }

  const base = isObject(target) || Array.isArray(target) ? target : ({} as T);
  const output: any = Array.isArray(base) ? [...(base as any)] : { ...(base as any) };

  for (const [key, value] of Object.entries(source as any)) {
    if (value === undefined) {
      delete output[key];
      continue;
    }

    const current = (base as any)[key];

    if (Array.isArray(value)) {
      output[key] = value.map(item => (isObject(item) ? mergeDeep({}, item as any) : item));
    } else if (isObject(value) && isObject(current)) {
      output[key] = mergeDeep(current, value);
    } else if (isObject(value)) {
      output[key] = mergeDeep({}, value);
    } else {
      output[key] = value;
    }
  }

  return output;
}

describe('mapFrontpage', () => {
  it('maps titles, contacts, news and lists from the API response', () => {
    const api = new FrontpageApiBuilder().build();

    const vm = mapFrontpage(api);

    expect(vm.title).toBe('Frontpage title');
    expect(vm.contact).toEqual({
      name: 'Education Board',
      email: 'info@example.com',
      phone: '+372 600 0000'
    });
    expect(vm.news).toEqual({ title: 'Latest news', url: '/news/latest', routed: true });

    expect(vm.services.length).toBe(2);
    const [firstService, secondService] = vm.services;
    expect(firstService).toEqual({
      title: 'First service',
      content: 'Detailed description for service A.',
      img: '/assets/service-a.png',
      alt: 'Service A illustration',
      link: { title: 'Service A details', url: '/services/a', routed: true }
    });
    expect(secondService).toEqual({
      title: 'Second service',
      content: 'Detailed description for service B.',
      img: 'https://cdn.example.com/service-b.jpg',
      alt: 'Service B illustration',
      link: { title: 'Service B external', url: 'https://example.com/service-b', routed: false }
    });

    expect(vm.topics).toEqual([
      { title: 'Curriculum', url: '/topics/curriculum', routed: true }
    ]);

    expect(vm.links).toEqual([
      {
        title: 'Study programmes',
        desc: 'Explore programmes.',
        img: '/assets/programme.jpg',
        alt: 'Programme image',
        link: { title: 'View programmes', url: '/programmes', routed: true }
      },
      {
        title: 'External resource',
        desc: 'A helpful resource.',
        img: 'https://cdn.example.com/resource.jpg',
        alt: 'Resource image',
        link: { title: 'Open resource', url: 'https://example.com/resource', routed: false }
      }
    ]);

    expect(vm.references).toEqual([
      {
        title: 'Need assistance?',
        questionTitle: 'How can we help?',
        content: 'Contact our support team for guidance.',
        link: { title: 'Contact us', url: '/contact', routed: true }
      }
    ]);

    expect(vm.languages).toEqual([
      { code: 'en', active: false, path: '/en' },
      { code: 'et', active: true, path: '/et' }
    ]);
  });

  it('respects fieldFrontpageNewsAllowed flag', () => {
    const allowed = new FrontpageApiBuilder().withNewsAllowed(true).build();
    const disallowed = new FrontpageApiBuilder().withNewsAllowed(false).build();

    const allowedVm = mapFrontpage(allowed);
    const disallowedVm = mapFrontpage(disallowed);

    expect(allowedVm.news).not.toBeNull();
    expect(disallowedVm.news).toBeNull();
  });

  it('handles services, topics and links with missing data safely', () => {
    const api = new FrontpageApiBuilder()
      .with({
        content: {
          fieldFrontpageServices: {
            c: {
              fieldServiceTitle: 'Service without image',
              fieldServiceContent: undefined,
              fieldServiceImage: undefined,
              fieldServiceLink: [{ title: undefined, path: '/no-title', routed: true }]
            }
          },
          fieldFrontpageTopics: {
            c: {
              fieldTopicLink: [{ title: 'Incomplete', path: '', routed: true }]
            }
          },
          fieldLinkCards: {
            card3: {
              fieldTitle: 'Minimal card',
              fieldDescription: undefined,
              fieldMediaImg: [],
              fieldSingleLink: [
                { title: undefined, path: '/card-link', routed: true }
              ]
            }
          }
        }
      })
      .build();

    const vm = mapFrontpage(api);

    expect(vm.services.some(s => s.title === 'Service without image')).toBeTrue();
    const minimalService = vm.services.find(s => s.title === 'Service without image')!;
    expect(minimalService.img).toBeUndefined();
    expect(minimalService.alt).toBeUndefined();
    expect(minimalService.link).toEqual({ title: '', url: '/no-title', routed: true });

    expect(vm.topics).toEqual([
      { title: 'Curriculum', url: '/topics/curriculum', routed: true }
    ]);

    const minimalCard = vm.links.find(l => l.title === 'Minimal card');
    expect(minimalCard).toEqual({
      title: 'Minimal card',
      desc: undefined,
      img: undefined,
      alt: undefined,
      link: { title: '', url: '/card-link', routed: true }
    });
  });

  it('falls back to defaults when optional fields are missing', () => {
    const minimalApi = {
      content: {
        title: '',
        fieldFrontpageContactEmail: undefined,
        fieldFrontpageContactName: undefined,
        fieldFrontpageContactPhone: undefined
      }
    } as FrontpageApi;

    expect(() => mapFrontpage(minimalApi)).not.toThrow();
    const vm: FrontpageVM = mapFrontpage(minimalApi);

    expect(vm.title).toBe(FRONTPAGE_DEFAULT_TITLE);
    expect(vm.contact).toBeNull();
    expect(vm.news).toBeNull();
    expect(vm.services).toEqual([]);
    expect(vm.topics).toEqual([]);
    expect(vm.links).toEqual([]);
    expect(vm.references).toEqual([]);
    expect(vm.languages).toEqual([]);
  });
});

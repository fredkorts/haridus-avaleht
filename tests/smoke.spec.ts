import { test, expect } from '@playwright/test';

const frontpageFixture = {
  content: {
    title: 'Fixture Frontpage',
    fieldFrontpageContactName: 'Contact Person',
    fieldFrontpageContactEmail: 'contact@example.com',
    fieldFrontpageContactPhone: '+372 123 4567',
    fieldFrontpageNewsAllowed: '1',
    fieldFrontpageNews: [
      { title: 'Important update', entityUrl: { path: '/news/important-update', routed: true } }
    ],
    fieldFrontpageNewsDescription: '<h1>Fixture Frontpage</h1><p>Stay informed with the latest news.</p>',
    fieldFrontpageServices: {
      service1: {
        fieldServiceTitle: 'Study',
        fieldServiceContent: 'Find a study programme that suits you.',
        fieldServiceLink: [
          { title: 'Browse programmes', path: '/programmes', routed: true }
        ]
      }
    },
    fieldFrontpageTopics: {
      topic1: {
        fieldTopicLink: [
          { title: 'Admissions', path: '/topics/admissions', routed: true }
        ]
      }
    },
    fieldLinkCards: {
      link1: {
        fieldTitle: 'Scholarships',
        fieldDescription: 'Financial support opportunities.',
        fieldSingleLink: [
          { title: 'View scholarships', path: '/scholarships', routed: true }
        ]
      }
    },
    fieldFrontpageReferences: {
      ref1: {
        fieldReferenceTitle: 'Need help?',
        fieldReferenceQuestionTitle: 'Contact us',
        fieldReferenceContent: 'We are happy to assist you.'
      }
    }
  }
};

const translationsFixture = {
  'news.label': 'News',
  'home.services_title': 'Services',
  'button.read_more': 'Read more',
  'frontpage.errors.loadFailed': 'Failed to load frontpage',
  'common.loading': 'Loading…'
};

test('frontpage renders smoke view with intercepted data', async ({ page }) => {
  await page.route('**/api/frontpage**', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(frontpageFixture)
    });
  });

  await page.route('**/api/translations**', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(translationsFixture)
    });
  });

  await page.goto('/');

  await expect(page.locator('h1')).toHaveText(frontpageFixture.content.title);
  await expect(page.getByRole('heading', { name: /News|Services/ })).toBeVisible();
});

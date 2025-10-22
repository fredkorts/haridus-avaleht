export interface NavigationRouteConfig {
  label: string;
  route: string;
  ariaCurrent?: 'page';
  exact?: boolean;
}

export const PRIMARY_NAVIGATION_ARIA_LABEL = 'Põhimenüü';

export const HOME_NAVIGATION_ITEM: NavigationRouteConfig = {
  label: 'Avaleht',
  route: '/',
  ariaCurrent: 'page',
  exact: true,
};

export const TEST_NAVIGATION_ITEM: NavigationRouteConfig = {
  label: 'Test',
  route: '/test',
  ariaCurrent: 'page',
};

export const QUERY_SANITY_HOME = `
{
  "home": *[
    _type == 'home'
  ][0] {
    ...,
    hero {
      ...,
      content[] {
        ...
        image
      }
    }
  }
}
`;
export const QUERY_SANITY_PAGE = `
{
  "page": *[
    _type == 'page'
    && slug.current == $slug
  ][0] {
    ...
  }
}
`;

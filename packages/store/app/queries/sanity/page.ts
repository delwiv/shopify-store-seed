export const SANITY_QUERY_PAGE = `
{
  "page": *[
    _type == 'page' 
    && slug.current == $slug
  ][0] {
    ...
  }
}
`;

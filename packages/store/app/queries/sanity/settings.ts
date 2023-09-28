export const QUERY_SANITY_SETTINGS = `
{
"data": *[
  _type == 'settings'

][0]
{
  ...,
  menu {
    ...,
    links[] {
      ...,
      reference->
    }
  }
}

}

`;

export const QUERY_SANITY_NEWSLETTER = `
{
  "newsletter": *[
    _type == 'settings'
  ][0].productNewsletterBlock {
      ...,
      image {
        ...,
        image {
        ...,
        asset-> {
          originalFilename,
          url
        }
      }
    }
  }
}
`;

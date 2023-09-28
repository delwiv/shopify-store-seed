import sanityBuilder from '@sanity/image-url';
import {createClient} from '@sanity/client';

const settings = {
  projectId: '2xv31i09',
  dataset: 'production',
  useCdn: process.env.NODE_ENV === 'production',
  apiVersion: '2023-05-03',
};

export const sanityClient = createClient({
  ...settings,
});

export const builder = sanityBuilder(sanityClient);
//
// for link references to pages, collections or products
export const buildLink = (data) => {
  try {
    if (data.reference._type.includes('page')) {
      return `/pages/${data.reference.slug.current}`;
    }
    return '/'.concat(
      [`${data.reference._type}s`, data.reference.store.slug.current].join('/'),
    );
  } catch (err) {
    console.warn('could not build link for this input', data, err);
    return '';
  }
};

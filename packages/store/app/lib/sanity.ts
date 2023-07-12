import {createClient} from '@sanity/client';

const settings = {
  projectId: '2xv31i09',
  dataset: 'production',
  useCdn: process.env.NODE_ENV === 'production',
  apiVersion: '2023-05-03',
};

export const sanityClient = createClient(settings);

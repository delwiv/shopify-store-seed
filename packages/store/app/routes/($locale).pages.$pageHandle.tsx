import {json, type LoaderArgs} from '@shopify/remix-oxygen';
import type {Page as PageType} from '@shopify/hydrogen/storefront-api-types';
import {useLoaderData} from '@remix-run/react';
import invariant from 'tiny-invariant';

import {PageHeader} from '~/components';
import {routeHeaders} from '~/data/cache';
import {seoPayload} from '~/lib/seo.server';
import {sanityClient} from '~/lib/sanity';
import {SANITY_QUERY_PAGE} from '~/queries/sanity/page';

export const headers = routeHeaders;

export async function loader({request, params, context}: LoaderArgs) {
  invariant(params.pageHandle, 'Missing page handle');

  const page = await sanityClient.fetch(SANITY_QUERY_PAGE, {
    slug: params.pageHandle,
  });

  if (!page) {
    throw new Response(null, {status: 404});
  }

  const seo = seoPayload.page({page, url: request.url});

  return json({page, seo});
}

export default function Page() {
  const {page} = useLoaderData<typeof loader>();

  return (
    <>
      <PageHeader heading={page.title}>
        <div
          dangerouslySetInnerHTML={{__html: page.body}}
          className="prose dark:prose-invert"
        />
      </PageHeader>
    </>
  );
}

const PAGE_QUERY = `#graphql
  query PageDetails($language: LanguageCode, $handle: String!)
  @inContext(language: $language) {
    page(handle: $handle) {
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
`;

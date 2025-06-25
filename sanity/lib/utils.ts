import { createClient, type SanityClient } from 'next-sanity'
import imageUrlBuilder from "@sanity/image-url";

export const client = createClient({
	projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset:process.env.NEXT_PUBLIC_SANITY_DATASET,
	apiVersion: "2024-02-02",
	useCdn: false,
	// token,
});

const builder = imageUrlBuilder(client);

export const urlFor = (source: any) => {
	return builder.image(source);
};


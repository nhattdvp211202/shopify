import { Card, Layout, Page, Box, ResourceList, ResourceItem, Thumbnail, Text } from "@shopify/polaris";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { ProductIcon } from "@shopify/polaris-icons";
import { authenticate } from "../shopify.server";


export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(`
    query fetchProducts {
        products(first: 10) {
            edges {
                node {
                    id
                    title
                    handle
                    status
                    priceRangeV2 {
                        maxVariantPrice {
                            amount
                            currencyCode
                        }
                    }
                    featuredImage {
                        url
                        altText
                    }
                }
            }
        }
    }
`);

  const productsData = (await response.json()).data;
  console.log(productsData);
  return json({
    products: productsData.products.edges,
  });
};

export default function Products() {
  const { products } = useLoaderData();

  const renderImage = (image) => {
    return image ? (
      <Thumbnail source={image.url} alt={image.altText} />
    ) : (
      <Thumbnail source={ProductIcon} alt="Product" />
    );
  };

  const renderItem = (item) => {
    const { id, title, handle, featuredImage, status, priceRangeV2 } = item.node;
  
    return (
      <ResourceItem
        id={id}
        media={renderImage(featuredImage)}
        onClick={() => {
          shopify.toast.show(`This item is ${title}`);
        }}
      >
        <Text as="h5" variant="bodyMd">
          {title}
        </Text>
        <div>Handle: {handle}</div>
        <div>Status: {status}</div>
        <div>
          Price: {priceRangeV2.maxVariantPrice.amount} {priceRangeV2.maxVariantPrice.currencyCode}
        </div>
      </ResourceItem>
    );
  };

  return (
    <Page>
      <ui-title-bar title="Products">
        <button
          variant="primary"
          onClick={() => {
            shopify.modal.show("create-products-modal");
          }}
        >
          Create a new product
        </button>
      </ui-title-bar>

      <ui-modal id="create-products-modal">
        <ui-title-bar title="Create a new product">
          <button variant="primary" onClick={() => {}}>Ok</button>
        </ui-title-bar>
        <Box padding="500">This is where you can create new products.</Box>
      </ui-modal>

      <Layout>
        <Layout.Section>
          <Card>
            <ResourceList
              resourceName={{
                singular: "Product",
                plural: "Products",
              }}
              items={products}
              renderItem={renderItem}
            />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

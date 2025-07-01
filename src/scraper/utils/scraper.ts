import { CheerioAPI } from "cheerio";
import { ApiProperty } from "@nestjs/swagger";
const parseNumberValue = (raw: string): number => {
  return Number(raw.replace(/[^\d.]+/g, ""));
};

const parseNumberFromSelector = ($: CheerioAPI, selector: string): number => {
  const raw = $(selector).first().text();
  return parseNumberValue(raw);
};

export class ProductAttribute {
  @ApiProperty()
  label: string;

  @ApiProperty()
  value: string;
}

export class ProductDetails {
  @ApiProperty()
  title: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  listPrice: number;

  @ApiProperty()
  reviewRating: number;

  @ApiProperty()
  reviewCount: number;

  @ApiProperty({ type: [String] })
  imageUrls: string[];

  @ApiProperty({ type: [ProductAttribute] })
  attributes: ProductAttribute[];
}

const SELECTORS = {
  TITLE: "span#productTitle",
  PRICE: "span.a-price-whole",
  LIST_PRICE: "span.basisPrice .a-offscreen",
  REVIEW_RATING: "#acrPopover a > span",
  REVIEW_COUNT: "#acrCustomerReviewText",
  IMAGES: "#altImages .item img",
  PRODUCT_ATTRIBUTE_ROWS: "#productOverview_feature_div tr",
  ATTRIBUTES_LABEL: "td:nth-of-type(1) span",
  ATTRIBUTES_VALUE: "td:nth-of-type(2) span"
} as const;

const extractImageUrls = ($: CheerioAPI): string[] => {
  return $(SELECTORS.IMAGES)
    .map((_, el) => $(el).attr("src"))
    .get();
};

const extractProductAttributes = ($: CheerioAPI): ProductAttribute[] => {
  return $(SELECTORS.PRODUCT_ATTRIBUTE_ROWS)
    .map((_, row) => {
      const label = $(row).find(SELECTORS.ATTRIBUTES_LABEL).text().trim();
      const value = $(row).find(SELECTORS.ATTRIBUTES_VALUE).text().trim();
      return { label, value };
    })
    .get();
};

export const extractProductDetails = ($: CheerioAPI): ProductDetails => {
  const title = $(SELECTORS.TITLE).text().trim();
  const price = parseNumberFromSelector($, SELECTORS.PRICE);
  const listPrice = parseNumberFromSelector($, SELECTORS.LIST_PRICE);
  const reviewRating = parseNumberFromSelector($, SELECTORS.REVIEW_RATING);
  const reviewCount = parseNumberFromSelector($, SELECTORS.REVIEW_COUNT);
  const imageUrls = extractImageUrls($);
  const attributes = extractProductAttributes($);

  return {
    title,
    price,
    listPrice,
    reviewRating,
    reviewCount,
    imageUrls,
    attributes
  };
};

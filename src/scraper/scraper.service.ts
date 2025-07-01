import { Injectable, Logger } from "@nestjs/common";
import { CheerioCrawler, CheerioCrawlingContext, log } from "crawlee";
import { extractProductDetails, ProductDetails } from "./utils/scraper";
import { handleCaptchaBlocking } from "@/scraper/utils/blocking-dectection";

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  async scrapeProductPage(url: string): Promise<ProductDetails> {
    const results: ProductDetails[] = [];

    const crawler = new CheerioCrawler({
      async requestHandler(context: CheerioCrawlingContext) {
        const { request, $ } = context;
        const { url } = request;

        handleCaptchaBlocking($);

        log.info(`Scraping product page`, { url });
        const extractedProduct = extractProductDetails($);

        log.info(`Scraped product details for "${extractedProduct.title}"`, {
          url
        });

        results.push(extractedProduct);
      }
    });

    await crawler.run([url]);

    return results[0];
  }
}

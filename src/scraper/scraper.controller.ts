import { Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ScraperService } from "./scraper.service";
import { ProductDetails } from "./utils/scraper";

@ApiTags("Scraper")
@Controller("scrape")
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @Get()
  @ApiOperation({ summary: "Scrape Amazon product details" })
  @ApiQuery({
    name: "url",
    type: String,
    required: true,
    description: "Amazon product page URL"
  })
  @ApiResponse({
    status: 200,
    description: "Product details retrieved successfully",
    type: ProductDetails
  })
  async scrape(
    @Query("url") url: string
  ): Promise<ProductDetails | { error: string }> {
    if (!url) return { error: "Missing product URL" };
    return this.scraperService.scrapeProductPage(url);
  }
}

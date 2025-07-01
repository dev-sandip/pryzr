import { CheerioAPI } from "cheerio";

const CAPTCHA_SELECTOR = '[action="/errors/validateCaptcha"]';

export const handleCaptchaBlocking = ($: CheerioAPI) => {
  const isCaptcha = $(CAPTCHA_SELECTOR).length > 0;
  if (isCaptcha) throw new Error("Captcha is displayed! Retrying...");
};

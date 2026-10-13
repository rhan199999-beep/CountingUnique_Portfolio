import { test, expect } from "@playwright/test";

test.describe("portfolio", () => {
  test("hero renders real numbers and no horizontal overflow", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /hey, i'm pranay, making lifestyle-based videos/i })
    ).toBeVisible();
    await expect(page.getByAltText("Counting Unique").first()).toBeVisible();
    await expect(page.getByAltText("Pranay Gupta")).toBeVisible();
    // Live scrape or snapshot seed — either way a sub count renders.
    await expect(page.getByText(/subscribers/i).first()).toBeVisible();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test("about section summarizes Pranay", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /about me/i })
    ).toBeVisible();
    await expect(page.getByText(/two youtube channels/i)).toBeVisible();
  });

  test("mobile menu opens and navigates (375px)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    const menuButton = page.getByRole("button", { name: /menu|close/i });
    await expect(menuButton).toBeVisible();
    await menuButton.click();
    const channelsLink = page.getByRole("link", { name: "Channels", exact: true });
    await expect(channelsLink).toBeVisible();
    await channelsLink.click();
    await expect(page).toHaveURL(/#channels/);
  });

  test("desktop nav is inline (1440px)", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await expect(page.getByRole("button", { name: /menu|close/i })).toBeHidden();
    await expect(
      page.locator("header nav ul a[href='#channels']")
    ).toBeVisible();
  });

  test("anchor scrolls to latest section", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /skip to the videos/i }).click();
    await expect(page.locator("#latest")).toBeInViewport();
  });

  test("channel numbers are visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("41.1M").first()).toBeVisible();
    await expect(page.getByText("98.4M").first()).toBeVisible();
  });

  test("latest uploads section renders with content", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /fresh off youtube/i })
    ).toBeVisible();
    await expect(page.locator("#latest").getByRole("radio", { name: "Pranay Gupta" })).toBeVisible();
    // Live feed cards or curated fallback list — content either way.
    const items = page.locator("#latest a[href*='youtube.com'], #latest li");
    await expect(items.first()).toBeVisible();
    // Switching tabs swaps channels with no navigation and no scroll jump.
    const y0 = await page.evaluate(() => window.scrollY);
    await page.locator("#latest").getByRole("radio", { name: "Pranay Gupta" }).check();
    await expect(page.locator("#latest .panel-pg")).toBeVisible();
    await expect(page.locator("#latest .panel-cu")).toBeHidden();
    expect(await page.evaluate(() => window.scrollY)).toBe(y0);
    await expect(
      page.getByRole("link", { name: /browse everything from/i })
    ).toHaveAttribute("href", /youtube\.com\/results/);
  });

  test("partners section shows real brand logos", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /brands we've collaborated with/i })
    ).toBeVisible();
    for (const brand of ["Samsung", "Rapido", "Uber", "Zoho"]) {
      const logo = page.locator("#partners").getByRole("link", { name: new RegExp(`${brand} videos`, "i") }).first();
      await logo.scrollIntoViewIfNeeded();
      await expect(logo).toBeVisible();
      await expect(logo).toHaveAttribute("href", /youtube\.com/);
    }
  });

  test("analytics section draws the studio numbers", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /studio reports/i })
    ).toBeVisible();
    // Channel tabs swap the dashboard — devices donut per channel.
    const numbers = page.locator("#numbers");
    await expect(numbers.getByText("56.3%").first()).toBeVisible();
    await numbers.getByRole("tab", { name: "Pranay Gupta" }).click();
    await expect(numbers.getByText("81.9%").first()).toBeVisible();
  });

  test("contact footer links out to real channels", async ({ page }) => {
    await page.goto("/");
    const whatsapp = page.getByRole("link", { name: "WhatsApp channel", exact: true });
    await expect(whatsapp).toHaveAttribute("href", /whatsapp\.com/);
  });

  for (const width of [375, 768, 1024, 1440]) {
    test(`no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflow).toBeLessThanOrEqual(1);
    });
  }
});

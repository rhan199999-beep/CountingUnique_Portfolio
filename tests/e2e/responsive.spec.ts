import { test, expect } from "@playwright/test";

test.describe("portfolio", () => {
  test("hero names the creator and shows the newest video", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /hey, i'm pranay.*unbelievable/i })
    ).toBeVisible();
    await expect(page.getByText("Counting Unique").first()).toBeVisible();
    await expect(page.getByText("Saypranay").first()).toBeVisible();
    // Live scrape or snapshot seed — either way a sub count renders.
    await expect(page.getByText(/subscribers/i).first()).toBeVisible();
    // Above-the-fold actions.
    await expect(
      page.getByRole("link", { name: /watch latest/i }).first()
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /subscribe/i }).first()).toBeVisible();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test("about section sits directly under the hero", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /two channels\. one rule/i })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /the good stuff/i })
    ).toHaveCount(0);
  });

  test("about section summarizes Pranay and both channels", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /two channels\. one rule/i })
    ).toBeVisible();
    await expect(
      page.getByText(/I take crazy ideas seriously/i)
    ).toBeVisible();
    await expect(page.locator("#channels")).toBeVisible();
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

  test("desktop nav is inline and keeps Work with me sticky (1440px)", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await expect(page.getByRole("button", { name: /menu|close/i })).toBeHidden();
    await expect(page.locator("header nav ul a[href='#channels']")).toBeVisible();
    await expect(
      page.locator("header").getByRole("link", { name: /work with me/i })
    ).toBeVisible();
  });

  test("nav jumps to the video library without a reload", async ({ page }) => {
    await page.goto("/");
    const menuButton = page.getByRole("button", { name: /menu|close/i });
    if (await menuButton.isVisible()) {
      await menuButton.click();
    }
    await page.locator('a[href="#latest"]:visible').first().click();
    await expect(page).toHaveURL(/#latest/);
    await expect(page.locator("#latest")).toBeInViewport();
  });

  test("channel numbers are visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("41.1M").first()).toBeVisible();
    await expect(page.getByText("98.4M").first()).toBeVisible();
  });

  test("library renders category filters and swaps channels", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /the library/i })).toBeVisible();
    await expect(page.locator('label[for="tab-pg"]')).toBeVisible();
    // Category filter chips exist and "All" is the default.
    await expect(page.locator("#latest .catlabel").first()).toBeVisible();
    // Feed cards or curated fallback — content either way.
    const items = page.locator("#latest a[href*='youtube.com'], #latest li");
    await expect(items.first()).toBeVisible();
    // Switching tabs swaps channels with no navigation and no scroll jump.
    const tab = page.locator('label[for="tab-pg"]');
    await tab.scrollIntoViewIfNeeded();
    const y0 = await page.evaluate(() => window.scrollY);
    await tab.click();
    await expect(page.locator("#latest .panel-pg")).toBeVisible();
    await expect(page.locator("#latest .panel-cu")).toBeHidden();
    const y1 = await page.evaluate(() => window.scrollY);
    // Lenis can settle by a few pixels after the programmatic scroll; the
    // point is that switching tabs never navigates or jumps the page.
    expect(Math.abs(y1 - y0)).toBeLessThanOrEqual(24);
    await expect(
      page.getByRole("link", { name: /browse everything from/i })
    ).toHaveAttribute("href", /youtube\.com\/results/);
  });

  test("category filter hides non-matching cards", async ({ page }) => {
    await page.goto("/");
    const panel = page.locator("#latest .panel-cu");
    const total = await panel.locator(".video-card").count();
    const categoryInputs = panel.locator("input[id^='filter-cu-']");
    const count = await categoryInputs.count();
    // All + however many categories exist in this feed.
    expect(count).toBeGreaterThan(1);
    if (count > 1) {
      const radios = await categoryInputs.evaluateAll((els) =>
        els.map((el) => (el as HTMLInputElement).id)
      );
      const slug = radios.find((id) => id !== "filter-cu-all")!.replace("filter-cu-", "");
      await panel.locator(`label[for="filter-cu-${slug}"]`).click();
      const visible = await panel.locator(".video-card:visible").count();
      expect(visible).toBeGreaterThan(0);
      expect(visible).toBeLessThanOrEqual(total);
      const allHaveClass = await panel
        .locator(".video-card:visible")
        .evaluateAll((els, s) => els.every((el) => el.classList.contains(`vcat-${s}`)), slug);
      expect(allHaveClass).toBe(true);
    }
  });

  test("sticky mobile YouTube CTA appears on scroll", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, 900));
    await expect(
      page.getByRole("link", { name: /watch latest/i }).last()
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /^subscribe$/i }).last()
    ).toBeVisible();
  });

  test("partners section shows real brand logos", async ({ page }) => {
    // The wall drifts continuously, so run this content check with motion
    // paused (reduced-motion is a real, supported preference for the marquee).
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /brands we've collaborated with/i })
    ).toBeVisible();
    for (const brand of ["Samsung", "Rapido", "Uber", "Zoho"]) {
      const logo = page
        .locator("#partners")
        .getByRole("link", { name: new RegExp(`${brand} videos`, "i") })
        .first();
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
    const numbers = page.locator("#numbers");
    await expect(numbers.getByText("56.3%").first()).toBeVisible();
    await numbers.getByRole("tab", { name: "Pranay Gupta" }).click();
    await expect(numbers.getByText("81.9%").first()).toBeVisible();
  });

  test("work-with-me path is present", async ({ page }) => {
    await page.goto("/");
    const work = page.locator("#work");
    await work.scrollIntoViewIfNeeded();
    await expect(
      work.getByRole("heading", { name: /give me something worth filming/i })
    ).toBeVisible();
    await expect(
      work.getByRole("link", { name: /start a collab/i })
    ).toHaveAttribute("href", /whatsapp\.com/);
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

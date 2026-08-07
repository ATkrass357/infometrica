"""
Focused Playwright verification for the Webora admin accept-application dialog.

Bug under test:
The small grey description under the "Teilzeit" contract option in the
"Bewerbung akzeptieren" dialog must show the updated 20h / 2.200 € + Provision
/ 3-month probation text, and not the old 700 € base-compensation text.

This file mirrors the script executed via mcp_browser_automation in iteration 19.
"""


async def test_admin_accept_dialog_contract_descriptions(page):
    await page.set_viewport_size({"width": 1920, "height": 1080})
    await page.goto("https://keyperion-preview.preview.emergentagent.com/admin/login")
    await page.wait_for_load_state("domcontentloaded")
    await page.locator('[data-testid="admin-login-email"]').fill("admin@webora.de")
    await page.locator('[data-testid="admin-login-password"]').fill("Kp9!xRv2Lq@Zm7Tn4&Q")
    await page.locator('[data-testid="admin-login-submit"]').click()
    await page.wait_for_url("**/admin/dashboard", timeout=15000)

    await page.goto("https://keyperion-preview.preview.emergentagent.com/admin/applications")
    await page.wait_for_selector('[data-testid="admin-applications-page"]', timeout=15000)
    await page.locator('[data-testid="status-filter-select"]').select_option("all")

    accept_buttons = page.locator('[data-testid^="accept-application-"]')
    assert await accept_buttons.count() > 0, "No pending application accept action available"
    await accept_buttons.first.click()
    await page.wait_for_selector('[data-testid="accept-dialog"]', timeout=10000)

    expected_teilzeit = "20 Std./Woche · 2.200 € brutto + Provision · Probezeit 3 Monate"
    expected_teilzeit_at = "Österreich · 20 Std./Woche · 2.200 € brutto + Provision"

    teilzeit_desc = await page.locator('[data-testid="contract-type-teilzeit"] p').inner_text()
    teilzeit_at_desc = await page.locator('[data-testid="contract-type-teilzeit_at"] p').inner_text()
    dialog_text = await page.locator('[data-testid="accept-dialog"]').inner_text()

    assert teilzeit_desc == expected_teilzeit
    assert teilzeit_at_desc == expected_teilzeit_at
    assert "Grundvergütung 700" not in dialog_text
    assert "bis 20 Std./Woche" not in dialog_text

# GTM handover SchilderGoud

GTM is not installed yet. The website only initializes `window.dataLayer` and pushes analytics-ready events. Add the GTM container snippet later in the marked head location and configure consent before firing non-essential tags.

## Custom Event triggers

| dataLayer event | Recommended GTM trigger name | Purpose |
| --- | --- | --- |
| `page_context` | CE - page_context | Page context payload available on every page. |
| `cta_click` | CE - cta_click | Main CTA clicks across header, hero, services, portfolio, reviews, footer and final CTA areas. |
| `contact_click` | CE - contact_click | Phone and email link clicks. |
| `quote_form_start` | CE - quote_form_start | First interaction with an offer request form. |
| `quote_form_photo_selected` | CE - quote_form_photo_selected | Photo selection count for the quote form; no file names or sizes are sent. |
| `quote_form_submit` | CE - quote_form_submit | Valid quote form submission attempt. |
| `generate_lead` | CE - generate_lead | Successful quote request; configure as the primary conversion event. |
| `quote_form_error` | CE - quote_form_error | Quote form submission failure. |
| `before_after_interaction` | CE - before_after_interaction | First interaction with a before/after slider per session. |
| `content_card_click` | CE - content_card_click | Service and project card interactions. |
| `review_link_click` | CE - review_link_click | Google review link click. |

## Implementation notes

- Configure GA4 and Google Ads tags inside GTM only.
- Do not add GA4, Google Ads, Meta Pixel or other tracking scripts directly to page templates.
- Verify all events in GTM Preview / Tag Assistant before publishing.
- The quote form events intentionally avoid names, emails, phone numbers, free-text messages, uploaded file names, addresses and postcodes.

# Image Sourcing Rules

This guide prepares Phase 4 image choices. It does not approve downloads or publication.
The shortlist contains source pages and credits. No image files were fetched, saved, or reviewed visually.
Read each file page again before later use. A collection label alone does not clear an image.

## Allowed Licences

Prefer public-domain images, CC0, CC BY, and CC BY-SA.
Keep the exact licence version. A newer version cannot silently replace the source licence.

| Basis | Required check | Link |
| --- | --- | --- |
| Public domain | Record why both the work and its photograph qualify. Check the named country limits. | [Commons public-domain guide](https://commons.wikimedia.org/wiki/Commons:Public_domain) |
| CC0 1.0 | Confirm the image itself carries this waiver. Keep its source and credit. | [CC0 terms](https://creativecommons.org/publicdomain/zero/1.0/) |
| CC BY | Credit the creator, link the licence, and state changes. Retain supplied notices. | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| CC BY-SA | Follow attribution terms. Share adapted images under the required same or compatible licence. | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |

Older CC versions are allowed when their exact terms are recorded and met.
For multiple licence choices, record which one we will use.
Keep licence links and change notices with exported images, including images shipped in the native app.
Keep adapted image terms separate from the app code licence.
Do not add access terms that block rights granted by the image licence.

Do not shortlist fair-use images, “all rights reserved” works, or unclear “free image” offers as cleared assets.
Exclude licences that forbid commercial use or changes. Exclude permission that only covers this website or one use.
“No known restrictions” needs a stated copyright basis. It is not the same as a public-domain finding.
An ancient object can be public domain while a new photograph remains protected.
A museum's open-access policy does not cover every photograph in its collection.
The [Met policy](https://www.metmuseum.org/policies/image-resources) explains its image-level open-access checks.

Government hosting alone does not establish public-domain status.
Confirm the creator, third-party notices, and terms for the specific image.
The [NASA media guide](https://www.nasa.gov/nasa-brand-center/images-and-media/) covers credits, outside material, and limits on implied endorsement.
Do not use agency seals or logos as decoration.

## Credits And Licence Log

Use this credit pattern:

`“Title” — Creator; collection and object number; source page; licence and version; changes.`

Link the title to the source page and the licence name to its terms.
Retain any required copyright notice, credit parties, source links, and disclaimer.
Include a creator link when the source supplies one.
For public-domain images, state the basis and credit the source even when attribution is optional.
For museum objects, include the museum's supplied credit line and accession number.
State actual changes, such as “Cropped and resized.” Never claim “Unchanged” after editing.
Shortlist credits describe unmodified source candidates; they are not final export credits.
Use the CSV template when an image enters production. Leave unknown fields blank and mark the row HOLD.

The log records the source-page revision, check date, rights evidence, intended use, and unresolved questions.
Later, add the local file path, checksum, pixel size, crop, and final credit.
Do not fill download fields during this preparation task.
Follow the [Commons reuse guide](https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia) when checking individual file pages.

## Evidence, Context, And Illustration

An image is evidence only for a claim its source and the approved record support.
A photograph can document an object, an inscription, or a visible feature.
It cannot establish an entire story merely because its subject appears in that story.
A museum object needs a catalogue identity. A text detail needs a verified passage and edition.
Never imply that a decorative page contains the disputed words without checking that page.
A coin portrait documents an ancient design. It does not establish a ruler's exact appearance.
Ancient reliefs show ancient portrayals. They are not photographs of the events shown.

Use “Context” for landscapes, later buildings, broad settings, and objects outside a record's direct evidence.
Name modern places as modern places. State when a site is proposed, traditional, restored, or partly rebuilt.
Keep the record's doubts and limits. A place photo cannot settle a disputed location or date.
Use plain captions and source details to distinguish surviving material from later work.
Do not infer borders, ownership, or ancient populations from modern map labels.

Use “Illustration” for imagined scenes, reconstructions, diagrams, and generated artwork.
Label these beside the image, even when the source's filename sounds historical.
Never present imagined art as evidence or as a real portrait.
No imagined scenes are selected in this shortlist.

Follow the AGENTS.md portrayal rule:

- Human illustrations show people of the ancient Near East and Africa.
- Include varied skin tones, features, and natural hair textures.
- Portray people with dignity.
- Imagined artwork is never presented as historical evidence or a real portrait.

Welcome people of any faith or none. Do not assume belief or prior knowledge.
Write captions at grades 6–8, averaged by collection. Keep sentences within 20 words and card blurbs within 15.
Explain unfamiliar terms. Preserve source titles and scripture quotations as supplied.
Run `npm run check:readability` after content changes. Review new captions separately if the checker does not scan them.

## Phone Format And Size Targets

These are proposed Phase 4 targets, not claims about files downloaded here.

| Use | Pixel target | Encoded size target | Framing |
| --- | --- | --- | --- |
| Small card | 640 pixels wide | At most 100 KB | Keep the main subject clear at phone width. |
| Large card | 960 pixels wide | At most 180 KB | Offer a safe crop for a 4:3 frame. |
| Detail photo | 1600 pixels on the long edge | At most 350 KB | Preserve the full object or landscape. |
| Inscription detail | Up to 2400 pixels on the long edge | At most 700 KB | Keep letters readable; add a linked transcription. |

Use WebP for photographs, with JPEG where needed. Consider AVIF only after checking supported app browsers.
Use PNG for transparency or details that compression damages. Keep the source aspect ratio for evidence views.
Do not enlarge a small source to meet a target. Flag it for replacement.
Avoid GIF animation and text baked into images. Respect reduced motion and provide meaningful alt text.
Store width and height to prevent page shifts. Load offscreen images only when needed.
Provide a clear image-open action and a nearby Sources link with thumb-sized controls.
Keep credits reachable without covering the image. Check contrast and legibility at narrow phone widths.

Do not invent missing edges or letters with image generation.
Record crops, colour changes, and sharpening. Keep a full view available when a crop could mislead.
Remove private location metadata when needed; retain rights and source details in the licence log.
Before later download, resolve each HOLD. Then check visual quality, orientation, source dimensions, and any stated rights limits.

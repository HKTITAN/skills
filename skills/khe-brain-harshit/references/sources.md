---
title: sources
summary: How his X and LinkedIn archive was read, what was left out, every post the theme files cite with its URL and date, and how to refresh. The gate reads the table to check every citation.
---

# Sources

This skill is a reading of what Harshit Khemani has posted himself on X (@HarshitKhemani) and LinkedIn, taken from his own data exports of 13 November 2026 and read on 2026-11-15. When this file and a post disagree, the post is right.

Every claim in the theme files ends with `(post, URL)`, where the post's name is the date it went up and its first words, as the table below has it. A reply cites a post as `(post)` inside the sentence and as `Source: post, URL` under the answer. The gate (`scripts/brain-check.mjs`) reads the first two columns of the table, so a name that is not here cannot be cited.

## The archive

| Kind | Count | Read how |
|---|---|---|
| Main set: X posts with self-threads merged into their first post, X community posts, X replies of 200 characters or more, 2 X articles and 199 LinkedIn posts | 1,951 | In full, in 8 batches, one note per batch with a claim, a date and a link per line |
| X replies to other people of under 200 characters | 5,902 | In full, in 4 batches, keeping only the replies that state a view, a fact about his work or a story |
| In all | 7,853 items, December 2020 to November 2026 | Every quote in the theme files was checked by script against the post it cites |

Read in all: his posts, his self-threads, his long-form notes, his X community posts, his two X articles and his LinkedIn posts. The theme files cite the posts below; a post not cited here was read and carried no position worth a line.

## How it was read

- **One claim, one post.** Every line in a theme file is a paraphrase of one or two posts, with the post's date and link. The few quotes are under 15 words each and were matched character for character against the post by script.
- **Two eras.** Posts before June 2025 are a different writer: emoji threads, hashtags, Notion tips and feature requests. From June 2025 he writes in lowercase with short lines about AI, agents, games and design. A line from before June 2025 carries its year in the theme files.
- **Replies are context-bound.** A reply answers someone else's post. A line taken from a reply says so, and is never a manifesto.
- **Relays are not his.** Where he summarises someone else (Greg Isenberg's list, a Dan Shipper episode, a Tim Sweeney interview, a line he credits to Rishitabh Thapliyal), the theme files say whose idea it is.
- **Left out on purpose.** Direct messages were never opened. Money he has, earned, raised or was paid, deal prices, internal or deck numbers, anything about the $SMASH token, and the names of his school and college are not in any file, even where a public post mentions them. Likes, bookmarks, follows, Grok chats, ads data and deleted posts were not read.
- **Campus Binge.** He leads Product & Design there; the founder is Rishitabh Thapliyal.

## Not in the corpus

| Material | Why it is not in the corpus |
|---|---|
| Direct messages on X and LinkedIn | Private. Never opened. |
| His khe.money site, notes and essays | Not part of the exports. A refresh may add them as their own rows. |
| His Notion pages, decks and docs | Private working material, not posts. |
| Posts after 13 November 2026 | Newer than the export. |
| Instagram, YouTube, Threads, Snapchat | Not exported. |
| Deleted posts | Withdrawn by him. |

## Refresh

1. Request new X and LinkedIn exports and extract them outside the skill folder.
2. Read every post newer than 2026-11-13 the same way: one note per batch, a claim, a date and a link per line, quotes checked by script.
3. Add each new claim to its theme file with its `(post, URL)`, add the post's row to the table below, and check [disagreements](disagreements.md) and [silent](silent.md): a new post can end a silence or move a view.
4. Run `node scripts/brain-check.mjs --self-test`.

## The posts

| Post | URL | Date | Where | First words |
|---|---|---|---|---|
| post archive | https://x.com/HarshitKhemani | 2020-12 to 2026-11 | X profile | The account every X post here comes from; the evidence for what is and is not in the corpus |
| 2022-01-20-notionhq-can-add-option | https://x.com/HarshitKhemani/status/1484001421649653765 | 2022-01-20 | X reply | @NotionHQ Can you add an option to switch between the two? I ... |
| 2022-02-04-what-benefits-joining-homework | https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A6895334143404634112 | 2022-02-04 | LinkedIn post | What are the benefits of joining Homework Bros? |
| 2022-04-06-tallyforms-notionhq-saviomartin7-heyeaslo | https://x.com/HarshitKhemani/status/1511685724768124930 | 2022-04-06 | X reply | @TallyForms @NotionHQ @saviomartin7 @heyeaslo No... actually, I wanted something like this: If ... |
| 2022-04-25-buy-notion-day-planner | https://x.com/HarshitKhemani/status/1518590289078009856 | 2022-04-25 | X post | Buy Notion Day Planner on @Gumroad https://harshitkhemani.gumroad.com/l/dayplanner |
| 2022-04-30-heyeaslo-notionhq-hey-am | https://x.com/HarshitKhemani/status/1520278069306478592 | 2022-04-30 | X reply | @heyeaslo @NotionHQ Hey! I am running a startup @Homework\_Bros with @Anav\_Chawla ... ... |
| 2022-05-03-super-make-custom-code | https://x.com/HarshitKhemani/status/1521490345686618112 | 2022-05-03 | X reply | @super\_ make custom code free for all :/ |
| 2022-05-07-mohtab-heyeaslo-here-go | https://x.com/HarshitKhemani/status/1522856881420926977 | 2022-05-07 | X reply | @mohtab @heyeaslo Here you go : https://harshitkhemani.super.site/ |
| 2022-05-09-anav-chawla-heyraiu-karthik | https://x.com/HarshitKhemani/status/1523540283958657024 | 2022-05-09 | X reply | @Anav\_Chawla @heyraiu @just\_karthik\_ @NotionHQ @canva @TallyForms @unsplash @gumroad @hypefury @jittervideo @Taskade @figma ... |
| 2022-05-09-hey-issam-redgregory1-if | https://x.com/HarshitKhemani/status/1523548069991567360 | 2022-05-09 | X reply | @hey\_issam @RedGregory1 If you make a large heading around 7-8 words, it ... |
| 2022-05-09-karthik-super-super-saas | https://x.com/HarshitKhemani/status/1523670087647244289 | 2022-05-09 | X reply | @just\_karthik\_ @super\_ Super is a SaaS built on top of the Notion ... |
| 2022-05-10-mishacreator-firefox-opera-googlechrome | https://x.com/HarshitKhemani/status/1523975511709392896 | 2022-05-10 | X reply | @mishacreator @firefox @opera @googlechrome @MicrosoftEdge yea... I first used chrome then I ... |
| 2022-05-10-mishacreator-firefox-opera-googlechrome-2 | https://x.com/HarshitKhemani/status/1523976243674112000 | 2022-05-10 | X reply | @mishacreator @firefox @opera @googlechrome @MicrosoftEdge Here are some quick features that I ... |
| 2022-05-10-undraw-co-has-one | https://x.com/HarshitKhemani/status/1523968502234632193 | 2022-05-10 | X reply | @unDraw\_co has to be one of the best illustration libraries I have ... |
| 2022-05-14-am-finally-notion-certified | https://x.com/HarshitKhemani/status/1525501981866881025 | 2022-05-14 | X post | I am finally Notion Certified! |
| 2022-05-14-amngpta-gumroad-notionapi-like | https://x.com/HarshitKhemani/status/1525311952494288896 | 2022-05-14 | X reply | @amngpta @gumroad @NotionAPI like product embeds but better |
| 2022-05-15-itsjustbayu-notionhq-quick-tip | https://x.com/HarshitKhemani/status/1525863188629450755 | 2022-05-15 | X reply | @itsjustbayu @NotionHQ Quick tip : Make a formula property and mention the ... |
| 2022-05-16-am-launching-thread-series | https://x.com/HarshitKhemani/status/1526052776890929152 | 2022-05-16 | X post | I am launching a thread series '👨🏻‍🔬Formula Laboratory' where I will be ... |
| 2022-05-16-anav-chawla-iampascio-notionhq | https://x.com/HarshitKhemani/status/1526038130801152001 | 2022-05-16 | X reply | @Anav\_Chawla @IAmPascio @NotionHQ ikrr it's fun creating stuff rather than using it ... |
| 2022-05-16-anav-chawla-inotionhq-heyzoish | https://x.com/HarshitKhemani/status/1526238030855835649 | 2022-05-16 | X reply | @Anav\_Chawla @iNotionHQ @heyzoish Not every time though... if you need to record ... |
| 2022-05-16-simsays00-anav-chawla-notionhq | https://x.com/HarshitKhemani/status/1526176512860631040 | 2022-05-16 | X community reply | @simsays00 @Anav\_Chawla @NotionHQ Ohh then I guess you should focus on enhancing ... |
| 2022-05-16-thread-formula-laboratory-01 | https://x.com/HarshitKhemani/status/1526052223540600832 | 2022-05-16 | X post | (🧵Thread) |
| 2022-05-16-wanna-get-free-udemy | https://x.com/HarshitKhemani/status/1526185945103757312 | 2022-05-16 | X post | 💁🏻‍♂️Wanna get FREE Udemy Coupon Codes? (🧵Thread) |
| 2022-05-18-victor-bigfield-well-can | https://x.com/HarshitKhemani/status/1526787094068490240 | 2022-05-18 | X reply | @victor\_bigfield Well, we can upload stuff in the consumer tab too! Twitter ... |
| 2022-05-19-notionops-ohh-think-canny | https://x.com/HarshitKhemani/status/1527130572593983488 | 2022-05-19 | X community reply | @NotionOps ohh... I think canny would provide a better solution because users ... |
| 2022-05-20-learn-notion-free-gathered | https://x.com/HarshitKhemani/status/1527557854814683137 | 2022-05-20 | X post | 💁🏻‍♂️Learn Notion for FREE |
| 2022-05-23-health-analyst-analyze-your | https://x.com/HarshitKhemani/status/1528751704707309569 | 2022-05-23 | X post | Health Analyst: Analyze your health with the help of an AI based ... |
| 2022-06-06-buymeacoffee-notionhq-paytable-looking | https://x.com/HarshitKhemani/status/1533828629435920386 | 2022-06-06 | X reply | @youssefhdarwish @buymeacoffee @NotionHQ @paytable I was looking for a free alternative as ... |
| 2022-06-09-v3-1-0-out | https://x.com/HarshitKhemani/status/1534831093618442240 | 2022-06-09 | X post | v3.1.0 is out now! https://x.com/Homework\_Bros/status/1534830806908440578 |
| 2022-06-14-e17az-cron-raphaelschaad-invited | https://x.com/HarshitKhemani/status/1536544861070823424 | 2022-06-14 | X reply | @e17az @Cron @raphaelschaad invited me to @Cron today haha... I didn't get ... |
| 2022-06-16-lets-build-community-built | https://x.com/HarshitKhemani/status/1537391010036461568 | 2022-06-16 | X post | 💁🏻‍♂️ Let's build a community-built 'Mega-Thread' for Marketing Tips. |
| 2022-06-18-tdinh-thanks-well-offer | https://x.com/HarshitKhemani/status/1538087552292634624 | 2022-06-18 | X reply | @tdinh\_me Thanks, |
| 2022-06-22-coda-hq-thecodaguy-homework | https://x.com/HarshitKhemani/status/1539647365451108352 | 2022-06-22 | X reply | @coda\_hq @thecodaguy @Homework\_Bros Thanks, but would you mind fixing this for new ... |
| 2022-06-22-karthik-notionhq-eah-sure | https://x.com/HarshitKhemani/status/1539618495503007745 | 2022-06-22 | X reply | @just\_karthik\_ @NotionHQ Eah sure! I wanted something minimal to match the layout ... |
| 2022-06-27-uniquebots-biodotlink-ik-domains | https://x.com/HarshitKhemani/status/1541290216119361536 | 2022-06-27 | X reply | @KnightLiteKing @UniqueBots @biodotlink ik the domains are paid but... connecting them should ... |
| 2022-07-16-make-hq-updates-tallyforms | https://x.com/HarshitKhemani/status/1548135916832583680 | 2022-07-16 | X reply | @make\_hq\_updates @TallyForms haha I love the sync databases in @coda\_hq ... I ... |
| 2022-07-16-matt-gray-try-out | https://x.com/HarshitKhemani/status/1548303800791797760 | 2022-07-16 | X reply | @matt\_gray\_ try out spade, it's a really good extension for annotation of ... |
| 2022-07-31-thank-much-o-200 | https://x.com/HarshitKhemani/status/1553614613333192704 | 2022-07-31 | X post | 👉🏻👈🏻Thank you so much :o |
| 2022-08-20-really-underrated-chrome-extension | https://x.com/HarshitKhemani/status/1560875529166733312 | 2022-08-20 | X reply | @SpadeForChrome is a really underrated chrome extension. |
| 2022-08-21-am-happy-announce-homework | https://x.com/HarshitKhemani/status/1561231705783951360 | 2022-08-21 | X post | I am happy to announce that @Homework\_Bros is now a Notion Community! |
| 2022-08-28-francescod-ales-notion-will | https://x.com/HarshitKhemani/status/1563818373170941952 | 2022-08-28 | X reply | @FrancescoD\_Ales Notion will still remain the top tier workspace for me though. ... |
| 2022-09-01-notionhq-possible-restrict-page | https://x.com/HarshitKhemani/status/1565219602455756802 | 2022-09-01 | X reply | @NotionHQ is it possible to restrict page creation in the workspace section ... |
| 2022-09-09-got-try-out-beta | https://x.com/HarshitKhemani/status/1568206199937695744 | 2022-09-09 | X post | I just got to try out the beta release of @nexsnap for ... |
| 2022-09-18-nexsnap-has-one-go | https://x.com/HarshitKhemani/status/1571420576992104449 | 2022-09-18 | X post | Nexsnap has to be one of the go-to tools in my productivity ... |
| 2022-09-21-filipminev-tallyforms-mariemartens-yes | https://x.com/HarshitKhemani/status/1572466868950306817 | 2022-09-21 | X reply | @filipminev @TallyForms @MarieMartens yes but I am thinking of customising webhook links ... |
| 2022-10-06-dashlane-oh-alright-authenticator | https://x.com/HarshitKhemani/status/1578055831308103681 | 2022-10-06 | X reply | @DashlaneSupport @dashlane oh alright, for the authenticator, I was thinking it would ... |
| 2022-11-01-wanna-have-audience-notion | https://x.com/HarshitKhemani/status/1587479293856460800 | 2022-11-01 | X post | 😍 Wanna have an audience of Notion creators to share your notion ... |
| 2022-11-07-notionhq-feature-idea-upload | https://x.com/HarshitKhemani/status/1589466526591352832 | 2022-11-07 | X reply | @NotionHQ feature idea: |
| 2022-11-08-am-now-notionhq-partner | https://x.com/HarshitKhemani/status/1589905510492700672 | 2022-11-08 | X post | I am now a @NotionHQ Partner, so when you sign up with ... |
| 2022-11-16-notionhq-feature-suggestion-adding | https://x.com/HarshitKhemani/status/1592688333670744064 | 2022-11-16 | X reply | @NotionHQ feature suggestion: adding quick database entries from a widget on your ... |
| 2022-11-19-elonmusk-jack-lucididy-instead | https://x.com/HarshitKhemani/status/1593850081920561152 | 2022-11-19 | X reply | @elonmusk @jack @Lucididy @jordanbpeterson Instead of making the blue checks paid for ... |
| 2022-11-23-get-started-by-joining | https://x.com/HarshitKhemani/status/1595446693742641154 | 2022-11-23 | X reply | @severinschuetz Get started by joining some communities ;) |
| 2022-11-23-join-communities-by-no | https://x.com/HarshitKhemani/status/1595391914601160708 | 2022-11-23 | X post | Join communities by No-Code Central on @WhatsApp to get engaged with your ... |
| 2022-11-28-latest-template-reached-10 | https://x.com/HarshitKhemani/status/1597200069052485635 | 2022-11-28 | X post | My latest template just reached 10 downloads. Check it out if you ... |
| 2022-11-30-finding-customers-doesnt-have | https://x.com/HarshitKhemani/status/1597886883492933634 | 2022-11-30 | X post | Finding customers doesn't have to be expensive. |
| 2022-12-07-ayesha-notion-meanwhile | https://x.com/HarshitKhemani/status/1600302058690994176 | 2022-12-07 | X reply | @severinschuetz @ayesha\_notion meanwhile me: 🥲😂 |
| 2022-12-07-nccs-notion-community-has | https://x.com/HarshitKhemani/status/1600302342968311809 | 2022-12-07 | X post | NCC's Notion community has surpassed 80 participants! Join now :) https://x.com/HarshitKhemani/status/1595391914601160708 |
| 2022-12-08-notionhead-nexbotai-haha-not | https://x.com/HarshitKhemani/status/1600911851419598848 | 2022-12-08 | X reply | @notionhead @NexBotAI @HealthAnalystHQ haha it's not even close to launching but yes ... |
| 2022-12-08-notionhead-will-soon-saw | https://x.com/HarshitKhemani/status/1600907399426363393 | 2022-12-08 | X reply | @notionhead it will be soon, we saw apps like @NexBotAI built on ... |
| 2022-12-11-biodotlink-pretty-cool-service | https://x.com/HarshitKhemani/status/1601755382938234881 | 2022-12-11 | X reply | @YasithaOfficial @biodotlink It's a pretty cool service, I have to say that... ... |
| 2022-12-14-join-now-100-counting | https://x.com/HarshitKhemani/status/1602953948616589313 | 2022-12-14 | X post | Join now! 100+ and counting :) https://x.com/HarshitKhemani/status/1595391914601160708 |
| 2022-12-14-wish-someone-could-make | https://x.com/HarshitKhemani/status/1603062491382427650 | 2022-12-14 | X post | I wish someone could make a ChatGPT integration for @NotionHQ so that ... |
| 2022-12-15-did-know-no-code | https://x.com/HarshitKhemani/status/1603451384678223873 | 2022-12-15 | X post | Did you know that No-Code tools are rapidly becoming more popular? These ... |
| 2022-12-21-came-across-link-bio | https://x.com/HarshitKhemani/status/1605553718484537344 | 2022-12-21 | X post | Just came across this Link in Bio tool @joinbento a week ago. ... |
| 2022-12-26-thevideowizz-true-but-chatgpt | https://x.com/HarshitKhemani/status/1607434341881384960 | 2022-12-26 | X reply | @HabibtheCurator @TheVideoWizz True, but, ChatGPT is pretty impressive ngl... If dealt with ... |
| 2022-12-30-365th-notion-certified-user | https://x.com/HarshitKhemani/status/1608840122883268609 | 2022-12-30 | X post | I was the 365th Notion Certified User followed by @Anav\_Chawla at 366th ... |
| 2022-12-31-glad-part-team-were | https://x.com/HarshitKhemani/status/1609067250119770112 | 2022-12-31 | X post | Glad to be part of the team! |
| 2023-01-02-ecogensocial-delhi-have | https://x.com/HarshitKhemani/status/1609791768387817474 | 2023-01-02 | X reply | @EcogenSocial @his college\_delhi |
| 2023-01-02-mikescops-dashlane-keep-mind | https://x.com/HarshitKhemani/status/1609835434196238336 | 2023-01-02 | X reply | @MikeScops @dashlane @DashlaneSupport understandable, just keep it in mind for the future ... |
| 2023-01-11-omnagupta-vensykrishna-am-ngl | https://x.com/HarshitKhemani/status/1613174745914314752 | 2023-01-11 | X reply | @OmnaGupta @vensykrishna I am ngl, I opened the app, saw how complex ... |
| 2023-01-13-iampascio-building-ecogen-ecogensocial | https://x.com/HarshitKhemani/status/1613765453977096192 | 2023-01-13 | X reply | @IAmPascio I'm building EcoGen(@EcogenSocial), an app that promotes eco-friendly actions by tracking ... |
| 2023-01-13-thread-alert-becoming-highly | https://x.com/HarshitKhemani/status/1613886735783723014 | 2023-01-13 | X post | 🧵 Thread Alert! Becoming a highly creative person takes time and effort, ... |
| 2023-01-14-dashlane-get-why-icloud | https://x.com/HarshitKhemani/status/1614088227216052225 | 2023-01-14 | X reply | @yuvrajjsinghh18 @dashlane I get why iCloud is preferred, but I prefer @dashlane's ... |
| 2023-01-16-thenocodecrew-productivity-tip-use | https://x.com/HarshitKhemani/status/1615007027809644544 | 2023-01-16 | X reply | @TheNoCodeCrew Productivity tip: |
| 2023-01-16-trying-land-internship-designer | https://x.com/HarshitKhemani/status/1615015077673062401 | 2023-01-16 | X post | Are you trying to land an internship as a designer? Check out ... |
| 2023-01-18-choosing-college-major-field | https://x.com/HarshitKhemani/status/1615655641359740928 | 2023-01-18 | X post | Choosing a college major or field of study can be tough. Here ... |
| 2023-01-25-ismailsafwat-producthunt-windows-first | https://x.com/HarshitKhemani/status/1618056122648387585 | 2023-01-25 | X reply | @ismailsafwat @ProductHunt @browsercompany Windows first 🔫🥺 |
| 2023-01-26-yankovich-manganumapp-arcinternet-googlechrome | https://x.com/HarshitKhemani/status/1618659970341556224 | 2023-01-26 | X reply | @Yankovich\_ @manganumapp @ArcInternet @googlechrome haha nice work guys! 🙌 |
| 2023-01-27-what-do-think-artists | https://x.com/HarshitKhemani/status/1618976334465863683 | 2023-01-27 | X post | What do you think? Are artists like @JaiBuaniaw, @heysallywong, and many other ... |
| 2023-01-30-thecodaguy-coda-hq-wish | https://x.com/HarshitKhemani/status/1619869482192875520 | 2023-01-30 | X reply | @thecodaguy @coda\_hq I wish @NotionHQ had this natively... Idrk why I just ... |
| 2023-01-30-yankovich-manganumapp-aha-saw | https://x.com/HarshitKhemani/status/1619975841680850944 | 2023-01-30 | X reply | @Yankovich\_ @manganumapp aha I saw that tweet but that isn't what I ... |
| 2023-02-03-iameribyte-mrbeast-elonmusk-start | https://x.com/HarshitKhemani/status/1621550310690029570 | 2023-02-03 | X reply | @iameribyte @MrBeast @elonmusk Start with informative threads. They boost your account by ... |
| 2023-02-05-dannyhatcher-obsdmd-notionhq-when | https://x.com/HarshitKhemani/status/1622242939400495109 | 2023-02-05 | X reply | @DannyHatcher @obsdmd @NotionHQ when chatgpt api comes out, notion is gonna dominate ... |
| 2023-02-26-join-our-whatsapp-group | https://x.com/HarshitKhemani/status/1629834033495670787 | 2023-02-26 | X post | Join our WhatsApp group for @joinbento enthusiasts! Connect with like-minded Bentonauts, share ... |
| 2023-03-11-recently-removed-from-notion | https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7040148829328785408 | 2023-03-11 | LinkedIn post | I was recently removed from the Notion Certifications workspace on Notion without ... |
| 2023-03-12-didnt-think-would-ever | https://x.com/HarshitKhemani/status/1634738968099946498 | 2023-03-12 | X post | I didn't think I would ever say this but Notion just doesn't ... |
| 2023-03-13-man-they-really-charging | https://x.com/HarshitKhemani/status/1635196636006850560 | 2023-03-13 | X reply | @Kushiiiiiiiiya man, they really be charging for basic authentication now? lmao 💀 |
| 2023-03-14-update-access-has-been | https://x.com/HarshitKhemani/status/1635549314234851328 | 2023-03-14 | X post | Update: My access has been restored and I have successfully backed up ... |
| 2023-04-10-nerdymomocat-yudax-joinbento-oliverbytes | https://x.com/HarshitKhemani/status/1645382889603735552 | 2023-04-10 | X reply | @nerdymomocat @\_yudax @joinbento @oliverbytes I mostly give honest feedback, even if it's ... |
| 2023-05-05-try-method-lsc-cornell | https://x.com/HarshitKhemani/status/1654416524554141697 | 2023-05-05 | X reply | @rudradepponmusk Try this method: |
| 2023-06-28-thoughts-second-brain-technique | https://x.com/HarshitKhemani/status/1674091179737055232 | 2023-06-28 | X post | 🧠💭 Thoughts on the Second Brain Technique: A Different Perspective |
| 2023-08-24-started-using-literally-yesterday | https://x.com/HarshitKhemani/status/1694654311748301186 | 2023-08-24 | X post | I started using @fabricinternet literally yesterday, and it's gotta be one of ... |
| 2023-08-31-sev-estil-introduced-some | https://x.com/HarshitKhemani/status/1697190444080173493 | 2023-08-31 | X reply | @sev\_estil I introduced some of my friends to Notion (features-wise), when they ... |
| 2024-02-06-m-happy-share-ve | https://x.com/HarshitKhemani/status/1754790578011963833 | 2024-02-06 | X post | I’m happy to share that I’ve obtained a new certification: Notion Advanced ... |
| 2024-03-11-received-certificate-microsoft-student | https://www.linkedin.com/feed/update/urn%3Ali%3AugcPost%3A7172773882116861952 | 2024-03-11 | LinkedIn post | Just received the certificate for Microsoft Student Ambassadors - Azure Fundamentals Cloud ... |
| 2024-03-14-daily-app-stack-browser | https://x.com/HarshitKhemani/status/1768171898125336643 | 2024-03-14 | X post | This is my daily app stack: |
| 2024-03-14-have-been-trying-like | https://x.com/HarshitKhemani/status/1768173058668290417 | 2024-03-14 | X post | I have been trying @AFFiNEOfficial |
| 2024-03-16-m-happy-share-ve | https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7174803158311866368 | 2024-03-16 | LinkedIn post | I’m happy to share that I’ve obtained a new certification: |
| 2024-03-20-dont-build-something-people | https://x.com/HarshitKhemani/status/1770359490082193800 | 2024-03-20 | X post | Don't build something people don't want a solution for. Build something they ... |
| 2024-04-08-taskade-knowledge-game-changer | https://x.com/HarshitKhemani/status/1777153249386074417 | 2024-04-08 | X reply | @Taskade 'Knowledge' is a game changer for students. It allows you to ... |
| 2024-04-16-mfreihaendig-mean-annually-total | https://x.com/HarshitKhemani/status/1780256519558431083 | 2024-04-16 | X reply | @MFreihaendig I mean, is that annually or in total? Because it's way ... |
| 2024-04-19-came-back-from-notion | https://x.com/HarshitKhemani/status/1781354412625314043 | 2024-04-19 | X post | Just came back from the Notion Gurugram meetup! |
| 2024-06-04-thenotionbar-notionhq-tried-importing | https://x.com/HarshitKhemani/status/1797820624683040888 | 2024-06-04 | X reply | @thenotionbar @NotionHQ Tried importing a 1,000+ pages PDF, Notion gave up. |
| 2024-07-06-am-thrilled-share-have | https://www.linkedin.com/feed/update/urn%3Ali%3AugcPost%3A7215248673008439297 | 2024-07-06 | LinkedIn post | I am thrilled to share that I have received a certificate from ... |
| 2024-07-18-exploring-mediapipe-last-night | https://x.com/HarshitKhemani/status/1813762536749269203 | 2024-07-18 | X post | I was exploring mediapipe last night, pretty cool ngl. |
| 2024-08-02-notnotrachit-zorin-maybe-prefer | https://x.com/HarshitKhemani/status/1819287894051176692 | 2024-08-02 | X reply | @notnotrachit zorin maybe? i prefer windows cuz of the linux subsystem now ... |
| 2024-08-04-happy-share-ive-been | https://x.com/HarshitKhemani/status/1820044665762005150 | 2024-08-04 | X post | I'm happy to share that I've been selected as a Notion Campus ... |
| 2024-08-06-exciting-news-thrilled-announce | https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7226582655021068288 | 2024-08-06 | LinkedIn post | 🌟 Exciting News! 🌟 |
| 2024-08-23-during-induction-program | https://www.linkedin.com/feed/update/urn%3Ali%3AugcPost%3A7232759371565314050 | 2024-08-23 | LinkedIn post | During my induction program at his college, I had the privilege of ... |
| 2024-09-09-recently-conducted-1-1 | https://www.linkedin.com/feed/update/urn%3Ali%3AugcPost%3A7238954886871031808 | 2024-09-09 | LinkedIn post | I recently conducted a 1:1 session with a beginner-level tech student who ... |
| 2024-09-27-final-day-university | https://www.linkedin.com/feed/update/urn%3Ali%3AugcPost%3A7245452918449987587 | 2024-09-27 | LinkedIn post | On the final day of the his college Startup Genesis Bootcamp, we ... |
| 2024-09-29-gear-up-launch-startup | https://www.linkedin.com/feed/update/urn%3Ali%3AugcPost%3A7246039933356761088 | 2024-09-29 | LinkedIn post | As I gear up to launch my startup, I’m in need of ... |
| 2024-09-29-if-look-almost-all | https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7246177799542112258 | 2024-09-29 | LinkedIn post | If you look at almost all the biggest startups (mostly from 2010 ... |
| 2024-10-01-thrilled-share-friendzone-has | https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7246679523667140608 | 2024-10-01 | LinkedIn post | I'm thrilled to share that The Friendzone has just hit 100 subscribers! ... |
| 2024-10-17-proud-have-introduced-luna | https://www.linkedin.com/feed/update/urn%3Ali%3AugcPost%3A7252600570413240320 | 2024-10-17 | LinkedIn post | 🚀 Proud to have introduced Luna at Synergy 2024, Delhi's biggest tech ... |
| 2024-10-27-omnagupta-looks-cool-using | https://x.com/HarshitKhemani/status/1850535028624634177 | 2024-10-27 | X reply | @OmnaGupta looks cool! are you using @Taskade for this? I’ve been loving ... |
| 2024-11-26-excited-share-team-luna | https://www.linkedin.com/feed/update/urn%3Ali%3AugcPost%3A7267115100220592129 | 2024-11-26 | LinkedIn post | 🎉 Excited to share that Team Luna secured 2nd place in Ideathon ... |
| 2024-11-26-if-ve-been-living | https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7267179196303499264 | 2024-11-26 | LinkedIn post | If you’ve been living under a rock, let me catch you up. |
| 2024-11-27-recently-came-across-best | https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7267574465083899906 | 2024-11-27 | LinkedIn post | I recently came across the best definition of product positioning I've seen: |
| 2024-11-27-repeated-behaviors-consistent-dopamine | https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7267573872357457921 | 2024-11-27 | LinkedIn post | Repeated behaviors with consistent dopamine release become habits.' But how does this ... |
| 2024-11-27-today-s-session-yashwardhan | https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7267460174527758336 | 2024-11-27 | LinkedIn post | Today’s session with Yashwardhan Burad, CEO & Co-Founder of AccioJob, at his college ... |
| 2024-11-28-every-entrepreneur-starts-idea | https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7267810893000781824 | 2024-11-28 | LinkedIn post | Every entrepreneur starts with an idea, but success comes from turning that ... |
| 2024-11-30-your-brain-having-ideas | https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7268611283665461248 | 2024-11-30 | LinkedIn post | Your brain is for having ideas, not holding them.' - David Allen |
| 2024-12-01-biggest-lie-productivity-work | https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7268905849153044481 | 2024-12-01 | LinkedIn post | The biggest lie in productivity? 'I work better under pressure.' |
| 2024-12-01-every-idea-needs-execution | https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7268907904663973889 | 2024-12-01 | LinkedIn post | Every idea needs execution, but execution needs strategy. |
| 2024-12-01-give-someone-matchbox-theyll | https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7268908744682401792 | 2024-12-01 | LinkedIn post | Give someone a matchbox and they'll probably just open it. Give them ... |
| 2024-12-01-most-expensive-advice-one | https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7268907331264884736 | 2024-12-01 | LinkedIn post | The most expensive advice is the one you don't take. |
| 2024-12-01-most-powerful-skill-knowing | https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7268911974007074817 | 2024-12-01 | LinkedIn post | The most powerful skill? Knowing when to quit. |
| 2024-12-01-what-if-treated-life | https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7268904108428804096 | 2024-12-01 | LinkedIn post | What if we treated life like Notion treats content? |
| 2024-12-01-your-network-your-net | https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7268905361481306112 | 2024-12-01 | LinkedIn post | Your network is your net worth' - but here's what they don't ... |
| 2024-12-01-your-productivity-system-making | https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7268909771372527616 | 2024-12-01 | LinkedIn post | Your 'productivity system' is making you less productive. |
| 2024-12-04-spotify-wrapped-2024-has | https://www.linkedin.com/feed/update/urn%3Ali%3AugcPost%3A7270076489117642755 | 2024-12-04 | LinkedIn post | Spotify Wrapped 2024 has arrived, and while it’s a fun way to ... |
| 2024-12-07-am-too-young-start | https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7271081968077799424 | 2024-12-07 | LinkedIn post | I am too young to start.' Sounds familiar? 👇 |
| 2024-12-07-eat-frog-phrase-might | https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7271098592306565120 | 2024-12-07 | LinkedIn post | Eat the frog. |
| 2024-12-07-imagine-all-knowledge-your | https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7271075418722463745 | 2024-12-07 | LinkedIn post | Imagine all the knowledge in your brain as a tree. |
| 2024-12-07-innovation-isnt-about-product | https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7271050136451973120 | 2024-12-07 | LinkedIn post | Innovation isn't just about the product,it's about how you tell the story. |
| 2024-12-07-yesterday-attended-founders-meet | https://www.linkedin.com/feed/update/urn%3Ali%3AugcPost%3A7271009693567709184 | 2024-12-07 | LinkedIn post | Yesterday, I attended the Founders Meet 2024 at the BSC BioNEST Bioincubator, ... |
| 2024-12-08-cant-cry-about-having | https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7271570521417220096 | 2024-12-08 | LinkedIn post | I can't cry about having a lot on my plate when my ... |
| 2024-12-08-iphone-exports-from-india | https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7271544033271803904 | 2024-12-08 | LinkedIn post | iPhone exports from India are growing at astonishing rates! 📈 |
| 2024-12-13-mindful-content-consume-shapes | https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7273394668090912768 | 2024-12-13 | LinkedIn post | Be mindful of the content you consume,it shapes how you think and ... |
| 2024-12-13-pitching-isn-t-about | https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7273394389714915328 | 2024-12-13 | LinkedIn post | Pitching isn’t just about selling your idea,it’s about telling a story. |
| 2024-12-15-repetitive-tasks-draining-your | https://x.com/HarshitKhemani/status/1868158724184985892 | 2024-12-15 | X post | Repetitive tasks are draining your creativity, and you might not even notice ... |
| 2024-12-16-attending-esports-community-industry | https://www.linkedin.com/feed/update/urn%3Ali%3AugcPost%3A7274452846031335425 | 2024-12-16 | LinkedIn post | Attending the eSPORTS COMMUNITY AND INDUSTRY SUMMIT (ESCOM) 2024 at Talkatora Stadium, ... |
| 2024-12-19-chatgpt-now-message-call | https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7275510537650675712 | 2024-12-19 | LinkedIn post | 📞ChatGPT is now just a message (or a call) away! 👇 |
| 2024-12-21-agi-here-openai-announced | https://www.linkedin.com/feed/update/urn%3Ali%3AugcPost%3A7276092966341894144 | 2024-12-21 | LinkedIn post | 🤯 AGI is here (or is it?) OpenAI just announced their o3 ... |
| 2024-12-26-have-noticed-cleve-ai | https://www.linkedin.com/feed/update/urn%3Ali%3AugcPost%3A7277949248191508480 | 2024-12-26 | LinkedIn post | 🚀 Have you noticed Cleve.ai popping up all over LinkedIn? If so, ... |
| 2025-01-01-don-t-have-skills | https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7280082192557350912 | 2025-01-01 | LinkedIn post | I don’t have the skills for this.' I used to think the ... |
| 2025-01-02-quick-commerce-changed-how | https://www.linkedin.com/feed/update/urn%3Ali%3AugcPost%3A7280581758981435394 | 2025-01-02 | LinkedIn post | Quick-Commerce changed how we shop, but Quick-Healthcare? |
| 2025-01-06-let-get-perfect-before | https://www.linkedin.com/feed/update/urn%3Ali%3AugcPost%3A7281992268880781314 | 2025-01-06 | LinkedIn post | Let me get it perfect before I show it to anyone. |
| 2025-01-09-wow-500-000-users | https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7283087404222107648 | 2025-01-09 | LinkedIn post | Wow... 500,000 users for Tally! 🚀 |
| 2025-01-16-conscious-unconscious-about-your | https://www.linkedin.com/feed/update/urn%3Ali%3AugcPost%3A7285653650343915520 | 2025-01-16 | LinkedIn post | Are you conscious or unconscious about your idea❓🫵 |
| 2025-01-18-omnagupta-hasnt-been-there | https://x.com/HarshitKhemani/status/1880486668911976920 | 2025-01-18 | X reply | @OmnaGupta Hasn't this been there for quite some time? I think it's ... |
| 2025-01-31-yc-s-focus-b2a | https://x.com/HarshitKhemani/status/1885346558893580499 | 2025-01-31 | X post | YC’s focus on B2A (Business-to-AI-Agents) startups in Spring 2025 marks a shift. |
| 2025-02-09-absolutely-thrilled-when-opportunity | https://www.linkedin.com/feed/update/urn%3Ali%3AugcPost%3A7294371804180058113 | 2025-02-09 | LinkedIn post | I was absolutely thrilled when the opportunity to help organize <INNOVERSE'36> came ... |
| 2025-06-02-hired-our-first-cohort | https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7335301490376417281 | 2025-06-02 | LinkedIn post | We just hired our first cohort of interns at Likwid.Ai , super ... |
| 2025-07-06-marketing-isn-t-department | https://www.linkedin.com/feed/update/urn%3Ali%3AugcPost%3A7347652046616961024 | 2025-07-06 | LinkedIn post | marketing isn’t a department. |
| 2025-07-07-most-people-misunderstand-mvps | https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7347971016347873281 | 2025-07-07 | LinkedIn post | most people misunderstand MVPs. |
| 2025-07-15-hardest-decisions-startups-aren | https://www.linkedin.com/feed/update/urn%3Ali%3AugcPost%3A7350851686204104704 | 2025-07-15 | LinkedIn post | the hardest decisions in startups aren’t financial. |
| 2025-07-17-fundraising-tool-not-milestone | https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7351521455324454912 | 2025-07-17 | LinkedIn post | fundraising is a tool. not a milestone. |
| 2025-07-22-most-products-don-t | https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7353424109071908865 | 2025-07-22 | LinkedIn post | most products don’t fail because they’re bad. |
| 2025-07-26-can-make-something-lets | https://www.linkedin.com/feed/update/urn%3Ali%3AugcPost%3A7354769866282684417 | 2025-07-26 | LinkedIn post | “can you make something that lets me switch windows by just waving ... |
| 2025-08-18-ai-won-t-kill | https://x.com/HarshitKhemani/status/1957297002863268302 | 2025-08-18 | X post | ai won’t kill software, it’ll catapult it |
| 2025-08-18-if-re-building-software | https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7363061889720836097 | 2025-08-18 | LinkedIn post | if you’re building software today, you need to read Dharmesh Shah’s article ... |
| 2025-10-04-6-months-ago-had | https://www.linkedin.com/feed/update/urn%3Ali%3AugcPost%3A7380125237624934400 | 2025-10-04 | LinkedIn post | 6 months ago, I had no idea a late-night text would change ... |
| 2025-10-10-every-friday-atal-community | https://www.linkedin.com/feed/update/urn%3Ali%3AugcPost%3A7382420057332776960 | 2025-10-10 | LinkedIn post | every friday at Atal Community Innovation Center-his college, we host Startup Sphere, ... |
| 2025-10-22-most-manufacturers-lose-time | https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7386676054943449088 | 2025-10-22 | LinkedIn post | most manufacturers lose time and cash to broken erp systems. |
| 2025-10-31-didn-t-expect-friday | https://www.linkedin.com/feed/update/urn%3Ali%3AugcPost%3A7390040536491077632 | 2025-10-31 | LinkedIn post | i didn’t expect a friday afternoon to change the way i think ... |
| 2025-11-08-thepetermick-hey-people-building | https://x.com/HarshitKhemani/status/1987156066107597086 | 2025-11-08 | X community reply | @ThePeterMick hey people! im building Likwid AI, an ai-native layer sitting on ... |
| 2025-11-09-aravsrinivas-lovable-already-showing | https://x.com/HarshitKhemani/status/1987394886585536832 | 2025-11-09 | X reply | @Franzferdinan57 @AravSrinivas @Lovable is already showing how “apps” can be generated + ... |
| 2025-11-09-aravsrinivas-timeframe-might-real | https://x.com/HarshitKhemani/status/1987391910777155773 | 2025-11-09 | X reply | @Franzferdinan57 @AravSrinivas timeframe might be the real variable here, people are definitely ... |
| 2025-11-11-each-thing-built-taught | https://x.com/HarshitKhemani/status/1988105337577341074 | 2025-11-11 | X post | each thing i built taught me something i didn't know about myself. ... |
| 2025-11-12-ionleu-were-building-ai | https://x.com/HarshitKhemani/status/1988447951006629946 | 2025-11-12 | X reply | @ionleu we're building an AI-native layer on top of ERPs to automate ... |
| 2025-12-04-thejayalto-were-all-patchworks | https://x.com/HarshitKhemani/status/1996609315994812768 | 2025-12-04 | X reply | @theJayAlto we're all patchworks of the thoughts we've consumed. if you look ... |
| 2025-12-04-xboxue-whopio-ycombinator-amazing | https://x.com/HarshitKhemani/status/1996610855233105950 | 2025-12-04 | X reply | @xboxue @WhopIO @ycombinator this is amazing, congrats! |
| 2025-12-05-coolest-thing-ive-seen | https://x.com/HarshitKhemani/status/1996948070186340566 | 2025-12-05 | X post | this is the coolest thing I've seen in a while. @eikedrescher I ... |
| 2025-12-05-saw-news-mark-zuckerberg | https://x.com/HarshitKhemani/status/1996980664932118943 | 2025-12-05 | X post | saw the news that Mark Zuckerberg is planning deep cuts to Meta’s ... |
| 2025-12-10-madebypanic-akothari-notionhq-really | https://x.com/HarshitKhemani/status/1998572326645019025 | 2025-12-10 | X reply | @madebypanic @akothari @NotionHQ I really hope they implement something like @AFFiNEOfficial (or ... |
| 2025-12-14-walking-through-indian-institute | https://www.linkedin.com/feed/update/urn%3Ali%3AugcPost%3A7405960147660992512 | 2025-12-14 | LinkedIn post | walking through Indian Institute of Technology, Bombay during E-Summit 2025 felt like ... |
| 2025-12-22-danifesto-next-interface-wont | https://x.com/HarshitKhemani/status/2003177247604376035 | 2025-12-22 | X reply | @danifesto the next interface won't ask you to learn it. it'll learn ... |
| 2025-12-22-gregisenberg-vibe-coding-may | https://x.com/HarshitKhemani/status/2003117874014245118 | 2025-12-22 | X reply | @gregisenberg vibe coding may have commoditized software but there's still a need ... |
| 2025-12-24-benln-building-tool-similar | https://x.com/HarshitKhemani/status/2003862308817395725 | 2025-12-24 | X reply | @benln building a tool (similar to @joinbento) for founders: one link for ... |
| 2025-12-24-dlevine815-granular-control-design | https://x.com/HarshitKhemani/status/2003666484325970283 | 2025-12-24 | X reply | @dlevine815 granular control + design view for image edits, right out of ... |
| 2025-12-24-next-interface-wont-ask | https://x.com/HarshitKhemani/status/2003887211587231907 | 2025-12-24 | X post | the next interface won't ask you to learn it. it'll learn you. ... |
| 2025-12-29-updated-portfolio-www-khe | https://x.com/HarshitKhemani/status/2005520405789077505 | 2025-12-29 | X post | updated my portfolio |
| 2026-01-01-headsets-least-interesting-part | https://x.com/HarshitKhemani/status/2006802629897449819 | 2026-01-01 | X post | headsets are the least interesting part of XR. |
| 2026-01-01-next-evolution-computing-obvious | https://x.com/HarshitKhemani/status/2006801057591312689 | 2026-01-01 | X post | the next evolution of computing is obvious but we can’t prototype it ... |
| 2026-01-03-mom-wont-stop-ranting | https://x.com/HarshitKhemani/status/2007385108987424974 | 2026-01-03 | X post | my mom won't stop ranting about how dependent i am on ai, ... |
| 2026-01-04-eikedrescher-remember-building-similar | https://x.com/HarshitKhemani/status/2007882097881739749 | 2026-01-04 | X reply | @eikedrescher I remember building a similar game 6 years ago using @GDevelopApp |
| 2026-01-05-most-tools-ask-adapt | https://x.com/HarshitKhemani/status/2008186643203965256 | 2026-01-05 | X post | most tools ask you to adapt to them, omi does the opposite. |
| 2026-01-06-whosaakash-but-seeing-direction | https://x.com/HarshitKhemani/status/2008364703358279902 | 2026-01-06 | X reply | @whosaakash but seeing the direction coding is going in, I believe that ... |
| 2026-01-06-whosaakash-cursor-way-better | https://x.com/HarshitKhemani/status/2008353981953687728 | 2026-01-06 | X reply | @whosaakash cursor is way better. especially now, with visual editing. |
| 2026-01-06-whosaakash-fair-point-cost | https://x.com/HarshitKhemani/status/2008358449638261103 | 2026-01-06 | X reply | @whosaakash fair point on the cost per token, google's scale is hard ... |
| 2026-01-06-whosaakash-look-way-canva | https://x.com/HarshitKhemani/status/2008367895701811578 | 2026-01-06 | X reply | @whosaakash look at it this way: |
| 2026-01-06-whosaakash-take-look-notion | https://x.com/HarshitKhemani/status/2008359898786980295 | 2026-01-06 | X reply | @whosaakash take a look at Notion and Microsoft Office haha, pretty similar. |
| 2026-01-08-mntruell-really-cool-but | https://x.com/HarshitKhemani/status/2009213016936698105 | 2026-01-08 | X reply | @mntruell it's really cool, but i'd love the following: |
| 2026-01-08-whosaakash-nothing-selimbenayat-yea | https://x.com/HarshitKhemani/status/2009134715312484731 | 2026-01-08 | X reply | @whosaakash @clickskeyboard @nothing @SelimBenayat yea, I believe essential space would sooner or ... |
| 2026-01-09-if-youre-getting-better | https://x.com/HarshitKhemani/status/2009588808988450908 | 2026-01-09 | X post | if you're getting better at picking what to work on, you're learning. |
| 2026-01-13-jasonbud-tried-organizing-codebase | https://x.com/HarshitKhemani/status/2011100773950878203 | 2026-01-13 | X reply | @JasonBud I tried organizing my codebase for the first time in a ... |
| 2026-01-13-quxfoobas-xuwu-yeah-think | https://x.com/HarshitKhemani/status/2011099764457373751 | 2026-01-13 | X reply | @QuxFooBas @xuwu yeah, i think that’s conflating things. |
| 2026-01-13-rauchg-allowing-users-remix | https://x.com/HarshitKhemani/status/2011007142493581363 | 2026-01-13 | X reply | @rauchg allowing users to 'remix' software might sound like a bad idea ... |
| 2026-01-13-xuwu-totally-agree-xr | https://x.com/HarshitKhemani/status/2010931112252715082 | 2026-01-13 | X reply | @xuwu totally agree on XR. curious about your take on the metaverse ... |
| 2026-01-15-afoxdesign-google-s-doing | https://x.com/HarshitKhemani/status/2011638203875483827 | 2026-01-15 | X reply | @afoxdesign google’s doing pretty well since they’re working toward making android run ... |
| 2026-01-15-davormeersman-afoxdesign-omidotme-fair | https://x.com/HarshitKhemani/status/2011803713585950805 | 2026-01-15 | X reply | @DavorMeersman @afoxdesign @omidotme fair questions raised, but it’s worth separating first-gen rough ... |
| 2026-01-16-next-big-shift-computing | https://www.linkedin.com/feed/update/urn%3Ali%3AugcPost%3A7417952673506828288 | 2026-01-16 | LinkedIn post | the next big shift in computing won’t look like a new app, ... |
| 2026-01-17-cursor-obsidian-vibe-coding | https://x.com/HarshitKhemani/status/2012615443287359681 | 2026-01-17 | X post | cursor + obsidian = ❤️ |
| 2026-01-17-faisalyaqub-notionhq-notionmail-woah | https://x.com/HarshitKhemani/status/2012559881518088636 | 2026-01-17 | X reply | @faisalyaqub @NotionHQ @NotionMail woah, would love to see this on android! |
| 2026-01-17-if-sit-down-properly | https://x.com/HarshitKhemani/status/2012546328128098729 | 2026-01-17 | X post | if you sit down, and properly understand how cursor works, you can ... |
| 2026-01-17-kodjima33-rewindai-context-matters | https://x.com/HarshitKhemani/status/2012462229455540257 | 2026-01-17 | X reply | @kodjima33 @RewindAI context matters more than ever, this'll be huge. |
| 2026-01-18-brettfromdj-man-really-wish | https://x.com/HarshitKhemani/status/2012809372142072023 | 2026-01-18 | X reply | @BrettFromDJ man, I really wish raycast was available for windows |
| 2026-01-18-xmok-brettfromdj-had-been | https://x.com/HarshitKhemani/status/2012842934035517465 | 2026-01-18 | X reply | @xmok\_ @BrettFromDJ I had been using powertoys until now and have seen ... |
| 2026-01-18-xmok-brettfromdj-omidotme-sure | https://x.com/HarshitKhemani/status/2012847373664338337 | 2026-01-18 | X reply | @xmok\_ @BrettFromDJ @omidotme sure, i'll look into it. |
| 2026-01-19-gtrushevskiy-rauchg-think-would | https://x.com/HarshitKhemani/status/2013075804838625502 | 2026-01-19 | X reply | @GTrushevskiy @rauchg i think it would be dynamic, updating themselves over time. |
| 2026-01-19-rauchg-feels-like-ui | https://x.com/HarshitKhemani/status/2013071754084921520 | 2026-01-19 | X reply | @rauchg feels like ui evals will become just as important as model ... |
| 2026-01-22-abhinavstwt-ofc-ghosted-abhinavstwt | https://x.com/HarshitKhemani/status/2014325584604905709 | 2026-01-22 | X reply | @Abhinavstwt ofc, it was ghosted. |
| 2026-01-24-make-any-repo-vibe | https://x.com/HarshitKhemani/status/2015041158024708518 | 2026-01-24 | X post | make any repo vibe-codeable, agent-ready, and cursor-compatible in minutes 👇 |
| 2026-02-03-built-khemessage-based-textarea | https://x.com/HarshitKhemani/status/2018587160761471380 | 2026-02-03 | X post | just built kheMessage, based on TextArea by Anton Medvedev, inspired by the ... |
| 2026-02-03-edwinarbus-haha-cool-wish | https://x.com/HarshitKhemani/status/2018583784472690827 | 2026-02-03 | X reply | @edwinarbus haha this is so cool. I wish cursor added something like ... |
| 2026-02-03-gregisenberg-internet-has-2 | https://x.com/HarshitKhemani/status/2018569062499176944 | 2026-02-03 | X reply | @gregisenberg the internet has 2 users now: human 🤝 machine |
| 2026-02-03-pbteja1998-information-velocity-crazy | https://x.com/HarshitKhemani/status/2018585558159962289 | 2026-02-03 | X reply | @pbteja1998 the information velocity is crazy. |
| 2026-02-03-rileybrown-built-first-vibe | https://x.com/HarshitKhemani/status/2018584816174960899 | 2026-02-03 | X reply | @rileybrown built my first vibe coded mvp with gpt-3 back in 2022, ... |
| 2026-02-03-tried-codex-again-months | https://x.com/HarshitKhemani/status/2018568052154270064 | 2026-02-03 | X post | tried codex (again) months later, it's soo good: 'fix all bugs, make ... |
| 2026-02-08-benln-building-peapod-protocol | https://x.com/HarshitKhemani/status/2020551002727047184 | 2026-02-08 | X reply | @benln building PeaPod, a protocol so nearby devices can form a small ... |
| 2026-02-17-wrapped-up-last-2 | https://www.linkedin.com/feed/update/urn%3Ali%3AugcPost%3A7429595604034584576 | 2026-02-17 | LinkedIn post | just wrapped up the last 2 days at India AI Impact Summit ... |
| 2026-02-18-whosaakash-openclaw-write-your | https://x.com/HarshitKhemani/status/2024187382556479863 | 2026-02-18 | X reply | @whosaakash @openclaw write your own http://SOUL.md type shi |
| 2026-02-21-last-3-days | https://www.linkedin.com/feed/update/urn%3Ali%3AugcPost%3A7430999181579808768 | 2026-02-21 | LinkedIn post | the last 3 days at his college during the startup development programme ... |
| 2026-03-23-d-rather-take-100 | https://www.linkedin.com/feed/update/urn%3Ali%3AugcPost%3A7441934265883324416 | 2026-03-23 | LinkedIn post | i’d rather take 100 shots where i try something new |
| 2026-03-28-building-2-player-strategy | https://x.com/HarshitKhemani/status/2037888710059163656 | 2026-03-28 | X reply | @rdominguezibar Building a 2 player strategy card and board hybrid game, that's ... |
| 2026-04-03-best-update-ever-ryolu | https://x.com/HarshitKhemani/status/2039940152429335029 | 2026-04-03 | X post | best update ever @ryolu\_ |
| 2026-04-03-may-not-street-smart | https://www.linkedin.com/feed/update/urn%3Ali%3AugcPost%3A7445883249387749377 | 2026-04-03 | LinkedIn post | i may not be “street smart.” |
| 2026-04-04-what-knowledge-actually-looks | https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7446192714871918592 | 2026-04-04 | LinkedIn post | this is what knowledge actually looks like when you zoom out. |
| 2026-04-06-longest-time-synergy | https://www.linkedin.com/feed/update/urn%3Ali%3AugcPost%3A7446912340530483201 | 2026-04-06 | LinkedIn post | for the longest time, SYNERGY at his college has been about students ... |
| 2026-04-09-cursor-ai-tried-last | https://x.com/HarshitKhemani/status/2042078707121320092 | 2026-04-09 | X reply | @cursor\_ai i tried it last night, woah |
| 2026-04-10-beashutiwari-cursor-ai-garrytan | https://x.com/HarshitKhemani/status/2042604347524309347 | 2026-04-10 | X reply | @beashutiwari @cursor\_ai @garrytan yes, and use gstack |
| 2026-04-10-ve-always-been-tinkerer | https://www.linkedin.com/feed/update/urn%3Ali%3AugcPost%3A7448449073004691456 | 2026-04-10 | LinkedIn post | i’ve always been a tinkerer. |
| 2026-04-13-pity-moth-confusing-lamp | https://www.linkedin.com/feed/update/urn%3Ali%3AugcPost%3A7449536835426443264 | 2026-04-13 | LinkedIn post | you pity the moth confusing a lamp for the moon, yet here ... |
| 2026-04-17-benjitaylor-love-chart-shake | https://x.com/HarshitKhemani/status/2045226200466174121 | 2026-04-17 | X reply | @benjitaylor love the chart shake you did here: |
| 2026-04-26-swiggy-opened-up-commerce | https://x.com/HarshitKhemani/status/2048321518598549859 | 2026-04-26 | X post | swiggy just opened up its commerce infra to devs with 3 mcp ... |
| 2026-04-26-swiggys-builders-club-really | https://www.linkedin.com/feed/update/urn%3Ali%3AugcPost%3A7454085915267846144 | 2026-04-26 | LinkedIn post | Swiggy's builders club is a really interesting example of what opens up ... |
| 2026-05-02-asked-clawmani-break-down | https://www.linkedin.com/feed/update/urn%3Ali%3AugcPost%3A7456367896156553216 | 2026-05-02 | LinkedIn post | I asked ClawMani to break down my Cursor usage over the last ... |
| 2026-05-02-dotta-wish-there-desktop | https://x.com/HarshitKhemani/status/2050580370572337389 | 2026-05-02 | X reply | @dotta i wish there was a desktop app for paperclip with the ... |
| 2026-05-03-npx-skills-add-hktitan | https://x.com/HarshitKhemani/status/2050856618070626320 | 2026-05-03 | X post | npx skills add HKTITAN/cursor-sdk |
| 2026-05-04-aaravgarg-openclaw-claudeai-papercliping | https://x.com/HarshitKhemani/status/2051380403735613890 | 2026-05-04 | X reply | @aaravgarg @openclaw @claudeai @papercliping you'll just need to assign a goal and ... |
| 2026-05-06-soon-enough-most-training | https://x.com/HarshitKhemani/status/2052084010453762497 | 2026-05-06 | X post | soon enough most of training and compute would happen in space, and ... |
| 2026-05-07-best-ai-product-one | https://x.com/HarshitKhemani/status/2052411659042640376 | 2026-05-07 | X reply | @theinformation the best AI product is the one people never remember opening |
| 2026-05-07-googlehealth-great-launch-would | https://x.com/HarshitKhemani/status/2052402107131777194 | 2026-05-07 | X reply | @googlehealth great launch. would love an mcp server for this. |
| 2026-05-07-water-bottle-tool-something | https://x.com/HarshitKhemani/article/2052412506002644992 | 2026-05-07 | X article article | Water bottle as a tool |
| 2026-05-08-aronprins-paperclip-community-could | https://x.com/HarshitKhemani/status/2052710180740300805 | 2026-05-08 | X reply | @aronprins paperclip community could host an accelerator just for agentic companies. something ... |
| 2026-05-08-askokara-www-smashandclash-smash | https://x.com/HarshitKhemani/status/2052667386160206186 | 2026-05-08 | X reply | @askOkara http://www.smashandclash.in - Smash&Clash is a 2-player competitive card battle played on ... |
| 2026-05-08-krishashok-should-try-elevenlabs | https://x.com/HarshitKhemani/status/2052776908790931882 | 2026-05-08 | X reply | @krishashok you should try @ElevenLabs for dubbing, pretty good at maintaining the ... |
| 2026-05-09-akothari-everyones-creative-they | https://x.com/HarshitKhemani/status/2052931190194364522 | 2026-05-09 | X reply | @akothari everyone's creative, they just didn't have an outlet yet. tools in ... |
| 2026-05-09-icanvardar-ai-great-force | https://x.com/HarshitKhemani/status/2052932812177821763 | 2026-05-09 | X reply | @icanvardar ai is a great force multiplier, but it also eats up ... |
| 2026-05-09-icanvardar-think-mtp-multi | https://x.com/HarshitKhemani/status/2052934945216266391 | 2026-05-09 | X reply | @icanvardar i think mtp (multi token prediction) will solve this to an ... |
| 2026-05-09-icanvardar-wish-colleges-understood | https://x.com/HarshitKhemani/status/2052930728472801763 | 2026-05-09 | X reply | @icanvardar I wish colleges understood this (I have an exam in 5 ... |
| 2026-05-09-think-they-might-more | https://x.com/HarshitKhemani/status/2053069079099916793 | 2026-05-09 | X reply | i think they might be more connected than it seems at first ... |
| 2026-05-09-yacinemtb-youll-tempted-ways | https://x.com/HarshitKhemani/status/2052933477595828462 | 2026-05-09 | X reply | @yacineMTB you'll be tempted in ways you've never before been tempted to ... |
| 2026-05-11-every-extra-click-tax | https://x.com/HarshitKhemani/status/2053906326988931477 | 2026-05-11 | X post | every extra click is a tax on momentum. |
| 2026-05-11-thvdnta-not-needed-tbh | https://x.com/HarshitKhemani/status/2053800798547816609 | 2026-05-11 | X reply | @thvdnta not needed tbh, but graphs help me visualize connections between certain ... |
| 2026-05-12-most-people-underestimate-how | https://x.com/HarshitKhemani/status/2054135387707367624 | 2026-05-12 | X post | most people underestimate how much motion and feedback shape emotional attachment to ... |
| 2026-05-13-go-spot-internet-lately | https://x.com/HarshitKhemani/status/2054653326067974262 | 2026-05-13 | X post | My go-to spot on the internet lately has been https://t.co/6vBdsfow1w |
| 2026-05-14-benjitaylor-lot-design-rules | https://x.com/HarshitKhemani/status/2054962534424477899 | 2026-05-14 | X reply | @benjitaylor a lot of design “rules” are just fear of experimentation. |
| 2026-05-14-best-startups-often-built | https://x.com/HarshitKhemani/status/2054933799977595056 | 2026-05-14 | X post | The best startups are often built through FAFO. |
| 2026-05-14-elevenlabs-studio-literally-cursor | https://x.com/HarshitKhemani/status/2054988798619246705 | 2026-05-14 | X post | elevenlabs studio is literally cursor for videos |
| 2026-05-15-beashutiwari-disagree-think-bigger | https://x.com/HarshitKhemani/status/2055178518275973179 | 2026-05-15 | X reply | @beashutiwari I disagree, I think the bigger shift is that the cost ... |
| 2026-05-15-best-product-work-comes | https://x.com/HarshitKhemani/status/2055293373146390723 | 2026-05-15 | X reply | the best product work comes from experimenting, shipping, and learning fast. iteration ... |
| 2026-05-15-give-your-agents-ability | https://x.com/HarshitKhemani/status/2055207458377789750 | 2026-05-15 | X post | Give your agents the ability to help you build your ideas for ... |
| 2026-05-16-maxbatt-nathievr-josethevrtech-fair | https://x.com/HarshitKhemani/status/2055713003304374508 | 2026-05-16 | X reply | @maxbatt @NathieVR @josethevrtech fair, it's very early. but it's only a matter ... |
| 2026-05-16-maxbatt-nathievr-josethevrtech-still | https://x.com/HarshitKhemani/status/2055711967562912173 | 2026-05-16 | X reply | @maxbatt @NathieVR @josethevrtech still better than pulling my phone out, opening an ... |
| 2026-05-17-agents-love-obsidian-but | https://x.com/HarshitKhemani/status/2055993213220229537 | 2026-05-17 | X reply | @meetedzenebubu my agents love obsidian, but since @NotionHQ has a cli now... ... |
| 2026-05-17-greg-mapped-out-what | https://x.com/HarshitKhemani/status/2055908062079410565 | 2026-05-17 | X post | Greg just mapped out what might be the most important startup opportunity ... |
| 2026-05-17-no-but-seriously-what | https://x.com/HarshitKhemani/status/2056009764346491357 | 2026-05-17 | X reply | no but seriously, what was the prompt (the design thinking, iterations, references, ... |
| 2026-05-17-scobleizer-0xcyborg-web3-most | https://x.com/HarshitKhemani/status/2056073610725630292 | 2026-05-17 | X reply | @Scobleizer @0XCyborg\_Web3 most of the friends I made growing up were online. ... |
| 2026-05-17-varun-mayya-s-point | https://x.com/HarshitKhemani/status/2056052441397989843 | 2026-05-17 | X post | Varun Mayya’s point in this video is simple: |
| 2026-05-18-ai-amplifying-humans-s | https://x.com/HarshitKhemani/status/2056306655508529277 | 2026-05-18 | X post | AI is amplifying humans. That’s both the exciting part and the terrifying ... |
| 2026-05-18-anthropic-acquired-stainless-almost | https://x.com/HarshitKhemani/status/2056452267281379600 | 2026-05-18 | X post | Anthropic just acquired Stainless and almost nobody is talking about what it ... |
| 2026-05-18-cursor-released-composer-2 | https://x.com/HarshitKhemani/status/2056440061399543983 | 2026-05-18 | X post | Cursor just released Composer 2.5, and the part I find most interesting ... |
| 2026-05-18-most-ai-infra-today | https://x.com/HarshitKhemani/status/2056242005664297426 | 2026-05-18 | X post | Most AI infra today has an awkward split: |
| 2026-05-18-thiagotf-grok-papercliping-paperclips | https://x.com/HarshitKhemani/status/2056357962940313892 | 2026-05-18 | X reply | @thiagoTF @grok @papercliping paperclip's quietly becoming the infra layer for agent collaboration ... |
| 2026-05-18-thiagotf-omidotme-good-tooling | https://x.com/HarshitKhemani/status/2056243316757504133 | 2026-05-18 | X reply | @thiagoTF @omidotme good tooling always “dumbs down” complexity, that’s literally the point. |
| 2026-05-19-andrej-karpathy-joining-anthropic | https://x.com/HarshitKhemani/status/2056757422749110764 | 2026-05-19 | X post | Andrej Karpathy joining Anthropic is one of the clearest signals yet about ... |
| 2026-05-19-aretaidos-best-interface-no | https://x.com/HarshitKhemani/status/2056623028554138065 | 2026-05-19 | X reply | @aretaidos the best interface is no interface. when AI becomes a native, ... |
| 2026-05-19-aretaidos-spot-real-world | https://x.com/HarshitKhemani/status/2056622747577696301 | 2026-05-19 | X reply | @aretaidos spot on. real-world utility + beautiful design is the ultimate combo ... |
| 2026-05-19-arsihoxha-care-compounds | https://x.com/HarshitKhemani/status/2056802675484971156 | 2026-05-19 | X reply | @ArsiHoxha\_ care compounds! |
| 2026-05-19-claudeai-feels-like-stack | https://x.com/HarshitKhemani/status/2056647797869510887 | 2026-05-19 | X reply | @claudeai feels like the stack is maturing fast. |
| 2026-05-19-dad-still-tells-basically | https://x.com/HarshitKhemani/status/2056644516778791170 | 2026-05-19 | X reply | my dad still tells me i basically taught him android when i ... |
| 2026-05-19-danshipper-anthropic-slowly-turning | https://x.com/HarshitKhemani/status/2056810941984182738 | 2026-05-19 | X reply | @danshipper that anthropic is slowly turning into an infra company |
| 2026-05-19-don-t-think-usefulness | https://x.com/HarshitKhemani/status/2056632120337141908 | 2026-05-19 | X reply | i don’t think usefulness has to be binary like “possible without it ... |
| 2026-05-19-exactly-best-products-don | https://x.com/HarshitKhemani/status/2056625000887787688 | 2026-05-19 | X reply | exactly. the best products don’t try to replace human moments, they enhance ... |
| 2026-05-19-grok-eve-bouff-ycombinator | https://x.com/HarshitKhemani/status/2056802990225596834 | 2026-05-19 | X reply | @grok @eve\_bouff @ycombinator @grok can you build one for India? |
| 2026-05-19-iamroyoto-right-feels-obvious | https://x.com/HarshitKhemani/status/2056625754461606221 | 2026-05-19 | X reply | @iamroyoto right? feels so obvious in hindsight. |
| 2026-05-19-iiviieee-when-developers-genuinely | https://x.com/HarshitKhemani/status/2056625618654249310 | 2026-05-19 | X reply | @iiviieee when developers genuinely rely on your tool in production and an ... |
| 2026-05-19-jahjiren-one-those-rare | https://x.com/HarshitKhemani/status/2056625376626192500 | 2026-05-19 | X reply | @Jahjiren one of those rare products where you instantly get it within ... |
| 2026-05-19-most-people-think-ai | https://x.com/HarshitKhemani/status/2056751441918955620 | 2026-05-19 | X post | most people think AI replaces jobs. |
| 2026-05-19-motion-mau-discord-telegram | https://x.com/HarshitKhemani/status/2056642459015537032 | 2026-05-19 | X reply | @motion\_mau @discord telegram has an amazing UX |
| 2026-05-19-noelkhw-no-growth-hacks | https://x.com/HarshitKhemani/status/2056625110770212991 | 2026-05-19 | X reply | @noelkhw no growth hacks, no market positioning, no trend chasing. just genuine ... |
| 2026-05-19-scobleizer-yes-but-meta | https://x.com/HarshitKhemani/status/2056809411675558156 | 2026-05-19 | X reply | @Scobleizer yes, but meta owns some of the biggest social networks globally: ... |
| 2026-05-19-thank-ve-learned-ton | https://x.com/HarshitKhemani/status/2056637882065141844 | 2026-05-19 | X reply | thank you for this. I’ve learned a ton just by observing how ... |
| 2026-05-20-cultured-marclou-whop-thanks | https://x.com/HarshitKhemani/status/2056958383539065143 | 2026-05-20 | X reply | @cultured @marclou @whop thanks a ton! it'd be really convenient for indian ... |
| 2026-05-20-got-fitness-band-not | https://x.com/HarshitKhemani/status/2056941581647949898 | 2026-05-20 | X post | i just got a fitness band. |
| 2026-05-20-jamboree-cooking-hard-one | https://x.com/HarshitKhemani/status/2057083461509509464 | 2026-05-20 | X post | JAMBOREE is cooking hard. one of the biggest upgrades! |
| 2026-05-20-k19unknown-harish-521-joined | https://x.com/HarshitKhemani/status/2057004195111485691 | 2026-05-20 | X reply | @K19Unknown @Harish\_521 (I joined in 2016) ha toh? |
| 2026-05-20-nikitabier-mitchellvii-what-if | https://x.com/HarshitKhemani/status/2056982011907379215 | 2026-05-20 | X reply | @nikitabier @mitchellvii what if X added a videos-only feed |
| 2026-05-21-cleanest-ai-take-heard | https://x.com/HarshitKhemani/status/2057340873587990841 | 2026-05-21 | X post | the cleanest ai take i heard today: |
| 2026-05-21-hishibui-yes-can-try | https://x.com/HarshitKhemani/status/2057488930291978310 | 2026-05-21 | X reply | @hishibui yes, can you try making universal emojis/icons across all platforms? here's ... |
| 2026-05-21-recently-came-back-x | https://x.com/HarshitKhemani/status/2057358607814103226 | 2026-05-21 | X reply | i recently came back to X after spending a long time posting ... |
| 2026-05-21-sharavarora-gmail-yea-solid | https://x.com/HarshitKhemani/status/2057356632632561941 | 2026-05-21 | X reply | @SharavArora @gmail yea... solid colors were better ngl |
| 2026-05-22-100-ai-design-still | https://x.com/HarshitKhemani/status/2057743728476058087 | 2026-05-22 | X reply | 100%. AI design still feels like soulless slop. |
| 2026-05-22-came-across-benji-taylor | https://x.com/HarshitKhemani/status/2057906570927993012 | 2026-05-22 | X post | i came across benji taylor through honk in 2023, and i immediately ... |
| 2026-05-22-exactly-agents-fast-but | https://x.com/HarshitKhemani/status/2057743504340820087 | 2026-05-22 | X reply | Exactly this. Agents are fast but have zero taste or unified vision. |
| 2026-05-23-messycables1-scobleizer-if-have | https://x.com/HarshitKhemani/status/2057996125219831823 | 2026-05-23 | X reply | @messycables1 @Scobleizer if you have taste, the Agents would empower you to ... |
| 2026-05-23-rileybrown-would-love-hear | https://x.com/HarshitKhemani/status/2058081068146626848 | 2026-05-23 | X reply | @rileybrown would love to hear your opinion on this: |
| 2026-05-23-s-double-edged-sword | https://x.com/HarshitKhemani/status/2058076468861935795 | 2026-05-23 | X post | it’s a double-edged sword. |
| 2026-05-25-dan-shipper-ceo-every | https://x.com/HarshitKhemani/status/2058800680324989265 | 2026-05-25 | X post | Dan Shipper (CEO of Every) is one of the few people actually ... |
| 2026-05-25-epic-s-rocket-league | https://x.com/HarshitKhemani/status/2058783043406696814 | 2026-05-25 | X post | epic’s rocket league ue6 teaser is interesting for one reason that has ... |
| 2026-05-25-obeyguy-use-hyperframes-hyperframes | https://x.com/HarshitKhemani/status/2059001868794450412 | 2026-05-25 | X reply | @obeyguy use @HyperFrames\_ |
| 2026-05-25-ve-been-tinkering-lot | https://x.com/HarshitKhemani/status/2058984826578088192 | 2026-05-25 | X reply | i’ve been tinkering a lot lately, and honestly the velocity of ideas ... |
| 2026-05-26-creativedash-wait-recalled-made | https://x.com/HarshitKhemani/status/2059222862322597955 | 2026-05-26 | X reply | @creativedash wait I just recalled I made my first game (without codex) ... |
| 2026-05-26-design-engineers-right-now | https://x.com/HarshitKhemani/status/2059220795080183973 | 2026-05-26 | X reply | design engineers (right now) keep reminding the AI every prompt about taste, ... |
| 2026-05-26-started-prototyping-2-player | https://x.com/HarshitKhemani/status/2059308359669682315 | 2026-05-26 | X reply | I started prototyping this 2-player card game inspired by triple triad from ... |
| 2026-05-27-every-dev-know-has | https://x.com/HarshitKhemani/status/2059558162693607660 | 2026-05-27 | X post | every dev i know has half a dozen agents lying around: claude ... |
| 2026-05-27-spotifynews-spotify-used-use | https://x.com/HarshitKhemani/status/2059634816346427728 | 2026-05-27 | X reply | @SpotifyNews @Spotify i used to use @snipd\_app for this. looks like im ... |
| 2026-05-28-abhagsain-open-slide-by | https://x.com/HarshitKhemani/status/2060019033949548717 | 2026-05-28 | X reply | @abhagsain open-slide by @1weiho is pretty good. |
| 2026-05-28-dynamic-workflows-claude-code | https://x.com/HarshitKhemani/status/2060078660275884236 | 2026-05-28 | X post | dynamic workflows in Claude Code are not just “more agents.” |
| 2026-05-28-ebogomolovs-spec-driven-development | https://x.com/HarshitKhemani/status/2060080445245845542 | 2026-05-28 | X reply | @EBogomolovs this is just spec-driven development on steroids. exactly like Antigravity 2.0. |
| 2026-05-28-mweinbach-yes-but-if | https://x.com/HarshitKhemani/status/2060086933427196412 | 2026-05-28 | X reply | @mweinbach yes! but if used correctly it's incredible |
| 2026-05-29-barely-explored-claude-code | https://x.com/HarshitKhemani/status/2060231477808533799 | 2026-05-29 | X post | I barely explored the claude code CLI before workflows came out and ... |
| 2026-05-29-spottedinprod-cool-spottedinprod-retrodotapp | https://x.com/HarshitKhemani/status/2060229016884494376 | 2026-05-29 | X reply | @spottedinprod this is so cool |
| 2026-06-01-gap-between-people-who | https://x.com/HarshitKhemani/status/2061415603920044197 | 2026-06-01 | X post | the gap between people who get 10x out of AI coding and ... |
| 2026-06-01-tribal-company-knowledge-still | https://x.com/HarshitKhemani/status/2061294160917999897 | 2026-06-01 | X post | tribal company knowledge is still something that needs to be figured out. ... |
| 2026-06-02-think-biggest-missed-opportunity | https://x.com/HarshitKhemani/status/2061868681622425830 | 2026-06-02 | X post | i think the biggest missed opportunity in software right now is native ... |
| 2026-06-03-anaarsonist-add-little-pat | https://x.com/HarshitKhemani/status/2062210688156860604 | 2026-06-03 | X reply | @AnaArsonist add a little pat-pat like @NotionMail |
| 2026-06-03-uiuxarih-nikitabier-looks-cool | https://x.com/HarshitKhemani/status/2062216092920184967 | 2026-06-03 | X reply | @uiuxarih @nikitabier looks cool, but I don't see a good enough use ... |
| 2026-06-03-uiuxarih-nikitabier-yes-would | https://x.com/HarshitKhemani/status/2062220225333063832 | 2026-06-03 | X reply | @uiuxarih @nikitabier yes, would love to see this come to life. chat ... |
| 2026-06-04-built-something-wish-more | https://x.com/HarshitKhemani/status/2062565795788693706 | 2026-06-04 | X post | built something i wish more people had: |
| 2026-06-06-osama-latrache-notionhq-but | https://x.com/HarshitKhemani/status/2063102377167880314 | 2026-06-06 | X reply | @osama\_latrache @NotionHQ but it's only available on the business plan and above ... |
| 2026-06-06-over-1-4k-people | https://x.com/HarshitKhemani/status/2063276611001339951 | 2026-06-06 | X post | over 1.4k people (and counting) have used poke recipes that I made ... |
| 2026-06-07-kianmckenn-interaction-can-work | https://x.com/HarshitKhemani/status/2063522348918292681 | 2026-06-07 | X reply | @marvinvonhagen @kianmckenn @interaction can you work on the SDK and docs please?🥹 |
| 2026-06-08-giulian0x6f-interaction-get-your | https://x.com/HarshitKhemani/status/2064008041918521696 | 2026-06-08 | X reply | @giulian0x6F @interaction get your pokie: |
| 2026-06-10-dex-doge-interaction-aliases | https://x.com/HarshitKhemani/status/2064562616383750604 | 2026-06-10 | X reply | @marvinvonhagen @dex\_doge @interaction aliases would be so cool 👀 |
| 2026-06-10-what-if-ordering-from | https://x.com/HarshitKhemani/status/2064597757428748764 | 2026-06-10 | X post | what if ordering from swiggy felt more like texting a friend than ... |
| 2026-06-11-50-hours-fable-5 | https://x.com/HarshitKhemani/status/2065110652935659695 | 2026-06-11 | X post | 50 hours with fable 5 and i think a lot of people ... |
| 2026-06-11-fable-cool-one-shot | https://x.com/HarshitKhemani/status/2064959839546278256 | 2026-06-11 | X post | FABLE IS SO COOL |
| 2026-06-12-ikr-rewrote-game-built | https://x.com/HarshitKhemani/status/2065446225630171194 | 2026-06-12 | X reply | @alightinastorm ikr! rewrote my game and built this in the last 50 ... |
| 2026-06-13-an0n-an0n-an0n-ak48503 | https://x.com/HarshitKhemani/status/2065842203247919356 | 2026-06-13 | X reply | @an0n\_an0n\_an0n @ak48503 @Polymarket agents reflect how you want them to be and ... |
| 2026-06-13-gregisenberg-fable-addictive-drug | https://x.com/HarshitKhemani/status/2065621735261778029 | 2026-06-13 | X reply | @gregisenberg fable was an addictive drug ngl |
| 2026-06-13-same-helped-rewrite-board | https://x.com/HarshitKhemani/status/2065780501370306909 | 2026-06-13 | X reply | @Ishansharma7390 same, it helped me rewrite my board game from scratch in ... |
| 2026-06-13-us-government-banned-fable | https://x.com/HarshitKhemani/status/2065623748548673978 | 2026-06-13 | X post | US GOVERNMENT JUST BANNED FABLE 5 IN FOREIGN COUNTRIES 😭 |
| 2026-06-14-can-now-play-smash | https://x.com/HarshitKhemani/status/2066060592079859866 | 2026-06-14 | X post | you can now play Smash&Clash with Poke! |
| 2026-06-14-meet-sijariya-shubhxho-wouldnt | https://x.com/HarshitKhemani/status/2066157669082451980 | 2026-06-14 | X reply | @meet\_sijariya @shubhxho wouldn't it be the opposite? I believe it'd further commoditize ... |
| 2026-06-15-ai-has-definitely-100xed | https://x.com/HarshitKhemani/status/2066391225180311678 | 2026-06-15 | X post | AI has definitely 100xed my creative output in the past 3 years ... |
| 2026-06-15-dhruvtwt-cursors-great-cloud | https://x.com/HarshitKhemani/status/2066572303329325288 | 2026-06-15 | X reply | @dhruvtwt\_ cursor's great for cloud |
| 2026-06-15-far-away-from-chasing | https://x.com/HarshitKhemani/status/2066513431281414215 | 2026-06-15 | X reply | @DanielSmidstrup far away from chasing generative visuals due to deepfake/misinfo risks prolly |
| 2026-06-15-full-audio-smash-clash | https://x.com/HarshitKhemani/status/2066405086969119180 | 2026-06-15 | X post | the full audio for Smash&Clash: voice, music, SFX was produced by Claude ... |
| 2026-06-16-samyok-interaction-yes-but | https://x.com/HarshitKhemani/status/2066923491967062221 | 2026-06-16 | X reply | @samyok @interaction yes, but @telegram was just more convenient in a multi-device ... |
| 2026-06-17-dont-get-why-people | https://x.com/HarshitKhemani/status/2067295748581151010 | 2026-06-17 | X post | I don't get why people are sad about this change. |
| 2026-06-17-stalmico-arshamg-yes-not | https://x.com/HarshitKhemani/status/2067218583193788671 | 2026-06-17 | X reply | @stalmico @arshamg\_ yes! not only that but a decade-long of AR efforts ... |
| 2026-06-18-kinda-confused-about-publishing | https://x.com/HarshitKhemani/status/2067651970807336994 | 2026-06-18 | X post | im kinda confused about this: |
| 2026-06-18-shrav-10-tell-claude | https://x.com/HarshitKhemani/status/2067610009228464262 | 2026-06-18 | X reply | @shrav\_10 just tell claude to push via gh cli using your id |
| 2026-06-18-used-ai-tool-not | https://x.com/HarshitKhemani/status/2067664861988094122 | 2026-06-18 | X reply | I used AI as a tool, and not a driver. I was ... |
| 2026-06-19-first-1m-thanks-x | https://x.com/HarshitKhemani/status/2067982165774905644 | 2026-06-19 | X post | my first 1M, thanks X algorithm :3 |
| 2026-06-19-swonzon-thank-yes-available | https://x.com/HarshitKhemani/status/2067939321467011288 | 2026-06-19 | X reply | @swonzon thank you! yes it's available for closed testing on the play ... |
| 2026-06-19-whop-please-add-upi | https://x.com/HarshitKhemani/status/2068016447251689768 | 2026-06-19 | X reply | @whop please add UPI support 🥹 |
| 2026-06-20-benjitaylor-little-details-matter | https://x.com/HarshitKhemani/status/2068381672928932187 | 2026-06-20 | X reply | @benjitaylor the little details matter so much! |
| 2026-06-20-can-now-share-replays | https://x.com/HarshitKhemani/status/2068226456665371016 | 2026-06-20 | X post | you can now share replays in Smash&Clash! |
| 2026-06-20-gap-between-who-who | https://x.com/HarshitKhemani/status/2068156612859363484 | 2026-06-20 | X post | the gap between who you are and who you want to be ... |
| 2026-06-20-thank-used-claude-threejs | https://x.com/HarshitKhemani/status/2068350533933613343 | 2026-06-20 | X reply | @cahitenessahin thank you! I used Claude with @threejs as the framework :) |
| 2026-06-25-achevywolf-tim-never-said | https://x.com/HarshitKhemani/status/2070209009475572078 | 2026-06-25 | X reply | @AChevyWolf tim never said ai made games are good, he just said ... |
| 2026-06-25-breejeanadkat-grok-imagine-design | https://x.com/HarshitKhemani/status/2069976172352700490 | 2026-06-25 | X reply | @BreejeAnadkat @grok @imagine design is NOT dead |
| 2026-06-25-fafo-keep-experimenting-close | https://x.com/HarshitKhemani/status/2070200560498962708 | 2026-06-25 | X post | FAFO! keep on experimenting, close the loop earlier, fail fast, learn fast, ... |
| 2026-06-25-poke-has-one-best | https://x.com/HarshitKhemani/status/2070021680383328271 | 2026-06-25 | X reply | poke has one of the best product-led growth I've seen in a ... |
| 2026-06-25-whop-felixms-interaction-mann | https://x.com/HarshitKhemani/status/2070194491668181454 | 2026-06-25 | X reply | @abearsomewhere @whop @felixms @marvinvonhagen @interaction mann, need whop cards in India :( |
| 2026-06-26-ai-indeed-making-more | https://x.com/HarshitKhemani/status/2070475921669435595 | 2026-06-26 | X reply | @DocStrangelove2 ai is indeed making you more productive tho 🤷 https://x.com/HarshitKhemani/status/2066391225180311678 |
| 2026-06-26-burned-16-98b-ai | https://x.com/HarshitKhemani/status/2070418857664385117 | 2026-06-26 | X post | I burned 16.98B AI coding tokens , rank #6 🔥 who burned ... |
| 2026-06-26-ericlewis-interaction-notionhq-no | https://x.com/HarshitKhemani/status/2070382856556482947 | 2026-06-26 | X reply | @Ericlewis @interaction @NotionHQ no we can use Notion via Poke right now, ... |
| 2026-06-26-ryukozyy-windows-any-day | https://x.com/HarshitKhemani/status/2070513021198434414 | 2026-06-26 | X reply | @ryukozyy windows, any day. subsystems are overkill. |
| 2026-06-26-stannostudio-interaction-boardyai-soarapp | https://x.com/HarshitKhemani/status/2070352847519306223 | 2026-06-26 | X reply | @stannostudio @interaction @boardyai @soarapp I see you've built one too! nice :D |
| 2026-06-27-bullying-palm-tree-fun | https://x.com/HarshitKhemani/status/2070660441190318308 | 2026-06-27 | X post | bullying a palm tree is fun sometimes |
| 2026-06-27-elie2222-future-mailing-interfaces | https://x.com/HarshitKhemani/status/2070755944632631415 | 2026-06-27 | X reply | @elie2222 the future of mailing interfaces are the ones that disappear into ... |
| 2026-06-27-scobleizer-grok-elonmusk-what | https://x.com/HarshitKhemani/status/2070927519654756633 | 2026-06-27 | X reply | @Scobleizer @grok @elonmusk what if X added 'plugins' where people could build ... |
| 2026-06-29-give-try-awesome-believe | https://x.com/HarshitKhemani/status/2071657385081647159 | 2026-06-29 | X reply | give it a try, it's awesome. |
| 2026-06-29-iamabhishek22-akshaymarch7-telegram-users | https://x.com/HarshitKhemani/status/2071663938341892558 | 2026-06-29 | X reply | @iamabhishek22\_ @akshaymarch7 on telegram, users can text you without having to reveal ... |
| 2026-06-29-ykw-if-think-about | https://x.com/HarshitKhemani/status/2071625274668859549 | 2026-06-29 | X post | ykw, if you think about it, it's a smart way to let ... |
| 2026-06-30-summer-break-anything-but | https://www.linkedin.com/feed/update/urn%3Ali%3AugcPost%3A7477606854878117888 | 2026-06-30 | LinkedIn post | my summer 'break' was anything but a break. |
| 2026-06-30-vivoplt-ive-been-hosting | https://x.com/HarshitKhemani/status/2071967887389306941 | 2026-06-30 | X reply | @vivoplt I've been hosting on vercel wayy before vibe coding was a ... |
| 2026-07-03-since-many-new-here | https://x.com/HarshitKhemani/status/2073097455537946964 | 2026-07-03 | X post | since many of you are new here, let me introduce myself again: |
| 2026-07-04-60fpsdesign-nice-paper-fold | https://x.com/HarshitKhemani/status/2073392689945665992 | 2026-07-04 | X reply | @60fpsdesign nice! a paper fold like arc search would make it soo ... |
| 2026-07-04-amazon-kept-empty-chair | https://x.com/HarshitKhemani/status/2073349208212681111 | 2026-07-04 | X post | Amazon kept an empty chair in meetings to represent the customer. |
| 2026-07-04-mika-el-think-wed | https://x.com/HarshitKhemani/status/2073355357787975826 | 2026-07-04 | X reply | @i\_mika\_el I think we'd need to create a persona that faces the ... |
| 2026-07-04-xoaanya-x-worked-well | https://x.com/HarshitKhemani/status/2073352622103511430 | 2026-07-04 | X reply | @xoaanya X worked well for me |
| 2026-07-05-aronprins-thsottiaux-do-really | https://x.com/HarshitKhemani/status/2073590283330318588 | 2026-07-05 | X reply | @aronprins @thsottiaux do we really need models for that? wouldn't that use-case ... |
| 2026-07-06-aadilshariff-sharavarora-still-going | https://x.com/HarshitKhemani/status/2074190560924213376 | 2026-07-06 | X reply | @aadilshariff\_ @SharavArora im still going to college (ugh) |
| 2026-07-06-parthjadhav8-could-create-tools | https://x.com/HarshitKhemani/status/2074084412111888548 | 2026-07-06 | X reply | @ParthJadhav8 you could create tools for codex and tunnel em to poke ... |
| 2026-07-06-synscience-not-sure-how | https://x.com/HarshitKhemani/status/2073975441673933311 | 2026-07-06 | X reply | @SynScience im not sure how relevant this is to people in the ... |
| 2026-07-07-arnesh-11-nikitabier-like | https://x.com/HarshitKhemani/status/2074337759637151841 | 2026-07-07 | X reply | @arnesh\_11 @nikitabier like X articles are great, but there's no other way ... |
| 2026-07-07-sidposting-fable-5-token | https://x.com/HarshitKhemani/status/2074361743267279202 | 2026-07-07 | X reply | @sidposting fable 5 is a token whore. |
| 2026-07-08-been-building-vercels-eve | https://x.com/HarshitKhemani/status/2074714752388104576 | 2026-07-08 | X post | been building with @vercel's eve for a bit and it's genuinely good. ... |
| 2026-07-08-joshwoodward-geminiapp-ive-been | https://x.com/HarshitKhemani/status/2074848786984345968 | 2026-07-08 | X reply | @joshwoodward @GeminiApp I've been using these with Poke: |
| 2026-07-08-maximus-hoggus-nova-nightfall | https://x.com/HarshitKhemani/status/2074861675535302699 | 2026-07-08 | X reply | @maximus\_hoggus @Nova\_Nightfall @joshwoodward @GeminiApp still not as efficient as claude or chatgpt ... |
| 2026-07-08-nova-nightfall-joshwoodward-geminiapp | https://x.com/HarshitKhemani/status/2074858941293773164 | 2026-07-08 | X reply | @Nova\_Nightfall @joshwoodward @GeminiApp it integrates well within the google ecosystem, but it's ... |
| 2026-07-08-piyushgarg-dev-ask-claude | https://x.com/HarshitKhemani/status/2074815484353270207 | 2026-07-08 | X reply | @piyushgarg\_dev just ask claude code to reverse engineer and ta-da! |
| 2026-07-08-rauchg-nishimiya-agent-agents | https://x.com/HarshitKhemani/status/2074875728689344566 | 2026-07-08 | X reply | @rauchg @nishimiya a .agent/.agents file format could be an easy way to ... |
| 2026-07-08-small-team-5-expanding | https://x.com/HarshitKhemani/status/2074844907840376930 | 2026-07-08 | X post | for a small team of 5 (expanding soon), wdyt would be better: |
| 2026-07-08-uploaded-brain-into-ai | https://x.com/HarshitKhemani/status/2074724061994012985 | 2026-07-08 | X post | i uploaded my brain into an ai. |
| 2026-07-09-gdp-counts-what-produce | https://x.com/HarshitKhemani/status/2075038352248811734 | 2026-07-09 | X reply | gdp counts what we produce domestically, not just what we import and ... |
| 2026-07-09-purelycoders-competitive-advantage-having | https://x.com/HarshitKhemani/status/2075116286758224335 | 2026-07-09 | X reply | @PurelyCoders my competitive advantage is that im having fun https://x.com/HarshitKhemani/status/2073097455537946964 |
| 2026-07-10-aaryanpatel-06-iamjosh000-yep | https://x.com/HarshitKhemani/status/2075419562666025365 | 2026-07-10 | X reply | @aaryanpatel\_06 @iamjosh000 @michalmalewicz yep, why not? he cracked software, and on his ... |
| 2026-07-12-ai-agents-might-actually | https://x.com/HarshitKhemani/status/2076344362993422338 | 2026-07-12 | X post | ai agents might actually solve physics before human researchers do. |
| 2026-07-12-consensual-ofc-but-think | https://x.com/HarshitKhemani/status/2076313366025601285 | 2026-07-12 | X reply | consensual ofc, but think about it. |
| 2026-07-12-naveens459-swiggy-interaction-best | https://x.com/HarshitKhemani/status/2076285742779871609 | 2026-07-12 | X reply | @NaveenS459 @Swiggy @interaction the best interfaces are the ones that dissapear into ... |
| 2026-07-12-thvdnta-interaction-samyok-bahah | https://x.com/HarshitKhemani/status/2076283282061439387 | 2026-07-12 | X reply | (first words left out: they name an amount of money) |
| 2026-07-13-sonofalli-sharavarora-makes-feel | https://x.com/HarshitKhemani/status/2076484543771718012 | 2026-07-13 | X reply | @sonofalli @SharavArora makes me feel old ngl (even tho I started around ... |
| 2026-07-14-aryanghosh01-meranivas-swiggy-aannuujx | https://x.com/HarshitKhemani/status/2077012364764041653 | 2026-07-14 | X reply | @aryanghosh01 @MeraNivas @Swiggy @aannuujX congratulations! you should join other builders on discord ... |
| 2026-07-14-scobleizer-nikitabier-any-time | https://x.com/HarshitKhemani/status/2077030680543080851 | 2026-07-14 | X reply | @Scobleizer @nikitabier any time im onboarding a friend to X, I subscribe ... |
| 2026-07-14-tylerbruno05-compete-who-were | https://x.com/HarshitKhemani/status/2077034622324752398 | 2026-07-14 | X reply | @tylerbruno05 just compete with who you were yesterday and keep getting better ... |
| 2026-07-16-blazestorm8f-radiolossanto-makes-sense | https://x.com/HarshitKhemani/status/2077587154478481803 | 2026-07-16 | X reply | @BlazeStorm8f @RadioLosSanto makes sense. I wish we could have all three cities ... |
| 2026-07-16-does-re-launched-fable | https://x.com/HarshitKhemani/status/2077587987538616714 | 2026-07-16 | X post | is it just me or does the re-launched Fable 5 feel like ... |
| 2026-07-16-sidposting-deyritoja-ive-seen | https://x.com/HarshitKhemani/status/2077716825492922614 | 2026-07-16 | X reply | @sidposting @DeyRitoja I've seen people pay for internships. like what? aren't you ... |
| 2026-07-16-startup-idea-what-if | https://x.com/HarshitKhemani/status/2077581887338373368 | 2026-07-16 | X post | startup idea: what if idle PS5s could become cloud gaming nodes? |
| 2026-07-16-themaninblue-cool-small-request | https://x.com/HarshitKhemani/status/2077566293868495067 | 2026-07-16 | X reply | @themaninblue this is so cool! |
| 2026-07-16-think-weve-normalized-something | https://x.com/HarshitKhemani/status/2077575735834034509 | 2026-07-16 | X post | i think we've normalized something that's actually pretty unnatural. |
| 2026-07-17-can-did-agents-x | https://x.com/HarshitKhemani/status/2077935387004322150 | 2026-07-17 | X post | we can', 'we did' (me + my agents) https://x.com/poteto/status/2077874001637151159 |
| 2026-07-18-ive-been-thinking-about | https://x.com/HarshitKhemani/status/2078392959574429811 | 2026-07-18 | X post | I've been thinking about what determines a country's long-term wealth. |
| 2026-07-18-raphaelschaad-eve-bouff-wdyt | https://x.com/HarshitKhemani/status/2078545217192669359 | 2026-07-18 | X reply | @raphaelschaad @eve\_bouff wdyt about snap maps or the ones instagram introduced recently? |
| 2026-07-19-aronprins-idk-if-but | https://x.com/HarshitKhemani/status/2078679153164103843 | 2026-07-19 | X reply | @aronprins idk if it's just me, but I've noticed that paperclip consumes ... |
| 2026-07-19-mikenevermiss-models-often-reflect | https://x.com/HarshitKhemani/status/2078708559668523247 | 2026-07-19 | X reply | @SharmaSha12201 @mikenevermiss models often reflect your ability to describe what you want. |
| 2026-07-20-have-feeling-well-see | https://x.com/HarshitKhemani/status/2079244979713741275 | 2026-07-20 | X post | i have a feeling we'll see a board game startup in yc ... |
| 2026-07-20-one-month-ago-launched | https://x.com/HarshitKhemani/status/2079268447654187262 | 2026-07-20 | X post | one month ago, we launched Smash&Clash |
| 2026-07-21-2-decades-ago-if | https://x.com/HarshitKhemani/status/2079631736724697271 | 2026-07-21 | X post | 2 decades ago, if you travelled somewhere and didn't speak the language, ... |
| 2026-07-21-vasuman-future-your-agents | https://x.com/HarshitKhemani/status/2079624883257114657 | 2026-07-21 | X reply | @vasuman the future is for your agents AND for you\* |
| 2026-07-22-know-how-6-y | https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7485749343468011520 | 2026-07-22 | LinkedIn post | you know how as a 6 y/o you'd go crazy when you ... |
| 2026-07-23-dannyhatcher-smart-tho-really | https://x.com/HarshitKhemani/status/2080339057473892435 | 2026-07-23 | X reply | @DannyHatcher this is so smart tho, I really love what Notion is ... |
| 2026-07-23-soham-nayak04-not-really | https://x.com/HarshitKhemani/status/2080302717797625986 | 2026-07-23 | X reply | @soham\_nayak04 not really, but be the face of your product. |
| 2026-07-24-dont-see-major-difference | https://x.com/HarshitKhemani/status/2080564136120086769 | 2026-07-24 | X post | i don't see a major difference in FC games over the years. |
| 2026-07-24-if-sony-stopping-disc | https://x.com/HarshitKhemani/status/2080571041659904417 | 2026-07-24 | X post | if sony is stopping disc production, at least let us upgrade and ... |
| 2026-07-26-spent-last-5-hours | https://www.linkedin.com/feed/update/urn%3Ali%3AugcPost%3A7487136159505072128 | 2026-07-26 | LinkedIn post | spent the last 5 hours at the Cursor India Community Roadshow in ... |
| 2026-07-27-were-missing-airbnb-intelligence | https://x.com/HarshitKhemani/status/2081800266924617997 | 2026-07-27 | X reply | we're missing the Airbnb for intelligence. people are already building incredibly capable ... |
| 2026-07-28-biggest-missing-dataset-ai | https://x.com/HarshitKhemani/status/2082099173651013694 | 2026-07-28 | X post | the biggest missing dataset for ai agents is your team's tribal knowledge. ... |
| 2026-07-28-boardyai-haha-yea-writing | https://x.com/HarshitKhemani/status/2082052789103120754 | 2026-07-28 | X reply | @boardyai haha yea. I was writing a comic book series called 'the ... |
| 2026-07-28-hadikhantech-fact-time-flies | https://x.com/HarshitKhemani/status/2082038936185327943 | 2026-07-28 | X reply | @hadikhantech and the fact that time flies by so fast that you ... |
| 2026-07-28-if-youre-getting-better | https://x.com/HarshitKhemani/status/2082040821805875272 | 2026-07-28 | X post | if you're getting better at picking what to work on, you're learning. ... |
| 2026-07-28-nawazish-khan1-hadikhantech-grok | https://x.com/HarshitKhemani/status/2081987032554094968 | 2026-07-28 | X reply | @nawazish\_khan1 @hadikhantech @grok same. I think Cursor would be the GUI long-term, ... |
| 2026-07-28-no-does-revenue-simply | https://x.com/HarshitKhemani/status/2082035252458143894 | 2026-07-28 | X post | no, it does. revenue is simply price × quantity, so the goal ... |
| 2026-07-28-not-really-no-cursor | https://x.com/HarshitKhemani/status/2082003681235566905 | 2026-07-28 | X reply | not really, no. cursor provides a lot more usage across multiple models ... |
| 2026-07-28-pricing-sits-perfectly-college | https://x.com/HarshitKhemani/status/2081989470275227921 | 2026-07-28 | X reply | the pricing sits perfectly for college students because a lot of them ... |
| 2026-07-28-ps5s-dualsense-immersion-truly | https://x.com/HarshitKhemani/status/2082006325169619341 | 2026-07-28 | X post | PS5's DualSense™ immersion is truly next level. I was playing TLOU 2 ... |
| 2026-07-28-watched-odyssey-friends-recently | https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7487846869885353984 | 2026-07-28 | LinkedIn post | watched The Odyssey with my friends recently. |
| 2026-07-29-hadikhantech-mean-has-been | https://x.com/HarshitKhemani/status/2082511015942758474 | 2026-07-29 | X reply | @hadikhantech I mean, it has been one of the best ways to ... |
| 2026-07-30-talk-your-users-most | https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7488632637612302336 | 2026-07-30 | LinkedIn post | talk to your users' is the most repeated advice in startups. |
| 2026-07-30-uraviva-people-wouldnt-value | https://x.com/HarshitKhemani/status/2082762621124808825 | 2026-07-30 | X reply | @UraViva\_ people wouldn't value it enough if it goes free |
| 2026-07-31-10-years-ago-when | https://x.com/HarshitKhemani/status/2082996061602468086 | 2026-07-31 | X post | 10 years ago, when I was 9, I made an X (or ... |
| 2026-07-31-25-year-old-stood | https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7488986888024842240 | 2026-07-31 | LinkedIn post | a 25-year-old stood in a lunch queue in Delhi in 2008 and ... |
| 2026-07-31-ive-wanted-enroll-emilkowalskis | https://x.com/HarshitKhemani/status/2083256915950502159 | 2026-07-31 | X post | i've wanted to enroll in @emilkowalski's https://t.co/TXr2xkqnND for the longest time, but ... |
| 2026-07-31-jayair-not-sold-acquired | https://x.com/HarshitKhemani/status/2083099818738774411 | 2026-07-31 | X reply | @jayair not sold, acquired. most of these teams are still building the ... |
| 2026-08-01-agree-almost-everything-here | https://x.com/HarshitKhemani/status/2083460987508637847 | 2026-08-01 | X post | i agree with almost everything here. |
| 2026-08-01-amritwt-haha-yea-last | https://x.com/HarshitKhemani/status/2083597156032934243 | 2026-08-01 | X reply | @amritwt haha yea. last month, I tried solving towards a universal theory ... |
| 2026-08-01-cultured-oo-yes-but | https://x.com/HarshitKhemani/status/2083388135317365000 | 2026-08-01 | X reply | @Fotografia92189 @cultured oo, yes! but I was talking more towards the 'sell ... |
| 2026-08-02-tech-unicorn-what-if | https://x.com/HarshitKhemani/status/2083801275351834681 | 2026-08-02 | X reply | @tech\_\_unicorn what if companies were internet-native by default? like not built out ... |
| 2026-08-03-clickupcrew-no-but-way | https://x.com/HarshitKhemani/status/2084240539134877927 | 2026-08-03 | X reply | @ClickUpCrew no, but this way, the agent can access MY account. I ... |
| 2026-08-03-made-skill-gives-startup | https://x.com/HarshitKhemani/status/2084315622230659388 | 2026-08-03 | X post | Made a Skill that gives startup advice from the actual YC canon: ... |
| 2026-08-04-excited-officially-join-elevenlabs | https://x.com/HarshitKhemani/status/2084667856328028248 | 2026-08-04 | X post | Excited to officially join the @ElevenLabs @ElevenCreative Ambassador Program 🚀 |
| 2026-08-09-business-strategy-analysis-agent | https://x.com/HarshitKhemani/status/2086499921881112774 | 2026-08-09 | X post | my Business Strategy & Analysis Agent is popular this week on the ... |
| 2026-08-09-n3ralcam-clem-works-well | https://x.com/HarshitKhemani/status/2086296113209069956 | 2026-08-09 | X reply | @N3RALCAM @\_clem works well with 1:1s but kinda weak in group meetings ... |
| 2026-08-09-notionhq-done-add-your | https://x.com/HarshitKhemani/status/2086500504398680298 | 2026-08-09 | X reply | @OsurmanHen73656 @NotionHQ done! add it to your workspace: |
| 2026-08-09-ve-built-economy-where | https://x.com/HarshitKhemani/status/2086447174704091432 | 2026-08-09 | X post | we’ve built an economy where labor demands more effort but cerebral work ... |
| 2026-08-09-why-do-pay-thinking | https://x.com/HarshitKhemani/article/2086442247239925760 | 2026-08-09 | X article article | Why do we pay thinking more than doing? |
| 2026-08-11-signlingo-khemoney | https://x.com/HarshitKhemani/status/2087227158238486957 | 2026-08-11 | X thread | https://signlingo.khe.money |
| 2026-08-15-funny-thing-being-trillionaire | https://x.com/HarshitKhemani/status/2088623868382691789 | 2026-08-15 | X reply | the funny thing is, being a trillionaire doesn’t mean you’ve run out ... |
| 2026-08-16-adilsyed23-telegram-has-great | https://x.com/HarshitKhemani/status/2089009163531866531 | 2026-08-16 | X reply | @Adilsyed23 telegram has a great api. @kunalb11 would be great if the ... |
| 2026-08-16-coobyk-proton-pass-true | https://x.com/HarshitKhemani/status/2088991026535154053 | 2026-08-16 | X reply | @Coobyk\_ @Proton\_Pass true, but I've been using it since the last 5 ... |
| 2026-08-17-investing-your-own-business | https://x.com/HarshitKhemani/status/2089347546716217772 | 2026-08-17 | X reply | investing in your own business is probably the highest-conviction bet, but it ... |
| 2026-08-17-think-your-stock-fractional | https://x.com/HarshitKhemani/status/2089344066035257406 | 2026-08-17 | X reply | think of your stock as a fractional claim on the economics of ... |
| 2026-08-18-github-humans-origin-agents | https://x.com/HarshitKhemani/status/2089532755122286848 | 2026-08-18 | X post | github ≈ humans |
| 2026-08-18-scobleizer-katies-context-key | https://x.com/HarshitKhemani/status/2089533645505831366 | 2026-08-18 | X reply | @Scobleizer @AlignmentMythAI @KatieS context is key |
| 2026-08-18-scobleizer-katies-yes-really | https://x.com/HarshitKhemani/status/2089538045150453866 | 2026-08-18 | X reply | @Scobleizer @AlignmentMythAI @KatieS yes it is! really exciting stuff, but I hope ... |
| 2026-08-18-shift-toward-one-person | https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7495549226785898498 | 2026-08-18 | LinkedIn post | the shift toward one-person companies is already happening as AI agents become ... |
| 2026-08-19-category-defining-products-then | https://x.com/HarshitKhemani/status/2090127356442853650 | 2026-08-19 | X post | category-defining products: |
| 2026-08-20-excited-share-joining-boardy | https://x.com/HarshitKhemani/status/2090255410007859519 | 2026-08-20 | X post | Excited to share that I'm joining the Boardy Pro Advisory Board! I'm ... |
| 2026-08-20-what-if-could-view | https://x.com/HarshitKhemani/status/2090501335041093716 | 2026-08-20 | X post | what if you could view and edit your skills across your local ... |
| 2026-08-21-skill-very-good-not | https://x.com/HarshitKhemani/status/2090872343107371440 | 2026-08-21 | X post | this skill is very good, not sure how it has only 4k ... |
| 2026-08-22-moving-fast-doesn-t | https://x.com/HarshitKhemani/status/2091047043049607596 | 2026-08-22 | X post | moving fast doesn’t matter if you’re not moving further. |
| 2026-08-22-sharavarora-defeats-purpose-braille | https://x.com/HarshitKhemani/status/2091141936619147386 | 2026-08-22 | X reply | @SharavArora defeats the purpose of Braille though, since people are supposed to ... |
| 2026-08-22-sharavarora-if-by-feel | https://x.com/HarshitKhemani/status/2091143009828262326 | 2026-08-22 | X reply | @SharavArora if by “feel braille on screen” you mean haptic sound/vibrations, that’s ... |
| 2026-08-23-designertom-fx-sh-last | https://x.com/HarshitKhemani/status/2091534279063040439 | 2026-08-23 | X reply | @designertom http://fx.sh is the last harness you'd ever need |
| 2026-08-23-if-youre-looking-some | https://x.com/HarshitKhemani/status/2091558128957710429 | 2026-08-23 | X post | if you're looking for some of the coolest designers on X, i ... |
| 2026-08-24-georgemayer-cursor-spacex-what | https://x.com/HarshitKhemani/status/2091685072986591399 | 2026-08-24 | X reply | @GeorgeMayer cursor to spacex is what instagram was to facebook |
| 2026-08-24-speakjava-intelligence-may-have | https://x.com/HarshitKhemani/status/2091687137498607807 | 2026-08-24 | X reply | @speakjava intelligence may have commoditized but the concentration of wealth in terms ... |
| 2026-08-24-were-not-building-websites | https://x.com/HarshitKhemani/status/2091884221464031534 | 2026-08-24 | X post | we're not just building websites for humans anymore. |
| 2026-08-25-hear-out-what-if | https://x.com/HarshitKhemani/status/2092044935046541574 | 2026-08-25 | X post | hear me out: what if openai launched a keyboard similar to gboard ... |
| 2026-08-25-talking-agents-more-than | https://x.com/HarshitKhemani/status/2092260547970613469 | 2026-08-25 | X post | talking to agents more than humans at this point, it's unhealthy. |
| 2026-08-25-vaibhavhome-bot-bot-plans | https://x.com/HarshitKhemani/status/2092283029540741303 | 2026-08-25 | X reply | @vaibhavhome @bot @bot plans most of the product/features, has a role-based structure ... |
| 2026-08-25-vaibhavhome-bot-shipped-well | https://x.com/HarshitKhemani/status/2092280537713168810 | 2026-08-25 | X reply | @vaibhavhome @bot shipped this (well, still in development): |
| 2026-08-26-got-snoop-dogg-hitman | https://x.com/HarshitKhemani/status/2092636502572605599 | 2026-08-26 | X post | we got snoop dogg in hitman before GTA VI 🗣️‼️ https://x.com/Hitman/status/2092628279521841497 |
| 2026-08-27-haha-thank-has-actually | https://x.com/HarshitKhemani/status/2092770926597407221 | 2026-08-27 | X reply | haha thank you! this has actually been a 20-month journey. i started ... |
| 2026-08-27-singhai-nima-owji-unified | https://x.com/HarshitKhemani/status/2092798317327720621 | 2026-08-27 | X reply | @singhai @nima\_owji a unified x login across all products would be great! |
| 2026-08-29-44latte-depends-driven-by | https://x.com/HarshitKhemani/status/2093735048591954330 | 2026-08-29 | X reply | @44latte depends, I was driven by curiousity as a kid and I ... |
| 2026-08-29-44latte-different-people-have | https://x.com/HarshitKhemani/status/2093736629492163004 | 2026-08-29 | X reply | @44latte different people have different ways of expressing themselves. if entrepreneurship is ... |
| 2026-08-29-cursor-has-become-such | https://x.com/HarshitKhemani/status/2093631467050119364 | 2026-08-29 | X post | Cursor has become such a big part of how i build that ... |
| 2026-08-29-itsnoahd-codex-direct-competitor | https://x.com/HarshitKhemani/status/2093762192843898983 | 2026-08-29 | X reply | @itsnoahd codex is a direct competitor + openai only serves 5% of ... |
| 2026-08-29-ketansahu-haha-yea-but | https://x.com/HarshitKhemani/status/2093778912409157740 | 2026-08-29 | X reply | @\_ketansahu haha yea, but idk man, maybe it's the fact that writing ... |
| 2026-08-29-nsharp17-couldn-t-agree | https://x.com/HarshitKhemani/status/2093750547333730326 | 2026-08-29 | X reply | @nsharp17 couldn’t agree more. social media got way too focused on audiences ... |
| 2026-08-29-zachmoskow-ill-miss-subsidized | https://x.com/HarshitKhemani/status/2093762958375682405 | 2026-08-29 | X reply | @zachmoskow I'll miss the subsidized model usage era. |
| 2026-08-29-zeroxjackson-moving-fast-doesnt | https://x.com/HarshitKhemani/status/2093532092680511862 | 2026-08-29 | X reply | @zeroxjackson moving fast doesn't matter if one doesn't move further. |
| 2026-08-30-early-attention-kid-hands | https://x.com/HarshitKhemani/status/2094065188098199624 | 2026-08-30 | X post | early attention as a kid just hands people a magnifying glass. people ... |
| 2026-08-30-mecharx2-44latte-parents-didnt | https://x.com/HarshitKhemani/status/2093889521373102324 | 2026-08-30 | X reply | @Mecharx2 @44latte my parents didn't tell me to start my first startup ... |
| 2026-08-30-micro-interactions-like-these | https://x.com/HarshitKhemani/status/2094115280595415316 | 2026-08-30 | X post | micro-interactions like these matter a lot! |
| 2026-08-30-plg-isn-t-about | https://x.com/HarshitKhemani/status/2094061078514950597 | 2026-08-30 | X post | PLG isn’t just about building a great product, it’s making the product ... |
| 2026-08-30-yeah-exactly-think-kind | https://x.com/HarshitKhemani/status/2093913635764773321 | 2026-08-30 | X reply | yeah exactly. i think that kind of curiosity is what drove me ... |
| 2026-08-31-dont-agree-showing-himself | https://x.com/HarshitKhemani/status/2094352639882604840 | 2026-08-31 | X reply | I don't agree with you on the 'showing himself on social media' ... |
| 2026-08-31-looking-forward-connect-more | https://x.com/HarshitKhemani/status/2094440699911713257 | 2026-08-31 | X post | looking forward to connect with more people from India who are building ... |
| 2026-08-31-wish-existing-browsers-like | https://x.com/HarshitKhemani/status/2094366932057354469 | 2026-08-31 | X post | wish existing browsers like chrome could build an SDK or something that ... |
| 2026-09-01-hadikhantech-grok-itd-burn | https://x.com/HarshitKhemani/status/2094669401815715889 | 2026-09-01 | X reply | @hadikhantech @grok it'd just burn more tokens tho if it's unstructured and ... |
| 2026-09-01-hadikhantech-grok-llms-consciously | https://x.com/HarshitKhemani/status/2094683660045988245 | 2026-09-01 | X reply | @hadikhantech @grok llms consciously know markdown formatting, but for txts, they'd have ... |
| 2026-09-01-hadikhantech-markdown-allows-hierarchy | https://x.com/HarshitKhemani/status/2094650493771661405 | 2026-09-01 | X reply | @hadikhantech markdown allows hierarchy for prioritization of context unlike txt |
| 2026-09-01-johnnynelai-x-every-x | https://x.com/HarshitKhemani/status/2094649950600851734 | 2026-09-01 | X reply | @johnnynelai @X every X account should have a mailbox that's accessible via ... |
| 2026-09-02-excited-share-khemoney-has | https://x.com/HarshitKhemani/status/2095035284710916161 | 2026-09-02 | X post | Excited to share that kheMoney has been named an OpenAI Select Partner. |
| 2026-09-03-constraints-create-way-better | https://x.com/HarshitKhemani/status/2095534238947061797 | 2026-09-03 | X post | constraints create way better outcomes than you can ever imagine. |
| 2026-09-03-coobyk-kunalb11-cant-leave | https://x.com/HarshitKhemani/status/2095515084454035567 | 2026-09-03 | X reply | @Coobyk\_ @kunalb11 can't leave the platform because everyone I talk to is ... |
| 2026-09-03-designerdada-d-hand-straight | https://x.com/HarshitKhemani/status/2095481942095597699 | 2026-09-03 | X reply | @designerdada i’d hand this straight to my agent with the a design skill skill ... |
| 2026-09-03-hemantg-marlbholo-where-can | https://x.com/HarshitKhemani/status/2095397024141361339 | 2026-09-03 | X reply | @\_hemantg @marlbholo where can I try instinct? poke's been my daily driver ... |
| 2026-09-03-ketansahu-bot-dont-think | https://x.com/HarshitKhemani/status/2095505326988833142 | 2026-09-03 | X reply | @\_ketansahu @bot @GUSTAVOSCHMIDT I don't think it does. it's mostly to set ... |
| 2026-09-03-marlbholo-interaction-oo-yea | https://x.com/HarshitKhemani/status/2095398092598358136 | 2026-09-03 | X reply | @marlbholo @interaction oo, yea poke isn't available on WhatsApp in India cuz ... |
| 2026-09-03-need-dashlane-agents | https://x.com/HarshitKhemani/status/2095310351160181155 | 2026-09-03 | X post | need a @dashlane for agents |
| 2026-09-03-whatsapp-has-shipped-many | https://x.com/HarshitKhemani/status/2095472381653631270 | 2026-09-03 | X post | WhatsApp has shipped so many product updates in the ~10 weeks since ... |
| 2026-09-05-coobyk-very-true-also | https://x.com/HarshitKhemani/status/2096091121734885805 | 2026-09-05 | X reply | @Coobyk\_ very true! also, im currently in my 3rd year of college ... |
| 2026-09-05-knowledge-curse-more-understand | https://x.com/HarshitKhemani/status/2096108317756260627 | 2026-09-05 | X post | knowledge is a curse. |
| 2026-09-05-more-use-llms-more | https://x.com/HarshitKhemani/status/2096106671848517816 | 2026-09-05 | X post | the more i use LLMs, the more i realize that programmers were, ... |
| 2026-09-05-saw-wusteps-dock-two | https://x.com/HarshitKhemani/status/2096141859374698496 | 2026-09-05 | X post | saw @wustep's dock: two icons for every AI app, one stock, one ... |
| 2026-09-05-what-if-could-order | https://x.com/HarshitKhemani/status/2096157594188644606 | 2026-09-05 | X post | what if you could order from Swiggy without leaving the terminal? |
| 2026-09-07-fafo-ed-way-build | https://x.com/HarshitKhemani/status/2096831748730720535 | 2026-09-07 | X post | FAFO-ed my way to build Smash&Clash for @specs |
| 2026-09-07-jenny-wen-constraints-create | https://x.com/HarshitKhemani/status/2097019802883891225 | 2026-09-07 | X reply | @jenny\_wen constraints create better outcomes! |
| 2026-09-09-wish-services-allowed-login | https://x.com/HarshitKhemani/status/2097520232189595935 | 2026-09-09 | X post | I wish services allowed a “Login with ChatGPT” or “Login with Grok” ... |
| 2026-09-11-earlier-had-manually-sign | https://x.com/HarshitKhemani/status/2098448553001841089 | 2026-09-11 | X reply | earlier we had to manually sign into the swiggy mcp with our ... |
| 2026-09-11-swiggy-mcp-poke-game | https://x.com/HarshitKhemani/status/2098451225851425279 | 2026-09-11 | X post | swiggy mcp with poke is a game changer |
| 2026-09-12-genuinely-excited-future-gaming | https://x.com/HarshitKhemani/status/2098624673311568047 | 2026-09-12 | X post | im genuinely so excited for the future of gaming. |
| 2026-09-12-introduced-team-bot-now | https://x.com/HarshitKhemani/status/2098682105249292484 | 2026-09-12 | X post | introduced my team to @bot, now im getting replaced by it. what ... |
| 2026-09-13-1-building-smash-clash | https://x.com/HarshitKhemani/status/2099172012606607467 | 2026-09-13 | X post | 1. im building Smash&Clash, a 2-player strategy board game you can play ... |
| 2026-09-13-if-have-explain-your | https://x.com/HarshitKhemani/status/2099039658323870191 | 2026-09-13 | X post | if you have to explain your product before someone can use it, ... |
| 2026-09-13-jawadmakes-true-easy-distribution | https://x.com/HarshitKhemani/status/2099078609684381813 | 2026-09-13 | X reply | @jawadmakes true, easy distribution |
| 2026-09-13-more-labor-intensive-work | https://x.com/HarshitKhemani/status/2099108726611521807 | 2026-09-13 | X post | the more labor-intensive the work, the more it exhausts you without necessarily ... |
| 2026-09-13-notionhq-also-big-shoutout | https://x.com/HarshitKhemani/status/2099172814406435053 | 2026-09-13 | X reply | @NotionHQ also, big shoutout to Notion for helping me organize my thoughts, ... |
| 2026-09-14-smash-clash-now-live | https://x.com/HarshitKhemani/status/2099319290734514288 | 2026-09-14 | X post | Smash&Clash is now live on Snapchat. |
| 2026-09-15-agentic-commerce-here-x | https://x.com/HarshitKhemani/status/2099708149767049420 | 2026-09-15 | X post | agentic commerce is here 🤯 https://x.com/aannuujX/status/2099694052165951626 |
| 2026-09-15-coobyk-try-google-drive | https://x.com/HarshitKhemani/status/2099681695557652939 | 2026-09-15 | X reply | @Coobyk\_ try google drive’s doc scanner, you won’t go back to any ... |
| 2026-09-16-ve-been-using-computers | https://x.com/HarshitKhemani/status/2100228344478666780 | 2026-09-16 | X post | i’ve been using computers since i was 4, so sitting in front ... |
| 2026-09-17-aaravgarg-not-right-but | https://x.com/HarshitKhemani/status/2100638976382267810 | 2026-09-17 | X reply | @aaravgarg not right, but a step in the right direction. still waiting ... |
| 2026-09-19-learn-by-fafo-tinkerer | https://x.com/HarshitKhemani/status/2101350604270706740 | 2026-09-19 | X post | learn by FAFO, be a tinkerer! https://x.com/nikunj/status/2101340098356990058 |
| 2026-09-20-buildwithsid-making-llm-def | https://x.com/HarshitKhemani/status/2101687216460406899 | 2026-09-20 | X reply | @buildwithsid making this with an LLM is def possible but not as ... |
| 2026-09-20-constraints-create-better-outcomes | https://x.com/HarshitKhemani/status/2101705796463796431 | 2026-09-20 | X post | constraints create better outcomes! https://x.com/cramforce/status/2101686378287501721 |
| 2026-09-20-jev-json-render-would | https://x.com/HarshitKhemani/status/2101627123824009341 | 2026-09-20 | X reply | @natashamalpani jev + json-render would be WILD |
| 2026-09-20-llms-turned-software-from | https://x.com/HarshitKhemani/status/2101626382824734900 | 2026-09-20 | X post | LLMs turned software from deterministic systems into non-deterministic powerhouses. |
| 2026-09-20-sometimes-companies-patent-things | https://x.com/HarshitKhemani/status/2101661958944747901 | 2026-09-20 | X reply | sometimes companies patent things precisely so competitors can’t build them first. and ... |
| 2026-09-21-12k-plays-counting-play | https://x.com/HarshitKhemani/status/2101984183753314733 | 2026-09-21 | X post | 12k plays and counting! |
| 2026-09-21-if-buyers-can-lowball | https://x.com/HarshitKhemani/status/2102054397505425772 | 2026-09-21 | X post | if buyers can lowball sellers with agents, sellers can also use agents ... |
| 2026-09-21-vijayshekhar-s-true-tho | https://x.com/HarshitKhemani/status/2101870918436110455 | 2026-09-21 | X reply | @vijayshekhar it’s true tho, interfaces will be on-demand |
| 2026-09-22-nomandsign-genuine-question-tho | https://x.com/HarshitKhemani/status/2102459471289307193 | 2026-09-22 | X reply | @Nomandsign genuine question tho: how is someone gonna share their X number ... |
| 2026-09-22-specs-built-game-specs | https://x.com/HarshitKhemani/status/2102263780524937301 | 2026-09-22 | X reply | @alessiograncini @specs I built my game (@smashnclashgame) for specs but I still ... |
| 2026-09-22-still-calling-ai-collectively | https://x.com/HarshitKhemani/status/2102426404331876413 | 2026-09-22 | X post | are we still calling it AI or are we collectively shifting to ... |
| 2026-09-22-wanna-use-muse-bad | https://x.com/HarshitKhemani/status/2102418738738037057 | 2026-09-22 | X post | i wanna use muse so bad |
| 2026-09-23-michaelbeer01-please-add-upi | https://x.com/HarshitKhemani/status/2102583248266391648 | 2026-09-23 | X reply | @michaelbeer01 please add UPI support to the roadmap 🥹 |
| 2026-09-23-wish-they-rolled-out | https://x.com/HarshitKhemani/status/2102752614140219824 | 2026-09-23 | X post | I wish they rolled out AI features in India too. been a ... |
| 2026-09-24-geoffreylitt-could-have-git | https://x.com/HarshitKhemani/status/2102959589729956200 | 2026-09-24 | X reply | @geoffreylitt or we could just have git-backed notion workspaces 👀 |
| 2026-09-25-akothari-fun-fact-why | https://x.com/HarshitKhemani/status/2103513353792725058 | 2026-09-25 | X reply | @akothari fun fact: this is why i initially started using Notion in ... |
| 2026-09-25-opus-5-5-another | https://x.com/HarshitKhemani/status/2103513994384605467 | 2026-09-25 | X post | opus 5.5 is on ANOTHER level man |
| 2026-09-25-rule-no-1-never | https://x.com/HarshitKhemani/status/2103493731169263816 | 2026-09-25 | X post | RULE NO. 1: never make any major life decisions: |
| 2026-09-25-stuff-people-building-ai | https://x.com/HarshitKhemani/status/2103516319828300097 | 2026-09-25 | X post | the stuff people are building with AI (or should I say SI) ... |
| 2026-09-25-tibor-tee-code-used | https://x.com/HarshitKhemani/status/2103522822790549685 | 2026-09-25 | X reply | @tibor\_tee code used to be deterministic, it's dynamic now thanks to LLMs. ... |
| 2026-09-27-asked-opus-5-5 | https://x.com/HarshitKhemani/status/2104226572714832226 | 2026-09-27 | X post | I asked opus 5.5 to rebuild @smashnclashgame's menus. IT'S SO GOOD AT ... |
| 2026-09-27-wustep-used-add-custom | https://x.com/HarshitKhemani/status/2104064713630048764 | 2026-09-27 | X reply | @wustep I used to add custom skins in fortnite with notepad++ hahah |
| 2026-09-28-agentic-commerce-here-built | https://x.com/HarshitKhemani/status/2104558703995469917 | 2026-09-28 | X post | agentic commerce is here! |
| 2026-09-28-fun-fact-can-edit | https://x.com/HarshitKhemani/status/2104614665645080972 | 2026-09-28 | X post | fun fact: you can edit markdown files directly in Notion |
| 2026-09-28-think-there-only-two | https://x.com/HarshitKhemani/status/2104587767506460874 | 2026-09-28 | X post | i think there are only TWO possible futures for consumer computing: |
| 2026-09-28-wustep-claudeai-bot-notionhq | https://x.com/HarshitKhemani/status/2104613627458371707 | 2026-09-28 | X reply | @wustep @claudeai @bot @NotionHQ you'd love my a design skill skill (I also added ... |
| 2026-09-29-emiliemc-citi-really-hope | https://x.com/HarshitKhemani/status/2104755603235336383 | 2026-09-29 | X reply | @emiliemc @Citi I really hope India starts adopting stablecoins |
| 2026-09-29-vercel-dev-vercel-domains | https://x.com/HarshitKhemani/status/2104730477584376178 | 2026-09-29 | X reply | @vercel\_dev vercel domains prices are a bit too high. any plans on ... |
| 2026-09-30-chatgpt-plugins-have-unlocked | https://x.com/HarshitKhemani/status/2105336569624474023 | 2026-09-30 | X post | ChatGPT Plugins have unlocked massive distribution for developers out there. |
| 2026-09-30-same-questions-poke-soo | https://x.com/HarshitKhemani/status/2105260592156271050 | 2026-09-30 | X reply | @sabeshbharathi same questions, poke is soo good and even has mcp support. |
| 2026-10-02-got-ryphone-duo-running | https://x.com/HarshitKhemani/status/2105888856801521921 | 2026-10-02 | X post | we got the ryPhone Duo running ryOS before GTA VI 🗣️‼️ |
| 2026-10-03-smash-clash-2-0 | https://www.linkedin.com/feed/update/urn%3Ali%3AugcPost%3A7512025106685059072 | 2026-10-03 | LinkedIn post | Smash&Clash 2.0 is out! |
| 2026-10-03-smash-clash-2-0-2 | https://x.com/HarshitKhemani/status/2106261180029554921 | 2026-10-03 | X post | Smash&Clash 2.0 is out! |
| 2026-10-04-harshitlog-tldraw-if-can | https://x.com/HarshitKhemani/status/2106672928201048321 | 2026-10-04 | X reply | @harshitlog @tldraw if you can draw on it, you can make a ... |
| 2026-10-04-maria-rcks-idk-how | https://x.com/HarshitKhemani/status/2106704030487691515 | 2026-10-04 | X reply | @maria\_rcks idk how to code btw https://x.com/HarshitKhemani/status/2106659181919154419 |
| 2026-10-04-open-sourced-tournament-organizer | https://x.com/HarshitKhemani/status/2106748909985145078 | 2026-10-04 | X post | We just open-sourced Tournament Organizer, a complete example of building a Smash&Clash ... |
| 2026-10-04-shipped-smash-clash-sdk | https://x.com/HarshitKhemani/status/2106659181919154419 | 2026-10-04 | X post | We shipped the Smash&Clash SDK, and to show what it can do, ... |
| 2026-10-04-shipped-smash-clash-sdk-2 | https://x.com/HarshitKhemani/status/2106658219019894978 | 2026-10-04 | X post | We shipped the Smash&Clash SDK, and to show what it can do, ... |
| 2026-10-04-smash-clash-now-retro | https://x.com/HarshitKhemani/status/2106811267986174224 | 2026-10-04 | X post | Smash&Clash is now on retro consoles! |
| 2026-10-06-smash-clash-now-telegram | https://x.com/HarshitKhemani/status/2107495726205006318 | 2026-10-06 | X post | Smash&Clash is now on @Telegram |
| 2026-10-06-someone-got-gta-v | https://www.linkedin.com/feed/update/urn%3Ali%3AugcPost%3A7513290368948465666 | 2026-10-06 | LinkedIn post | Someone got GTA V running in a web browser. |
| 2026-10-06-someone-got-gta-v-2 | https://x.com/HarshitKhemani/status/2107524697760182351 | 2026-10-06 | X post | Someone got GTA V running in a web browser. |
| 2026-10-07-kid-going-places-saw | https://x.com/HarshitKhemani/status/2107875480800219585 | 2026-10-07 | X post | this kid is going places! 🫡 |
| 2026-10-08-intelligence-has-commoditized-sure | https://x.com/HarshitKhemani/status/2108193786535059687 | 2026-10-08 | X post | intelligence has commoditized, sure. but the rich-get-richer equation still holds. |
| 2026-10-08-nikita1178151-yess-cosplayed-vizor | https://x.com/HarshitKhemani/status/2108137049807303136 | 2026-10-08 | X reply | @Nikita1178151 yess, I cosplayed Vizor (my comic’s character that I wrote back ... |
| 2026-10-08-pranvtwt-could-integrate-smash | https://x.com/HarshitKhemani/status/2108107082520272987 | 2026-10-08 | X reply | @pranvtwt you could integrate Smash&Clash SDK in it and let anyone build ... |
| 2026-10-08-true-s-why-introduced | https://x.com/HarshitKhemani/status/2108136746676592883 | 2026-10-08 | X reply | true! that’s why I introduced the Smash&Clash SDK. it allows anyone to ... |
| 2026-10-08-waiting4-asi-basically-dont | https://x.com/HarshitKhemani/status/2108192014106018005 | 2026-10-08 | X reply | @waiting4\_asi this is basically me. i don't live in code or do ... |
| 2026-10-10-smash-clash-now-playable | https://x.com/HarshitKhemani/status/2108950647492223164 | 2026-10-10 | X post | Smash&Clash is now playable inside GTA V |
| 2026-10-10-someone-gta-v-played | https://x.com/HarshitKhemani/status/2108808575925776795 | 2026-10-10 | X post | someone in GTA V just played a match of Smash&Clash against someone ... |
| 2026-10-10-yes-but-see-not | https://x.com/HarshitKhemani/status/2108904314924372336 | 2026-10-10 | X reply | yes, but see: it's not rebuilding https://t.co/g8Zcj4jMOd, it's the end of https://t.co/g8Zcj4jMOd ... |
| 2026-10-12-love-what-youre-building | https://x.com/HarshitKhemani/status/2109706776224686116 | 2026-10-12 | X reply | @TimSweeneyEpic love what you're building towards with UE6: open, interoperable, no walled ... |
| 2026-10-12-s-only-going-accelerate | https://x.com/HarshitKhemani/status/2109686706379341998 | 2026-10-12 | X post | it’s only going to accelerate further. |
| 2026-10-12-smash-clash-now-live | https://x.com/HarshitKhemani/status/2109689554362114260 | 2026-10-12 | X post | Smash&Clash is now live on the Microsoft Store! |
| 2026-10-13-aakashgupta-exactly-matters-more | https://x.com/HarshitKhemani/status/2109945758367760599 | 2026-10-13 | X reply | @aakashgupta exactly! interoperability matters more than ever and the ability to create ... |
| 2026-10-13-agent-oli-exactly-why | https://x.com/HarshitKhemani/status/2109903986518319295 | 2026-10-13 | X reply | @Agent\_Oli exactly why I opened up my game via an SDK allowing ... |
| 2026-10-13-daquackers-really-dont-care | https://x.com/HarshitKhemani/status/2109876231823110402 | 2026-10-13 | X reply | @DaQuackers I really don't care about how a game is made, I ... |
| 2026-10-13-don-t-get-why | https://x.com/HarshitKhemani/status/2109873617886748829 | 2026-10-13 | X post | I don’t get why people are going after Tim for this. |
| 2026-10-13-gpt-6s-generative-ui | https://x.com/HarshitKhemani/status/2109949488727224800 | 2026-10-13 | X post | GPT-6's generative UI is genuinely insane. I asked ChatGPT, 'let's play Smash&Clash' ... |
| 2026-10-13-iamrishitabh-not-really-why | https://x.com/HarshitKhemani/status/2110007267466911796 | 2026-10-13 | X reply | @iamRishitabh not really, this is why I built the SDK! on-demand interfaces ... |
| 2026-10-13-thanks-honestly-client-stays | https://x.com/HarshitKhemani/status/2109908599950692465 | 2026-10-13 | X reply | thanks! honestly, the client stays completely free to play, we plan to ... |
| 2026-10-13-youll-notice-smash-clash | https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7515683325471113216 | 2026-10-13 | LinkedIn post | you'll notice Smash&Clash looks a little different today. |
| 2026-10-14-cool-but-ui-meant | https://x.com/HarshitKhemani/status/2110358273547444677 | 2026-10-14 | X reply | cool but this is ui. i meant interoperable pieces of game assets ... |
| 2026-10-14-need-shadcn-gaming | https://x.com/HarshitKhemani/status/2110228800760082693 | 2026-10-14 | X post | we need a shadcn for gaming. |
| 2026-10-15-aleksksaa-yourpersona-think-they | https://x.com/HarshitKhemani/status/2110677077603262642 | 2026-10-15 | X reply | @aleksksaa @yourpersona i think they’re trying to understand product decisions from various ... |
| 2026-10-15-big-fan-arcade-battle | https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7516361321047605249 | 2026-10-15 | LinkedIn post | i'm a big fan of the Arcade / 'Battle Hub' inside Street ... |
| 2026-10-15-dont-want-miss-out | https://x.com/HarshitKhemani/status/2110649412288475501 | 2026-10-15 | X post | I don't want to miss out on being early inside Fortnite/Verse. |
| 2026-10-15-sorry-but-gaming-wont | https://x.com/HarshitKhemani/status/2110643118832017873 | 2026-10-15 | X post | sorry but gaming won't survive inside walled gardens anymore 💔 |
| 2026-10-18-all-websites-should-ship | https://x.com/HarshitKhemani/status/2111699566487879694 | 2026-10-18 | X post | all websites should ship a custom right click menu, looks so much ... |
| 2026-10-18-ann-nnng-haha-ikr | https://x.com/HarshitKhemani/status/2111759527213514831 | 2026-10-18 | X reply | @ann\_nnng haha ikr! i made a little sports demo that allows you ... |
| 2026-10-18-building-games-getting-easy | https://x.com/HarshitKhemani/status/2111884410010431569 | 2026-10-18 | X post | building games is getting as easy as posting a short. |
| 2026-10-18-mean-floor-has-raised | https://x.com/HarshitKhemani/status/2111720743059050783 | 2026-10-18 | X reply | i mean, the floor has raised a lot but so has the ... |
| 2026-10-18-si-has-been-enabler | https://x.com/HarshitKhemani/status/2111821591692886087 | 2026-10-18 | X post | SI has been an enabler for many builders out there. |
| 2026-10-18-si-not-hype-tho | https://x.com/HarshitKhemani/status/2111821040045412358 | 2026-10-18 | X reply | SI is not just hype tho, it's becoming a way of accelerating ... |
| 2026-10-18-using-tldraw-offline-emilkowalskis | https://x.com/HarshitKhemani/status/2111747149725831646 | 2026-10-18 | X post | using @tldraw offline with @emilkowalski's skills is really underrated. |
| 2026-10-18-zaiphirion-appreciate-giving-shot | https://x.com/HarshitKhemani/status/2111843155314454871 | 2026-10-18 | X reply | @zaiphirion appreciate you giving it a shot and being honest! I intentionally ... |
| 2026-10-19-0-100-entirely-vibe | https://x.com/HarshitKhemani/status/2112037534922576299 | 2026-10-19 | X post | 0/100?? |
| 2026-10-19-always-fascinated-by-how | https://x.com/HarshitKhemani/status/2112035743422177593 | 2026-10-19 | X post | I was always fascinated by how The Finals had live commentary, and ... |
| 2026-10-19-keep-experimenting-keep-tinkering | https://x.com/HarshitKhemani/status/2112113623778951249 | 2026-10-19 | X post | KEEP EXPERIMENTING |
| 2026-10-20-gaming-also-going-get | https://x.com/HarshitKhemani/status/2112457428868776278 | 2026-10-20 | X post | gaming is also going to get really interesting in this new world ... |
| 2026-10-20-mcp-events-best-addition | https://x.com/HarshitKhemani/status/2112443279082229986 | 2026-10-20 | X post | MCP Events are the best addition to the MCP spec ngl |
| 2026-10-20-shanehegde-freedom-only-works | https://x.com/HarshitKhemani/status/2112564341652463809 | 2026-10-20 | X reply | @shanehegde the freedom only works if the constraints are explicit enough for ... |
| 2026-10-20-your-product-wont-live | https://x.com/HarshitKhemani/status/2112453994643870174 | 2026-10-20 | X post | your product won't live in one place in the future. |
| 2026-10-21-treat-games-like-products | https://x.com/HarshitKhemani/status/2112882020636594542 | 2026-10-21 | X post | treat games like products, treat products like games. |
| 2026-10-21-true-information-velocity-has | https://x.com/HarshitKhemani/status/2112713351893750055 | 2026-10-21 | X post | true. information velocity has increased tremendously in the last couple of months, ... |
| 2026-10-22-watched-waiting4-asis-top | https://x.com/HarshitKhemani/status/2113309428887998492 | 2026-10-22 | X post | just watched @waiting4\_asi's top 3 predictions for the future and honestly all ... |
| 2026-10-23-wabi-plaid-wish-available | https://x.com/HarshitKhemani/status/2113467346224607559 | 2026-10-23 | X reply | @wabi @Plaid I wish this was available for Indian banks |
| 2026-10-24-100k-matches-hosted-snapchat | https://x.com/HarshitKhemani/status/2114054062157312155 | 2026-10-24 | X post | 100K+ matches hosted on Snapchat! |
| 2026-10-24-can-run-doom-yes | https://x.com/HarshitKhemani/status/2114047270748639512 | 2026-10-24 | X post | Can it run DOOM? |
| 2026-10-24-few-weeks-ago-realized | https://x.com/HarshitKhemani/status/2113919196866449793 | 2026-10-24 | X post | a few weeks ago, I realized Notion can open and edit local ... |
| 2026-10-24-notion-passport-your-agents | https://x.com/HarshitKhemani/status/2114043060942503999 | 2026-10-24 | X post | notion, the passport for your agents. |
| 2026-10-25-notionhq-believe-tallyforms-would | https://x.com/HarshitKhemani/status/2114171665001447692 | 2026-10-25 | X reply | @Fotografia92189 @nikhilkamathcio @NotionHQ I believe @TallyForms would still exist if they sell ... |
| 2026-10-25-qol-update-notion-added | https://x.com/HarshitKhemani/status/2114204528577065354 | 2026-10-25 | X post | QOL update: Notion just added PDF icons for file uploads! |
| 2026-10-26-boardyai-mariemartens-tallyforms-oo | https://x.com/HarshitKhemani/status/2114722148740895192 | 2026-10-26 | X reply | @boardyai @MarieMartens @TallyForms oo we need that! (webmcp too but programmatic mcp ... |
| 2026-10-26-cloud-gaming-relies-dedicated | https://x.com/HarshitKhemani/status/2114737613102055768 | 2026-10-26 | X reply | cloud gaming relies on dedicated hardware in the cloud. |
| 2026-10-26-people-who-let-experiment | https://x.com/HarshitKhemani/status/2114761325817815068 | 2026-10-26 | X post | people who let you experiment a lot & fuck around and find ... |
| 2026-10-26-sainotsoai-atharvavaidya-hand-design | https://x.com/HarshitKhemani/status/2114576404717437434 | 2026-10-26 | X reply | @sainotsoai @atharvavaidya or just hand it a .design file https://github.com/his agent studio/design |
| 2026-10-27-anaarsonist-vertical-use-ai | https://x.com/HarshitKhemani/status/2115023942683664569 | 2026-10-27 | X reply | @AnaArsonist vertical use of ai >> horizontal use of ai |
| 2026-10-27-marvinkennis-benjitaylor-jesper-vos | https://x.com/HarshitKhemani/status/2114920947409166394 | 2026-10-27 | X reply | @marvinkennis @benjitaylor @jesper\_vos in real time?! og:video is very underexplored |
| 2026-10-28-coobyk-geometric-vs-optical | https://x.com/HarshitKhemani/status/2115236814248431640 | 2026-10-28 | X reply | @Coobyk\_ geometric vs optical center |
| 2026-10-29-every-time-farza-posts | https://x.com/HarshitKhemani/status/2115661452136927412 | 2026-10-29 | X post | every time Farza posts, i get a lil too excited because THIS ... |
| 2026-10-29-made-bet-customers-spending | https://x.com/HarshitKhemani/status/2115667849813647497 | 2026-10-29 | X post | we made a bet that customers spending less time in our product ... |
| 2026-10-31-upi-finally-available-whop | https://x.com/HarshitKhemani/status/2116412493203730866 | 2026-10-31 | X post | UPI is (finally) available on @whop!! |
| 2026-11-01-nuvolore-need-school-agents | https://x.com/HarshitKhemani/status/2116787423162352035 | 2026-11-01 | X reply | @nuvolore we need a school for agents, where the agents are given ... |
| 2026-11-02-ive-been-having-hard | https://x.com/HarshitKhemani/status/2117122521191665729 | 2026-11-02 | X post | i've been having a hard time getting one thought out of my ... |
| 2026-11-02-what-if-had-videos | https://x.com/HarshitKhemani/status/2117279159844311052 | 2026-11-02 | X post | what if 𝕏 had videos? |
| 2026-11-04-addyosmani-intentionally-want-other | https://x.com/HarshitKhemani/status/2117849299333914863 | 2026-11-04 | X reply | @addyosmani I intentionally want other people to copy my game (not exactly ... |
| 2026-11-05-prvkhvr-all-about-channelizing | https://x.com/HarshitKhemani/status/2118351733319757928 | 2026-11-05 | X reply | @prvkhvr it's all about channelizing the hatred and building something great out ... |
| 2026-11-05-when-can-start-vibe | https://x.com/HarshitKhemani/status/2118351951498981836 | 2026-11-05 | X post | when can we start vibe coding atoms? |
| 2026-11-06-bcis-inevitable-really-excited | https://x.com/HarshitKhemani/status/2118660565954679050 | 2026-11-06 | X post | BCIs are inevitable. really excited for what @temple is building! https://x.com/deepigoyal/status/2118658277273993270 |
| 2026-11-06-nuvolore-wonder-if-agents | https://x.com/HarshitKhemani/status/2118724905839845543 | 2026-11-06 | X reply | @nuvolore I wonder if agents will ever have a different mainstream language ... |
| 2026-11-06-thats-fair-but-think | https://x.com/HarshitKhemani/status/2118731449532911992 | 2026-11-06 | X reply | that's fair, but i think that's a product/design choice, not necessarily a ... |
| 2026-11-06-think-about-way-programming | https://x.com/HarshitKhemani/status/2118727317027766589 | 2026-11-06 | X reply | think about it this way: |
| 2026-11-06-ve-been-thinking-lot | https://x.com/HarshitKhemani/status/2118637259394023690 | 2026-11-06 | X post | i’ve been thinking a lot about whether subjective consciousness can actually continue ... |
| 2026-11-07-emilkowalski-shadcn-ive-been | https://x.com/HarshitKhemani/status/2119052511965487228 | 2026-11-07 | X reply | @emilkowalski @shadcn I've been experimenting with a concept called Agents School. It's ... |
| 2026-11-07-garrytan-exploring-idea-agent | https://x.com/HarshitKhemani/status/2118920272187441286 | 2026-11-07 | X reply | @garrytan exploring the idea of an agent school where your agents can ... |
| 2026-11-09-games-within-games-connected | https://x.com/HarshitKhemani/status/2119696322651673030 | 2026-11-09 | X post | games within games, connected through interoperability, will shape the next decade of ... |
| 2026-11-09-like-current-dialogue-system | https://x.com/HarshitKhemani/status/2119734577325576476 | 2026-11-09 | X reply | like the current dialogue system has a few 'scripted' responses that were ... |
| 2026-11-09-top5gamingx-dubbed-localization-elevenlabs | https://x.com/HarshitKhemani/status/2119729684493799542 | 2026-11-09 | X reply | @Top5Gamingx dubbed localization with @ElevenLabs would be so goated |
| 2026-11-11-mattworkman-by-integrating-your | https://x.com/HarshitKhemani/status/2120429822967251226 | 2026-11-11 | X reply | @mattworkman by integrating your game into platforms/games that people are already on ... |
| 2026-11-11-npx-skills-add-hktitan | https://x.com/HarshitKhemani/status/2120395864988647844 | 2026-11-11 | X post | npx skills add HKTITAN/skills |
| 2026-11-13-fnionic-true-launched-across | https://x.com/HarshitKhemani/status/2121062435536908683 | 2026-11-13 | X reply | @FnIonic true, we launched across lots of platforms, with Snapchat having the ... |

import { test, expect } from "@playwright/test";

test.beforeEach("go to the local host", async ({ page }) => {
  await page.goto("http://localhost:8000/");
});

test("on page load, i see an input bar", async ({ page }) => {
  await expect(page.getByLabel("Command input")).toBeVisible();
});

test("after I type into the input box, its text changes", async ({ page }) => {
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("Awesome command");
  const mock_input = `Awesome command`;
  await expect(page.getByLabel("Command input")).toHaveValue(mock_input);
});

test("on page load, i see a button", async ({ page }) => {
  await expect(page.getByRole("button")).toBeVisible();
});

test("the default mode is brief", async ({ page }) => {
  await expect(
    page.getByRole("button", { name: "Submitted Briefly" })
  ).toBeVisible();
});

test("mode switch changes the button", async ({ page }) => {
  await expect(
    page.getByRole("button", { name: "Submitted Briefly" })
  ).toBeVisible();
  await page.getByLabel("Command input").fill("mode verbose");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();
  await expect(
    page.getByRole("button", { name: "Submitted Verbosely" })
  ).toBeVisible();
  await page.getByLabel("Command input").fill("mode brief");
  await page.getByRole("button", { name: "Submitted Verbosely" }).click();
  await expect(
    page.getByRole("button", { name: "Submitted Briefly" })
  ).toBeVisible();
});

test("test verbose mode", async ({ page }) => {
  await page.getByPlaceholder("Enter command here!").fill("mode verbose");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();
  await expect(
    page.getByText("Command: mode verbose Output: Mode set to Verbose")
  ).toBeVisible();
  await page.getByPlaceholder("Enter command here!").fill("mode brief");
  await page.getByRole("button", { name: "Submitted Verbosely" }).click();
  await expect(page.getByText("Output: Mode set to Brief")).toBeVisible();
});

test("load success message printing brief", async ({ page }) => {
  await page.getByPlaceholder("Enter command here!").fill("load people.csv");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();
  await expect(
    page.getByText("Output: Successfully loaded file people.csv")
  ).toBeVisible();
});

test("load success message printing verbose", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await page.getByPlaceholder("Enter command here!").fill("mode verbose");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();
  await page.getByPlaceholder("Enter command here!").fill("load people.csv");
  await page.getByRole("button", { name: "Submitted Verbosely" }).click();
  await expect(
    page.getByText(
      "Command: load people.csv Output: Successfully loaded file people.csv"
    )
  ).toBeVisible();
});

test("load fail message printing brief", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await page.getByPlaceholder("Enter command here!").fill("load fake.csv");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();
  await expect(
    page.getByText("Output: Error: File fake.csv not found")
  ).toBeVisible();
});

test("load fail message printing verbose", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await page.getByPlaceholder("Enter command here!").fill("mode verbose");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();
  await page.getByPlaceholder("Enter command here!").fill("load fake.csv");
  await page.getByRole("button", { name: "Submitted Verbosely" }).click();
  await expect(
    page.getByText(
      "Command: load fake.csv Output: Error: File fake.csv not found"
    )
  ).toBeVisible();
});

test("invalid command", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  //invalid command brief mode
  await page.getByPlaceholder("Enter command here!").fill("invalid");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();
  await expect(page.getByText("Output: Error: Invalid command")).toBeVisible();

  //invalid command verbose mode
  await page.getByPlaceholder("Enter command here!").fill("mode verbose");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();
  await page.getByPlaceholder("Enter command here!").fill("invalid");
  await expect(
    page.getByText("Command: invalid Output: Error: Invalid command")
  ).toBeVisible();
});

test("test view before load", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await page.getByPlaceholder("Enter command here!").fill("view people.csv");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();
  await expect(
    page.getByText("Output: Error: No dataset loaded")
  ).toBeVisible();
});

test("view success message", async ({ page }) => {
  await page.getByPlaceholder("Enter command here!").fill("load people.csv");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();
  await page.getByPlaceholder("Enter command here!").fill("view people.csv");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();
  await expect(page.getByLabel("history-div")).toContainText([
    "NameAgeCityAlice25New YorkBob30ChicagoCharlie35Los AngelesPercy26New York",
  ]);
});

test("view large dataset", async ({ page }) => {
  await page
    .getByPlaceholder("Enter command here!")
    .fill("load income_by_race.csv");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();
  await page
    .getByPlaceholder("Enter command here!")
    .fill("view income_by_race.csv");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();
  await expect(page.getByLabel("history-div")).toContainText([
    "ID RaceRaceID YearYearHousehold Income by RaceHousehold Income by Race MoeGeographyID GeographySlug Geography0Total20202020854136122Bristol County, RI05000US44001bristol-county-ri0Total20202020758572022Kent County, RI05000US44003kent-county-ri0Total20202020842822629Newport County, RI05000US44005newport-county-ri0Total20202020623231270Providence County, RI05000US44007providence-county-ri0Total20202020869703651Washington County, RI05000US44009washington-county-ri1White20202020853596432Bristol County, RI05000US44001bristol-county-ri1White20202020754082311Kent County, RI05000US44003kent-county-ri1White20202020874073706Newport County, RI05000US44005newport-county-ri1White20202020676391255Providence County, RI05000US44007providence-county-ri1White20202020881473942Washington County, RI05000US44009washington-county-ri2Black202020207244354768Bristol County, RI05000US44001bristol-county-ri2Black2020202010037520176Kent County, RI05000US44003kent-county-ri2Black202020204662214559Newport County, RI05000US44005newport-county-ri2Black20202020460843384.0000000000000Providence County, RI05000US44007providence-county-ri2Black20202020458496614Washington County, RI05000US44009washington-county-ri3Native American202020203610616192Providence County, RI05000US44007providence-county-ri4Asian202020206961253700Bristol County, RI05000US44001bristol-county-ri4Asian202020209757818617Kent County, RI05000US44003kent-county-ri4Asian2020202011035012239Newport County, RI05000US44005newport-county-ri4Asian20202020814385762Providence County, RI05000US44007providence-county-ri4Asian202020206965331807.000000000000Washington County, RI05000US44009washington-county-ri5Pacific Islander20202020439904351Providence County, RI05000US44007providence-county-ri6Other202020206044613988Kent County, RI05000US44003kent-county-ri6Other20202020293752225Newport County, RI05000US44005newport-county-ri6Other20202020407064024Providence County, RI05000US44007providence-county-ri7Two Or More2020202010025022504Bristol County, RI05000US44001bristol-county-ri7Two Or More202020207593826788Kent County, RI05000US44003kent-county-ri7Two Or More20202020835745944Newport County, RI05000US44005newport-county-ri7Two Or More20202020471638892Providence County, RI05000US44007providence-county-ri7Two Or More202020209689842213Washington County, RI05000US44009washington-county-ri8White Non-Hispanic20202020864637051Bristol County, RI05000US44001bristol-county-ri8White Non-Hispanic20202020752652318Kent County, RI05000US44003kent-county-ri8White Non-Hispanic20202020877133638Newport County, RI05000US44005newport-county-ri8White Non-Hispanic20202020714281376Providence County, RI05000US44007providence-county-ri8White Non-Hispanic20202020875163859.0000000000000Washington County, RI05000US44009washington-county-ri9Hispanic202020206416725729Bristol County, RI05000US44001bristol-county-ri9Hispanic202020207660214152Kent County, RI05000US44003kent-county-ri9Hispanic202020205665233449Newport County, RI05000US44005newport-county-ri9Hispanic20202020415921749Providence County, RI05000US44007providence-county-ri9Hispanic2020202010492930259Washington County, RI05000US44009washington-county-ri0Total20192019830924339Bristol County, RI05000US44001bristol-county-ri0Total20192019735211703Kent County, RI05000US44003kent-county-ri0Total20192019794542611Newport County, RI05000US44005newport-county-ri0Total20192019589741051Providence County, RI05000US44007providence-county-ri0Total20192019855312042Washington County, RI05000US44009washington-county-ri1White20192019827505075Bristol County, RI05000US44001bristol-county-ri1White20192019734151906Kent County, RI05000US44003kent-county-ri1White20192019821582740Newport County, RI05000US44005newport-county-ri1White20192019641951128Providence County, RI05000US44007providence-county-ri1White20192019870192150Washington County, RI05000US44009washington-county-ri2Black201920197960917881Kent County, RI05000US44003kent-county-ri2Black201920194476512493Newport County, RI05000US44005newport-county-ri2Black20192019433873459.0000000000000Providence County, RI05000US44007providence-county-ri2Black201920198301116035Washington County, RI05000US44009washington-county-ri3Native American201920193937535211Newport County, RI05000US44005newport-county-ri3Native American201920193320010203Providence County, RI05000US44007providence-county-ri4Asian2019201911875078991Bristol County, RI05000US44001bristol-county-ri4Asian20192019922689257Kent County, RI05000US44003kent-county-ri4Asian2019201910691224529Newport County, RI05000US44005newport-county-ri4Asian20192019754254603Providence County, RI05000US44007providence-county-ri4Asian201920197573511221Washington County, RI05000US44009washington-county-ri5Pacific Islander201920194081516560Providence County, RI05000US44007providence-county-ri6Other201920197017923312Kent County, RI05000US44003kent-county-ri6Other20192019369623139Providence County, RI05000US44007providence-county-ri7Two Or More2019201911007843635Bristol County, RI05000US44001bristol-county-ri7Two Or More201920195811211419Kent County, RI05000US44003kent-county-ri7Two Or More201920197075016835Newport County, RI05000US44005newport-county-ri7Two Or More20192019450306614Providence County, RI05000US44007providence-county-ri8White Non-Hispanic20192019832164938Bristol County, RI05000US44001bristol-county-ri8White Non-Hispanic20192019733161864.0000000000000Kent County, RI05000US44003kent-county-ri8White Non-Hispanic20192019822822614Newport County, RI05000US44005newport-county-ri8White Non-Hispanic20192019679751352Providence County, RI05000US44007providence-county-ri8White Non-Hispanic20192019868572237Washington County, RI05000US44009washington-county-ri9Hispanic201920197054324295Bristol County, RI05000US44001bristol-county-ri9Hispanic201920197468511265Kent County, RI05000US44003kent-county-ri9Hispanic201920195610622438Newport County, RI05000US44005newport-county-ri9Hispanic20192019391251865Providence County, RI05000US44007providence-county-ri9Hispanic201920198366158895Washington County, RI05000US44009washington-county-ri0Total20182018755783422Bristol County, RI05000US44001bristol-county-ri0Total20182018702231879.0000000000000Kent County, RI05000US44003kent-county-ri0Total20182018772373024Newport County, RI05000US44005newport-county-ri0Total2018201855233904.0000000000000Providence County, RI05000US44007providence-county-ri0Total20182018813012985Washington County, RI05000US44009washington-county-ri1White20182018757303643.0000000000000Bristol County, RI05000US44001bristol-county-ri1White20182018704021972Kent County, RI05000US44003kent-county-ri1White20182018800353330Newport County, RI05000US44005newport-county-ri1White20182018604371180Providence County, RI05000US44007providence-county-ri1White20182018822403183Washington County, RI05000US44009washington-county-ri2Black201820186347221347Kent County, RI05000US44003kent-county-ri2Black201820185062519586Newport County, RI05000US44005newport-county-ri2Black20182018407092053Providence County, RI05000US44007providence-county-ri2Black201820189031320795Washington County, RI05000US44009washington-county-ri3Native American201820183576727464Newport County, RI05000US44005newport-county-ri3Native American201820183510112922Providence County, RI05000US44007providence-county-ri4Asian201820188225080499Bristol County, RI05000US44001bristol-county-ri4Asian201820189787917549Kent County, RI05000US44003kent-county-ri4Asian2018201810773319097Newport County, RI05000US44005newport-county-ri4Asian20182018683833861Providence County, RI05000US44007providence-county-ri4Asian201820187594610049Washington County, RI05000US44009washington-county-ri5Pacific Islander20182018415084724Providence County, RI05000US44007providence-county-ri6Other201820187567931076Kent County, RI05000US44003kent-county-ri6Other20182018113414468Newport County, RI05000US44005newport-county-ri6Other20182018352252479Providence County, RI05000US44007providence-county-ri7Two Or More201820184808314257Kent County, RI05000US44003kent-county-ri7Two Or More201820186812532171Newport County, RI05000US44005newport-county-ri7Two Or More20182018416073396Providence County, RI05000US44007providence-county-ri8White Non-Hispanic20182018760573490.0000000000000Bristol County, RI05000US44001bristol-county-ri8White Non-Hispanic20182018702862041.0000000000000Kent County, RI05000US44003kent-county-ri8White Non-Hispanic20182018802903111Newport County, RI05000US44005newport-county-ri8White Non-Hispanic2018201864160985.0000000000000Providence County, RI05000US44007providence-county-ri8White Non-Hispanic20182018821663288Washington County, RI05000US44009washington-county-ri9Hispanic201820185160231160.000000000000Bristol County, RI05000US44001bristol-county-ri9Hispanic201820187390614038Kent County, RI05000US44003kent-county-ri9Hispanic201820184151224697Newport County, RI05000US44005newport-county-ri9Hispanic20182018351391669Providence County, RI05000US44007providence-county-ri9Hispanic201820188227956035Washington County, RI05000US44009washington-county-ri0Total20172017746303265Bristol County, RI05000US44001bristol-county-ri0Total20172017690472197Kent County, RI05000US44003kent-county-ri0Total20172017754631780Newport County, RI05000US44005newport-county-ri0Total2017201752530812Providence County, RI05000US44007providence-county-ri0Total20172017778622350Washington County, RI05000US44009washington-county-ri1White20172017747363411Bristol County, RI05000US44001bristol-county-ri1White20172017699122016.0000000000000Kent County, RI05000US44003kent-county-ri1White20172017772442184Newport County, RI05000US44005newport-county-ri1White20172017579171170Providence County, RI05000US44007providence-county-ri1White20172017783502452Washington County, RI05000US44009washington-county-ri2Black20172017400249584Kent County, RI05000US44003kent-county-ri2Black201720173948315542Newport County, RI05000US44005newport-county-ri2Black20172017375532770Providence County, RI05000US44007providence-county-ri2Black201720179825025121Washington County, RI05000US44009washington-county-ri3Native American2017201789387773Newport County, RI05000US44005newport-county-ri3Native American20172017279603745Providence County, RI05000US44007providence-county-ri4Asian201720177877838212Bristol County, RI05000US44001bristol-county-ri4Asian201720179500016888Kent County, RI05000US44003kent-county-ri4Asian201720171058752926Newport County, RI05000US44005newport-county-ri4Asian20172017629835383Providence County, RI05000US44007providence-county-ri4Asian201720177309434344Washington County, RI05000US44009washington-county-ri5Pacific Islander20172017417116825.000000000000Providence County, RI05000US44007providence-county-ri6Other201720174230423495Kent County, RI05000US44003kent-county-ri6Other201720173252231695Newport County, RI05000US44005newport-county-ri6Other20172017330262866Providence County, RI05000US44007providence-county-ri7Two Or More201720177701137514Bristol County, RI05000US44001bristol-county-ri7Two Or More201720174400011831Kent County, RI05000US44003kent-county-ri7Two Or More201720175625045583Newport County, RI05000US44005newport-county-ri7Two Or More20172017404535913Providence County, RI05000US44007providence-county-ri8White Non-Hispanic20172017747883320Bristol County, RI05000US44001bristol-county-ri8White Non-Hispanic20172017697242055Kent County, RI05000US44003kent-county-ri8White Non-Hispanic20172017777802312Newport County, RI05000US44005newport-county-ri8White Non-Hispanic20172017614661015Providence County, RI05000US44007providence-county-ri8White Non-Hispanic20172017783642455Washington County, RI05000US44009washington-county-ri9Hispanic201720174754231963Bristol County, RI05000US44001bristol-county-ri9Hispanic201720176506914243.000000000000Kent County, RI05000US44003kent-county-ri9Hispanic201720173625010115Newport County, RI05000US44005newport-county-ri9Hispanic20172017328381822Providence County, RI05000US44007providence-county-ri9Hispanic201720176600046545Washington County, RI05000US44009washington-county-ri0Total20162016730962962Bristol County, RI05000US44001bristol-county-ri0Total20162016655921418Kent County, RI05000US44003kent-county-ri0Total20162016713472096Newport County, RI05000US44005newport-county-ri0Total2016201650637599Providence County, RI05000US44007providence-county-ri0Total20162016743022229Washington County, RI05000US44009washington-county-ri1White20162016732552929Bristol County, RI05000US44001bristol-county-ri1White20162016661161376Kent County, RI05000US44003kent-county-ri1White20162016731012389Newport County, RI05000US44005newport-county-ri1White2016201655418964Providence County, RI05000US44007providence-county-ri1White20162016749622699Washington County, RI05000US44009washington-county-ri2Black201620165075021955Kent County, RI05000US44003kent-county-ri2Black201620163812515190Newport County, RI05000US44005newport-county-ri2Black20162016363472108Providence County, RI05000US44007providence-county-ri2Black201620167833324435Washington County, RI05000US44009washington-county-ri3Native American2016201677087150Newport County, RI05000US44005newport-county-ri3Native American20162016272076936Providence County, RI05000US44007providence-county-ri4Asian201620167859844648Bristol County, RI05000US44001bristol-county-ri4Asian201620168445115969.000000000000Kent County, RI05000US44003kent-county-ri4Asian201620169961532343Newport County, RI05000US44005newport-county-ri4Asian20162016588656489Providence County, RI05000US44007providence-county-ri4Asian201620165386434694Washington County, RI05000US44009washington-county-ri5Pacific Islander20162016490758896Providence County, RI05000US44007providence-county-ri6Other20162016488499012Kent County, RI05000US44003kent-county-ri6Other201620163594617527Newport County, RI05000US44005newport-county-ri6Other20162016314102525Providence County, RI05000US44007providence-county-ri6Other201620165435443814Washington County, RI05000US44009washington-county-ri7Two Or More201620167331562393.00000000000Bristol County, RI05000US44001bristol-county-ri7Two Or More20162016341367418Kent County, RI05000US44003kent-county-ri7Two Or More201620165112543611Newport County, RI05000US44005newport-county-ri7Two Or More20162016356056327Providence County, RI05000US44007providence-county-ri7Two Or More201620165186042964Washington County, RI05000US44009washington-county-ri8White Non-Hispanic20162016730962931Bristol County, RI05000US44001bristol-county-ri8White Non-Hispanic20162016660101360Kent County, RI05000US44003kent-county-ri8White Non-Hispanic20162016735262358Newport County, RI05000US44005newport-county-ri8White Non-Hispanic2016201658890962Providence County, RI05000US44007providence-county-ri8White Non-Hispanic20162016749352687Washington County, RI05000US44009washington-county-ri9Hispanic201620166819438709Bristol County, RI05000US44001bristol-county-ri9Hispanic201620165937514497Kent County, RI05000US44003kent-county-ri9Hispanic201620163921417695Newport County, RI05000US44005newport-county-ri9Hispanic20162016306811539Providence County, RI05000US44007providence-county-ri9Hispanic201620165471549259Washington County, RI05000US44009washington-county-ri0Total20152015724583264Bristol County, RI05000US44001bristol-county-ri0Total20152015643831384Kent County, RI05000US44003kent-county-ri0Total20152015695264013Newport County, RI05000US44005newport-county-ri0Total2015201549743837Providence County, RI05000US44007providence-county-ri0Total20152015728072018.0000000000000Washington County, RI05000US44009washington-county-ri1White20152015728153491.0000000000000Bristol County, RI05000US44001bristol-county-ri1White20152015650891594Kent County, RI05000US44003kent-county-ri1White20152015720632802Newport County, RI05000US44005newport-county-ri1White20152015541481068Providence County, RI05000US44007providence-county-ri1White20152015741242231Washington County, RI05000US44009washington-county-ri2Black201520154633914032Kent County, RI05000US44003kent-county-ri2Black201520153532412508Newport County, RI05000US44005newport-county-ri2Black20152015356352376Providence County, RI05000US44007providence-county-ri2Black201520156985032800Washington County, RI05000US44009washington-county-ri3Native American201520153088223254Kent County, RI05000US44003kent-county-ri3Native American2015201577216671Newport County, RI05000US44005newport-county-ri3Native American20152015255816276Providence County, RI05000US44007providence-county-ri3Native American201520152937528355Washington County, RI05000US44009washington-county-ri4Asian201520157500044237Bristol County, RI05000US44001bristol-county-ri4Asian201520157230611596Kent County, RI05000US44003kent-county-ri4Asian201520156463236205Newport County, RI05000US44005newport-county-ri4Asian20152015526684329Providence County, RI05000US44007providence-county-ri4Asian201520153477317313Washington County, RI05000US44009washington-county-ri6Other201520154995911854Kent County, RI05000US44003kent-county-ri6Other20152015360425401Newport County, RI05000US44005newport-county-ri6Other20152015302822966Providence County, RI05000US44007providence-county-ri7Two Or More201520153875018572Kent County, RI05000US44003kent-county-ri7Two Or More201520153660721926Newport County, RI05000US44005newport-county-ri7Two Or More20152015374266042Providence County, RI05000US44007providence-county-ri7Two Or More201520154895027437Washington County, RI05000US44009washington-county-ri8White Non-Hispanic20152015727443542Bristol County, RI05000US44001bristol-county-ri8White Non-Hispanic20152015652741634Kent County, RI05000US44003kent-county-ri8White Non-Hispanic20152015725002793Newport County, RI05000US44005newport-county-ri8White Non-Hispanic20152015569331002Providence County, RI05000US44007providence-county-ri8White Non-Hispanic20152015743262237Washington County, RI05000US44009washington-county-ri9Hispanic201520156358334020Bristol County, RI05000US44001bristol-county-ri9Hispanic20152015496075303Kent County, RI05000US44003kent-county-ri9Hispanic201520153695612656Newport County, RI05000US44005newport-county-ri9Hispanic20152015290841458Providence County, RI05000US44007providence-county-ri9Hispanic20152015550315748Washington County, RI05000US44009washington-county-ri0Total20142014692405304Bristol County, RI05000US44001bristol-county-ri0Total20142014629761421Kent County, RI05000US44003kent-county-ri0Total20142014727022313Newport County, RI05000US44005newport-county-ri0Total2014201449139832Providence County, RI05000US44007providence-county-ri0Total20142014727841757Washington County, RI05000US44009washington-county-ri1White20142014700865118Bristol County, RI05000US44001bristol-county-ri1White20142014637021404Kent County, RI05000US44003kent-county-ri1White20142014744122263Newport County, RI05000US44005newport-county-ri1White2014201454134854Providence County, RI05000US44007providence-county-ri1White20142014741101884.0000000000000Washington County, RI05000US44009washington-county-ri2Black2014201442292219684Bristol County, RI05000US44001bristol-county-ri2Black201420144235018515Kent County, RI05000US44003kent-county-ri2Black201420143664517157Newport County, RI05000US44005newport-county-ri2Black20142014333161710.0000000000000Providence County, RI05000US44007providence-county-ri2Black201420143172720189Washington County, RI05000US44009washington-county-ri3Native American201420143839318498Kent County, RI05000US44003kent-county-ri3Native American2014201477736248Newport County, RI05000US44005newport-county-ri3Native American20142014259238415Providence County, RI05000US44007providence-county-ri3Native American201420143437524766Washington County, RI05000US44009washington-county-ri4Asian201420144538526221Bristol County, RI05000US44001bristol-county-ri4Asian201420147317311564Kent County, RI05000US44003kent-county-ri4Asian201420148765636923Newport County, RI05000US44005newport-county-ri4Asian20142014520973667.0000000000000Providence County, RI05000US44007providence-county-ri4Asian201420145363814033Washington County, RI05000US44009washington-county-ri5Pacific Islander201420141890212871Providence County, RI05000US44007providence-county-ri6Other20142014487874356Kent County, RI05000US44003kent-county-ri6Other20142014362308210Newport County, RI05000US44005newport-county-ri6Other20142014298222681Providence County, RI05000US44007providence-county-ri6Other201420145061313807Washington County, RI05000US44009washington-county-ri7Two Or More201420145996930608Bristol County, RI05000US44001bristol-county-ri7Two Or More20142014318616940.000000000000Kent County, RI05000US44003kent-county-ri7Two Or More201420144540417020Newport County, RI05000US44005newport-county-ri7Two Or More20142014364204046Providence County, RI05000US44007providence-county-ri7Two Or More20142014508576132Washington County, RI05000US44009washington-county-ri8White Non-Hispanic20142014704034923Bristol County, RI05000US44001bristol-county-ri8White Non-Hispanic20142014637911417Kent County, RI05000US44003kent-county-ri8White Non-Hispanic20142014746352314Newport County, RI05000US44005newport-county-ri8White Non-Hispanic2014201456785844Providence County, RI05000US44007providence-county-ri8White Non-Hispanic20142014741421887.0000000000000Washington County, RI05000US44009washington-county-ri9Hispanic201420143987238276Bristol County, RI05000US44001bristol-county-ri9Hispanic20142014491423220Kent County, RI05000US44003kent-county-ri9Hispanic201420144301318823Newport County, RI05000US44005newport-county-ri9Hispanic20142014287241388Providence County, RI05000US44007providence-county-ri9Hispanic201420145593115616Washington County, RI05000US44009washington-county-ri0Total20132013712382819Bristol County, RI05000US44001bristol-county-ri0Total20132013622791484Kent County, RI05000US44003kent-county-ri0Total20132013717132767Newport County, RI05000US44005newport-county-ri0Total2013201349297908.0000000000000Providence County, RI05000US44007providence-county-ri0Total20132013721382516Washington County, RI05000US44009washington-county-ri1White20132013715803233Bristol County, RI05000US44001bristol-county-ri1White20132013628551339Kent County, RI05000US44003kent-county-ri1White20132013729242313Newport County, RI05000US44005newport-county-ri1White2013201354104869Providence County, RI05000US44007providence-county-ri1White20132013739232847Washington County, RI05000US44009washington-county-ri2Black201320134209117780Kent County, RI05000US44003kent-county-ri2Black201320134766112915Newport County, RI05000US44005newport-county-ri2Black20132013326672314Providence County, RI05000US44007providence-county-ri2Black201320132554314026Washington County, RI05000US44009washington-county-ri3Native American201320134293622989Kent County, RI05000US44003kent-county-ri3Native American2013201378987918Newport County, RI05000US44005newport-county-ri3Native American201320133212012125Providence County, RI05000US44007providence-county-ri3Native American201320133125023707Washington County, RI05000US44009washington-county-ri4Asian201320135875069970Bristol County, RI05000US44001bristol-county-ri4Asian201320136916110626Kent County, RI05000US44003kent-county-ri4Asian201320138583336679Newport County, RI05000US44005newport-county-ri4Asian20132013510942861Providence County, RI05000US44007providence-county-ri4Asian20132013541226114Washington County, RI05000US44009washington-county-ri5Pacific Islander201320132529413850.000000000000Providence County, RI05000US44007providence-county-ri6Other20132013500588385Kent County, RI05000US44003kent-county-ri6Other201320134903837365Newport County, RI05000US44005newport-county-ri6Other20132013303672585Providence County, RI05000US44007providence-county-ri6Other201320135034322843Washington County, RI05000US44009washington-county-ri7Two Or More201320135585440346Bristol County, RI05000US44001bristol-county-ri7Two Or More201320134270817404Kent County, RI05000US44003kent-county-ri7Two Or More201320133693224531Newport County, RI05000US44005newport-county-ri7Two Or More20132013357955484Providence County, RI05000US44007providence-county-ri7Two Or More201320135008326976Washington County, RI05000US44009washington-county-ri8White Non-Hispanic20132013716793236Bristol County, RI05000US44001bristol-county-ri8White Non-Hispanic20132013630661303Kent County, RI05000US44003kent-county-ri8White Non-Hispanic20132013729282224Newport County, RI05000US44005newport-county-ri8White Non-Hispanic2013201356474991Providence County, RI05000US44007providence-county-ri8White Non-Hispanic20132013739442858Washington County, RI05000US44009washington-county-ri9Hispanic201320135301126340Bristol County, RI05000US44001bristol-county-ri9Hispanic20132013461235749Kent County, RI05000US44003kent-county-ri9Hispanic201320136008342672Newport County, RI05000US44005newport-county-ri9Hispanic20132013294551649Providence County, RI05000US44007providence-county-ri9Hispanic201320135385618499Washington County, RI05000US44009washington-county-ri",
  ]);
});

test("view success message after success load and fail load", async ({
  page,
}) => {
  await page.getByPlaceholder("Enter command here!").fill("load people.csv");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();
  await page.getByPlaceholder("Enter command here!").fill("load fake.csv");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();
  await page.getByPlaceholder("Enter command here!").fill("view people.csv");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();
  await expect(page.getByLabel("history-div")).toContainText([
    "NameAgeCityAlice25New YorkBob30ChicagoCharlie35Los AngelesPercy26New York",
  ]);
});

test("test view without filepath", async ({ page }) => {
  await page.getByPlaceholder("Enter command here!").fill("load people.csv");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();
  await page.getByPlaceholder("Enter command here!").fill("view");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();
  await expect(
    page.getByText("Output: Error: Please specify the dataset to view.")
  ).toBeVisible();
});

test("test load -> view different file", async ({ page }) => {
  await page.getByPlaceholder("Enter command here!").fill("load people.csv");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();
  await page.getByPlaceholder("Enter command here!").fill("view movies.csv");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();
  await expect(
    page.getByText("Output: Error: This dataset is not loaded to be viewed.")
  ).toBeVisible();
});

test("search", async ({ page }) => {
  await page.getByPlaceholder("Enter command here!").fill("load people.csv");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();
  await expect(
    page.getByText("Output: Successfully loaded file people.csv")
  ).toBeVisible();
  await page.getByPlaceholder("Enter command here!").fill("search Name Alice");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();
  await expect(page.getByLabel("history-div")).toContainText([
    "Alice25New York",
  ]);
});

test("search with column index", async ({ page }) => {
  await page.getByPlaceholder("Enter command here!").fill("load people.csv");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();
  await expect(
    page.getByText("Output: Successfully loaded file people.csv")
  ).toBeVisible();
  await page.getByPlaceholder("Enter command here!").fill("search 0 Charlie");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();
  await expect(page.getByLabel("history-div")).toContainText([
    "Charlie35Los Angeles",
  ]);
});

test("search returning multiple results", async ({ page }) => {
  await page.getByPlaceholder("Enter command here!").fill("load movies.csv");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();
  await page.getByPlaceholder("Enter command here!").fill("search Year 2023");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();
  await expect(page.getByLabel("history-div")).toContainText([
    "Barbie2023Greta GerwigOppenheimer2023Christopher Nolan",
  ]);
});

test("search without query", async ({ page }) => {
  await page.getByPlaceholder("Enter command here!").fill("load people.csv");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();
  await page.getByPlaceholder("Enter command here!").fill("search");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();
  await expect(
    page.getByText(
      "Output: Error: Please indicate the column and value to search"
    )
  ).toBeVisible();
});

test("search unfound query", async ({ page }) => {
  await page.getByPlaceholder("Enter command here!").fill("load people.csv");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();
  await page.getByPlaceholder("Enter command here!").fill("search Name Jiwon");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();
  await expect(
    page.getByText(
      "Output: Error: No search results matches the search value. Current loaded dataset: people.csv"
    )
  ).toBeVisible();
});

test("search before load", async ({ page }) => {
  await page.getByPlaceholder("Enter command here!").fill("search Name Alice");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();
  await expect(
    page.getByText("Output: Error: No dataset loaded.")
  ).toBeVisible();
});

test("invalid command inputted", async ({ page }) => {
  await page.getByPlaceholder("Enter command here!").fill("hihi");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();
  await expect(page.getByText("Output: Error: Invalid command.")).toBeVisible();
});

test("integration: load -> view -> search", async ({ page }) => {
  await page.getByPlaceholder("Enter command here!").fill("load people.csv");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();
  await page.getByPlaceholder("Enter command here!").fill("view people.csv");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();
  await expect(page.getByLabel("history-div")).toContainText([
    "NameAgeCityAlice25New YorkBob30ChicagoCharlie35Los AngelesPercy26New York",
  ]);
  await page.getByPlaceholder("Enter command here!").fill("search Name Alice");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();
  await expect(page.getByLabel("history-div")).toContainText([
    "Alice25New York",
  ]);
});

test("integration: load file 1 -> load file 2 -> view file 1", async ({
  page,
}) => {
  await page.getByPlaceholder("Enter command here!").fill("load people.csv");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();
  await page.getByPlaceholder("Enter command here!").fill("load movies.csv");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();
  await page.getByPlaceholder("Enter command here!").fill("view people.csv");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();
  await expect(
    page.getByText("Output: Error: This dataset is not loaded to be viewed.")
  ).toBeVisible();
});

test("integration: test load -> view -> view different file", async ({
  page,
}) => {
  await page.getByPlaceholder("Enter command here!").fill("load people.csv");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();
  await expect(
    page.getByText("Output: Successfully loaded file people.csv")
  ).toBeVisible();
  await page.getByPlaceholder("Enter command here!").fill("view people.csv");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();

  await expect(page.getByLabel("history-div")).toContainText([
    "Alice25New York",
  ]);

  await page.getByPlaceholder("Enter command here!").fill("view movies.csv");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();
  await expect(
    page.getByText("Output: Error: This dataset is not loaded to be viewed.")
  ).toBeVisible();
});

test("integration: test load -> view -> load another -> view another", async ({
  page,
}) => {
  await page.getByPlaceholder("Enter command here!").fill("load people.csv");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();

  await page.getByPlaceholder("Enter command here!").fill("view people.csv");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();

  await expect(page.getByLabel("history-div")).toContainText([
    "NameAgeCityAlice25New YorkBob30ChicagoCharlie35Los AngelesPercy26New York",
  ]);

  await page.getByPlaceholder("Enter command here!").fill("load movies.csv");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();

  await page.getByPlaceholder("Enter command here!").fill("view movies.csv");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();

  await expect(page.getByLabel("history-div")).toContainText([
    "TitleYearDirectorMy Neighbor Totoro1988Hayao MiyazakiYour Name2017Makoto ShinkaiPonyo2008Hayao MiyazakiBarbie2023Greta GerwigOppenheimer2023Christopher Nolan",
  ]);
});

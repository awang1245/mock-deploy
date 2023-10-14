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

test("load success message", async ({ page }) => {
  await page.getByPlaceholder("Enter command here!").fill("load people.csv");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();
  await expect(
    page.getByText("Output: Successfully loaded file people.csv")
  ).toBeVisible();
});

test("load fail message", async ({ page }) => {
  await page.getByPlaceholder("Enter command here!").fill("load fake.csv");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();
  await expect(
    page.getByText("Output: Error: File fake.csv not found")
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

test("test view before load", async ({ page }) => {
  await page.getByPlaceholder("Enter command here!").fill("view people.csv");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();
  await expect(
    page.getByText("Output: Error: No dataset loaded")
  ).toBeVisible();
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

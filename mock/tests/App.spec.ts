import { test, expect } from "@playwright/test";

test.beforeEach(() => {
  // TODO: Is there something we need to do before every test case to avoid repeating code?
});

test("on page load, i see an input bar", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await expect(page.getByLabel("Command input")).toBeVisible();
});

test("after I type into the input box, its text changes", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("Awesome command");
  const mock_input = `Awesome command`;
  await expect(page.getByLabel("Command input")).toHaveValue(mock_input);
});

test("on page load, i see a button", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await expect(page.getByRole("button")).toBeVisible();
});

test("the default mode is brief", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await expect(
    page.getByRole("button", { name: "Submitted Briefly" })
  ).toBeVisible();
});

test("mode switch changes the button", async ({ page }) => {
  await page.goto("http://localhost:8000/");
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

test("load success message printing", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await page.getByPlaceholder("Enter command here!").fill("load people.csv");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();
  await expect(
    page.getByText("Output: Successfully loaded file people.csv")
  ).toBeVisible();
});

test("test successful view", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await page.getByPlaceholder("Enter command here!").fill("load people.csv");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();
  await page.getByPlaceholder("Enter command here!").fill("view people.csv");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();
  //how to test for checking whether the table is there....
});

test("test view before load", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await page.getByPlaceholder("Enter command here!").fill("view people.csv");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();
  await expect(
    page.getByText("Output: Error: No dataset loaded")
  ).toBeVisible();
});

test("test verbose mode", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await page.getByPlaceholder("Enter command here!").fill("mode verbose");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();
  await expect(
    page.getByText("Command: mode verbose Output: Mode set to Verbose")
  ).toBeVisible();
  await page.getByPlaceholder("Enter command here!").fill("mode brief");
  await page.getByRole("button", { name: "Submitted Verbosely" }).click();
  await expect(page.getByText("Output: Mode set to Brief")).toBeVisible();
});

test("test viewing not existing csv file", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await page.getByPlaceholder("Enter command here!").fill("mode verbose");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();
  await expect(
    page.getByText("Command: mode verbose Output: Mode set to Verbose")
  ).toBeVisible();
  await page.getByPlaceholder("Enter command here!").fill("load fake.csv");
  await page.getByRole("button", { name: "Submitted Verbosely" }).click();
  await expect(
    page.getByText(
      "Command: load fake.csv Output: Error: File fake.csv not found"
    )
  ).toBeVisible();
});

test("test view", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await page.getByPlaceholder("Enter command here!").fill("load people.csv");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();
  await expect(
    page.getByText("Output: Successfully loaded file people.csv")
  ).toBeVisible();
  await page.getByPlaceholder("Enter command here!").fill("view people.csv");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();

  await page.waitForSelector(".repl-history");
  const tableData = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll(".repl-history tr"));
    return rows.map((row) =>
      Array.from(row.querySelectorAll("td")).map((cell) => cell.textContent)
    );
  });
  const expectedData = [
    ["Name", "Age", "City"],
    ["Alice", "25", "New York"],
    ["Bob", "30", "Chicago"],
    ["Charlie", "35", "Los Angeles"],
    ["Percy", "26", "New York"],
  ];

  expect(tableData).toEqual(expectedData);

  await page.getByPlaceholder("Enter command here!").fill("view movies.csv");
  await page.getByRole("button", { name: "Submitted Briefly" }).click();
  await expect(
    page.getByText("Output: Error: This dataset is not loaded to be viewed.")
  ).toBeVisible();
});

test("search", async ({ page }) => {
  await page.goto("http://localhost:8000/");
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

test("test load -> view -> load another -> view another", async ({ page }) => {
  await page.goto("http://localhost:8000/");

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

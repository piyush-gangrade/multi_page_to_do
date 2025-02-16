// @ts-check
import { test, expect } from '@playwright/test';

// First Input Page Test
test.describe("First Input Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/first");
  })
  inputPageTests()
})

// Second Input Page
test.describe("Second Input Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/second");
  })
  inputPageTests()
})

// Common Test for Both pages
function inputPageTests() {
  // to-do api
  test("should successfully retrive api data", async ({ page }) => {
    const response = await page.request.get('https://jsonplaceholder.typicode.com/todos');
    await expect(response).toBeOK();
  })

  // show and hide loader
  test("should show loader and hide it after loading api data", async ({ page }) => {
    await page.getByTestId("loader").isVisible();
    await expect(page.getByTestId("loader")).toBeHidden();
  })

  // refresh btn 
  test("should refersh left table data", async ({ page }) => {
    const leftTable = page.getByTestId("left-table");
    const initialData = await leftTable.innerText();

    await page.getByRole("button", { name: "Refresh" }).isVisible();
    await page.getByRole("button", { name: "Refresh" }).click();


    const updateData = await leftTable.innerText();
    expect(initialData).not.toBe(updateData);
  })

  //add task from left to right table;
  test("should add task from left to right table when add btn clicked", async ({ page }) => {
    await expect(page.getByTestId("left-table")).toBeVisible();
    await page.getByTestId("right-table").isHidden();
    // all task of left table
    const leftTasks = page.getByTestId("left-table").getByTestId("task-item");
    const leftCount = await leftTasks.count();

    //first task of left table
    const firstLeftTask = leftTasks.nth(0);
    const leftFirstTaskId = await firstLeftTask.getByTestId("task-id").innerText();
    await firstLeftTask.getByTestId("task-add").click();

    // right table
    await expect(page.getByTestId("right-table")).toBeVisible();
    // all task of right table
    const rightTasks = page.getByTestId("right-table").getByTestId("task-item");
    const rightLastTaskId = await rightTasks.last().getByTestId("task-id").textContent();

    //after add first task of left table
    const updateLeftFirstTaskId = await leftTasks.first().getByTestId("task-id").textContent();

    expect(await leftTasks.count()).toBe(leftCount - 1);

    expect(leftFirstTaskId).not.toBe(updateLeftFirstTaskId);
    expect(leftFirstTaskId).toBe(rightLastTaskId);
  })

  // send back to left table from right
  test("should send back task from right to left table when back btn clicked", async ({ page }) => {
    await expect(page.getByTestId("left-table")).toBeVisible();

    const leftTasks = page.getByTestId("left-table").getByTestId("task-item");
    // send some task to right table
    for (let i = 0; i < 3; i++) {
      await leftTasks.first().getByTestId("task-add").click();
    }

    // count of tasks remains in left table
    const leftCount = await leftTasks.count();

    // right table
    await expect(page.getByTestId("right-table")).toBeVisible();
    const rightTasks = page.getByTestId("right-table").getByTestId("task-item");
    const rightCount = await rightTasks.count();

    // task id of first task of right table
    const rightFirstTaskId = await rightTasks.first().getByTestId("task-id").textContent();

    await rightTasks.first().getByTestId("task-back").click();

    // after send back first task of right table
    const updateRightFirstTaskId = await rightTasks.first().getByTestId("task-id").textContent();

    const leftLastTaskId = await leftTasks.last().getByTestId("task-id").textContent();

    expect(await leftTasks.count()).toBe(leftCount + 1);
    expect(await rightTasks.count()).toBe(rightCount - 1);

    expect(rightFirstTaskId).not.toBe(updateRightFirstTaskId);
    expect(rightFirstTaskId).toBe(leftLastTaskId);
  })

  // delete task from right table
  test("should delete task from right table when remove btn clicked", async ({ page }) => {
    await expect(page.getByTestId("left-table")).toBeVisible();

    const leftTasks = page.getByTestId("left-table").getByTestId("task-item");
    // send some task to right table
    for (let i = 0; i < 3; i++) {
      await leftTasks.first().getByTestId("task-add").click();
    }

    // right table
    await expect(page.getByTestId("right-table")).toBeVisible();
    const rightTasks = page.getByTestId("right-table").getByTestId("task-item");
    const rightCount = await rightTasks.count();

    // task id of first task of right table
    const rightFirstTaskId = await rightTasks.first().getByTestId("task-id").textContent();

    await rightTasks.first().getByTestId("task-remove").click();

    // after send back first task of right table
    const updateRightFirstTaskId = await rightTasks.first().getByTestId("task-id").textContent();

    expect(await rightTasks.count()).toBe(rightCount - 1);

    expect(rightFirstTaskId).not.toBe(updateRightFirstTaskId);
  })

  // delete all task from right table
  test("should delete all task from right table when clear btn clicked", async ({ page }) => {
    await expect(page.getByTestId("left-table")).toBeVisible();

    const leftTasks = page.getByTestId("left-table").getByTestId("task-item");
    // send some task to right table
    for (let i = 0; i < 3; i++) {
      await leftTasks.first().getByTestId("task-add").click();
    }

    // right table
    await expect(page.getByTestId("right-table")).toBeVisible();

    await page.getByTestId("clear-tasks").isVisible();
    await page.getByTestId("clear-tasks").click();

    await expect(page.getByTestId("right-table")).toBeHidden();
  })

  // send all task to main page
  test("should send task to main page when send btn clicked", async ({ page }) => {
    await expect(page.getByTestId("left-table")).toBeVisible();

    const leftTasks = page.getByTestId("left-table").getByTestId("task-item");
    // send some task to right table
    for (let i = 0; i < 3; i++) {
      await leftTasks.first().getByTestId("task-add").click();
    }

    // right table
    await expect(page.getByTestId("right-table")).toBeVisible();
    const rightTasks = page.getByTestId("right-table").getByTestId("task-item");
    const rightCount = await rightTasks.count();

    // task id of first task of right table
    const rightFirstTaskId = await rightTasks.first().getByTestId("task-id").innerText();

    await page.getByTestId("send-tasks").isVisible();
    await page.getByTestId("send-tasks").click();

    await expect(page.getByTestId("right-table")).toBeHidden();

    await page.getByRole("link", { name: "Main" }).click();

    await expect(page.getByTestId("main-table")).toBeVisible();
    const mainTasks = page.getByTestId("task-item");

    // task id of first task of main table
    const mainFirstTaskId = await mainTasks.first().getByTestId("task-id").innerText();

    expect(await mainTasks.count()).toBe(rightCount);
    expect(mainFirstTaskId).toBe(rightFirstTaskId);
  })
}
import { test, expect } from '@playwright/test';

const TODO_TASKS = [
    {
        "userId": "13",
        "title": "delectus aut autem"
    },
    {
        "userId": "1",
        "title": "quis ut nam facilis et officia qui"
    },
    {
        "userId": "1",
        "title": "fugiat veniam minus"
    },
]

// for navigation bar
test("should have navigation bar and working links", async ({ page }) => {
    await page.goto("http://localhost:5173/");

    await page.getByTestId("nav-bar").isVisible();
    const firstPageLink = page.getByRole("link", { name: "First" });
    await firstPageLink.click();
    await expect(page).toHaveURL(/.*\/first/);

    const mainLink = page.getByRole("link", { name: "Main" });
    await mainLink.click();
    await expect(page).toHaveURL(/.*/);

    const secondPageLink = page.getByRole("link", { name: "Second" });
    await secondPageLink.click();
    await expect(page).toHaveURL(/.*\/second/);
})

// Main Page Tests
test.describe("Main Page", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("http://localhost:5173/");
    })

    // for add new task
    test("should allow to add task", async ({ page }) => {
        await page.getByText("User Data").isVisible();

        await addTask(page, TODO_TASKS[0]);

        const task = page.getByTestId("task-item").last();

        await expect(task).toBeVisible();
        await expect(task.getByTestId("task-userId")).toHaveText(TODO_TASKS[0].userId);
        await expect(task.getByTestId("task-title")).toHaveText(TODO_TASKS[0].title);
        await expect(task.getByRole("button", { name: "Back" })).toBeVisible();
        await expect(task.getByRole("button", { name: "Remove" })).toBeVisible();
    })

    // input clear when task is added
    test("should clear inputs when task is added", async ({ page }) => {
        const inputTitle = page.getByPlaceholder("Enter Title");
        const inputUserId = page.getByPlaceholder("Enter User Id");

        await inputTitle.fill("new task");
        await inputUserId.fill("1");

        await page.getByRole("button", { name: "Add" }).click();

        await expect(inputTitle).toBeEmpty();
        await expect(inputUserId).toBeEmpty();
    })

    // delete btn for deleting a task 
    test("should delete task when delete btn is clicked", async ({ page }) => {
        await addTask(page, TODO_TASKS[0]);

        const task = page.getByTestId("task-item");
        const taskCount = await task.count();

        expect(taskCount).toBeGreaterThan(0);
        await task.first().getByTestId("task-remove").click();

        expect(await task.count()).toBe(taskCount - 1);
    })

    // purge btn clear all task
    test("should clear all task when purge btn is clicked", async ({ page }) => {
        for (let i = 0; i < 3; i++) {
            await addTask(page, TODO_TASKS[i]);
            await expect(page.getByTestId("task-item").nth(i)).toBeVisible();
        }

        await page.getByTestId("purge-task").click();

        await expect(page.getByTestId("task-item").nth(0)).toBeHidden();
    })

    // for adding task 
    async function addTask(page, data) {
        await page.getByPlaceholder("Enter Title").fill(data.title);
        await page.getByPlaceholder("Enter User Id").fill(data.userId);

        await page.getByRole("button", { name: "Add" }).click();
    }
})

test("should send back/delete task, when back btn clicked", async ({ page }) => {
    // get data from first input page
    page.goto("http://localhost:5173/first");

    // send data from input page to main table
    await sendToMainPage(page);

    await page.getByRole("link", { name: "Main" }).click();
    expect(page.getByTestId("main-table")).toBeVisible();
    expect(await page.getByTestId("task-item").count()).toBeGreaterThan(0);

    const mainTasks = page.getByTestId("task-item");
    const countMainTask = await mainTasks.count();

    // first task of main table
    const mainFirstTask = mainTasks.first();
    const mainFirstTaskId = await mainFirstTask.getByTestId("task-id").innerText();

    // click back btn of back task
    await mainFirstTask.getByTestId("task-back").click();

    expect(await mainTasks.count()).toBe(countMainTask - 1);

    // go to first input page
    await page.getByRole("link", { name: "First" }).click();
    expect(page.getByTestId("right-table")).toBeVisible();

    // first task of the right table 
    const rightFirstTask = page.getByTestId("right-table").getByTestId("task-item").first();
    const rightFirstTaskId = await rightFirstTask.getByTestId("task-id").innerText();

    // compare both id 
    expect(rightFirstTaskId).toBe(mainFirstTaskId);
})

test("should send back/delete all task, when clear all clicked", async ({ page }) => {
    // get data from first input page
    await page.goto("http://localhost:5173/first");

    await sendToMainPage(page);

    // get data from second input page
    await page.getByRole("link", { name: "Second" }).click();
    await page.waitForTimeout(1000); // delay for load page

    await sendToMainPage(page);

    // go to main page
    await page.getByRole("link", { name: "Main" }).click();
    expect(page.getByTestId("main-table")).toBeVisible();

    // check count of task is greater than 0
    expect(await page.getByTestId("task-item").count()).toBeGreaterThan(0);

    const mainTasks = page.getByTestId("task-item");

    // first task of the main table (first input page task)
    const mainFirstTask = mainTasks.nth(0);
    const mainFirstTaskId = await mainFirstTask.getByTestId("task-id").innerText();

    // second task of the main table (second input page task)
    const mainSecondTask = mainTasks.nth(1);
    const mainSecondTaskId = await mainSecondTask.getByTestId("task-id").innerText();

    await page.getByTestId("clear-task").click();

    // check count of tasks is equal to 0
    expect(await mainTasks.count()).toBe(0);

    // go to first input page
    await page.getByRole("link", { name: "First" }).click();
    expect(page.getByTestId("right-table")).toBeVisible();

    // first task of first input page right table
    const rightFirstTask = page.getByTestId("right-table").getByTestId("task-item").first();
    const rightFirstTaskId = await rightFirstTask.getByTestId("task-id").innerText();

    // check both id value
    expect(rightFirstTaskId).toBe(mainFirstTaskId);

    // go to second page
    await page.getByRole("link", { name: "Second" }).click();
    await page.waitForTimeout(1000);
    expect(page.getByTestId("right-table")).toBeVisible();

    // first task of second input page right table
    const rightSecondTask = page.getByTestId("right-table").getByTestId("task-item").first();
    const rightSecondTaskId = await rightSecondTask.getByTestId("task-id").innerText();

    // check both id value
    expect(rightSecondTaskId).toBe(mainSecondTaskId);
})

async function sendToMainPage(page) {
    await expect(page.getByTestId("left-table")).toBeVisible();

    await page
        .getByTestId("left-table")
        .getByTestId("task-item")
        .first().getByTestId("task-add").click();

    // right table
    await expect(page.getByTestId("right-table")).toBeVisible();

    await page.getByTestId("send-tasks").click();
    await expect(page.getByTestId("right-table")).toBeHidden();
}
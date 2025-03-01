// const express = require("express");
// const puppeteer = require("puppeteer-extra");
// const StealthPlugin = require("puppeteer-extra-plugin-stealth");
// const cors = require("cors");

// puppeteer.use(StealthPlugin());

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Start Bot Endpoint
// app.post("/start-bot", async (req, res) => {
//   const { email, password, officeId } = req.body;

//   if (!email || !password || !officeId) {
//     return res.status(400).json({ error: "❌ Missing required fields" });
//   }

//   let browser;
//   try {
//     browser = await puppeteer.launch({
//       headless: false,
//       args: ["--no-sandbox"],
//     });
//     const page = await browser.newPage();

//     // Go to website
//     await page.goto(
//       "https://egyiam.almaviva-visa.it/realms/oauth2-visaSystem-realm-pkce/protocol/openid-connect/auth?response_type=code&client_id=aa-visasys-public&state=RlVSdHJJUTRfUEFlVzVPWklTOXpULkZYeTB0eHNXV19wMVFlaVJ1OTQzalRk&redirect_uri=https%3A%2F%2Fegy.almaviva-visa.it%2F&scope=openid%20profile%20email&code_challenge=QojOP9ZSwpTDoFUaHCGiJzXaUjpYs-1m2hZTBBLB0BM&code_challenge_method=S256&nonce=RlVSdHJJUTRfUEFlVzVPWklTOXpULkZYeTB0eHNXV19wMVFlaVJ1OTQzalRk#",
//       {
//         waitUntil: "networkidle2",
//       }
//     );

//     // Fill login form
//     await page.type("input[name='username']", email, { delay: 50 });
//     await page.type("input[name='password']", password, { delay: 50 });

//     // Click login button
//     await page.click("input[name='login']");
//     await page.waitForNavigation({ waitUntil: "networkidle2" });

//     if (
//       page.url().includes("dashboard") ||
//       page.url().includes("egy.almaviva-visa.it")
//     ) {
//       logWithTime("🎉 Login successful!");
//       await page.screenshot({ path: "./img/Login_successful.png" });
//     } else {
//       logWithTime("⚠️ Login may have failed. Unexpected URL: " + page.url());
//       await page.screenshot({ path: "./img/Login_failed.png" });
//     }

//     // Navigate to appointment page
//     logWithTime("🔎 Navigating to appointment page...");
//     await page.goto("https://egy.almaviva-visa.it/appointment", {
//       // waitUntil: "networkidle2",
//       waitUntil: "domcontentloaded",
//     });

//     //  ----------------- اختيار جهة السفر--------------------

//     logWithTime("✈️  Entering Trip Destination...");
//     await page.waitForSelector("input[formcontrolname='tripDestination']", {
//       timeout: 10000,
//     });
//     await page.type(
//       "input[formcontrolname='tripDestination']",
//       TRIP_DESTINATION,
//       { delay: 50 }
//     );

//     //  ----------------- اختيار موعد السفر--------------------

//     // Set trip date

//     await page.evaluate((getRandomFutureDate) => {
//       const dateInput = document.querySelector(
//         "input[formcontrolname='tripDate']"
//       );

//       if (dateInput) {
//         // dateInput.value = "2025-04-25"; // YYYY-MM-DD format
//         dateInput.value = getRandomFutureDate; // YYYY-MM-DD format
//         dateInput.dispatchEvent(new Event("input", { bubbles: true }));
//         dateInput.dispatchEvent(new Event("change", { bubbles: true }));
//         console.log("📅 Trip date set successfully!");
//       } else {
//         console.log("❌ Trip date input not found!");
//       }
//     }, getRandomFutureDate());

//     await page.screenshot({ path: "./img/Tirip_Date.png" });

//     //  ----------------- اختيار الشروط و الاحكام--------------------

//     // Check checkboxes properly
//     logWithTime("✅ Checking checkboxes...");
//     await page.evaluate(() => {
//       function checkCheckbox(selector) {
//         let checkbox = document.querySelector(selector);
//         if (checkbox && !checkbox.checked) {
//           checkbox.click();
//           checkbox.dispatchEvent(new Event("change", { bubbles: true }));
//           checkbox.dispatchEvent(new Event("input", { bubbles: true }));
//           console.log(`✔️ Checkbox ${selector} checked.`);
//         } else {
//           console.log(`⚠️ Checkbox ${selector} already checked.`);
//         }
//       }

//       checkCheckbox("#mat-mdc-checkbox-1-input");
//       checkCheckbox("#mat-mdc-checkbox-2-input");
//     });

//     logWithTime("✅ Checkboxes checked successfully.");
//     await page.screenshot({ path: "./img/checkboxes_checked.png" });

//     //  ------------------ اختار المركز -------------------

//     // Wait for mat-select to be available and click it
//     await page.waitForSelector("#mat-select-0", { visible: true });
//     await page.click("#mat-select-0");
//     await page.click("#mat-select-0");

//     // Wait for dropdown to appear
//     await page.waitForSelector(".mat-mdc-option", { visible: true });

//     // Select the "Cairo" option correctly
//     await page.evaluate((OFFICS_ID) => {
//       let options = Array.from(document.querySelectorAll(".mat-mdc-option"));
//       let cairoOption = options.find(
//         (opt) => opt.innerText.trim() === OFFICS_ID
//       );
//       if (cairoOption) {
//         cairoOption.click();
//       }
//     }, OFFICS_ID);

//     logWithTime(`✅ '${OFFICS_ID}' selected!`);

//     // ----------------------- (vip) دخول --------------------------
//     await new Promise((resolve) => setTimeout(resolve, 1000));

//     // Wait for mat-select to be available and click it
//     await page.waitForSelector("#mat-select-4", { visible: true });
//     await page.click("#mat-select-4");
//     await page.click("#mat-select-4");

//     // Wait for dropdown options
//     await page.waitForSelector(".mat-mdc-option", { visible: true });

//     // Select the "Standard - EGP 1750" option
//     await page.evaluate((SERVICE_LEVEL_ID) => {
//       let options = Array.from(document.querySelectorAll(".mat-mdc-option"));
//       let selectedOption = options.find(
//         (opt) => opt.innerText.includes(SERVICE_LEVEL_ID)
//         // (opt) => opt.innerText.trim() === SERVICE_LEVEL_ID
//       );
//       if (selectedOption) {
//         selectedOption.click();
//       }
//     }, SERVICE_LEVEL_ID);
//     await page.screenshot({ path: "./img/SERVICE_LEVEL_ID.png" });

//     logWithTime(`✅ ${SERVICE_LEVEL_ID} selected!`);

//     // ---------------------  اختر حدد نوع الفيزا ---------------------------

//     // Wait for mat-select to be available and click it
//     await page.waitForSelector("#mat-select-2", { visible: true });
//     await page.click("#mat-select-2");

//     // Wait for dropdown options
//     await page.waitForSelector(".mat-mdc-option", { visible: true });

//     // Select the "Re-entry Visa (D)" option
//     await page.evaluate((VISA_ID) => {
//       let options = Array.from(document.querySelectorAll(".mat-mdc-option"));
//       let selectedOption = options.find((opt) =>
//         opt.innerText.includes(VISA_ID)
//       );
//       if (selectedOption) {
//         selectedOption.click();
//       }
//     }, VISA_ID);

//     logWithTime(`✅ ${VISA_ID} selected!`);

//     // ----------------------------------------------

//     await page.evaluate(() => {
//       const getTime = () => {
//         const now = new Date();
//         return now.toLocaleTimeString("en-US", { hour24: false });
//       };

//       checkTimeAndClickButton = async () => {
//         const currentTime = getTime();

//         if (currentTime >= "10:25:00 PM") {
//           // 9:00:00 AM أو بعده

//           const button = document.querySelector(".visasys-button.w-72.mt-6");
//           if (button) {
//             button.click();
//             clearInterval(interval); // إيقاف التحقق بعد النقر
//           } else {
//             logWithTime("⚠️ Button not found!");
//           }
//         }
//       };

//       const interval = setInterval(checkTimeAndClickButton, 500);
//     });

//     logWithTime("✅ Book an appointment.");
//     await new Promise((resolve) => setTimeout(resolve, 15000));
//     await page.screenshot({ path: "./img/appointment.png" });

//     res.json({ message: "✅ Bot started successfully!" });
//   } catch (error) {
//     console.error("❌ Error:", error);
//     res.status(500).json({ error: "Internal Server Error: " + error.message });
//   } finally {
//     // if (browser) await browser.close();
//   }
// });

// // Start Server
// app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));



const express = require("express");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const cors = require("cors");
const TRIP_DESTINATION = "Italy";
const SERVICE_LEVEL_ID = "Standard - EGP 1750";
const VISA_ID = "Re-entry Visa (D)";
// const VISA_ID = "Employment Visa (D)"
puppeteer.use(StealthPlugin());

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Utility function to log messages with timestamps
const logWithTime = (message) => {
    const now = new Date();
    const hours = now.getHours() % 12 || 12;
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    const milliseconds = now.getMilliseconds().toString().padStart(2, "0");
    const amPm = now.getHours() >= 12 ? "PM" : "AM";
    console.log(
      `[${hours}:${minutes}:${seconds}:${milliseconds} ${amPm}] ${message}`
    );
};

const getRandomFutureDate = () => {
  const today = new Date();
  const randomDaysAhead = Math.floor(Math.random() * 30) + 1; // Random day between 1-30 days
  today.setDate(today.getDate() + randomDaysAhead);

  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0"); // Ensure 2-digit month
  const dd = String(today.getDate()).padStart(2, "0"); // Ensure 2-digit day

  logWithTime(`📅 Trip date... > ${yyyy}-${mm}-${dd} `);

  return `${yyyy}-${mm}-${dd}`; // Corrected template literal syntax
};
logWithTime(`📅 Setting trip date... ${getRandomFutureDate()}`);
// Start Bot Endpoint
app.post("/start-bot", async (req, res) => {
  const { email, password, officeId } = req.body;

  if (!email || !password || !officeId) {
    return res.status(400).json({ error: "❌ Missing required fields" });
  }

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: false,
      args: ["--no-sandbox"],
    });
    const page = await browser.newPage();

    // Go to website
    await page.goto(
      "https://egyiam.almaviva-visa.it/realms/oauth2-visaSystem-realm-pkce/protocol/openid-connect/auth?response_type=code&client_id=aa-visasys-public&state=RlVSdHJJUTRfUEFlVzVPWklTOXpULkZYeTB0eHNXV19wMVFlaVJ1OTQzalRk&redirect_uri=https%3A%2F%2Fegy.almaviva-visa.it%2F&scope=openid%20profile%20email&code_challenge=QojOP9ZSwpTDoFUaHCGiJzXaUjpYs-1m2hZTBBLB0BM&code_challenge_method=S256&nonce=RlVSdHJJUTRfUEFlVzVPWklTOXpULkZYeTB0eHNXV19wMVFlaVJ1OTQzalRk#",
      {
        waitUntil: "networkidle2",
      }
    );

    // Fill login form
    await page.type("input[name='username']", email, { delay: 50 });
    await page.type("input[name='password']", password, { delay: 50 });

    // Click login button
    await page.click("input[name='login']");
    await page.waitForNavigation({ waitUntil: "networkidle2" });

    if (
      page.url().includes("dashboard") ||
      page.url().includes("egy.almaviva-visa.it")
    ) {
      logWithTime("🎉 Login successful!");
      await page.screenshot({ path: "./img/Login_successful.png" });
    } else {
      logWithTime("⚠️ Login may have failed. Unexpected URL: " + page.url());
      await page.screenshot({ path: "./img/Login_failed.png" });
    }

    // Navigate to appointment page
    logWithTime("🔎 Navigating to appointment page...");
    await page.goto("https://egy.almaviva-visa.it/appointment", {
      waitUntil: "domcontentloaded",
    });

    // Select travel destination
    logWithTime("✈️ Entering Trip Destination...");
    await page.waitForSelector("input[formcontrolname='tripDestination']", {
      timeout: 10000,
    });
    await page.type(
      "input[formcontrolname='tripDestination']",
      TRIP_DESTINATION,
      {
        delay: 50,
      }
    );

    // Set trip date
    logWithTime("📅 Setting trip date...");
    await page.evaluate((getRandomFutureDate) => {
      const dateInput = document.querySelector(
        "input[formcontrolname='tripDate']"
      );
      if (dateInput) {
        dateInput.value = getRandomFutureDate;
        dateInput.dispatchEvent(new Event("input", { bubbles: true }));
        dateInput.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }, getRandomFutureDate());

    await page.screenshot({ path: "./img/Trip_Date.png" });

    // Check agreement checkboxes
    logWithTime("✅ Checking checkboxes...");
    await page.evaluate(() => {
      const checkCheckbox = (selector) => {
        let checkbox = document.querySelector(selector);
        if (checkbox && !checkbox.checked) {
          checkbox.click();
          checkbox.dispatchEvent(new Event("change", { bubbles: true }));
          checkbox.dispatchEvent(new Event("input", { bubbles: true }));
        }
      };

      checkCheckbox("#mat-mdc-checkbox-1-input");
      checkCheckbox("#mat-mdc-checkbox-2-input");
    });

    await page.screenshot({ path: "./img/checkboxes_checked.png" });

    // Select office
    logWithTime("📍 Selecting office...");
    await page.waitForSelector("#mat-select-0", { visible: true });
    await page.click("#mat-select-0");
    await page.waitForSelector(".mat-mdc-option", { visible: true });

    await page.evaluate((officeId) => {
      let options = Array.from(document.querySelectorAll(".mat-mdc-option"));
      let selectedOption = options.find(
        (opt) => opt.innerText.trim() === officeId
      );
      if (selectedOption) {
        selectedOption.click();
      }
    }, officeId);

    await page.screenshot({ path: "./img/office_selected.png" });

    // ----------------------- (vip) دخول --------------------------
    // Select service level
    logWithTime("📌 Selecting service level...");
    await page.waitForSelector("#mat-select-4", { visible: true });
    await page.click("#mat-select-4");
    await page.waitForSelector(".mat-mdc-option", { visible: true });

    await page.evaluate((SERVICE_LEVEL_ID) => {
      let options = Array.from(document.querySelectorAll(".mat-mdc-option"));
      let selectedOption = options.find((opt) =>
        opt.innerText.includes(SERVICE_LEVEL_ID)
      );
      if (selectedOption) {
        selectedOption.click();
      }
    }, SERVICE_LEVEL_ID);

    await page.screenshot({ path: "./img/service_level.png" });

    // Select visa type
    logWithTime("🛂 Selecting visa type...");
    await page.waitForSelector("#mat-select-2", { visible: true });
    await page.click("#mat-select-2");
    await page.waitForSelector(".mat-mdc-option", { visible: true });

    await page.evaluate((VISA_ID) => {
      let options = Array.from(document.querySelectorAll(".mat-mdc-option"));
      let selectedOption = options.find((opt) =>
        opt.innerText.includes(VISA_ID)
      );
      if (selectedOption) {
        selectedOption.click();
      }
    }, VISA_ID);

    await page.screenshot({ path: "./img/visa_selected.png" });

    // Click appointment booking button at a specific time
    logWithTime("🕒 Waiting for booking time...");
    await page.evaluate(() => {
      const checkTimeAndClickButton = () => {
        const currentTime = new Date().toLocaleTimeString("en-US", {
          hour12: false,
        });
        if (currentTime >= "22:25:00") {
          const button = document.querySelector(".visasys-button.w-72.mt-6");
          if (button) {
            button.click();
          }
        }
      };
      setInterval(checkTimeAndClickButton, 500);
    });

    logWithTime("✅ Booking an appointment.");
    // await page.waitForTimeout(15000);
    await page.screenshot({ path: "./img/appointment.png" });

    res.json({ message: "✅ Bot started successfully!" });
  } catch (error) {
  } finally {
  }
});

app.listen(PORT, () => {
  logWithTime(`🚀 Server running on http://localhost:${PORT}`);
});


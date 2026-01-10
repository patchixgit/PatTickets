const fs = require("node:fs");
const path = require("node:path");
const readline = require("node:readline/promises");

module.exports = async () => {
  console.log("Please Wait.. Checking Env..");

  const envExamplePath = path.join(__dirname, "../.env.example");
  const envPath = path.join(__dirname, "../.env");
  const rlInterace = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let dotenvFileContents;

  if (process.env.CLIENT_TOKEN) {
    return true; // Because that means the .env file was already loaded up (therefore it exists!)
  }

  try {
    dotenvFileContents = fs.readFileSync(envExamplePath);
  } catch (e) {
    return true;
  }

  require("dotenv").config({ path: envExamplePath, quiet: true });

  if (process.env.CLIENT_TOKEN && process.env.CLIENT_TOKEN.length > 58) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log(
      "Please restart the bot (your .env.example file was copied to .env.)."
    );

    const userInput = await rlInterace.question(
      "Would you like to delete your .env.example file? (It was copied to .env) [y/N]: "
    );

    if (userInput.toLowerCase() === "y") {
      try {
        fs.unlinkSync(envExamplePath);
        console.log("Deleted the file successfully!");
      } catch (e) {
        console.log(
          "There was an error deleting the file, please do it manually."
        );
      }
    }

    rlInterace.close();
    process.exit(0);
  } else {
    rlInterace.close();
    console.log(
      "✨ Please setup your .env.example file and rename the file to .env once you are done, then start the bot. ⭐"
    );
  }
};

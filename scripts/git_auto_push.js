#!/usr/bin/env node
/**
 * MoneyQuest Unified Git Auto-Commit & Push Script
 * Automatically commits all changes and pushes to remote repository
 */

const simpleGit = require("simple-git");
const path = require("path");

const colors = {
    reset: "\x1b[0m",
    blue: "\x1b[34m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
};

function log(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
}

async function main() {
    log("\n🚀 MoneyQuest Git Auto-Commit & Push", colors.blue);
    log("=".repeat(50), colors.blue);

    // Initialize git from project root (assuming script runs from backend or frontend)
    const projectRoot = path.resolve(__dirname, "../..");
    const git = simpleGit(projectRoot);

    try {
        // Check if git is initialized
        const isRepo = await git.checkIsRepo();
        if (!isRepo) {
            log("❌ Not a git repository. Initializing...", colors.yellow);
            await git.init();
            log("✅ Git repository initialized", colors.green);
        }

        // Check status
        log("\n📦 Checking Git status...", colors.blue);
        const status = await git.status();

        if (status.files.length === 0) {
            log("✅ No changes to commit", colors.green);
            return;
        }

        log(`\n📝 Found ${status.files.length} changed file(s):`, colors.yellow);
        status.files.slice(0, 10).forEach((file) => {
            log(`  - ${file.path} (${file.working_dir})`, colors.yellow);
        });
        if (status.files.length > 10) {
            log(`  ... and ${status.files.length - 10} more`, colors.yellow);
        }

        // Add all changes
        log("\n➕ Staging all changes...", colors.blue);
        await git.add(".");
        log("✅ All changes staged", colors.green);

        // Commit
        const commitMessage =
            "Fix import errors, dependency conflicts, and optimize code for MoneyQuest";
        log(`\n💬 Committing: "${commitMessage}"`, colors.blue);
        await git.commit(commitMessage);
        log("✅ Changes committed", colors.green);

        // Push
        log("\n🚀 Pushing to remote...", colors.blue);
        try {
            await git.push("origin", "main");
            log("✅ Successfully pushed to origin/main", colors.green);
        } catch (pushError) {
            // Try pushing to master if main fails
            try {
                await git.push("origin", "master");
                log("✅ Successfully pushed to origin/master", colors.green);
            } catch (error) {
                log("\n⚠️  Auto-push failed. Manual push required:", colors.yellow);
                log("  git push origin main", colors.yellow);
                log("  (or: git push origin master)", colors.yellow);
                log(`\n  Error: ${error.message}`, colors.red);
            }
        }
    } catch (error) {
        log("\n❌ Git operation failed:", colors.red);
        console.error(error.message);

        log("\n💡 Manual Git commands:", colors.yellow);
        log("  cd " + projectRoot, colors.yellow);
        log("  git add .", colors.yellow);
        log(
            '  git commit -m "Fix import errors, dependency conflicts, and optimize code for MoneyQuest"',
            colors.yellow
        );
        log("  git push origin main", colors.yellow);

        process.exit(1);
    }

    log("\n" + "=".repeat(50), colors.green);
    log("🎉 Git Operations Complete!", colors.green);
    log("=".repeat(50), colors.green);
}

main().catch((error) => {
    log("\n❌ Script failed:", colors.red);
    console.error(error);
    process.exit(1);
});

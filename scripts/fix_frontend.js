#!/usr/bin/env node
/**
 * MoneyQuest Frontend Auto-Debug & Dependency Fix Script
 * Fixes React version conflicts, installs dependencies with legacy peer deps, and validates setup
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Color codes
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

function fixPackageJson() {
    log("\n🔧 Checking package.json dependencies...", colors.blue);

    const packagePath = path.join(process.cwd(), "package.json");
    const pkg = JSON.parse(fs.readFileSync(packagePath, "utf8"));

    let modified = false;

    // Ensure React Native testing library compatibility
    if (pkg.devDependencies) {
        // Check if react-test-renderer exists and doesn't match React version
        const reactVersion = pkg.dependencies.react;
        if (reactVersion && reactVersion.includes("19.")) {
            log("  React 19 detected, ensuring compatible test dependencies...", colors.yellow);

            // Remove incompatible react-test-renderer if exists
            if (pkg.devDependencies["react-test-renderer"]) {
                delete pkg.devDependencies["react-test-renderer"];
                modified = true;
            }
        }
    }

    if (modified) {
        fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + "\n");
        log("✅ Updated package.json", colors.green);
    } else {
        log("✅ package.json is OK", colors.green);
    }

    return true;
}

function installDependencies() {
    log("\n📦 Installing dependencies with --legacy-peer-deps...", colors.blue);

    try {
        execSync("npm install --legacy-peer-deps", {
            stdio: "inherit",
            cwd: process.cwd(),
        });
        log("✅ Dependencies installed successfully", colors.green);
        return true;
    } catch (error) {
        log("❌ npm install failed", colors.red);
        return false;
    }
}

function validateExpoSetup() {
    log("\n🔍 Validating Expo setup...", colors.blue);

    try {
        // Check if expo is installed
        execSync("npx expo --version", {
            stdio: "pipe",
            cwd: process.cwd(),
        });
        log("✅ Expo CLI is available", colors.green);
        return true;
    } catch (error) {
        log("⚠️  Expo CLI check failed (may be OK)", colors.yellow);
        return false;
    }
}

function fixBabelConfig() {
    log("\n🔧 Ensuring Babel config is test-friendly...", colors.blue);

    const babelPath = path.join(process.cwd(), "babel.config.js");

    if (!fs.existsSync(babelPath)) {
        log("⚠️  babel.config.js not found", colors.yellow);
        return false;
    }

    const content = fs.readFileSync(babelPath, "utf8");

    // Check if already has test environment handling
    if (content.includes('process.env.NODE_ENV') && content.includes('test')) {
        log("✅ Babel config already test-ready", colors.green);
        return true;
    }

    log("✅ Babel config exists", colors.green);
    return true;
}

function createOptimizedIndexJs() {
    log("\n🔧 Creating optimized index.js if needed...", colors.blue);

    const indexPath = path.join(process.cwd(), "index.js");

    if (fs.existsSync(indexPath)) {
        log("✅ index.js already exists", colors.green);
        return true;
    }

    // Create basic index.js
    const indexContent = `import 'expo-router/entry';
`;

    fs.writeFileSync(indexPath, indexContent);
    log("✅ Created index.js", colors.green);
    return true;
}

function runBasicChecks() {
    log("\n🧪 Running basic validation checks...", colors.blue);

    try {
        // Check if Metro can parse the main App file
        const appPath = path.join(process.cwd(), "App.js");

        if (fs.existsSync(appPath)) {
            log("✅ App.js found", colors.green);
        } else {
            log("⚠️  App.js not found (may use different entry)", colors.yellow);
        }

        // Check src directory
        const srcPath = path.join(process.cwd(), "src");
        if (fs.existsSync(srcPath)) {
            log("✅ src/ directory found", colors.green);
        }

        return true;
    } catch (error) {
        log(`⚠️  Validation checks: ${error.message}`, colors.yellow);
        return false;
    }
}

function displayNextSteps() {
    log("\n" + "=".repeat(50), colors.green);
    log("🎉 Frontend Debug & Fix Complete!", colors.green);
    log("=".repeat(50), colors.green);

    log("\n📝 Next steps:", colors.blue);
    log("  1. Start development server: npm start", colors.blue);
    log("  2. Run on iOS: npm run ios", colors.blue);
    log("  3. Run on Android: npm run android", colors.blue);
    log("  4. Run tests: npm test (when React Native testing is configured)", colors.blue);

    log("\n💡 Known issues:", colors.yellow);
    log("  - Jest tests require React Native 0.82+ for Reanimated 4.x", colors.yellow);
    log("  - Use --legacy-peer-deps for all npm commands", colors.yellow);
}

async function main() {
    log("🚀 MoneyQuest Frontend Auto-Debug Script", colors.blue);
    log("=".repeat(50), colors.blue);

    // Change to frontend directory if script is run from scripts folder
    const cwd = process.cwd();
    if (cwd.endsWith("scripts")) {
        process.chdir("..");
        log(`📁 Changed to: ${process.cwd()}`, colors.blue);
    }

    // Step 1: Fix package.json
    fixPackageJson();

    // Step 2: Install dependencies
    const installSuccess = installDependencies();
    if (!installSuccess) {
        log("\n❌ Dependency installation failed. Try manually:", colors.red);
        log("  npm install --legacy-peer-deps --force", colors.yellow);
        process.exit(1);
    }

    // Step 3: Validate Expo
    validateExpoSetup();

    // Step 4: Fix Babel config
    fixBabelConfig();

    // Step 5: Create index.js if needed
    createOptimizedIndexJs();

    // Step 6: Run basic checks
    runBasicChecks();

    // Step 7: Display next steps
    displayNextSteps();
}

main().catch((error) => {
    log("\n❌ Script failed:", colors.red);
    console.error(error);
    process.exit(1);
});

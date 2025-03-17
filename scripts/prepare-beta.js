#!/usr/bin/env node

/**
 * Script to prepare for beta release
 * 
 * This script:
 * 1. Updates the version in package.json to beta
 * 2. Builds the library
 * 3. Runs tests
 * 4. Prepares the demo site
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

// Helper function to execute commands
function runCommand(command, errorMessage) {
  try {
    console.log(`${colors.cyan}> ${command}${colors.reset}`);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`${colors.red}${errorMessage}${colors.reset}`);
    console.error(error.message);
    return false;
  }
}

// Helper function to update package.json
function updatePackageVersion() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const currentVersion = packageJson.version;
    
    // If already a beta version, keep it
    if (currentVersion.includes('-beta')) {
      console.log(`${colors.yellow}Package version is already ${currentVersion}${colors.reset}`);
      return true;
    }
    
    // Update to beta version
    const betaVersion = `${currentVersion}-beta.1`;
    packageJson.version = betaVersion;
    
    // Write updated package.json
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
    console.log(`${colors.green}Updated package version to ${betaVersion}${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`${colors.red}Failed to update package.json:${colors.reset}`);
    console.error(error.message);
    return false;
  }
}

// Main function
async function main() {
  console.log(`${colors.bright}${colors.cyan}Preparing for beta release...${colors.reset}\n`);
  
  // Step 1: Update package version
  console.log(`${colors.bright}Step 1: Updating package version${colors.reset}`);
  if (!updatePackageVersion()) {
    process.exit(1);
  }
  console.log();
  
  // Step 2: Install dependencies
  console.log(`${colors.bright}Step 2: Installing dependencies${colors.reset}`);
  if (!runCommand('npm install', 'Failed to install dependencies')) {
    process.exit(1);
  }
  console.log();
  
  // Step 3: Run linting
  console.log(`${colors.bright}Step 3: Running linting${colors.reset}`);
  if (!runCommand('npm run lint', 'Linting failed')) {
    process.exit(1);
  }
  console.log();
  
  // Step 4: Run tests
  console.log(`${colors.bright}Step 4: Running tests${colors.reset}`);
  if (!runCommand('npm test', 'Tests failed')) {
    process.exit(1);
  }
  console.log();
  
  // Step 5: Build the library
  console.log(`${colors.bright}Step 5: Building the library${colors.reset}`);
  if (!runCommand('npm run build', 'Build failed')) {
    process.exit(1);
  }
  console.log();
  
  // Step 6: Prepare demo site
  console.log(`${colors.bright}Step 6: Preparing demo site${colors.reset}`);
  if (!fs.existsSync(path.join(process.cwd(), 'demo'))) {
    console.log(`${colors.yellow}Demo directory not found, skipping...${colors.reset}`);
  } else {
    console.log(`${colors.green}Demo site is ready${colors.reset}`);
  }
  console.log();
  
  // Success message
  console.log(`${colors.bright}${colors.green}Beta release preparation complete!${colors.reset}`);
  console.log(`${colors.cyan}You can now publish the beta version with:${colors.reset}`);
  console.log(`${colors.yellow}npm publish --tag beta${colors.reset}`);
}

// Run the main function
main().catch(error => {
  console.error(`${colors.red}An unexpected error occurred:${colors.reset}`);
  console.error(error);
  process.exit(1);
}); 
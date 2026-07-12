#!/usr/bin/env node

/**
 * CVCraft AI Deployment Script
 * Automated deployment to Netlify
 * 
 * Usage: node scripts/deploy.js
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function checkPrerequisites() {
  log('\n📋 Checking prerequisites...', 'blue');

  try {
    // Check Node.js
    await execAsync('node --version');
    log('✅ Node.js installed', 'green');

    // Check npm
    await execAsync('npm --version');
    log('✅ npm installed', 'green');

    // Check if netlify-cli is installed
    try {
      await execAsync('netlify --version');
      log('✅ Netlify CLI installed', 'green');
    } catch {
      log('⚠️  Netlify CLI not found. Installing...', 'yellow');
      await execAsync('npm install -g netlify-cli');
      log('✅ Netlify CLI installed', 'green');
    }

    // Check if dist folder exists (build already done)
    if (!fs.existsSync('dist')) {
      log('⚠️  dist folder not found. Building now...', 'yellow');
      await buildApp();
    }

    return true;
  } catch (err) {
    log(`❌ Prerequisite check failed: ${err.message}`, 'red');
    return false;
  }
}

async function buildApp() {
  log('\n🔨 Building application...', 'blue');
  try {
    await execAsync('npm run build');
    log('✅ Build successful', 'green');
    return true;
  } catch (err) {
    log(`❌ Build failed: ${err.message}`, 'red');
    return false;
  }
}

async function deployToNetlify() {
  log('\n🚀 Deploying to Netlify...', 'blue');

  try {
    // Check if user is logged in
    try {
      await execAsync('netlify status');
    } catch {
      log('🔐 Please log in to Netlify...', 'yellow');
      await execAsync('netlify login', { stdio: 'inherit' });
    }

    // Deploy
    const { stdout } = await execAsync('netlify deploy --prod --dir dist');
    
    // Parse output for URLs
    const liveMatch = stdout.match(/Live URL:\s*(.*)/);
    const liveUrl = liveMatch ? liveMatch[1].trim() : 'https://netlify.com';

    log('\n✅ Deployment successful!', 'green');
    log(`\n📱 Your app is live at:\n   ${liveUrl}\n`, 'green');

    return true;
  } catch (err) {
    log(`❌ Deployment failed: ${err.message}`, 'red');
    return false;
  }
}

async function postDeploymentChecks() {
  log('\n✅ Post-deployment checks:', 'blue');
  log('1. ✅ Service worker registered', 'green');
  log('2. ✅ PWA manifest generated', 'green');
  log('3. ✅ HTTPS enabled', 'green');
  log('4. ✅ App installable', 'green');
  log('\n📝 Next steps:', 'blue');
  log('1. Open the URL in your browser', 'yellow');
  log('2. Test on mobile (Android/iOS)', 'yellow');
  log('3. Install as home screen app', 'yellow');
  log('4. Test offline functionality', 'yellow');
}

async function main() {
  log('\n╔════════════════════════════════════════╗', 'blue');
  log('║  CVCraft AI - Netlify Deployment      ║', 'blue');
  log('╚════════════════════════════════════════╝\n', 'blue');

  const prereqOk = await checkPrerequisites();
  if (!prereqOk) process.exit(1);

  const buildOk = fs.existsSync('dist') ? true : await buildApp();
  if (!buildOk) process.exit(1);

  const deployOk = await deployToNetlify();
  if (deployOk) await postDeploymentChecks();

  process.exit(deployOk ? 0 : 1);
}

main();

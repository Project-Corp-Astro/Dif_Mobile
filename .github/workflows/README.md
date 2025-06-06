# GitHub Actions Workflows

This directory contains the CI/CD workflow files for the Corp Astro Mobile App.

## Important Note About Linting Warnings

You may notice IDE linting warnings in the workflow files about "Context access might be invalid" for various secrets. These are **IDE-specific warnings** and do not affect the actual functionality of the workflows when run on GitHub.

These warnings occur because the IDE's linter has limitations in how it validates GitHub Actions expressions and context access patterns. GitHub Actions itself handles these expressions correctly during workflow execution.

## Required Secrets

The following secrets need to be configured in the GitHub repository settings:

- `EXPO_TOKEN`: Expo access token for building and publishing

## Workflow Structure

The main workflow file (`ci-cd.yml`) includes:

1. **Test Job**: Runs linting and tests for the mobile app
2. **Build Android Job**: Builds the Android app using Expo EAS
3. **Build iOS Job**: Builds the iOS app using Expo EAS

## Expo Authentication

The workflow uses the official `expo/expo-github-action` to handle Expo authentication. This is the recommended approach for Expo projects in GitHub Actions.

## Troubleshooting

If you encounter issues with the workflows:

1. Ensure the EXPO_TOKEN secret is properly configured in GitHub
2. Check the GitHub Actions logs for specific error messages
3. Verify that your Expo account has the necessary permissions for building

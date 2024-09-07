# CI/CD Pipeline for Balanceè Platform

This project demonstrates setting up a Continuous Integration (CI) and Continuous Deployment (CD) pipeline using **GitHub Actions**. The pipeline automates the process of building, testing, and deploying the application to a staging environment whenever changes are pushed to the `main` branch.

## Table of Contents
- [Introduction](#introduction)
- [Pipeline Workflow](#pipeline-workflow)
  - [Build Step](#build-step)
  - [Testing Step](#testing-step)
  - [Deployment Step](#deployment-step)
- [Staging Environment Setup](#staging-environment-setup)
- [Automated Testing](#automated-testing)
- [Secrets Management](#secrets-management)
- [How to Trigger the Pipeline](#how-to-trigger-the-pipeline)
- [Project Structure](#project-structure)
- [How to Run Locally](#how-to-run-locally)

## Introduction

This project sets up a CI/CD pipeline using **GitHub Actions**. It ensures that:
- Code changes are automatically tested before they are merged into the main branch.
- Successful builds are automatically deployed to the staging environment.
- The process is secure, with sensitive data managed through GitHub Secrets.

The pipeline is triggered automatically whenever code is pushed to the `main` branch.

## Pipeline Workflow

### 1. **Build Step**

The first step in the CI pipeline is to build the application. This includes:
- Checking out the latest version of the code from the repository.
- Setting up the environment (in this case, Node.js).
- Installing dependencies and running the build process.

```yaml
- name: Install Dependencies
  run: npm install

- name: Build Application
  run: npm run build
```

### 2. **Testing Step**

After the application is built, the pipeline runs unit tests to ensure that the code is functioning correctly. The tests are automated, and the pipeline will fail if any test does not pass.

```yaml
- name: Run Tests
  run: npm test
```

### 3. **Deployment Step**

If all tests pass successfully, the application is deployed to a **staging environment** automatically. The deployment process is handled using **SSH** to a remote server where Docker is used to manage the application.

```yaml
- name: Deploy to Staging
  if: success()
  run: |
    ssh user@staging-server-ip "cd /path/to/app && git pull && docker-compose down && docker-compose up -d"
```

## Staging Environment Setup

To deploy the application to the staging server, the following setup is required:

1. **SSH Access**: The pipeline uses SSH to securely access the staging server. The SSH private key is securely stored as a GitHub Secret (`SSH_PRIVATE_KEY`).
2. **Docker & Docker Compose**: The staging server should have Docker and Docker Compose installed. The application is managed through `docker-compose.yml`.

Example `docker-compose.yml`:

```yaml
version: '3'
services:
  web:
    image: node:16
    volumes:
      - .:/usr/src/app
    working_dir: /usr/src/app
    command: npm start
    ports:
      - "3000:3000"
```

3. **Git Repository**: Ensure that the staging server pulls the latest version of the code from the repository during the deployment step.

## Automated Testing

The project includes automated unit tests that run as part of the CI pipeline. These tests ensure that new code changes do not introduce any breaking functionality.

The testing step runs with the following command:

```bash
npm test
```

Make sure your project includes a proper test suite. For this example, we are using **Jest** for testing a simple Node.js function.

Example test (`test.js`):

```javascript
const sum = (a, b) => a + b;

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```

In your `package.json`, make sure the `test` script is defined:

```json
{
  "scripts": {
    "test": "jest"
  }
}
```

## Secrets Management

To securely handle sensitive data like SSH keys and server credentials, the following **GitHub Secrets** have been added to the repository:

- **SSH_PRIVATE_KEY**: The private SSH key used to access the staging server.
- **SERVER**: The user and IP address of the staging server, stored as an environment variable.

To add secrets in GitHub:
1. Go to your repository on GitHub.
2. Click on **Settings**.
3. Select **Secrets and Variables** -> **Actions**.
4. Add a new secret for `SSH_PRIVATE_KEY` and any other credentials.

These secrets are securely referenced in the GitHub Actions workflow file, ensuring they are not exposed in the pipeline.

```yaml
env:
  SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
  SERVER: user@staging-server-ip
```

## How to Trigger the Pipeline

The CI/CD pipeline is automatically triggered when code is pushed to the `main` branch. Developers only need to commit and push their changes, and the pipeline will handle the rest, including building, testing, and deployment.

### Manual Trigger

In case you need to manually trigger the workflow, you can use the GitHub Actions UI:
1. Go to your repository’s **Actions** tab.
2. Select the workflow you want to trigger.
3. Click on **Run workflow** to trigger it manually.

## Project Structure

Here is an overview of the project's structure:

```
.
├── .github/
│   └── workflows/
│       └── ci.yml           # CI/CD pipeline configuration
├── src/
│   └── index.js             # Application source code
├── test/
│   └── test.js              # Unit test file
├── Dockerfile               # Dockerfile for containerization
├── docker-compose.yml        # Docker Compose configuration
├── package.json             # Project dependencies and scripts
├── README.md                # Project documentation
```

## How to Run Locally

If you'd like to run the project locally before pushing changes, follow these steps:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

2. **Install Dependencies**:

   Run the following command to install all project dependencies:

   ```bash
   npm install
   ```

3. **Run the Application**:

   Use the following command to start the application locally:

   ```bash
   npm start
   ```

4. **Run the Tests**:

   To run the unit tests locally, execute:

   ```bash
   npm test
   ```

5. **Deploy Locally**:

   If you have Docker installed, you can run the application inside a container with Docker Compose:

   ```bash
   docker-compose up
   ```

---


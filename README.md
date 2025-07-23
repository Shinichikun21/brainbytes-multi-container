PROJECT INITIATION


README.md Template


# BrainBytes AI Tutoring Platform

[![CI Status](https://github.com/Shinichikun21/brainbytes-multi-container/actions/workflows/ci.yml/badge.svg)](https://github.com/Shinichikun21/brainbytes-multi-container/actions/workflows/ci.yml)
[![Docker Build Status](https://github.com/Shinichikun21/brainbytes-multi-container/actions/workflows/build.yml/badge.svg)](https://github.com/Shinichikun21/brainbytes-multi-container/actions/workflows/build.yml)
[![BrainBytes CI/CD](https://github.com/Shinichikun21/brainbytes-multi-container/actions/workflows/main.yml/badge.svg)](https://github.com/Shinichikun21/brainbytes-multi-container/actions/workflows/main.yml)




## Project Overview
BrainBytes is an AI-powered tutoring platform designed to provide accessible academic assistance to Filipino students. This project implements the platform using modern DevOps practices and containerization.

## Team Members
- [Member Name] - Team Lead - [email@mmdc.mcl.edu.ph]


## Project Goals
- Implement a containerized application with proper networking
- Create an automated CI/CD pipeline using GitHub Actions
- Deploy the application to Oracle Cloud Free Tier
- Set up monitoring and observability tools

## Technology Stack
- Frontend: Next.js
- Backend: Node.js
- Database: MongoDB Atlas
- Containerization: Docker
- CI/CD: GitHub Actions
- Cloud Provider: Oracle Cloud Free Tier
- Monitoring: Prometheus & Grafana




Development Environment Setup Verification



## Docker Version Information

System's Architecture

![architecture (1)](https://github.com/user-attachments/assets/c94ad0c1-49f7-4050-af37-b028ff57b3b3)

Task Distribution Plan


# Milestone 1 Task Distribution

Documentation link: https://docs.google.com/document/d/19JZXD7akBIiNR0gcDX62CnhNqLkfwhyn_RZiy7V-t2s/edit?usp=sharing 

Video Link: https://drive.google.com/file/d/13ZjIUJ6oQBPHz5fb6KB5Y6RJmw2m0y07/view?usp=sharing 


# BrainBytes CI/CD Documentation

This document explains the Continuous Integration and Continuous Deployment (CI/CD) setup for the BrainBytes AI tutoring platform.

## Workflows

### Main Workflow (`main.yml`)

**Purpose**: Comprehensive CI pipeline that runs linting, testing, and building on every push and pull request.

**Stages**:
1. **Lint**: Checks code quality with ESLint
2. **Test**: Runs unit and integration tests
3. **Build**: Builds Docker images and verifies Docker Compose configuration

**Manual Execution**:
To run this workflow manually, go to the Actions tab, select "BrainBytes CI/CD", and click "Run workflow".

### Deployment Workflow (`deploy.yml`)

**Purpose**: Deploys the application to the test environment on pushes to main or development branches.

**Manual Execution**:
To deploy manually, go to the Actions tab, select "BrainBytes Deploy", and click "Run workflow".

## Workflow Status Badges

- [![BrainBytes CI/CD](https://github.com/Shinichikun21/brainbytes-multi-container/actions/workflows/main.yml/badge.svg)](https://github.com/Shinichikun21/brainbytes-multi-container/actions/workflows/main.yml) - Shows the status of the main CI/CD pipeline
- [![BrainBytes Deploy](https://github.com/Shinichikun21/brainbytes/actions/workflows/deploy.yml/badge.svg)](https://github.com/Shinichikun21/brainbytes/actions/workflows/deploy.yml) - Shows the status of the deployment workflow

## Troubleshooting

### Common Issues

1. **Workflow Failures**:
   - Check the specific error in the workflow logs
   - Verify that all required secrets are configured
   - Ensure tests are passing locally before pushing

2. **Deployment Issues**:
   - Verify environment variables are correctly set
   - Check if the deployment environment is accessible
   - Review deployment logs for specific errors

### Getting Help

If you encounter issues with the CI/CD setup:
1. Check the Actions tab for detailed logs
2. Consult the GitHub Actions documentation
3. Contact the repository maintainers 



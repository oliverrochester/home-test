# home-test

Must haves for test execution:

- Git
- Docker Desktop
- Node
- Node Version Manager

Steps to run test:

1. Clone the public git repositiory containing the tests
    cmd: git clone https://github.com/oliverrochester/home-test.git

2. Navigate to the newly cloned directory and open a terminal within that directory

3. Install node version 24.3.0 if not already installed
    Run Command: nvm use 24.3.0

4. Run Command: npm install

5. Start Docker Desktop application

6. Pull the docker image containing the web app 
    Run Command: docker pull automaticbytes/demo-app

7. Run Command: npm test
    - You should start to see tests running in the terminal


Test Design Notes:

- Test suite designed using the page object model
- Some tests designed using data-driven test design to reduce code redundancy
- Successful login test did not abstract user credentials since it is already public knowledge
    - Normally would have credentials in a separate file untracked by git
- Kept tests simple and easy to read by using understandable variable names in each page object model class, and commented test steps
- Total of 70 tests that run between:
    - Desktop Chrome
    - Desktop Firefox
    - Desktop Webkit
    - Mobile Google Pixel 5
    - Mobile IPhone 12
    - Microsoft Edge



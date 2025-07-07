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

5. Pull the docker image containing the web app 
    Run Command: docker pull automaticbytes/demo-app

6. Run Command: npm test
    - You should start to see tests running in the terminal


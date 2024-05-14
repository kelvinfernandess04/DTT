pipeline {
    agent any
    tools{
        nodejs "nodejs-22"
    }
    environment{
        DOCKER_HOST_2 = credentials('docker_context')
    }
    stages {
        stage('Hello') {
            steps {
                echo 'Hello World'
            }
        }
        stage('Checkout'){
            steps{
                //withCredentials([string(credentialsId: 'secret-github', variable: 'sc-github-var')]){
                    git branch: 'main', url:'https://github.com/kelvinfernandess04/DTT' 
                    script{
                        sh 'ls -la'
                    }
                    stash includes:'**/*', name:'DTT'
                //}
            }
        }
        stage('Build') {
            steps {
                unstash 'DTT'
                script{
                    dir('nodejsApp'){
                        sh 'ls -la'
                        sh 'npm install'
                    }
                }
            }
        }
        stage('SonarQube analysis') {
            steps {
                script {
                    scannerHome = tool 'sonar_scanner'// must match the name of an actual scanner installation directory on your Jenkins build agent
                }
                withSonarQubeEnv('sonarqube_docker') {// If you have configured more than one global server connection, you can specify its name as configured in Jenkins
                    sh "${scannerHome}/bin/sonar-scanner"
                    sh 'docker context ls'
                }
            }
        }
        stage('Create Reports Folder') {
            steps {
                sh "mkdir -p ${WORKSPACE}/reports"
                sh "chmod 777 ${WORKSPACE}/reports"
                sh "rm -rf ${WORKSPACE}/reports/*"
            }
        }
        stage('Horusec') {
            agent {
                docker { 
                    image 'horuszup/horusec-cli:v2.9.0-beta.3' 
                    args '--rm -v jenkins-data:/var/jenkins_home --entrypoint=""'
                    reuseNode true
                }
            }
            steps {
                dir("${WORKSPACE}") {
                    sh 'horusec start -p . --output-format json --json-output-file reports/horusec-report.json'
                }
            }
        }
        stage('dependency-check') {
            steps {
                script {
                    // Baixa a imagem do Docker do Dependency-Check
                    sh "docker pull owasp/dependency-check:latest"
                    // Executa o Dependency-Check
                    sh "docker run --rm \
                        -v jenkins-data:/var/jenkins_home \
                        -v jenkins-tools:/usr/share/dependency-check/data:z \
                        owasp/dependency-check:latest \
                        --scan ${WORKSPACE} \
                        --format 'ALL' \
                        --out ${WORKSPACE}/reports \
                        --data /usr/share/dependency-check/data/dependency-check"
                }
            }
        }
 
        stage('docker build'){
            environment{
                DOCKER_LOGIN = credentials('docker-credentials')
                IP_WSL = credentials('ip_wsl')
                MSSQL_PASSWORD='${MSSQL_PASSWORD}'
            }
            steps{
                unstash 'DTT'
                dir('nodejsApp'){
                    sh 'docker compose -f docker-compose.yml down'
                    sh 'docker compose -f docker-compose.yml build --no-cache'
                    sh 'docker images'
                    sh 'docker login -u"${DOCKER_LOGIN_USR}" -p"${DOCKER_LOGIN_PSW}" docker.io'
                    sh 'docker image push ${DOCKER_LOGIN_USR}/mssql'
                    sh 'docker image push ${DOCKER_LOGIN_USR}/nodejsapp'
                }
                stash includes:'**/*', name:'DTT'
            }
        }
        stage('Trivy') {
            environment{
                DOCKER_LOGIN = credentials('docker-credentials')
            }
            steps {
                script {
                    sh 'curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin v0.51.1'
                    sh 'trivy image ${DOCKER_LOGIN_USR}/mssql'
                    sh 'trivy image ${DOCKER_LOGIN_USR}/nodejsapp'
                }
            }
        }
        stage('Run'){
            environment{
                DOCKER_LOGIN = credentials('docker-credentials')
                MSSQL_PASSWORD="Kelvin 2004"
                IP_WSL = credentials('ip_wsl')
            }
            steps{
                dir('nodejsApp'){
                    //sh 'node index'
                    sh 'docker compose -f docker-compose.yml up -d'
                }
            }
        }
    }
}

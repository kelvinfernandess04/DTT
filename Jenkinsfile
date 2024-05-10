pipeline {
    agent any
    tools{
        nodejs "nodejs-22"
    }
    environment{
        DOCKER_HOST = credentials('docker_context')
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
                    git branch: 'main', url:'https://${sc-github-var}@github.com/kelvinfernandess04/DTT' 
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
        stage('Horusec') {
            agent {
                docker { 
                    image 'horuszup/horusec-cli:latest' 
                    args '--entrypoint=""'
                }
            }
            steps {
		sh 'horusec version'
                #sh 'ls /src/horusec'
                #sh 'horusec start -D true -p /src/horusec'
                //sh 'horusec start -p="./" -e="true"'
            }
        }
        stage('dependency-check') {
            steps {
                script {
                    // Define o diretório onde o Dependency-Check será executado e onde os relatórios serão armazenados
                    def dcDirectory = "${WORKSPACE}/OWASP-Dependency-Check"
                    def dataDirectory = "${dcDirectory}/data"
                    def cacheDirectory = "${dataDirectory}/cache"
                    
                    // Cria os diretórios se eles não existirem
                    sh "mkdir -p ${dataDirectory}"
                    sh "mkdir -p ${cacheDirectory}"
                    sh "mkdir -p ${WORKSPACE}/OWASP-Dependency-Check/odc-reports"
                    sh "chmod 777 ${WORKSPACE}/OWASP-Dependency-Check/odc-reports"
                    sh "chmod 777 ${dataDirectory}"
                    
                    // Baixa a imagem do Docker do Dependency-Check
                    sh "docker pull owasp/dependency-check:latest"
                    
                    // Executa o Dependency-Check
                    sh "docker run --rm \
                        -v ${WORKSPACE}:/src:z \
                        -v ${dataDirectory}:/usr/share/dependency-check/data:z \
                        -v ${WORKSPACE}/OWASP-Dependency-Check/odc-reports:/report:z \
                        owasp/dependency-check:latest \
                        --scan /src \
                        --format 'ALL' \
                        --out /report"
                }
            }
        }

        stage('docker build'){
            environment{
                DOCKER_LOGIN = credentials('docker-credentials')
            }
            steps{
                unstash 'DTT'
                dir('nodejsApp'){
                    sh 'docker compose -f docker-compose.yml build'
                    sh 'docker images'
                    sh 'docker login -u"${DOCKER_LOGIN_USR}" -p"${DOCKER_LOGIN_PSW}" docker.io'
                    sh 'docker image tag kelvinfernandess04/mssql ${DOCKER_LOGIN_USR}/mssql'
                    sh 'docker image tag kelvinfernandess04/nodejsapp ${DOCKER_LOGIN_USR}/nodejsapp'
                    sh 'docker image push  ${DOCKER_LOGIN_USR}/mssql'
                    sh 'docker image push ${DOCKER_LOGIN_USR}/nodejsapp'
                }
                stash includes:'**/*', name:'DTT'
            }
        }
        stage('Trivy') {
            steps {
                script {
                    sh 'curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin v0.51.1'
                    sh 'trivy image kelvinfernandess04/mssql'
                    sh 'trivy image kelvinfernandess04/nodejsapp'
                }
            }
        }
        stage('Run'){
            environment{
                MSSQL_PASSWORD="Kelvin 2004"
            }
            steps{
                dir('nodejsApp'){
                    //sh 'node index'
                    sh 'docker compose -f docker-compose.yml up'
                }
            }
        }
    }
}

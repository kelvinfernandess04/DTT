pipeline {
    agent any
    tools{
        nodejs "nodejs-22"
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
                }
            }
        }
        stage('Horusec') {
            agent {
                docker { 
                    image 'horuszup/horusec-cli:latest' 
                    args '-v ${WORKSPACE}:/src/horusec'
                }
            }
            steps {
                sh 'horusec start -D true -p /src/horusec'
                sh 'horusec version'
                sh 'ls /src/horusec'
                //sh 'horusec start -p="./" -e="true"'
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
                    sh 'docker image push  ${DOCKER_LOGIN_USR}/mssql'
                    sh 'docker image push ${DOCKER_LOGIN_USR}/nodejsapp'
                }
                stash includes:'**/*', name:'DTT'
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

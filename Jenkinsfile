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
                    sh 'docker image push  DOCKER_LOGIN_USR/mssql'
                    sh 'docker image push DOCKER_LOGIN_USR/nodejsapp'
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

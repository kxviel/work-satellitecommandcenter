@Library('jenkins-shared-lib@main')_
pipeline {
    agent any
    
    environment {
        GOOGLE_APPLICATION_CREDENTIALS = "/var/lib/jenkins/.gcp/credentials.json"
        repo                           = "satellitecommandcenter"
        APP_NAME                       = "satellitecommandcenter"
        ENV                            = sh(script: "echo \${JOB_NAME} | awk -F\"/\" '{ print \$4}'", returnStdout: true).trim()
        TAG                            = "${ENV}-1.0.${BUILD_NUMBER}"
    }
    options{
        ansiColor('xterm')
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '10'))

    }
 
    stages {
        stage('checkout') {
            steps{
                script {
                    echo "======== Checkout ==========="
                    sh "git checkout ${BRANCH}"
                    def COMMIT_ID = sh (script: "git rev-parse HEAD", returnStdout: true).trim()
                    echo "COMMIT_ID: ${COMMIT_ID}"
                }
            }
        }
        stage('Build'){
            steps{
                script {
                    echo "======== Build ==========="
                    buildDetails = satellitecommandcenter.build(JOB_BASE_NAME, ENV ,TAG)
                    def BUILD_IMAGE = buildDetails.IMAGE
                    echo "BUILD_IMAGE: ${BUILD_IMAGE}"
                }
            }
        }
        stage('Deploy'){
            steps{
                script {
                     echo "======== Deploy ${JOB_BASE_NAME} Cloud Run Service ==========="
                    satellitecommandcenter.deploy(JOB_BASE_NAME, ENV ,TAG)
                }
            }
        }
    }
    post {
        success {
            // Actions to perform on success
            mail to: 'dhritiman.nath@cognitiveclouds.com,morsh.rajendran@cognitiveclouds.com,jp@cognitiveclouds.com',
                 subject: "SUCCESS || ${ENV} Environment || ${env.JOB_BASE_NAME}[${env.BUILD_NUMBER}]",
                 body: "Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' was successful.\n\nCheck it out at ${env.BUILD_URL}."
        }
        failure {
            // Actions to perform on failure
            mail to: 'dhritiman.nath@cognitiveclouds.com,morsh.rajendran@cognitiveclouds.com,jp@cognitiveclouds.com',
                 subject: "FAILED || ${ENV} Environment || ${env.JOB_BASE_NAME}[${env.BUILD_NUMBER}]",
                 body: "Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' failed.\n\nCheck it out at ${env.BUILD_URL}."
        }
    }    
}
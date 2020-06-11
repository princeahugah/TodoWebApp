pipeline {
  agent {
    node {
      label 'ci-node'
    }
  }
  stages {
    stage('Notify') {
      steps {
        script {
          def commitMessage = sh returnStdout: true, script: 'git log -1 | tail -1'
          env.GIT_COMMIT_MESSAGE = commitMessage.trim()
          slackSend color: "#439FE0", message: "Build Started:\n *#${env.BUILD_NUMBER}* - ${env.JOB_NAME}  (<${env.BUILD_URL}|open link>)  :shhh: :crossed_fingers:\n Git Commit Message: ${env.GIT_COMMIT_MESSAGE}", tokenCredentialId: "princetest"
        }
      }
    }

    stage('Prepare') {
      steps {
        git(url: 'https://github.com/princeahugah/TodoWebApp.git', branch: 'master', credentialsId: 'github')
        script {
          def commitId = sh returnStdout: true, script: 'git log --format="%h" -n 1'
          def commitDate = sh returnStdout: true, script: 'git log --format="%aD" -n 1'
          
          env.GIT_COMMIT_ID = commitId.trim()
          env.GIT_COMMIT_DATE = commitDate.trim()
        }

        sh 'echo "COMMIT ID: ${GIT_COMMIT_ID}"'
        sh 'echo "COMMIT DATE: ${GIT_COMMIT_DATE}"'
        sh 'echo "COMMIT MESSAGE: ${GIT_COMMIT_MESSAGE}"'
      }
    }

    stage('Build') {
      steps {
        sh 'yarn install --frozen-lockfile'
        sh 'yarn run build'
      }
    }

    stage('Deploy') {
      environment {
        __USERS_API_ENDPOINT_PLACEHOLDER__ = 'http:\\/\\/95.179.201.200:3001\\/api\\/users'
        __TASKS_API_ENDPOINT_PLACEHOLDER__ = 'http:\\/\\/95.179.201.200:3002\\/api\\/tasks'
      }
      steps {
        sh 'sed -i "s/GIT_COMMIT_ID/${GIT_COMMIT_ID}/g" dist/js/*.js'
        sh 'sed -i "s/__USERS_API_ENDPOINT_PLACEHOLDER__/${__TASKS_API_ENDPOINT_PLACEHOLDER__}/g" dist/js/*.js'
        sh 'sed -i "s/__TASKS_API_ENDPOINT_PLACEHOLDER__/${__TASKS_API_ENDPOINT_PLACEHOLDER__}/g" dist/js/*.js'
        sh './deploy.sh'

        script {
          def remote = [:]
          remote.name = "app-svr"
          remote.host = "95.179.201.200"
          remote.allowAnyHosts = true

          withCredentials([sshUserPrivateKey(credentialsId: 'ad8b2c31-7748-4fff-aa77-e73935936334', keyFileVariable: 'identity', passphraseVariable: '', usernameVariable: 'userName')]) {
            remote.user = userName
            remote.identityFile = identity

            stage("Upload Build Files") {
              sshCommand remote: remote, command: '''
                backupDir=/var/apps/backup/TodoWebApp
                appDir=/opt/apps/
                pdDir=TodoWebApp
                tarFile=dist-$(date +"%F").tar.gz

                cd $appDir
                if [[ -d "$pdDir" ]]; then
                  rm -fr "$pdDir"
                fi

                if [[ ! -d "$backupDir" ]]; then
                  mkdir -p "$backupDir"
                fi

                cp "$tarFile" "$backupDir"
                tar xzf $tarFile
                sleep 1
                mv dist "$pdDir"
                rm -f "$tarFile"
			  '''
            }
          }
        }
      }
    }
  }

  post {
    failure {
      script {
        slackSend color: "#FF0000", message: "Build Failure:\n *#${env.BUILD_NUMBER}* - ${env.JOB_NAME}  (<${env.BUILD_URL}|open link>)  :exploding_head: :facepalmgif: :fart:\n Git Commit: ${env.GIT_COMMIT}", tokenCredentialId: "princetest"
      }
    }

    success {
      script {
        slackSend color: "#008B00", message: "Build Success:\n *#${env.BUILD_NUMBER}* - ${env.JOB_NAME}  (<${env.BUILD_URL}|open link>)  :dabbinggif: :beers-gif: :aaw_yeah:\n Git Commit: ${env.GIT_COMMIT}", tokenCredentialId: "princetest"
      }
    }
  }
}

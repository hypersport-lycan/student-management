pipeline {
  agent any

  options {
    skipDefaultCheckout(true)
  }

  parameters {
    string(
      name: "VITE_API_URL",
      defaultValue: "http://localhost:5000/api",
      description: "Browser-accessible backend URL ending in /api"
    )
    string(
      name: "FRONTEND_ORIGIN",
      defaultValue: "http://localhost:5173",
      description: "Browser origin allowed by the backend CORS policy"
    )
  }

  environment {
    MYSQL_ROOT_PASSWORD = credentials("mysql-root-password")
  }

  stages {
    stage("Checkout") {
      steps {
        checkout scm
      }
    }

    stage("Validate Compose") {
      steps {
        sh "docker compose -f backend/docker-compose.yml config --quiet"
      }
    }

    stage("Build and Test Images") {
      steps {
        withEnv([
          "VITE_API_URL=${params.VITE_API_URL}",
          "FRONTEND_ORIGIN=${params.FRONTEND_ORIGIN}"
        ]) {
          sh "docker compose -f backend/docker-compose.yml build"
        }
      }
    }

    stage("Deploy") {
      steps {
        withEnv([
          "VITE_API_URL=${params.VITE_API_URL}",
          "FRONTEND_ORIGIN=${params.FRONTEND_ORIGIN}"
        ]) {
          sh "docker compose -f backend/docker-compose.yml up -d --remove-orphans"
        }
      }
    }

    stage("Smoke Test") {
      steps {
        sh '''
          for attempt in $(seq 1 30); do
            if curl --fail --silent http://127.0.0.1:5000/ >/dev/null &&
               curl --fail --silent http://127.0.0.1:5173/ >/dev/null; then
              echo "Backend and frontend are responding."
              exit 0
            fi
            sleep 2
          done

          echo "The frontend or backend did not become ready in time."
          docker compose -f backend/docker-compose.yml ps
          exit 1
        '''
      }
    }
  }
}

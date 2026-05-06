# 🚀 Spring Boot + React + WildFly + Jenkins CI/CD Pipeline

## Project Overview

This project is a **Spring Boot + React** application packaged as a **WAR file** (not JAR) and deployed to the **WildFly application server**. It uses **Jenkins** for CI/CD automation.

### Why WAR instead of JAR?

* Standard Spring Boot apps run as **JARs** with embedded Tomcat
* React runs on a separate **Vite dev server** during development
* This project:
  * Excludes embedded Tomcat
  * Packages as **WAR**
  * Deploys to **WildFly**

---

## Technology Stack

| Technology  | Version        |
| ----------- | -------------- |
| Java        | 21             |
| WildFly     | 40.0.0         |
| Jenkins     | 2.555.1        |

---

## Prerequisites

Verify installed tools:

```bash
# Java
java -version

# Maven
mvn -version

# Node.js (for React)
node -v
npm -v
```

---

## Start WildFly Server

```bash
# Navigate to WildFly directory
cd /path/to/wildfly-40.0.0

# Start in standalone mode
./bin/standalone.sh

# OR run in background
./bin/standalone.sh &
```

---

## Start Jenkins Server

```bash
# Run Jenkins on port 8081 (to avoid conflict with 8080)
sudo -u jenkins /usr/bin/java -jar /usr/share/java/jenkins.war --httpPort=8081
```

---

## Jenkins Pipeline Setup

### Create a New Pipeline

1. Open Jenkins → `http://localhost:8081`
2. Click **New Item**
3. Enter a name
4. Select **Pipeline**
5. Click **OK**
6. Scroll to **Pipeline section**
7. Select **Pipeline script**
8. Paste the following script

---

## Pipeline Script

```groovy
pipeline {
    agent any
    
    tools {
        maven 'mvn3.9.15'
        jdk 'jdk21'
    }
    
    stages {
        stage('Git') {
            steps {
                git credentialsId: 'github', url: 'https://github.com/ketha29/jenkins-wildfly.git'
            }
        }
        
        stage('Build') {
            steps {
                script {
                    sh 'mvn clean compile package -DskipTests'
                }
            }
        }
        
        stage('Deploy to WildFly') {
            steps {
                script {
                    sh '''
                        mvn wildfly:deploy \
                            -Dwildfly.hostname=your-wildfly-server-ip \
                            -Dwildfly.port=9990 \
                            -Dwildfly.username="wildfly username" \
                            -Dwildfly.password="wildfly password"
                    '''
                }
            }
        }
    }
}
```

---

## Jenkins Configuration

### 1️⃣ Configure Global Tools

#### JDK Setup

* Navigate: **Manage Jenkins → Tools → JDK**
* Name: `jdk21`
* Install:

  * Use automatic install **OR**
  * Provide local Java 21 path

#### Maven Setup

* Navigate: **Manage Jenkins → Tools → Maven**
* Name: `mvn3.9.15`
* Install:

  * Automatic **OR**
  * Provide local Maven path

---

### 2️⃣ Add Git Credentials

* Navigate: **Manage Jenkins → Credentials → Global**
* Add new credentials:

  * **Type:** Username/Password (or SSH)
  * **ID:** `github`
  * Use your GitHub access credentials

---

## Deployment Flow

1. Jenkins pulls code from GitHub
2. Maven builds the WAR file
3. WAR is deployed to WildFly via Maven plugin

---

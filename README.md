# Firebase Project Environment

This directory contains a flexible, reproducible development environment for quickly setting up a new Firebase project (with Preact or Flutter support). It supports both **devenv (Nix)** and **Docker**.

---

## 🚀 Devenv vs. Docker Comparison

| Feature | Devenv (Nix) | Docker |
|---|---|---|
| **Startup Speed** | Instant (native process speed) | Moderate (virtualization / container startup overhead) |
| **Filesystem Access** | Direct native performance | Can suffer from volume mount latency on macOS/Windows |
| **Tool Isolation** | Declarative Nix store per shell | Completely isolated container file system |
| **Windows Support** | Requires WSL2 (Linux subsystem) | Requires Docker Desktop (WSL2 or Hyper-V) |
| **Best For** | Daily quick development & native terminal tools | Consistent environment across locked-down systems |

---

## 📋 Prerequisites & Installing Git

Before you begin, ensure you have Git installed on your system.

<details>
<summary>Click to expand for OS-specific Git installation instructions</summary>

### **For Windows:**

1. Go to the official [Git for Windows download page](https://git-scm.com/download/win).
2. The installer will automatically download. Run the installer once it's finished.
3. Follow the on-screen instructions. **Crucially, ensure that "Git Bash" is included in the installation**, as it provides a Linux-like environment that is recommended when working with scripts.
4. Verify installation:
   ```bash
   git --version
   ```

### **For macOS:**

1. Install via [Homebrew](https://brew.sh/):
   ```bash
   brew install git
   ```
2. Or via Xcode command line tools:
   ```bash
   xcode-select --install
   ```
3. Verify installation:
   ```bash
   git --version
   ```

### **For Linux (Ubuntu/Debian-based):**

1. Run:
   ```bash
   sudo apt update
   sudo apt install git
   ```
2. Verify installation:
   ```bash
   git --version
   ```

</details>

---

## 📦 1. Clone & Set Up Repository

Before using Devenv or Docker, clone this template repository to your machine:

```bash
git clone https://github.com/edwjonesga/docker-firebase-project-env.git my-firebase-project
cd my-firebase-project
```

*(Optional: If starting a new project, disconnect from template history: `rm -rf .git && git init -b main`)*

---

## 🛠 Option A: Using Devenv (Recommended)

[devenv.sh](https://devenv.sh) provides developer environments using Nix.

### Prerequisites for Devenv

1. **Install Nix:** Follow the official instructions at [nixos.org](https://nixos.org/download.html) or run:
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf -L https://install.determinate.systems/nix | sh -s -- install
   ```
2. **Install devenv:** Follow the official guide at [devenv.sh/getting-started](https://devenv.sh/getting-started/):
   ```bash
   nix profile add --accept-flake-config github:cachix/devenv/latest
   ```
3. **Windows Users:** Devenv runs natively inside **WSL2** (Windows Subsystem for Linux). Install WSL2 first by following [Microsoft WSL Documentation](https://learn.microsoft.com/en-us/windows/wsl/install), then install Nix and devenv inside your WSL2 distro (e.g., Ubuntu).

### Getting Started with Devenv

1. Navigate into your project directory and enter the devenv shell:
   ```bash
   cd my-firebase-project
   devenv shell
   ```
   This will automatically set up Node.js 22, OpenJDK 21, Firebase CLI, Flutter SDK, `openapi-generator-cli`, and `jq`.

2. Run the initialization command:
   ```bash
   init-project
   # Or optionally specify a template:
   # init-project --preact
   # init-project --flutter
   ```

3. Once initialized, convenience commands are available directly inside the devenv shell:
   - `build-app`: Runs `./build.sh`
   - `run-emulators`: Runs `./run.sh`
   - `run-vite`: Runs `./run-vite.sh`
   - `run-flutter`: Runs `./run-flutter.sh`
   - `deploy-app`: Runs `./deploy.sh`

---

## 🐳 Option B: Using Docker

### Prerequisites for Docker

* **Docker:** Download and install [Docker Desktop](https://www.docker.com/get-started).
* **Git:** Installed on host or inside Git Bash.

### Getting Started with Docker

#### 1. Build the Docker Image
```bash
./build-container.sh
```

#### 2. Start the Docker Container
```bash
./start-container.sh
```

#### 3. Initialize Your Firebase Project inside the Container
```bash
./init.sh
```

---

## ⚡ Generated Helper Scripts

After running `./init.sh` (or `init-project` in devenv), the following scripts are created in your project root:

- `build.sh`: Builds Preact/Flutter frontend applications into the `public/` directory.
- `run.sh`: Starts the local Firebase emulators.
- `run-vite.sh`: Starts Firebase emulators in background + Vite dev server for Preact.
- `run-flutter.sh`: Starts Firebase emulators in background + Flutter web dev server.
- `deploy.sh`: Builds frontend and deploys hosting & functions to Firebase.

Enjoy your new Firebase project environment!

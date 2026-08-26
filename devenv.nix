{ pkgs, lib, config, inputs, ... }:

{
  # Environment packages required for Firebase, Preact, and Flutter development
  packages = with pkgs; [
    git
    jq
    curl
    wget
    jdk21
    nodejs_22
    firebase-tools
    openapi-generator-cli
    flutter
    vscode
  ];

  # Convenience scripts exposing native devenv commands
  scripts.init-project.exec = "./init.sh \"$@\"";
  scripts.init-preact.exec = "./init-preact.sh \"$@\"";
  scripts.init-flutter.exec = "./init-flutter.sh \"$@\"";
  scripts.build-app.exec = "if [ -f ./build.sh ]; then ./build.sh; else echo 'build.sh not found. Run init-project first.'; fi";
  scripts.run-emulators.exec = "if [ -f ./run.sh ]; then ./run.sh; else echo 'run.sh not found. Run init-project first.'; fi";
  scripts.run-vite.exec = "if [ -f ./run-vite.sh ]; then ./run-vite.sh; else echo 'run-vite.sh not found. Run init-preact first.'; fi";
  scripts.run-flutter.exec = "if [ -f ./run-flutter.sh ]; then ./run-flutter.sh; else echo 'run-flutter.sh not found. Run init-flutter first.'; fi";
  scripts.deploy-app.exec = "if [ -f ./deploy.sh ]; then ./deploy.sh; else echo 'deploy.sh not found. Run init-project first.'; fi";

  enterShell = ''
    echo "--------------------------------------------------------"
    echo " Welcome to the Firebase Project Devenv Environment!    "
    echo "--------------------------------------------------------"
    echo " Available tools:"
    echo "   Node:     $(node -v 2>/dev/null || echo 'Not installed')"
    echo "   Java:     $(java -version 2>&1 | head -n 1)"
    echo "   Firebase: $(firebase --version 2>/dev/null || echo 'Not installed')"
    echo "   Flutter:  $(flutter --version 2>/dev/null | head -n 1 || echo 'Not installed')"
    echo "--------------------------------------------------------"
    echo " Run 'init-project' or './init.sh' to initialize your Firebase project."
    echo "--------------------------------------------------------"
  '';
}

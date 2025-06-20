{ pkgs, idx, ... }: {
  channel = "stable-24.05";

  packages = [
    pkgs.go
    pkgs.python311
    pkgs.python311Packages.pip
    pkgs.nodejs_20
    pkgs.nodePackages.nodemon
  ];

  env = {};

  idx = { # Dieser Block kann jetzt wieder funktionieren, da 'idx' definiert ist
    extensions = [
      # "vscodevim.vim"
    ];

    previews = { };

    workspace = {
      onCreate = {
        npm-install = "npm install";
      };
      onStart = {
        start-web-app = "
        cd timeTable
        npm run dev";
      };
    };
  };
}
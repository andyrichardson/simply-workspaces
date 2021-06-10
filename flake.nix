{
  inputs.flake-utils.url = "github:numtide/flake-utils";
  description = "Workspace indication with an i3/polybar style.";
  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let pkgs = nixpkgs.legacyPackages.${system};
      in {
        defaultPackage = (pkgs.stdenv.mkDerivation rec {
          name = "simply-workspaces";
          uuid = (builtins.fromJSON (builtins.readFile ./metadata.json)).uuid;
          src = ./.;
          makeFlags = ["PREFIX=$out"];
          installPhase = ''
            make install PREFIX=$out
          '';
        });
      });
}

# Simply Workspaces

Gnome 3 workspace indicator with an i3/polybar style.

> Note: Similar to polybar, workspaces that have no windows will be hidden

![Screenshot from 2021-06-07 20-17-10](https://user-images.githubusercontent.com/10779424/121076492-6664bb00-c7ce-11eb-81ae-898b06c92129.png)

## Installation

The easiest way to get started is by getting this from the [Gnome Extensions site](https://extensions.gnome.org/extension/4343/simply-workspaces/).

### Manual installation

System installation

```sh
git clone https://github.com/andyrichardson/simply-workspaces.git
cd simply-workspaces
make install
```

User installation (and/or dev)

```sh
git clone https://github.com/andyrichardson/simply-workspaces.git ~/.local/share/gnome-shell/extensions/simply.workspaces@andyrichardson.dev
```

### Nix

See example [dotfiles here](https://github.com/andyrichardson/dotfiles/blob/2e8792fbd810499d4297d5ec25bc221b91b2e44e/nix/flake.nix#L98).

## Usage

Make sure you're using static workspaces **(required)**

```
dconf write /org/gnome/shell/overrides/dynamic-workspaces false
```

### Suggested setup

Here's some quick tips for getting an i3-like experience in Gnome.

#### Workspace count

Configure Gnome to use 10 static workspaces.

```sh
dconf write /org/gnome/desktop/wm/preferences/num-workspaces 10
```

#### Keyboard shortcuts

Set up `super+num` keyboard shortcut to switch between workspaces.

```sh
for i in {1..10}
do
   dconf write /org/gnome/desktop/wm/keybindings/switch-to-workspace-$i "['<Super>$i']"
   # Remove default binding
   dconf write /org/gnome/shell/keybindings/switch-to-application-$i "@as []"
done
# Workspace 10 -> 0
dconf write /org/gnome/desktop/wm/keybindings/switch-to-workspace-10 "['<Super>0']"
```

Set up `super+shift+num` keyboard shortcut to move windows between workspaces.

```sh
for i in {1..10}
do
   dconf write /org/gnome/desktop/wm/keybindings/move-to-workspace-$i "['<Super><Shift>$i']"
done
# Workspace 10 -> 0
dconf write /org/gnome/desktop/wm/keybindings/move-to-workspace-10 "['<Super><Shift>0']"
```

#### Tiling

Install [Pop Shell](https://github.com/pop-os/shell) for window tiling.

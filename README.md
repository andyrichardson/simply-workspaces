# Simply Workspaces

Gnome 3 workspace indicator with an i3/polybar style.

> Note: Similar to polybar, workspaces that have no windows will be hidden

![Screenshot from 2021-06-07 20-17-10](https://user-images.githubusercontent.com/10779424/121076492-6664bb00-c7ce-11eb-81ae-898b06c92129.png)

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
   dconf write /org/gnome/desktop/wm/keybindings/move-window-to-workspace-$i "['<Super><Shift>$i']"
done
# Workspace 10 -> 0
dconf write /org/gnome/desktop/wm/keybindings/move-window-to-workspace-10 "['<Super><Shift>10']"
```

#### Tiling

Install [Pop Shell](https://github.com/pop-os/shell) for window tiling.

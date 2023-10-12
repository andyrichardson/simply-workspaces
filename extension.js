import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

import { Container, WorkspaceIndicator } from './ui.js';

const WorkspaceManager = global.workspace_manager;
const Display = global.display;

// Initial state
let indicators;
let container;
const handlers = [];

const getWorkspaceWindowCount = (workspace) => {
  if (!workspace.n_windows) {
    return 0;
  }

  const primary = Display.get_primary_monitor();
  return workspace.list_windows().reduce((agg, window) => {
    if (window.get_monitor() !== primary) {
      return agg;
    }

    return agg + 1;
  }, 0);
};

const initUI = (workspaceCount) => {
  const currentWorkspace = WorkspaceManager.get_active_workspace_index();
  indicators = new Array(workspaceCount).fill(null).map((_, i) => {
    const active = i === currentWorkspace;
    const workspace = WorkspaceManager.get_workspace_by_index(i);
    return WorkspaceIndicator({
      label: `${i + 1}`,
      active,
      windowCount: getWorkspaceWindowCount(workspace),
    });
  });
  container = Container({ indicators });
};

const attachHandlers = () => {
  // Listen for workspace switch
  const changeHandler = WorkspaceManager.connect(
    "active-workspace-changed",
    () => {
      const activeWorkspace = WorkspaceManager.get_active_workspace_index();
      indicators.forEach((indicator, index) => {
        index === activeWorkspace
          ? indicator.setActive()
          : indicator.setInactive();
      });
    }
  );
  handlers.push(() => WorkspaceManager.disconnect(changeHandler));

  const workspaceHandlers = indicators.map((instance, i) => {
    const workspace = WorkspaceManager.get_workspace_by_index(i);
    const updateWindowCount = () =>
      instance.setWindowCount(getWorkspaceWindowCount(workspace));

    const windowAdded = workspace.connect("window-added", updateWindowCount);
    const windowRemoved = workspace.connect(
      "window-removed",
      updateWindowCount
    );
    const nodeClick = instance.node.connect("clicked", () => {
      workspace.activate(global.get_current_time());
    });

    return () => {
      workspace.disconnect(windowAdded);
      workspace.disconnect(windowRemoved);
      instance.node.disconnect(nodeClick);
    };
  });
  handlers.push(...workspaceHandlers);
};

const detachHandlers = () => {
  while (handlers.length > 0) {
    handlers.pop()();
  }
};

export default class SimplyWorkspaces extends Extension {
  enable() {
    if (
      this.getSettings("org.gnome.mutter").get_boolean(
        "dynamic-workspaces"
      )
    ) {
      Main.notifyError(
        "Simply Workspaces Extension",
        "Dynamic workspaces are not supported"
      );
      logError(Error("Dynamic workspaces are not supported."));
      return;
    }

    const workspaceCount = this.getSettings(
      "org.gnome.desktop.wm.preferences"
    ).get_int("num-workspaces");
    initUI(workspaceCount);

    attachHandlers();
    Main.panel._leftBox.insert_child_at_index(container.node, 0);
  }

  disable() {
    detachHandlers();
    Main.panel._leftBox.remove_child(container.node);
  }
}

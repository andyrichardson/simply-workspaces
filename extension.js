const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const { Container, WorkspaceIndicator } = Me.imports.ui;

const WorkspaceManager = global.workspace_manager;
const { Display } = imports.gi.Meta;
const Main = imports.ui.main;

// Initial state
let indicators;
let container;
const handlers = [];

const getWorkspaceWindowCount = (workspace) => {
  if (!workspace.n_windows) {
    return 0;
  }

  const primary = new Display().get_primary_monitor();
  return workspace.list_windows().reduce((agg, window) => {
    if (window.get_monitor() !== primary) {
      return agg;
    }

    return agg + 1;
  }, 0);
};

const initUI = () => {
  const workspaceCount = ExtensionUtils.getSettings(
    "org.gnome.desktop.wm.preferences"
  ).get_int("num-workspaces");
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
      workspace.activate(Date.now() / 1000);
    });

    return () => {
      workspace.disconnect(windowAdded);
      workspace.disconnect(windowRemoved);
      instance.disconnect(nodeClick);
    };
  });
  handlers.concat(workspaceHandlers);
};

const detachHandlers = () => {
  while (handlers.length > 0) {
    handlers.pop()();
  }
};

var init = () => {};

var enable = () => {
  if (
    ExtensionUtils.getSettings("org.gnome.mutter").get_boolean(
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

  initUI();
  attachHandlers();
  Main.panel._leftBox.insert_child_at_index(container.node, 0);
};

var disable = () => {
  detachHandlers();
  Main.panel._leftBox.remove_child(container.node);
};

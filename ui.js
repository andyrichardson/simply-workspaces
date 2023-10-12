import St from 'gi://St';

export const WorkspaceIndicator = ({ label, active, windowCount }) => {
  const node = St.Button.new_with_label(label);
  const state = {
    label,
    active,
    windowCount,
  };

  node.set_style_class_name("indicator");
  const render = () => {
    if (!state.active && !state.windowCount) {
      node.hide();
      return;
    }

    const styles = ["indicator", state.active ? "active" : ""];
    node.set_style_class_name(styles.join(" "));
    node.show();
  };

  const setLabel = (l) => (state.label = l);

  const setActive = () => {
    state.active = true;
    render();
  };

  const setInactive = () => {
    state.active = false;
    render();
  };

  const setWindowCount = (n) => {
    state.windowCount = n;
    render();
  };

  // Initial render
  render();

  return {
    node,
    setActive,
    setInactive,
    setWindowCount,
    setLabel,
  };
};

export const Container = ({ indicators }) => {
  const node = St.BoxLayout.new();
  node.set_style_class_name("container");

  indicators.forEach((i) => {
    node.add_child(i.node);
  });

  return {
    node,
    indicators,
  };
};

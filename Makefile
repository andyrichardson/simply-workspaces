PREFIX ?= /usr
UUID = $(shell grep "uuid" metadata.json | sed -e 's/.*"uuid": "//' -e 's/",.*//')
OUT_DIR = $(PREFIX)/share/gnome-shell/extensions/$(UUID)

install:
	@mkdir -p $(OUT_DIR)
	@cp {*.js,*.json,*.css,LICENSE} $(OUT_DIR)

build:
	@zip $(UUID).zip {*.js,*.json,*.css,LICENSE}

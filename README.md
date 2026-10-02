# Minecraft Guides

Step-by-step guides for Minecraft mods: which machines to build, how many,
what they run on and how long each stage takes.

Site: https://beinforit.github.io/mcguides-site/ (Russian),
https://beinforit.github.io/mcguides-site/en/ (English).

Built with Material for MkDocs.

```bash
python -m venv .venv
.venv/Scripts/python -m pip install -r requirements.txt
.venv/Scripts/mkdocs serve
```

Russian is built by `mkdocs.yml` from `docs/`, English by `mkdocs-en.yml` from
`docs/en/` into `/en/`. Both use the images in `docs/assets/`; the English
build picks them up through `hooks/shared_assets.py`.

```bash
.venv/Scripts/mkdocs serve -f mkdocs-en.yml -a 127.0.0.1:8001
```

## License

Guide text and site files: [CC BY-SA 4.0](LICENSE), HoppinHauler.
Minecraft textures belong to Mojang, mod textures and icons to the mod
authors; they are not covered by this license. Not an official Minecraft
product, not affiliated with Mojang, Microsoft or All the Mods.

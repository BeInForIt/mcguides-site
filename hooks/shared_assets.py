from pathlib import Path

from mkdocs.structure.files import File


def on_files(files, config):
    docs = Path(config.docs_dir).parent
    shared = docs / "assets"
    if not shared.is_dir():
        raise FileNotFoundError(f"shared assets not found: {shared}")
    for path in sorted(shared.rglob("*")):
        if path.is_file():
            files.append(File(path.relative_to(docs).as_posix(), str(docs), config.site_dir,
                              config.use_directory_urls))
    return files

"""Exercise the Windows handoff and both rename-failure recovery paths."""
import importlib.util
import os
from pathlib import Path
import sys
import tempfile
from unittest.mock import patch

sys.dont_write_bytecode = True

module_path = Path(__file__).with_name('swap-mobile.py')
spec = importlib.util.spec_from_file_location('swap_mobile', module_path)
swap = importlib.util.module_from_spec(spec)
spec.loader.exec_module(swap)

for failure in (None, 1, 2):
    with tempfile.TemporaryDirectory(prefix='biblelens-swap-') as tmp:
        staged, current = Path(tmp) / 'staged', Path(tmp) / 'www'
        staged.mkdir()
        current.mkdir()
        (staged / 'release.json').write_text('new')
        (current / 'release.json').write_text('old')
        rename, calls = os.rename, []

        def move(source, destination):
            calls.append((source, destination))
            if len(calls) == failure:
                raise PermissionError('Simulated locked directory')
            rename(source, destination)

        with patch.object(sys, 'platform', 'win32'), patch.object(os, 'rename', move):
            try:
                swap.swap_mobile(str(staged), str(current))
                assert failure is None
            except PermissionError:
                assert failure is not None
        assert (current / 'release.json').read_text() == ('new' if failure is None else 'old')
        assert not list(Path(tmp).glob('.www-previous-*'))
        if failure:
            assert (staged / 'release.json').read_text() == 'new'

with tempfile.TemporaryDirectory(prefix='biblelens-swap-first-') as tmp:
    staged, current = Path(tmp) / 'staged', Path(tmp) / 'www'
    staged.mkdir()
    (staged / 'release.json').write_text('new')
    swap.swap_mobile(str(staged), str(current))
    assert (current / 'release.json').read_text() == 'new'
print('PASS: first mobile staging, Windows replacement, and locked-directory rollback preserve complete bundles.')

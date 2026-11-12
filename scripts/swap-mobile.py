"""Replace a staged mobile bundle, preserving the previous bundle on failure."""
import ctypes
import os
import shutil
import sys
import tempfile


def swap_mobile(staged, current):
    staged, current = map(os.fsencode, (staged, current))
    if not os.path.exists(current):
        os.rename(staged, current)
    elif sys.platform == 'win32':
        # Windows has no directory-exchange primitive. Keep a uniquely named
        # previous bundle until the complete staged directory is in place.
        backup = tempfile.mkdtemp(prefix=b'.www-previous-', dir=os.path.dirname(current))
        os.rmdir(backup)
        os.rename(current, backup)
        try:
            os.rename(staged, current)
        except BaseException:
            os.rename(backup, current)
            raise
        # Installation/build consumers run only after this script succeeds.
        # A locked old file should not invalidate the successfully staged app.
        try:
            shutil.rmtree(backup)
        except OSError:
            print('Previous mobile bundle retained for cleanup:', os.fsdecode(backup), file=sys.stderr)
    else:
        libc = ctypes.CDLL(None, use_errno=True)
        if sys.platform == 'darwin':
            result = libc.renamex_np(staged, current, 2)  # RENAME_SWAP
        elif sys.platform.startswith('linux'):
            result = libc.renameat2(-100, staged, -100, current, 2)  # RENAME_EXCHANGE
        else:
            raise RuntimeError('Directory exchange unavailable; live bundle was kept.')
        if result:
            raise OSError(ctypes.get_errno(), os.strerror(ctypes.get_errno()))


if __name__ == '__main__':
    swap_mobile(*sys.argv[1:])

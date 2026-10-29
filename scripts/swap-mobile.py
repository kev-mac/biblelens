"""Atomically exchange two complete directories on the same filesystem."""
import ctypes
import os
import sys

staged, current = map(os.fsencode, sys.argv[1:])
if not os.path.exists(current):
    os.rename(staged, current)
else:
    libc = ctypes.CDLL(None, use_errno=True)
    if sys.platform == 'darwin':
        result = libc.renamex_np(staged, current, 2)  # RENAME_SWAP
    elif sys.platform.startswith('linux'):
        result = libc.renameat2(-100, staged, -100, current, 2)  # RENAME_EXCHANGE
    else:
        raise RuntimeError('Atomic directory exchange is unavailable; live bundle was kept.')
    if result:
        raise OSError(ctypes.get_errno(), os.strerror(ctypes.get_errno()))

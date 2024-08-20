#!/bin/env python3
import subprocess
import argparse
import sys
import os
venv_name = "py-venv"

script_dir = os.path.dirname(os.path.abspath(__file__))
venv_py_bin_path = "%s/%s/bin/python3" % (script_dir, venv_name)
venv_pip_bin_path = "%s/%s/bin/pip3" % (script_dir, venv_name)
org_py_bin = sys.executable

def main(args):
  if args.create and args.run:
    if args.verbose:
      print("Either use \"--create\" or \"--run\". Aborting!")
    return 1

  if args.create:
    if args.verbose:
      print("Creating venv %s..." % venv_name)
    if os.path.exists(venv_py_bin_path):
      if args.verbose:
        print("Create option is present but the venv %s does exist already. Skipping!" % venv_name)
      return 3
    else:
      create_job = subprocess.run([org_py_bin, "-m", "venv", "py-venv"])
      if create_job.returncode > 0:
        if args.verbose:
          print("Create of venv %s failed!" % venv_name)
      else:
        if args.verbose:
          print("Created venv %s" % venv_name)
      return create_job.returncode

  if args.run:
    if args.verbose:
      print("Running scripts...")

    total_return_code = 0
    for script in args.vars:
      if args.verbose:
        print("Running script %s" % script)
      run_job = subprocess.run([venv_py_bin_path, script], text=True, capture_output=True)
      if run_job.returncode > total_return_code:
        total_return_code = run_job.returncode

      print(run_job.stdout.strip())
      if run_job.returncode > 0:
        print(run_job.stderr)

  if args.install_libs:
    for lib in args.vars:
      install_job = subprocess.run([venv_pip_bin_path, "install", lib])
      if install_job.returncode > 0:
        print("Installation of lib %s failed!" % lib)
        return install_job.returncode
      else:
        print("Installed lib %s." % lib)

if __name__ == '__main__':
  parser = argparse.ArgumentParser(description="Create a virtual env, install libs or run commands in a previous created virtual env")
  parser.add_argument("--create", action="store_true", default=False, help="create the virtual env")
  parser.add_argument("--install-libs", action="store_true", default=False, help="install libraries in the virtual env")
  parser.add_argument("--verbose", action="store_true", default=False, help="print more output")
  parser.add_argument("--run", action="store_true", default=False, help="run a command in the virtual env")
  parser.add_argument("vars", nargs="*")

  args = parser.parse_args()
  sys.exit(main(args))

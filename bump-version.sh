#!/usr/bin/env bash
# Bumps the project version across all relevant files.
#
# Files updated:
#   - VERSION
#   - public/config.js     (window.APP_CONFIG.VERSION)
#   - package.json         ("version" field)
#   - package-lock.json    (root "version" fields, via npm)
#
# Usage:   ./bump-version.sh <new-version>
# Example: ./bump-version.sh 1.2.0
#          ./bump-version.sh 2.0.0-rc1

set -euo pipefail

# ─── Validate args ────────────────────────────────────────────────────────────
if [ $# -ne 1 ]; then
  echo "Usage: $0 <new-version>"
  echo "Example: $0 1.2.0"
  exit 1
fi

NEW_VERSION="$1"

if ! [[ "$NEW_VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z0-9.-]+)?$ ]]; then
  echo "Error: '$NEW_VERSION' is not a valid semver"
  echo "Expected format: X.Y.Z  or  X.Y.Z-suffix  (e.g. 1.2.0, 2.0.0-rc1)"
  exit 1
fi

# ─── Move to repo root (script directory) ─────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# ─── Sanity checks ────────────────────────────────────────────────────────────
for f in VERSION public/config.js package.json package-lock.json; do
  if [ ! -f "$f" ]; then
    echo "Error: required file '$f' not found"
    exit 1
  fi
done

if ! command -v npm >/dev/null 2>&1; then
  echo "Error: npm is required but was not found in PATH"
  exit 1
fi

CURRENT_VERSION=$(tr -d '[:space:]' < VERSION)
echo "Current version: $CURRENT_VERSION"
echo "New version:     $NEW_VERSION"
echo

# ─── Detect sed in-place flag (GNU vs BSD/macOS) ──────────────────────────────
if sed --version >/dev/null 2>&1; then
  SED_INPLACE=(-i)        # GNU sed
else
  SED_INPLACE=(-i '')     # BSD/macOS sed
fi

# ─── 1) VERSION file ──────────────────────────────────────────────────────────
echo "→ Updating VERSION"
echo "$NEW_VERSION" > VERSION

# ─── 2) public/config.js (window.APP_CONFIG.VERSION) ──────────────────────────
echo "→ Updating public/config.js"
sed "${SED_INPLACE[@]}" -E \
  "s/(VERSION:[[:space:]]*['\"])[^'\"]*(['\"])/\1${NEW_VERSION}\2/" \
  public/config.js

# ─── 3) package.json + package-lock.json (via npm) ────────────────────────────
echo "→ Updating package.json + package-lock.json"
npm version "$NEW_VERSION" \
  --no-git-tag-version \
  --allow-same-version \
  --no-commit-hooks >/dev/null

# ─── Summary ──────────────────────────────────────────────────────────────────
echo
echo "✅ Version bumped: $CURRENT_VERSION → $NEW_VERSION"
echo
echo "Files changed:"
echo "  • VERSION"
echo "  • public/config.js"
echo "  • package.json"
echo "  • package-lock.json"
echo
echo "Next steps:"
echo "  git add VERSION public/config.js package.json package-lock.json"
echo "  git commit -m \"chore: bump version to $NEW_VERSION\""
echo "  git push origin main"
echo "  # then trigger the 'Create Release' workflow on GitHub"
